import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Filter, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { sendStatusUpdate } from '../services/emailService'

const AdminDashboard = () => {
  const [applications, setApplications] = useState([])
  const [roles, setRoles] = useState([])
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    activeRoles: 0
  })
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [editingApplication, setEditingApplication] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAddRole, setShowAddRole] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [showRoles, setShowRoles] = useState(false)
  const [newRole, setNewRole] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    location: 'Remote',
    duration: 3,
    stipend: 25000,
    application_deadline: '2024-12-31'
  })
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [applicationsResponse, rolesResponse] = await Promise.all([
        supabase
          .from('applications')
          .select(`
            *,
            internship_roles (
              title,
              department
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('internship_roles')
          .select('*')
          .order('created_at', { ascending: false })
      ])

      const applicationsData = applicationsResponse.data || []
      const rolesData = rolesResponse.data || []

      setApplications(applicationsData)
      setRoles(rolesData)

      // Calculate stats
      setStats({
        totalApplications: applicationsData.length,
        pendingApplications: applicationsData.filter(app => app.status === 'pending').length,
        shortlistedApplications: applicationsData.filter(app => app.status === 'shortlisted').length,
        activeRoles: rolesData.filter(role => role.is_active).length
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId, newStatus, message = '') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      // Send email notification
      const application = applications.find(app => app.id === applicationId)
      if (application) {
        try {
          await sendStatusUpdate(
            application.email,
            application.full_name,
            application.internship_roles.title,
            newStatus,
            message
          )
        } catch (emailError) {
          console.error('Email sending failed:', emailError)
        }
      }

      toast.success(`Application ${newStatus} successfully`)
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update application status')
    }
  }

  const addRole = async () => {
    try {
      console.log('Adding role:', newRole)
      const { data, error } = await supabase
        .from('internship_roles')
        .insert([newRole])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Role added successfully:', data)
      toast.success('Role added successfully')
      setShowAddRole(false)
      setNewRole({
        title: '',
        department: '',
        description: '',
        requirements: '',
        location: 'Remote',
        duration: 3,
        stipend: 25000,
        application_deadline: '2024-12-31'
      })
      fetchData()
    } catch (error) {
      console.error('Error adding role:', error)
      toast.error(`Failed to add role: ${error.message}`)
    }
  }

  const deleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return
    }

    try {
      console.log('Deleting application:', applicationId)
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)

      if (error) {
        console.error('Delete error:', error)
        throw error
      }

      console.log('Application deleted successfully')
      toast.success('Application deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting application:', error)
      toast.error(`Failed to delete application: ${error.message}`)
    }
  }

  const startEditApplication = (application) => {
    setEditingApplication(application)
    setEditForm({
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      university: application.university,
      course: application.course,
      year: application.year,
      cgpa: application.cgpa,
      motivation: application.motivation
    })
  }

  const updateApplication = async () => {
    try {
      console.log('Updating application:', editingApplication.id, editForm)
      const { error } = await supabase
        .from('applications')
        .update(editForm)
        .eq('id', editingApplication.id)

      if (error) {
        console.error('Update error:', error)
        throw error
      }

      console.log('Application updated successfully')
      toast.success('Application updated successfully')
      setEditingApplication(null)
      setEditForm({})
      fetchData()
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error(`Failed to update application: ${error.message}`)
    }
  }

  const deleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('internship_roles')
        .delete()
        .eq('id', roleId)

      if (error) throw error

      toast.success('Role deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error('Failed to delete role')
    }
  }

  const startEditRole = (role) => {
    setEditingRole(role)
    setNewRole({
      title: role.title,
      department: role.department,
      description: role.description,
      requirements: role.requirements,
      location: role.location,
      duration: role.duration,
      stipend: role.stipend,
      application_deadline: role.application_deadline
    })
  }

  const updateRole = async () => {
    try {
      const { error } = await supabase
        .from('internship_roles')
        .update(newRole)
        .eq('id', editingRole.id)

      if (error) throw error

      toast.success('Role updated successfully')
      setEditingRole(null)
      setNewRole({
        title: '',
        department: '',
        description: '',
        requirements: '',
        location: 'Remote',
        duration: 3,
        stipend: 25000,
        application_deadline: '2024-12-31'
      })
      fetchData()
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role')
    }
  }

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'shortlisted': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'accepted': return 'text-accent'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'shortlisted': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      case 'accepted': return <Star size={16} />
      default: return <Clock size={16} />
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
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage internship applications and roles</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-accent">{stats.totalApplications}</p>
              </div>
              <Users className="text-accent" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendingApplications}</p>
              </div>
              <Clock className="text-yellow-400" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Shortlisted</p>
                <p className="text-2xl font-bold text-green-400">{stats.shortlistedApplications}</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Roles</p>
                <p className="text-2xl font-bold text-accent">{stats.activeRoles}</p>
              </div>
              <Briefcase className="text-accent" size={32} />
            </div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAddRole(true)}
              className="btn-primary flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Role
            </button>
            <button 
              onClick={() => setShowRoles(true)}
              className="btn-secondary flex items-center"
            >
              <Briefcase size={16} className="mr-2" />
              Manage Roles
            </button>
            <button className="btn-secondary flex items-center">
              <Download size={16} className="mr-2" />
              Export Data
            </button>
          </div>
        </motion.div>

        {/* Applications Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-semibold">Applicant</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">AI Score</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Applied</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{application.full_name}</p>
                        <p className="text-sm text-gray-400">{application.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{application.internship_roles?.title}</p>
                        <p className="text-sm text-gray-400">{application.internship_roles?.department}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                          <span className="text-accent font-bold">{application.ai_score}</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">AI Score</p>
                          <p className="text-xs text-gray-500">{application.ai_feedback?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-2 capitalize">{application.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="p-2 text-gray-400 hover:text-accent transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => startEditApplication(application)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit Application"
                        >
                          <Edit size={16} />
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                              title="Shortlist"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteApplication(application.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No applications found</p>
            </div>
          )}
        </motion.div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <p className="font-medium">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">University</label>
                    <p className="font-medium">{selectedApplication.university}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Course</label>
                    <p className="font-medium">{selectedApplication.course}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">CGPA</label>
                    <p className="font-medium">{selectedApplication.cgpa}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">AI Score & Feedback</label>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-accent font-bold text-lg mr-2">{selectedApplication.ai_score}/100</span>
                      <span className="text-gray-400">AI Score</span>
                    </div>
                    <p className="text-sm">{selectedApplication.ai_feedback}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Motivation</label>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm">{selectedApplication.motivation}</p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          updateApplicationStatus(selectedApplication.id, 'shortlisted')
                          setSelectedApplication(null)
                        }}
                        className="btn-primary flex-1"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => {
                          updateApplicationStatus(selectedApplication.id, 'rejected')
                          setSelectedApplication(null)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-1"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedApplication.status === 'shortlisted' && (
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'accepted')
                        setSelectedApplication(null)
                      }}
                      className="btn-primary flex-1"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Manage Roles Modal */}
        {showRoles && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Manage Roles</h3>
                <button
                  onClick={() => setShowRoles(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-accent">{role.title}</h4>
                        <p className="text-gray-300">{role.department}</p>
                        <p className="text-gray-400 text-sm mt-2">{role.description?.substring(0, 100)}...</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                          <span>{role.location}</span>
                          <span>{role.duration} months</span>
                          <span>₹{role.stipend?.toLocaleString()}/month</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => startEditRole(role)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit Role"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Application Modal */}
        {editingApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Edit Application</h3>
                <button
                  onClick={() => setEditingApplication(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">University</label>
                    <input
                      type="text"
                      value={editForm.university || ''}
                      onChange={(e) => setEditForm({...editForm, university: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Course</label>
                    <input
                      type="text"
                      value={editForm.course || ''}
                      onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                      type="text"
                      value={editForm.year || ''}
                      onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.cgpa || ''}
                      onChange={(e) => setEditForm({...editForm, cgpa: parseFloat(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Motivation</label>
                  <textarea
                    value={editForm.motivation || ''}
                    onChange={(e) => setEditForm({...editForm, motivation: e.target.value})}
                    className="input-field"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={updateApplication}
                    className="btn-primary flex-1"
                  >
                    Update Application
                  </button>
                  <button
                    onClick={() => setEditingApplication(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add/Edit Role Modal */}
        {(showAddRole || editingRole) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">{editingRole ? 'Edit Role' : 'Add New Role'}</h3>
                <button
                  onClick={() => {
                    setShowAddRole(false)
                    setEditingRole(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={newRole.title}
                      onChange={(e) => setNewRole({...newRole, title: e.target.value})}
                      className="input-field"
                      placeholder="Frontend Developer Intern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input
                      type="text"
                      value={newRole.department}
                      onChange={(e) => setNewRole({...newRole, department: e.target.value})}
                      className="input-field"
                      placeholder="Engineering"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    className="input-field"
                    rows={3}
                    placeholder="Role description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requirements</label>
                  <textarea
                    value={newRole.requirements}
                    onChange={(e) => setNewRole({...newRole, requirements: e.target.value})}
                    className="input-field"
                    rows={3}
                    placeholder="Role requirements..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={newRole.location}
                      onChange={(e) => setNewRole({...newRole, location: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (months)</label>
                    <input
                      type="number"
                      value={newRole.duration}
                      onChange={(e) => setNewRole({...newRole, duration: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stipend (₹/month)</label>
                    <input
                      type="number"
                      value={newRole.stipend}
                      onChange={(e) => setNewRole({...newRole, stipend: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Application Deadline</label>
                    <input
                      type="date"
                      value={newRole.application_deadline}
                      onChange={(e) => setNewRole({...newRole, application_deadline: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={editingRole ? updateRole : addRole}
                    className="btn-primary flex-1"
                  >
                    {editingRole ? 'Update Role' : 'Add Role'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddRole(false)
                      setEditingRole(null)
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
