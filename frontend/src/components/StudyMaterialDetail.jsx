import React from 'react'
import { Clock } from 'lucide-react'

export default function StudyMaterialDetail({ material, onBack }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to materials
          </button>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              material.difficulty === 'easy'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : material.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {material.difficulty}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {material.category}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {material.title}
        </h1>
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {material.readTime}
          </div>
          <div>Updated {material.lastUpdated}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-line">
            {material.content}
          </div>
        </div>
      </div>
    </div>
  )
}
