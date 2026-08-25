'use client'

import React, { createContext, useContext, useState } from 'react'

interface AuthContextType {
  user: any
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>({ name: 'Usuário VetWorkspace' })
  const [loading, setLoading] = useState(false)

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)