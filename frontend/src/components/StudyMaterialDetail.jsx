import React from 'react'
import { Clock } from 'lucide-react'

export default function StudyMaterialDetail({ material, onBack, onImport, onGenerate, aiResults }) {
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
          {material.fileUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => onImport && onImport(material)}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Import (extract text)
              </button>
              <button
                onClick={() => onGenerate && onGenerate(material)}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Import & Generate
              </button>
            </div>
          )}
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
        {material.fileUrl ? (
          <div className="w-full h-[80vh]">
            {/* Embed PDF in an iframe so users can view textbooks inline */}
            <iframe
              src={material.fileUrl}
              title={material.title}
              className="w-full h-full border rounded-md"
            />
          </div>
        ) : (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-line">
              {material.content}
            </div>
          </div>
        )}

        {/* AI Results (if any) */}
        {aiResults && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Generated content</h3>
            {aiResults.summary && (
              <div className="mb-3">
                <h4 className="font-medium">Summary</h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{aiResults.summary.content}</div>
              </div>
            )}

            {aiResults.flashcards && (
              <div className="mb-3">
                <h4 className="font-medium">Flashcards</h4>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {aiResults.flashcards.cards.map((c, i) => (
                    <div key={i} className="p-2 border rounded">
                      <div className="font-semibold">{c.front}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line">{c.back}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiResults.quiz && (
              <div>
                <h4 className="font-medium">Quiz</h4>
                <div className="space-y-3 mt-2">
                  {aiResults.quiz.questions.map((q, i) => (
                    <div key={i} className="p-2 border rounded">
                      <div className="font-semibold">{q.question}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {q.options && q.options.map((opt, idx) => (
                          <div key={idx} className={`py-0.5 ${q.correct_answer === idx ? 'text-green-700 font-medium' : ''}`}>{opt}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
