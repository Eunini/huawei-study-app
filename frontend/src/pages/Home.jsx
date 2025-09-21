import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  BookOpen, 
  FileText, 
  BarChart3, 
  Users, 
  Award, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Comprehensive study guides and documentation for HCIA and HCIP Cloud Computing',
      link: '/study'
    },
    {
      icon: FileText,
      title: 'Mock Exams',
      description: 'Practice with realistic exam questions and get instant feedback',
      link: '/exam'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress and identify areas for improvement',
      link: '/results'
    }
  ]

  const stats = [
    { label: 'Study Materials', value: '50+', icon: BookOpen },
    { label: 'Practice Questions', value: '500+', icon: FileText },
    { label: 'Students', value: '1000+', icon: Users },
    { label: 'Success Rate', value: '90%', icon: Award }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Master Huawei Cloud Computing
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Comprehensive study platform for HCIA and HCIP Cloud Computing certifications
              with interactive learning and practice exams
            </p>
            
            {user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/study"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Start Studying
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/exam"
                  className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Take Practice Exam
                  <FileText className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message for Logged In Users */}
      {user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-blue-800 dark:text-blue-200">
                Welcome back, {user.user_metadata?.name || user.email}! Ready to continue your learning journey?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-600 rounded-full">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides comprehensive tools and resources to help you master
              Huawei Cloud Computing concepts and pass your certification exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-6">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {feature.description}
                  </p>
                  {user && (
                    <Link
                      to={feature.link}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Section (for logged in users) */}
      {user && (
        <div className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Continue Your Learning
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Study Session
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Continue studying "HCIA Cloud Computing Fundamentals"
                </p>
                <Link
                  to="/study"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Continue Reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Progress
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You've completed 3 practice exams this week
                </p>
                <Link
                  to="/results"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  View Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section for non-logged in users */}
      {!user && (
        <div className="bg-blue-600 dark:bg-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of students who have successfully passed their Huawei Cloud certifications
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
