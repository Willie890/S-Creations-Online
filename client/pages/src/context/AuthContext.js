import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const res = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(res.data.user)
      } catch (err) {
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      router.push('/shop')
    } catch (err) {
      throw err.response.data
    }
  }

  const login = async (userData) => {
    try {
      const res = await axios.post('/api/auth/login', userData)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      router.push('/shop')
    } catch (err) {
      throw err.response.data
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
