import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { 
  User, 
  Mail, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  Shield, 
  Award,
  BookOpen,
  Target,
  Clock,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { darkMode, setTheme, theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@example.com',
    bio: 'Cloud computing enthusiast studying for Huawei HCIA certifications.',
    location: 'Global',
    joinDate: 'January 2024'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || 'Demo User',
      email: user?.email || 'demo@example.com',
      bio: 'Cloud computing enthusiast studying for Huawei HCIA certifications.',
      location: 'Global',
      joinDate: 'January 2024'
    })
    setIsEditing(false)
  }

  const stats = [
    { label: 'Study Sessions', value: '24', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Exams Taken', value: '8', icon: Target, color: 'bg-green-500' },
    { label: 'Study Hours', value: '45', icon: Clock, color: 'bg-purple-500' },
    { label: 'Certificates', value: '2', icon: Award, color: 'bg-yellow-500' }
  ]

  const achievements = [
    { title: 'First Study Session', description: 'Completed your first study session', earned: true },
    { title: 'Quick Learner', description: 'Completed 5 study sessions in a week', earned: true },
    { title: 'Exam Taker', description: 'Took your first mock exam', earned: true },
    { title: 'High Scorer', description: 'Scored above 80% in a mock exam', earned: false },
    { title: 'Consistent Learner', description: 'Study for 7 consecutive days', earned: false },
    { title: 'Master Student', description: 'Complete all study materials', earned: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your profile and track your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {formData.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Huawei Cloud Student
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{formData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{formData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-gray-900 dark:text-white">
                        {formData.location}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formData.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {formData.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                      achievement.earned
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.earned
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3
                          className={`font-medium ${
                            achievement.earned
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            achievement.earned
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Study Statistics
              </h2>
              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Account Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-900 dark:text-white">
                      Password
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-900 dark:text-white">
                      Two-Factor Auth
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Theme Preferences
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Choose your preferred theme for the application
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme(false)}
                    className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                      !darkMode && theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Sun className="w-6 h-6 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Light
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme(true)}
                    className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                      darkMode && theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Moon className="w-6 h-6 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Dark
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      // Reset to system preference
                      localStorage.removeItem('darkMode')
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                      setTheme(prefersDark)
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Monitor className="w-6 h-6 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        System
                      </span>
                    </div>
                  </button>
                </div>

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current theme: <span className="font-medium text-gray-900 dark:text-white">
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    System preference will automatically adjust based on your device settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
