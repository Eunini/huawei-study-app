import React, { useState } from 'react'
import { RotateCcw, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function Flashcard({ flashcard, onNext, onPrevious, currentIndex, totalCards }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    setShowAnswer(!showAnswer)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setShowAnswer(false)
    onNext()
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setShowAnswer(false)
    onPrevious()
  }

  if (!flashcard) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No flashcards available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Card Counter */}
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 min-h-[300px] flex items-center justify-center cursor-pointer transform transition-transform duration-300 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          <div className="text-center">
            {!showAnswer ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Question
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {flashcard.front}
                </p>
                <div className="mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFlip()
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Show Answer
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Answer
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {flashcard.back}
                </p>
                <div className="mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFlip()
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Answer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              flashcard.difficulty === 'easy'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : flashcard.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {flashcard.difficulty}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {flashcard.category}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <button
          onClick={() => {
            setIsFlipped(false)
            setShowAnswer(false)
          }}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click the card to flip it or use the show/hide answer buttons
        </p>
      </div>
    </div>
  )
}
