/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)

  // For development - just use mock data
  useEffect(() => {
    console.log('AuthProvider loaded with mock user for development')
  }, [])

  const signUp = async (email, password, name) => {
    try {
      setLoading(true)
      // Mock sign up - just simulate success
      console.log('Mock sign up for:', email)
      setTimeout(() => {
        setUser({
          id: 'mock-user-id',
          email: email,
          name: name
        })
        setSession({
          user: { id: 'mock-user-id', email: email, name: name }
        })
        setLoading(false)
      }, 1000)
      return { data: { user: { email, name } }, error: null }
    } catch (error) {
      setLoading(false)
      return { data: null, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      // Mock sign in - just simulate success
      console.log('Mock sign in for:', email)
      setTimeout(() => {
        setUser({
          id: 'mock-user-id',
          email: email,
          name: 'Inioluwa Atanda'
        })
        setSession({
          user: { id: 'mock-user-id', email: email }
        })
        setLoading(false)
      }, 1000)
      return { data: { user: { email } }, error: null }
    } catch (error) {
      setLoading(false)
      return { data: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      console.log('Mock sign out')
      setUser(null)
      setSession(null)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
