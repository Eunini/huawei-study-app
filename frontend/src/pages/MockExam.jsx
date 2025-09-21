import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Check, X, ArrowRight, ArrowLeft, Flag, RotateCcw, Trophy } from 'lucide-react'

const MockExam = () => {
  const navigate = useNavigate()
  const [examStarted, setExamStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [selectedExam, setSelectedExam] = useState(null)
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
  const [showResults, setShowResults] = useState(false)
  const [examQuestions, setExamQuestions] = useState([])

  // Mock exam configurations
  const examTypes = [
    {
      id: 'hcia-cloud',
      title: 'HCIA Cloud Computing',
      duration: 90,
      questions: 60,
      passingScore: 600,
      description: 'Foundation level certification for cloud computing fundamentals'
    },
    {
      id: 'hcip-cloud',
      title: 'HCIP Cloud Computing',
      duration: 90,
      questions: 60,
      passingScore: 600,
      description: 'Professional level certification for cloud computing'
    },
    {
      id: 'hcie-cloud',
      title: 'HCIE Cloud Computing',
      duration: 120,
      questions: 80,
      passingScore: 700,
      description: 'Expert level certification for cloud computing'
    }
  ]

  // Mock questions database
  const mockQuestions = [
    {
      id: 1,
      question: "What is the main characteristic of cloud computing that allows users to access resources on-demand?",
      options: [
        "Resource pooling",
        "On-demand self-service",
        "Rapid elasticity",
        "Measured service"
      ],
      correct: 1,
      difficulty: "easy",
      category: "fundamentals",
      explanation: "On-demand self-service allows users to provision computing capabilities automatically without human interaction."
    },
    {
      id: 2,
      question: "Which deployment model provides dedicated cloud infrastructure for a single organization?",
      options: [
        "Public cloud",
        "Private cloud",
        "Hybrid cloud",
        "Community cloud"
      ],
      correct: 1,
      difficulty: "easy",
      category: "deployment-models",
      explanation: "Private cloud provides dedicated infrastructure for a single organization, offering greater control and security."
    },
    {
      id: 3,
      question: "What is the primary benefit of using Infrastructure as a Service (IaaS)?",
      options: [
        "Pre-configured applications",
        "Development platform",
        "Virtualized computing resources",
        "Software licensing"
      ],
      correct: 2,
      difficulty: "medium",
      category: "service-models",
      explanation: "IaaS provides virtualized computing resources including servers, storage, and networking on-demand."
    },
    {
      id: 4,
      question: "In Huawei Cloud, which service is used for auto-scaling of compute instances?",
      options: [
        "Elastic Cloud Server (ECS)",
        "Auto Scaling (AS)",
        "Elastic Load Balance (ELB)",
        "Cloud Container Engine (CCE)"
      ],
      correct: 1,
      difficulty: "medium",
      category: "huawei-services",
      explanation: "Auto Scaling (AS) automatically adjusts the number of ECS instances based on demand."
    },
    {
      id: 5,
      question: "What is the maximum number of availability zones that can be configured for high availability in Huawei Cloud?",
      options: [
        "2",
        "3",
        "4",
        "5"
      ],
      correct: 1,
      difficulty: "hard",
      category: "architecture",
      explanation: "Huawei Cloud supports up to 3 availability zones for maximum high availability configuration."
    },
    {
      id: 6,
      question: "Which Huawei Cloud service provides distributed object storage?",
      options: [
        "Elastic Volume Service (EVS)",
        "Object Storage Service (OBS)",
        "Scalable File Service (SFS)",
        "Cloud Backup and Recovery (CBR)"
      ],
      correct: 1,
      difficulty: "easy",
      category: "storage",
      explanation: "Object Storage Service (OBS) provides distributed object storage with high durability and availability."
    },
    {
      id: 7,
      question: "What is the primary purpose of Virtual Private Cloud (VPC) in Huawei Cloud?",
      options: [
        "Load balancing",
        "Network isolation",
        "Data encryption",
        "Auto scaling"
      ],
      correct: 1,
      difficulty: "medium",
      category: "networking",
      explanation: "VPC provides network isolation and allows you to create a private network environment in the cloud."
    },
    {
      id: 8,
      question: "Which authentication method is recommended for programmatic access to Huawei Cloud APIs?",
      options: [
        "Username and password",
        "Access Key ID and Secret Access Key",
        "SMS verification",
        "Email verification"
      ],
      correct: 1,
      difficulty: "medium",
      category: "security",
      explanation: "Access Key ID and Secret Access Key provide secure programmatic access to Huawei Cloud APIs."
    }
  ]

  // Timer effect
  useEffect(() => {
    let timer
    if (examStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowResults(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [examStarted, timeLeft, showResults])

  // Generate random questions based on exam type
  const generateExamQuestions = (examType) => {
    const shuffled = [...mockQuestions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(examType.questions, mockQuestions.length))
  }

  const startExam = (examType) => {
    setSelectedExam(examType)
    setTimeLeft(examType.duration * 60)
    setExamQuestions(generateExamQuestions(examType))
    setExamStarted(true)
    setCurrentQuestion(0)
    setAnswers({})
    setFlaggedQuestions(new Set())
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const selectAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const calculateScore = () => {
    let correct = 0
    examQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / examQuestions.length) * 1000)
  }

  const finishExam = () => {
    setShowResults(true)
  }

  const resetExam = () => {
    setExamStarted(false)
    setShowResults(false)
    setCurrentQuestion(0)
    setAnswers({})
    setFlaggedQuestions(new Set())
    setSelectedExam(null)
    setExamQuestions([])
  }

  if (showResults) {
    const score = calculateScore()
    const correct = examQuestions.filter(q => answers[q.id] === q.correct).length
    const passed = score >= selectedExam.passingScore

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 ${
                passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                {passed ? 
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" /> :
                  <X className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
                }
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Exam {passed ? 'Passed!' : 'Failed'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {selectedExam.title}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Score Summary
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Final Score:</span>
                    <span className={`font-bold text-sm sm:text-base ${passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {score}/1000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Correct Answers:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {correct}/{examQuestions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Passing Score:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedExam.passingScore}/1000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Percentage:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round((correct / examQuestions.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance by Category
                </h3>
                <div className="space-y-3">
                  {['fundamentals', 'deployment-models', 'service-models', 'huawei-services', 'architecture', 'storage', 'networking', 'security'].map(category => {
                    const categoryQuestions = examQuestions.filter(q => q.category === category)
                    const categoryCorrect = categoryQuestions.filter(q => answers[q.id] === q.correct).length
                    const percentage = categoryQuestions.length > 0 ? Math.round((categoryCorrect / categoryQuestions.length) * 100) : 0
                    
                    if (categoryQuestions.length === 0) return null
                    
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300 capitalize">
                            {category.replace('-', ' ')}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={resetExam}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                Take Another Exam
              </button>
              <button
                onClick={() => navigate('/study')}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to Study
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Mock Exam Center
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 px-4">
              Test your knowledge with realistic practice exams
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {examTypes.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {exam.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exam.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exam.questions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Passing Score:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exam.passingScore}/1000
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => startExam(exam)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Exam
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Exam Instructions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Before You Start
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Find a quiet environment for concentration</li>
                  <li>• Have scratch paper and pen ready if needed</li>
                  <li>• Close unnecessary applications and tabs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  During the Exam
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• Use the flag feature to mark questions for review</li>
                  <li>• Monitor your time using the countdown timer</li>
                  <li>• Review your answers before submitting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = examQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-4 sm:mb-6 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {selectedExam.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {examQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm ${
                timeLeft < 300 ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                timeLeft < 900 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              }`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-mono font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={finishExam}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
              >
                Finish Exam
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Questions
              </h3>
              <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-4 gap-1 sm:gap-2">
                {examQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      index === currentQuestion 
                        ? 'bg-blue-600 text-white' 
                        : answers[q.id] !== undefined
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                    {flaggedQuestions.has(q.id) && (
                      <Flag className="absolute -top-1 -right-1 w-3 h-3 text-orange-500" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-300">Unanswered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQ.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                    currentQ.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {currentQ.category}
                  </span>
                </div>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQ.id)
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {currentQ.question}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(currentQ.id, index)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      answers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQ.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {answers[currentQ.id] === index && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === examQuestions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockExam
