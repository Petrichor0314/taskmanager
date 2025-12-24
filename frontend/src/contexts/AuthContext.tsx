import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    const { token, email, fullName, userId } = response.data

    localStorage.setItem('token', token)
    const userData: User = { userId, email, fullName }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    const { token, email, fullName, userId } = response.data

    localStorage.setItem('token', token)
    const userData: User = { userId, email, fullName }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
