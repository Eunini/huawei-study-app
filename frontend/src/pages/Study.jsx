import React, { useState, useEffect } from 'react'
import { FileText, BookOpen, Layers, Search, ChevronLeft, ChevronRight, Filter, Eye } from 'lucide-react'
import Flashcard from '../components/Flashcard'
import StudyTabs from '../components/StudyTabs'
import StudyFilters from '../components/StudyFilters'
import StudyMaterialCard from '../components/StudyMaterialCard'
import StudyMaterialDetail from '../components/StudyMaterialDetail'
import SearchResults from '../components/SearchResults'

export default function Study() {
  const [activeTab, setActiveTab] = useState('materials')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [studyMaterials, setStudyMaterials] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [aiResults, setAiResults] = useState(null)

  useEffect(() => {
    // Simulate API call + fetch real textbooks from backend
    setLoading(true)

    // Map backend textbooks (PDFs) into material entries so they're displayed in the materials grid
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

    Promise.all([
      // Fetch real textbooks from backend
      fetch(`${API_BASE}/api/study/textbooks`).then(r => r.ok ? r.json() : [])
    ])
      .then(([textbooks]) => {
        // convert textbooks (pdfs) to material objects the UI understands
        const pdfMaterials = (textbooks || []).map((t, idx) => ({
          id: `pdf-${t.filename}-${idx}`,
          title: t.title,
          content: '',
          description: 'PDF textbook',
          category: 'Textbook',
          readTime: Math.round((t.size_bytes || 0) / 1000) + ' KB',
          difficulty: 'easy',
          lastUpdated: new Date((t.last_modified || Date.now()) * 1000).toLocaleDateString(),
          fileUrl: `${API_BASE}${t.url}`
        }))

        setStudyMaterials(pdfMaterials)
        setFlashcards([])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const tabs = [
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'search', label: 'Search', icon: Search }
  ]

  const categories = ['all', 'HCIA', 'HCIP', 'HCIE']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  const filteredMaterials = studyMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || material.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const filteredFlashcards = flashcards.filter(flashcard => {
    const matchesCategory = selectedCategory === 'all' || flashcard.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || flashcard.difficulty === selectedDifficulty
    
    return matchesCategory && matchesDifficulty
  })

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < filteredFlashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1)
    }
  }

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

  async function handleImportMaterial(material) {
    if (!material.fileUrl) return
    setLoading(true)
    try {
      // extract filename from fileUrl
      const urlParts = material.fileUrl.split('/')
      const filename = decodeURIComponent(urlParts[urlParts.length - 1])

      const resp = await fetch(`${API_BASE}/api/study/textbooks/import/${filename}`, {
        method: 'POST'
      })

      if (!resp.ok) throw new Error('Import failed')
      const json = await resp.json()

      // update the selected material with the new content
      const updated = {
        ...material,
        id: json.id,
        title: json.title,
        content: json.content,
        description: json.description
      }

      setSelectedMaterial(updated)
      setStudyMaterials(prev => prev.map(m => (m.fileUrl === material.fileUrl ? updated : m)))
    } catch (err) {
      console.error(err)
      alert('Failed to import textbook: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateFromMaterial(material) {
    if (!material.fileUrl) return
    setLoading(true)
    try {
      const urlParts = material.fileUrl.split('/')
      const filename = decodeURIComponent(urlParts[urlParts.length - 1])

      const resp = await fetch(`${API_BASE}/api/study/textbooks/${filename}/generate`, {
        method: 'POST'
      })

      if (!resp.ok) throw new Error('Generate failed')
      const json = await resp.json()
      setAiResults(json.generated || null)
      if (json.material_id) {
        // mark material as imported (replace or attach id)
        setStudyMaterials(prev => prev.map(m => (m.fileUrl === material.fileUrl ? { ...m, id: json.material_id } : m)))
      }
    } catch (err) {
      console.error(err)
      alert('Failed to generate AI content: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  {/* Header */}
  <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Study Mode
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Master Huawei Cloud Computing with comprehensive study materials and flashcards
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{studyMaterials.length}</span> materials available
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Navigation Tabs */}
  <StudyTabs 
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={setActiveTab}
  />

  {/* Filters */}
  {(activeTab === 'materials' || activeTab === 'flashcards') && (
    <StudyFilters
      categories={categories}
      difficulties={difficulties}
      selectedCategory={selectedCategory}
      selectedDifficulty={selectedDifficulty}
      onCategoryChange={setSelectedCategory}
      onDifficultyChange={setSelectedDifficulty}
      resultsCount={
        activeTab === 'materials' 
          ? filteredMaterials.length 
          : filteredFlashcards.length
      }
      resultsType={activeTab}
    />
  )}

  {/* Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <>
        {/* Study Materials Tab */}
        {activeTab === 'materials' && (
          <div>
            {selectedMaterial ? (
              <StudyMaterialDetail
                material={selectedMaterial}
                onBack={() => setSelectedMaterial(null)}
                onImport={handleImportMaterial}
                onGenerate={handleGenerateFromMaterial}
                aiResults={aiResults}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map((material) => (
                  <StudyMaterialCard
                    key={material.id}
                    material={material}
                    onClick={() => setSelectedMaterial(material)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === 'flashcards' && (
          <div>
            {filteredFlashcards.length > 0 ? (
              <Flashcard
                flashcard={filteredFlashcards[currentFlashcardIndex]}
                onNext={handleNextFlashcard}
                onPrevious={handlePreviousFlashcard}
                currentIndex={currentFlashcardIndex}
                totalCards={filteredFlashcards.length}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No flashcards found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters to see more flashcards.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <SearchResults
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredMaterials={filteredMaterials}
            filteredFlashcards={filteredFlashcards}
            onMaterialClick={(material) => {
              setSelectedMaterial(material)
              setActiveTab('materials')
            }}
            onFlashcardClick={(card) => {
              const cardIndex = filteredFlashcards.findIndex(c => c.id === card.id)
              if (cardIndex !== -1) {
                setCurrentFlashcardIndex(cardIndex)
                setActiveTab('flashcards')
              }
            }}
          />
        )}
      </>
    )}
  </div>
</div>
  )
}