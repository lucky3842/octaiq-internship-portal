import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Calendar, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Internships = () => {
  const [roles, setRoles] = useState([])
  const [filteredRoles, setFilteredRoles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoles()
  }, [])

  useEffect(() => {
    console.log('Filtering roles. Total roles:', roles.length)
    console.log('Search term:', searchTerm)
    
    const filtered = roles.filter(role =>
      role.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    console.log('Filtered roles:', filtered.length)
    console.log('First filtered role:', filtered[0])
    setFilteredRoles(filtered)
  }, [searchTerm, roles])

  const fetchRoles = async () => {
    try {
      console.log('Fetching roles...')
      const { data, error } = await supabase
        .from('internship_roles')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Roles data:', data)
      console.log('First role:', data?.[0])
      console.log('First role keys:', data?.[0] ? Object.keys(data[0]) : 'No data')
      console.log('Roles error:', error)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setRoles(data || [])
      console.log('Set roles to state:', data?.length || 0)
    } catch (error) {
      console.error('Error fetching roles:', error)
      // Try fetching without the is_active filter as fallback
      try {
        const { data: fallbackData } = await supabase
          .from('internship_roles')
          .select('*')
          .order('created_at', { ascending: false })
        
        console.log('Fallback data:', fallbackData)
        setRoles(fallbackData || [])
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Available <span className="text-accent">Internships</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover your next opportunity at OctaIQ
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="search"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Simple test - show all roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div key={index} className="card">
              <h3 className="text-xl font-semibold mb-2">
                {role.title || 'No Title'}
              </h3>
              <p className="text-gray-300 mb-2">
                {role.department || 'No Department'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {role.description?.substring(0, 100) || 'No Description'}...
              </p>
              <div className="text-sm text-gray-400 mb-4">
                <p>Location: {role.location || 'N/A'}</p>
                <p>Duration: {role.duration || 'N/A'} months</p>
                <p>Stipend: ₹{role.stipend?.toLocaleString() || 'N/A'}/month</p>
              </div>
              <Link 
                to={`/internships/${role.id}/apply`}
                className="btn-primary w-full block text-center"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>

        {roles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No roles found in database</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Internships
