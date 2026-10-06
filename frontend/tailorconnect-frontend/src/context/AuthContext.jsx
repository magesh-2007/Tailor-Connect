import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'tc_token'
const ACTIVE_USER_KEY = 'tc_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session from localStorage on mount; validate with /api/auth/me
  useEffect(() => {
    const initSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(ACTIVE_USER_KEY)

      if (!storedToken) {
        setLoading(false)
        return
      }

      // Restore from cache immediately so UI does not flash logout
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (_) {
          // ignore parse errors
        }
      }

      try {
        const res = await api.get('/auth/me')
        const userData = res.data?.data?.user || res.data?.user
        if (userData) {
          setUser(userData)
          localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userData))
        }
      } catch (err) {
        // Token invalid or expired — clear session
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(ACTIVE_USER_KEY)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initSession()
  }, [])

  // Login via POST /api/auth/login
  // NOTE: No role is passed from the frontend. The backend determines the role
  // from the database and returns it in the JWT + user object.
  const login = async ({ email, identifier, password }) => {
    const term = (identifier || email || '').trim()
    const pass = (password || '').trim()

    if (!term || !pass) {
      return { success: false, error: 'Please enter both your email/username and password.' }
    }

    try {
      const res = await api.post('/auth/login', {
        identifier: term,
        password: pass,
      })

      const payload = res.data?.data || res.data
      const token = payload?.token
      const userData = payload?.user

      if (!token || !userData) {
        return { success: false, error: 'Unexpected response from server. Please try again.' }
      }

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userData))
      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.'
      return { success: false, error: msg }
    }
  }

  // Register via POST /api/auth/register
  // role should be 'CUSTOMER', 'STUDENT', or 'TAILOR' — validated by backend.
  // ADMIN and EMPLOYEE are blocked on the backend side.
  const register = async (role, formData) => {
    const { name, email, password } = formData
    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required.' }
    }

    try {
      const res = await api.post('/auth/register', { ...formData, role })

      const payload = res.data?.data || res.data
      const token = payload?.token
      const userData = payload?.user

      if (!token || !userData) {
        return { success: false, error: 'Unexpected response from server. Please try again.' }
      }

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userData))
      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please check your details.'
      return { success: false, error: msg }
    }
  }

  // Google Login via POST /api/auth/google
  // Accepts user info fetched from Google's userinfo endpoint (via access_token flow).
  // The backend looks up or creates the user in MongoDB.
  // New Google accounts default to CUSTOMER on the backend.
  const loginWithGoogle = async ({ email, name, googleId, profileImage } = {}) => {
    if (!email) {
      return { success: false, error: 'Google sign-in did not return a valid email.' }
    }
    try {
      const res = await api.post('/auth/google', {
        email,
        name,
        googleId,
        profileImage,
      })

      const payload = res.data?.data || res.data
      const token = payload?.token
      const userData = payload?.user

      if (!token || !userData) {
        return { success: false, error: 'Google login failed. Please try again.' }
      }

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userData))
      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Google login failed. Please try again.'
      return { success: false, error: msg }
    }
  }

  // Update profile — PATCH via /api/auth/me or appropriate endpoint
  const updateProfile = async (updatedFields) => {
    if (!user) return { success: false, error: 'Not logged in.' }

    try {
      const res = await api.patch('/auth/me', updatedFields)
      const userData = res.data?.data?.user || res.data?.user || { ...user, ...updatedFields }

      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userData))
      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      // Fallback: update local state even if backend unavailable
      const updated = { ...user, ...updatedFields }
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated))
      setUser(updated)
      return { success: true, user: updated }
    }
  }

  // Logout via POST /api/auth/logout
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (_) {
      // Ignore errors — always clear local session
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(ACTIVE_USER_KEY)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
