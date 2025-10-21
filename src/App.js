import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import About from './pages/About'
import Internships from './pages/Internships'
import ApplicationForm from './pages/ApplicationForm'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.email)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.email)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (email) => {
    // Temporarily check admin by email
    setIsAdmin(email === 'nagashreeshyl@gmail.com')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-primary text-white">
        <Header user={user} isAdmin={isAdmin} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:roleId/apply" element={<ApplicationForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              user && isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            } 
          />
        </Routes>

        <Chatbot />
      </div>
    </Router>
  )
}

export default App
