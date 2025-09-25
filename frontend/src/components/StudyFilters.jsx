import React from 'react'
import { Filter } from 'lucide-react'

export default function StudyFilters({ 
  selectedCategory, 
  selectedDifficulty, 
  onCategoryChange, 
  onDifficultyChange,
  activeTab,
  filteredMaterials,
  filteredFlashcards
}) {
  const categories = ['all', 'HCIA', 'HCIP', 'HCIE']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 sm:px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex-1 sm:flex-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => onDifficultyChange(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 sm:px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex-1 sm:flex-none"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === 'materials' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredMaterials.length} materials found
            </div>
          )}
          
          {activeTab === 'flashcards' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredFlashcards.length} flashcards found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
