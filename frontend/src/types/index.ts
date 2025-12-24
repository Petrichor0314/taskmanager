export interface User {
  userId: number
  email: string
  fullName: string
}

export interface AuthResponse {
  token: string
  email: string
  fullName: string
  userId: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface Project {
  id: number
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
  totalTasks: number
  completedTasks: number
  progressPercentage: number
}

export interface ProjectRequest {
  title: string
  description?: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
  projectId: number
}

export interface TaskRequest {
  title: string
  description?: string
  dueDate?: string
}

export interface ErrorResponse {
  status: number
  message: string
  timestamp: string
  errors?: Record<string, string>
}
