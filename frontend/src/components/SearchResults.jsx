import React from 'react'
import { Search, Eye, Layers } from 'lucide-react'

export default function SearchResults({ 
  searchQuery, 
  onSearchChange,
  filteredMaterials,
  flashcards,
  onMaterialClick,
  onFlashcardClick
}) {
  const searchFilteredFlashcards = flashcards.filter(card => 
    card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasNoResults = searchQuery && 
    filteredMaterials.length === 0 && 
    searchFilteredFlashcards.length === 0

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search study materials and flashcards..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {searchQuery && (
        <div className="space-y-6">
          {/* Materials Results */}
          {filteredMaterials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Study Materials ({filteredMaterials.length})
              </h3>
              <div className="space-y-4">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => onMaterialClick(material)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {material.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {material.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {material.category} • {material.difficulty} • {material.readTime}
                          </span>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flashcards Results */}
          {searchFilteredFlashcards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Flashcards ({searchFilteredFlashcards.length})
              </h3>
              <div className="space-y-4">
                {searchFilteredFlashcards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => onFlashcardClick(card)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {card.front}
                        </h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            {card.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            card.difficulty === 'easy'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : card.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {card.difficulty}
                          </span>
                        </div>
                      </div>
                      <Layers className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {hasNoResults && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start searching
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Enter keywords to search through study materials and flashcards.
          </p>
        </div>
      )}
    </div>
  )
}
