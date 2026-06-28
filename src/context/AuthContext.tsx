import { createContext, useState, useEffect, useContext } from 'react'
import type { ReactNode } from 'react'
import { authService, type User } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: any) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  /**
   * On mount, verify existing token and fetch user data
   */
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await authService.getCurrentUser()
          setUser(response.data.user)
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    verifyToken()
  }, [token])

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await authService.signup({
        email,
        password,
        firstName,
        lastName,
      })
      const newToken = response.data.token
      setToken(newToken)
      setUser(response.data.user)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error: any) {
      throw error.response?.data?.message || 'Signup failed'
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      const newToken = response.data.token
      setToken(newToken)
      setUser(response.data.user)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed'
    }
  }

  const logout = () => {
    authService.logout()
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (data: any) => {
    try {
      const response = await authService.updateProfile(data)
      setUser(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error: any) {
      throw error.response?.data?.message || 'Profile update failed'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
