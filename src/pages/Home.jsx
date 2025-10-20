import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Users, Award, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Home = () => {
  const [stats, setStats] = useState({
    totalRoles: 0,
    totalApplications: 0,
    activeRoles: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [rolesResponse, applicationsResponse] = await Promise.all([
        supabase.from('internship_roles').select('*'),
        supabase.from('applications').select('*')
      ])

      setStats({
        totalRoles: rolesResponse.data?.length || 0,
        totalApplications: applicationsResponse.data?.length || 0,
        activeRoles: rolesResponse.data?.filter(role => role.is_active)?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Launch Your Career with{' '}
            <span className="text-accent">OctaIQ</span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Discover exciting internship opportunities at OctaIQ and kickstart your journey in technology, innovation, and digital transformation.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/internships" className="btn-primary inline-flex items-center">
              Browse Internships
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <a
              href="https://octaiq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center"
            >
              Learn About OctaIQ
            </a>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-accent" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2">{stats.activeRoles}</h3>
              <p className="text-gray-300">Active Roles</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-accent" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2">{stats.totalApplications}</h3>
              <p className="text-gray-300">Applications Received</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-accent" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2">100%</h3>
              <p className="text-gray-300">Remote Friendly</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-accent">OctaIQ</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join a dynamic team that's shaping the future of technology and innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="card">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
              <p className="text-gray-300">
                Work with flexible hours and remote options to balance your studies and internship.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mentorship</h3>
              <p className="text-gray-300">
                Get guidance from experienced professionals and industry experts.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real Projects</h3>
              <p className="text-gray-300">
                Work on actual projects that impact our business and gain valuable experience.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
