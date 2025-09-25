import React, { createContext, useEffect, useState } from 'react'

const ThemeContext = createContext({})

export { ThemeContext }

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return stored !== null ? stored === 'true' : prefersDark
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  // Listen for system theme changes and keyboard shortcuts
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = localStorage.getItem('darkMode')
      if (stored === null) {
        setDarkMode(e.matches)
      }
    }

    // Keyboard shortcut handler (Ctrl/Cmd + Shift + T)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        setDarkMode(prev => !prev)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  const setTheme = (isDark) => {
    setDarkMode(isDark)
  }

  const value = {
    darkMode,
    toggleDarkMode,
    setTheme,
    theme: darkMode ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
