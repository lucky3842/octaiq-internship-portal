import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Award, Globe } from 'lucide-react'

const About = () => {
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-accent">OctaIQ</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering the next generation of tech talent through innovative internship programs and cutting-edge technology solutions.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="card">
              <Target className="text-accent mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-300">
                To bridge the gap between academic learning and industry requirements by providing hands-on experience through meaningful internship opportunities in technology and innovation.
              </p>
            </div>

            <div className="card">
              <Globe className="text-accent mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-300">
                To become the leading platform for tech internships, fostering innovation and creating pathways for students to launch successful careers in technology.
              </p>
            </div>
          </motion.div>

          {/* What We Do */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <Users className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-3">Talent Development</h3>
                <p className="text-gray-300">
                  We nurture young talent through structured internship programs with mentorship and real-world project experience.
                </p>
              </div>

              <div className="card text-center">
                <Award className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-3">Innovation Hub</h3>
                <p className="text-gray-300">
                  Our interns work on cutting-edge projects in AI, web development, data science, and emerging technologies.
                </p>
              </div>

              <div className="card text-center">
                <Target className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-3">Career Launchpad</h3>
                <p className="text-gray-300">
                  We provide the foundation for successful tech careers with industry connections and practical skills.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Company Values */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <h3 className="text-accent font-semibold mb-2">Innovation</h3>
                <p className="text-gray-300 text-sm">Embracing new technologies and creative solutions</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <h3 className="text-accent font-semibold mb-2">Excellence</h3>
                <p className="text-gray-300 text-sm">Striving for the highest quality in everything we do</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <h3 className="text-accent font-semibold mb-2">Growth</h3>
                <p className="text-gray-300 text-sm">Continuous learning and development for all</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <h3 className="text-accent font-semibold mb-2">Impact</h3>
                <p className="text-gray-300 text-sm">Creating meaningful change in the tech industry</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-300 mb-4">
              Ready to start your journey with OctaIQ? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:careers@octaiq.com" className="btn-primary">
                Contact Us
              </a>
              <a href="/internships" className="btn-secondary">
                View Internships
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
