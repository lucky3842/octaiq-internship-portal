import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Header = ({ user, isAdmin }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-white">OctaIQ</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/internships" className="text-gray-300 hover:text-accent transition-colors">
              Internships
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-300 hover:text-accent transition-colors">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User size={16} />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-accent transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="btn-primary text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
