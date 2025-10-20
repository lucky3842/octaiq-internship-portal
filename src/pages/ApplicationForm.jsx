/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, FileText, Send } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { scoreResume } from '../services/aiService'
import { sendApplicationConfirmation } from '../services/emailService'

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  university: z.string().min(2, 'University is required'),
  course: z.string().min(2, 'Course is required'),
  year: z.string().min(1, 'Year is required'),
  cgpa: z.string().min(1, 'CGPA is required'),
  motivation: z.string().min(50, 'Please write at least 50 characters'),
  resume: z.any().refine((files) => files?.length > 0, 'Resume is required')
})

const ApplicationForm = () => {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(applicationSchema)
  })

  const resumeFile = watch('resume')

  useEffect(() => {
    fetchRole()
  }, [roleId])

  const fetchRole = async () => {
    try {
      const { data, error } = await supabase
        .from('internship_roles')
        .select('*')
        .eq('id', roleId)
        .single()

      if (error) throw error
      setRole(data)
    } catch (error) {
      console.error('Error fetching role:', error)
      toast.error('Role not found')
      navigate('/internships')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    
    try {
      // Upload resume
      const resumeFile = data.resume[0]
      const fileName = `${Date.now()}-${resumeFile.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile)

      if (uploadError) throw uploadError

      // Extract text from resume (simplified - in production, use proper PDF parsing)
      const resumeText = `${data.fullName} ${data.email} ${data.university} ${data.course} ${data.motivation}`
      
      // Score resume with AI
      const aiScore = await scoreResume(resumeText, role.description)

      // Save application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          role_id: roleId,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          university: data.university,
          course: data.course,
          year: data.year,
          cgpa: parseFloat(data.cgpa),
          motivation: data.motivation,
          resume_url: uploadData.path,
          ai_score: aiScore.score,
          ai_feedback: aiScore.feedback,
          status: 'pending'
        })

      if (applicationError) throw applicationError

      // Send confirmation email
      try {
        await sendApplicationConfirmation(data.email, data.fullName, role.title)
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the application if email fails
      }

      toast.success('Application submitted successfully!')
      navigate('/internships')
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-300">Role not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Apply for <span className="text-accent">{role.title}</span>
          </h1>
          <p className="text-gray-300">{role.department} • {role.location}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    {...register('fullName')}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    {...register('phone')}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">University/College *</label>
                  <input
                    {...register('university')}
                    className="input-field"
                    placeholder="Your university name"
                  />
                  {errors.university && (
                    <p className="text-red-400 text-sm mt-1">{errors.university.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Course/Degree *</label>
                  <input
                    {...register('course')}
                    className="input-field"
                    placeholder="B.Tech Computer Science"
                  />
                  {errors.course && (
                    <p className="text-red-400 text-sm mt-1">{errors.course.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year of Study *</label>
                  <select {...register('year')} className="input-field">
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.year && (
                    <p className="text-red-400 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CGPA/Percentage *</label>
                  <input
                    {...register('cgpa')}
                    className="input-field"
                    placeholder="8.5 or 85%"
                  />
                  {errors.cgpa && (
                    <p className="text-red-400 text-sm mt-1">{errors.cgpa.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Resume</h3>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <label className="cursor-pointer">
                  <span className="text-accent hover:text-yellow-400 font-medium">
                    Click to upload your resume
                  </span>
                  <input
                    {...register('resume')}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </label>
                <p className="text-gray-400 text-sm mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
                {resumeFile && resumeFile[0] && (
                  <div className="mt-4 flex items-center justify-center text-accent">
                    <FileText size={20} className="mr-2" />
                    <span>{resumeFile[0].name}</span>
                  </div>
                )}
                {errors.resume && (
                  <p className="text-red-400 text-sm mt-2">{errors.resume.message}</p>
                )}
              </div>
            </div>

            {/* Motivation */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Motivation</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Why do you want to intern at OctaIQ? *
                </label>
                <textarea
                  {...register('motivation')}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Tell us about your interest in this role and what you hope to achieve..."
                />
                {errors.motivation && (
                  <p className="text-red-400 text-sm mt-1">{errors.motivation.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                ) : (
                  <Send className="mr-2" size={20} />
                )}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ApplicationForm
