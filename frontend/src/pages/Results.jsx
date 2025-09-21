import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Trophy, Target, Clock, BookOpen, TrendingUp, Award, Calendar, Filter } from 'lucide-react'

const Results = () => {
  const [timeFilter, setTimeFilter] = useState('all')
  const [examFilter, setExamFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data for results dashboard
  const mockResults = [
    {
      id: 1,
      examType: 'HCIA Cloud Computing',
      score: 750,
      totalQuestions: 60,
      correctAnswers: 45,
      duration: 85,
      date: '2024-12-15',
      passed: true,
      categoryScores: {
        fundamentals: 80,
        'deployment-models': 90,
        'service-models': 75,
        'huawei-services': 70,
        architecture: 85,
        storage: 88,
        networking: 72,
        security: 76
      }
    },
    {
      id: 2,
      examType: 'HCIP Cloud Computing',
      score: 620,
      totalQuestions: 60,
      correctAnswers: 37,
      duration: 88,
      date: '2024-12-10',
      passed: true,
      categoryScores: {
        fundamentals: 70,
        'deployment-models': 65,
        'service-models': 80,
        'huawei-services': 60,
        architecture: 75,
        storage: 82,
        networking: 68,
        security: 70
      }
    },
    {
      id: 3,
      examType: 'HCIA Cloud Computing',
      score: 580,
      totalQuestions: 60,
      correctAnswers: 35,
      duration: 90,
      date: '2024-12-05',
      passed: false,
      categoryScores: {
        fundamentals: 65,
        'deployment-models': 70,
        'service-models': 60,
        'huawei-services': 55,
        architecture: 68,
        storage: 75,
        networking: 58,
        security: 62
      }
    },
    {
      id: 4,
      examType: 'HCIE Cloud Computing',
      score: 720,
      totalQuestions: 80,
      correctAnswers: 58,
      duration: 115,
      date: '2024-11-28',
      passed: true,
      categoryScores: {
        fundamentals: 85,
        'deployment-models': 88,
        'service-models': 78,
        'huawei-services': 82,
        architecture: 90,
        storage: 86,
        networking: 74,
        security: 80
      }
    },
    {
      id: 5,
      examType: 'HCIP Cloud Computing',
      score: 550,
      totalQuestions: 60,
      correctAnswers: 33,
      duration: 90,
      date: '2024-11-20',
      passed: false,
      categoryScores: {
        fundamentals: 60,
        'deployment-models': 55,
        'service-models': 65,
        'huawei-services': 50,
        architecture: 62,
        storage: 70,
        networking: 48,
        security: 58
      }
    }
  ]

  const [results] = useState(mockResults)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  // Filter results based on selected filters
  const filteredResults = results.filter(result => {
    if (examFilter !== 'all' && result.examType !== examFilter) return false
    
    const resultDate = new Date(result.date)
    const now = new Date()
    
    switch (timeFilter) {
      case 'week':
        return (now - resultDate) / (1000 * 60 * 60 * 24) <= 7
      case 'month':
        return (now - resultDate) / (1000 * 60 * 60 * 24) <= 30
      case '3months':
        return (now - resultDate) / (1000 * 60 * 60 * 24) <= 90
      default:
        return true
    }
  })

  // Calculate statistics
  const stats = {
    totalExams: filteredResults.length,
    passedExams: filteredResults.filter(r => r.passed).length,
    averageScore: filteredResults.length > 0 ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length) : 0,
    highestScore: filteredResults.length > 0 ? Math.max(...filteredResults.map(r => r.score)) : 0,
    passRate: filteredResults.length > 0 ? Math.round((filteredResults.filter(r => r.passed).length / filteredResults.length) * 100) : 0
  }

  // Prepare chart data
  const scoreProgressData = filteredResults
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((result, index) => ({
      exam: `Exam ${index + 1}`,
      score: result.score,
      date: result.date,
      passed: result.passed
    }))

  const categoryPerformanceData = Object.keys(filteredResults[0]?.categoryScores || {}).map(category => ({
    category: category.replace('-', ' '),
    average: filteredResults.length > 0 
      ? Math.round(filteredResults.reduce((sum, r) => sum + (r.categoryScores[category] || 0), 0) / filteredResults.length)
      : 0
  }))

  const examTypeDistribution = ['HCIA Cloud Computing', 'HCIP Cloud Computing', 'HCIE Cloud Computing'].map(type => ({
    name: type.split(' ')[0],
    value: filteredResults.filter(r => r.examType === type).length,
    color: type === 'HCIA Cloud Computing' ? '#10b981' : type === 'HCIP Cloud Computing' ? '#3b82f6' : '#8b5cf6'
  })).filter(item => item.value > 0)

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Performance Dashboard
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
            Track your progress and analyze your exam performance
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exam Type
              </label>
              <select
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="all">All Exams</option>
                <option value="HCIA Cloud Computing">HCIA Cloud Computing</option>
                <option value="HCIP Cloud Computing">HCIP Cloud Computing</option>
                <option value="HCIE Cloud Computing">HCIE Cloud Computing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Exams</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalExams}</p>
              </div>
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 self-end sm:self-auto" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Passed</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{stats.passedExams}</p>
              </div>
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 self-end sm:self-auto" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Pass Rate</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{stats.passRate}%</p>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 self-end sm:self-auto" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Avg Score</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{stats.averageScore}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 self-end sm:self-auto" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Best Score</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">{stats.highestScore}</p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 self-end sm:self-auto" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Score Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Score Progress Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="exam" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  domain={[0, 1000]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Performance by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="category" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="average" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Exam Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Exam Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={examTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {examTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Results */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Exam Results
            </h3>
            <div className="space-y-4">
              {filteredResults.slice(0, 5).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {result.examType}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(result.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.score}/1000
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {result.correctAnswers}/{result.totalQuestions} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Results Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Detailed Results History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Exam Type</th>
                  <th scope="col" className="px-6 py-3">Score</th>
                  <th scope="col" className="px-6 py-3">Correct Answers</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {new Date(result.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{result.examType}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.score}/1000
                      </span>
                    </td>
                    <td className="px-6 py-4">{result.correctAnswers}/{result.totalQuestions}</td>
                    <td className="px-6 py-4">{result.duration} min</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.passed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
