import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/lib/api'
import type { Project, Task, TaskRequest } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Loader2, ArrowLeft, Trash2, Edit, Calendar, CheckCircle2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get<Project>(`/projects/${projectId}`)
      return response.data
    },
  })

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await api.get<Task[]>(`/projects/${projectId}/tasks`)
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: TaskRequest) => {
      const response = await api.post<Task>(`/projects/${projectId}/tasks`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsCreateOpen(false)
      resetCreate()
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create task.',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: number; data: TaskRequest }) => {
      const response = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setEditingTask(null)
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task.',
      })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await api.patch<Task>(`/projects/${projectId}/tasks/${taskId}/toggle`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task status.',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete task.',
      })
    },
  })

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  })

  useEffect(() => {
    if (editingTask) {
      resetEdit({
        title: editingTask.title,
        description: editingTask.description || '',
        dueDate: editingTask.dueDate || '',
      })
    }
  }, [editingTask, resetEdit])

  const onCreateSubmit = (data: TaskFormData) => {
    createMutation.mutate({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate || undefined,
    })
  }

  const onEditSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateMutation.mutate({
        taskId: editingTask.id,
        data: {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate || undefined,
        },
      })
    }
  }

  const filteredTasks = tasks?.filter((task) => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && !filteredTasks?.find((t) => t.dueDate === dueDate)?.completed
  }

  if (isLoadingProject || isLoadingTasks) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <Link to="/app/projects">
          <Button variant="link">Go back to projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/app/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-muted-foreground ml-10">{project.description}</p>
          )}
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open)
          if (!open) resetCreate()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Add a new task to this project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    placeholder="Task name"
                    {...registerCreate('title')}
                  />
                  {errorsCreate.title && (
                    <p className="text-sm text-destructive">{errorsCreate.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description (optional)</Label>
                  <Textarea
                    id="create-description"
                    placeholder="Task description"
                    {...registerCreate('description')}
                  />
                  {errorsCreate.description && (
                    <p className="text-sm text-destructive">{errorsCreate.description.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-dueDate">Due Date (optional)</Label>
                  <Input
                    id="create-dueDate"
                    type="date"
                    {...registerCreate('dueDate')}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {project.completedTasks} of {project.totalTasks} tasks completed
              </span>
              <span className="font-medium">{Math.round(project.progressPercentage)}%</span>
            </div>
            <Progress value={project.progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({tasks?.length || 0})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({tasks?.filter((t) => !t.completed).length || 0})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks?.filter((t) => t.completed).length || 0})
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks && filteredTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {filter === 'all'
                  ? 'Create your first task to get started'
                  : `There are no ${filter} tasks in this project`}
              </p>
              {filter === 'all' && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTasks?.map((task) => (
            <Card key={task.id} className={cn(
              "transition-all",
              task.completed && "opacity-60"
            )}>
              <CardContent className="flex items-start gap-4 p-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleMutation.mutate(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={cn(
                        "font-medium",
                        task.completed && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {task.dueDate && (
                          <span className={cn(
                            "flex items-center gap-1",
                            isOverdue(task.dueDate) && !task.completed && "text-destructive"
                          )}>
                            <Calendar className="h-3 w-3" />
                            Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        {task.completed && task.completedAt && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed {format(new Date(task.completedAt), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTask(task)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete task?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{task.title}".
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(task.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => {
        if (!open) setEditingTask(null)
      }}>
        <DialogContent>
          <form onSubmit={handleSubmitEdit(onEditSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update your task details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Task name"
                  {...registerEdit('title')}
                />
                {errorsEdit.title && (
                  <p className="text-sm text-destructive">{errorsEdit.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (optional)</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Task description"
                  {...registerEdit('description')}
                />
                {errorsEdit.description && (
                  <p className="text-sm text-destructive">{errorsEdit.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Due Date (optional)</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  {...registerEdit('dueDate')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
