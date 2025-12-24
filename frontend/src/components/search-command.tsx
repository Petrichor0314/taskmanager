import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Project } from '@/types'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  FolderOpen, 
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get<Project[]>('/projects')
      return response.data
    },
  })

  // Keyboard shortcut to open search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelectProject = (projectId: number) => {
    navigate(`/app/projects/${projectId}`)
    setOpen(false)
  }

  const handleSelectProjects = () => {
    navigate('/app/projects')
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search...
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects and tasks..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={handleSelectProjects}>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>View All Projects</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Projects">
            {projects?.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => handleSelectProject(project.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{project.title}</span>
                    {project.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {project.description}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {project.completedTasks}/{project.totalTasks} tasks
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
