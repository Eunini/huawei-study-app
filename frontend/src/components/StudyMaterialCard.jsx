import React from 'react'
import { Clock, ChevronRight, FileText } from 'lucide-react'

export default function StudyMaterialCard({ material, onClick }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick(material)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {material.category}
          </span>
          {material.fileUrl && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1">
              <FileText className="w-3 h-3" /> PDF
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            material.difficulty === 'easy'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : material.difficulty === 'medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {material.difficulty}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {material.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {material.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {material.readTime}
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
