import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  FileText, 
  Search, 
  Filter, 
  Layers,
  Clock,
  User,
  ChevronRight,
  Download,
  Star,
  Eye
} from 'lucide-react'
import Flashcard from '../components/Flashcard'

export default function Study() {
  const [activeTab, setActiveTab] = useState('materials')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [studyMaterials, setStudyMaterials] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Mock data - in production, this would come from API
  const mockStudyMaterials = [
    {
      id: '1',
      title: 'HCIA Cloud Computing Fundamentals',
      content: `# Cloud Computing Overview

Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort.

## Key Characteristics

### 1. On-demand self-service
Users can provision computing capabilities automatically without human interaction with service providers.

### 2. Broad network access
Services are available over the network through standard mechanisms.

### 3. Resource pooling
Computing resources are pooled to serve multiple consumers using multi-tenant model.

### 4. Rapid elasticity
Resources can be elastically provisioned and released to scale rapidly.

### 5. Measured service
Cloud systems automatically control and optimize resource use.

## Service Models

### Infrastructure as a Service (IaaS)
- Provides virtualized computing resources
- Examples: Virtual machines, storage, networks
- User manages: OS, middleware, runtime, data, applications

### Platform as a Service (PaaS)
- Provides platform and environment for developers
- Examples: Development frameworks, databases
- User manages: Data and applications

### Software as a Service (SaaS)
- Provides complete software applications
- Examples: Email, CRM, office applications
- User manages: Data only

## Deployment Models

### Public Cloud
- Open for public use
- Owned by cloud service provider
- Examples: AWS, Azure, Huawei Cloud

### Private Cloud
- Used exclusively by single organization
- Can be on-premises or hosted

### Hybrid Cloud
- Combination of public and private clouds
- Allows data and applications to be shared

### Community Cloud
- Shared by several organizations
- Supports specific community with shared concerns`,
      category: 'HCIA',
      description: 'Introduction to cloud computing concepts and models',
      readTime: '15 min',
      difficulty: 'easy',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'Huawei Cloud Services Overview',
      content: `# Huawei Cloud Core Services

## Compute Services

### Elastic Cloud Server (ECS)
- Virtual machines in the cloud
- Multiple instance types for different workloads
- Auto scaling capabilities
- Pay-as-you-use pricing

### Bare Metal Server (BMS)
- Dedicated physical servers
- High performance for demanding applications
- Direct hardware access

### Auto Scaling (AS)
- Automatically adjusts computing resources
- Based on demand and policies
- Ensures optimal performance and cost

### Function Graph
- Serverless computing service
- Event-driven execution
- Pay per invocation

## Storage Services

### Object Storage Service (OBS)
- Scalable object storage
- 99.999999999% (11 9's) durability
- Multiple storage classes
- RESTful API access

### Elastic Volume Service (EVS)
- Block storage for ECS instances
- High performance and reliability
- Snapshot and backup capabilities

### Scalable File Service (SFS)
- Shared file storage
- NFS protocol support
- Concurrent access from multiple instances

### Cloud Backup and Recovery (CBR)
- Backup and restore services
- Automated backup policies
- Cross-region backup support

## Network Services

### Virtual Private Cloud (VPC)
- Isolated network environment
- Custom IP address ranges
- Subnets and route tables
- Security groups and ACLs

### Elastic Load Balancer (ELB)
- Distributes traffic across instances
- Multiple load balancing algorithms
- Health checks and auto failover

### NAT Gateway
- Enables internet access for private subnets
- SNAT and DNAT capabilities
- High availability and scalability

### VPN Gateway
- Secure connections to on-premises
- Site-to-site and point-to-site VPN
- IPsec and SSL VPN support

## Database Services

### Relational Database Service (RDS)
- Managed database service
- Multiple database engines (MySQL, PostgreSQL, SQL Server)
- Automated backups and maintenance

### Document Database Service (DDS)
- MongoDB-compatible database
- Flexible document model
- Auto scaling and high availability

### GaussDB
- Enterprise-grade distributed database
- HTAP (Hybrid Transaction/Analytical Processing)
- High performance and scalability

### Distributed Cache Service (DCS)
- In-memory caching service
- Redis and Memcached compatible
- High availability and data persistence`,
      category: 'HCIA',
      description: 'Overview of core Huawei Cloud services',
      readTime: '25 min',
      difficulty: 'medium',
      lastUpdated: '2024-01-20'
    },
    {
      id: '3',
      title: 'HCIP Cloud Architecture Design',
      content: `# Cloud Architecture Design Principles

## Core Design Principles

### 1. Scalability and Elasticity
- **Horizontal Scaling**: Add more instances to handle increased load
- **Vertical Scaling**: Increase resources of existing instances
- **Auto Scaling**: Automatically adjust resources based on demand
- **Load Distribution**: Spread workload across multiple resources

### 2. High Availability and Fault Tolerance
- **Redundancy**: Multiple instances across availability zones
- **Failover**: Automatic switching to backup systems
- **Health Monitoring**: Continuous monitoring of system health
- **Disaster Recovery**: Plans for catastrophic failures

### 3. Security and Compliance
- **Defense in Depth**: Multiple layers of security
- **Encryption**: Data at rest and in transit
- **Access Control**: Identity and access management
- **Compliance**: Meeting regulatory requirements

### 4. Cost Optimization
- **Right Sizing**: Matching resources to actual needs
- **Reserved Instances**: Long-term commitments for discounts
- **Spot Instances**: Using spare capacity at reduced costs
- **Resource Monitoring**: Tracking usage and costs

### 5. Performance Efficiency
- **Resource Selection**: Choosing appropriate services and configurations
- **Monitoring**: Continuous performance monitoring
- **Optimization**: Regular performance tuning
- **Caching**: Using caching to improve response times

## Architecture Patterns

### Multi-tier Architecture
- **Presentation Tier**: User interface and user experience
- **Application Tier**: Business logic and processing
- **Data Tier**: Data storage and management
- **Benefits**: Separation of concerns, scalability, maintainability

### Microservices Architecture
- **Service Decomposition**: Breaking monolith into small services
- **Independent Deployment**: Each service can be deployed separately
- **Technology Diversity**: Different technologies for different services
- **Challenges**: Complexity, service communication, data consistency

### Serverless Architecture
- **Function as a Service (FaaS)**: Event-driven function execution
- **No Server Management**: Focus on code, not infrastructure
- **Auto Scaling**: Automatic scaling based on demand
- **Pay per Use**: Only pay for actual execution time

### Event-driven Architecture
- **Event Producers**: Components that generate events
- **Event Consumers**: Components that process events
- **Event Routing**: Directing events to appropriate consumers
- **Benefits**: Loose coupling, scalability, real-time processing

## Best Practices

### Design for Failure
- Assume components will fail
- Implement circuit breakers
- Use timeouts and retries
- Plan for graceful degradation

### Implement Monitoring and Logging
- Application performance monitoring (APM)
- Infrastructure monitoring
- Centralized logging
- Alerting and notification

### Automate Everything
- Infrastructure as Code (IaC)
- Continuous Integration/Continuous Deployment (CI/CD)
- Automated testing
- Configuration management

### Use Managed Services
- Reduce operational overhead
- Leverage cloud provider expertise
- Focus on business logic
- Improve security and compliance`,
      category: 'HCIP',
      description: 'Advanced cloud architecture design principles',
      readTime: '35 min',
      difficulty: 'hard',
      lastUpdated: '2024-01-25'
    }
  ]

  const mockFlashcards = [
    {
      id: '1',
      front: 'What are the 5 essential characteristics of cloud computing according to NIST?',
      back: '1. On-demand self-service\n2. Broad network access\n3. Resource pooling\n4. Rapid elasticity\n5. Measured service',
      category: 'HCIA',
      difficulty: 'easy'
    },
    {
      id: '2',
      front: 'What is the difference between IaaS, PaaS, and SaaS?',
      back: 'IaaS: Infrastructure as a Service - provides virtualized computing resources\nPaaS: Platform as a Service - provides platform and environment for developers\nSaaS: Software as a Service - provides complete software applications',
      category: 'HCIA',
      difficulty: 'medium'
    },
    {
      id: '3',
      front: 'What is Huawei Cloud ECS?',
      back: 'Elastic Cloud Server - Huawei\'s virtual machine service that provides scalable computing capacity in the cloud',
      category: 'HCIA',
      difficulty: 'easy'
    },
    {
      id: '4',
      front: 'What are the main components of a VPC in Huawei Cloud?',
      back: '1. Subnets\n2. Route Tables\n3. Security Groups\n4. Network ACLs\n5. Internet Gateway\n6. NAT Gateway',
      category: 'HCIP',
      difficulty: 'medium'
    },
    {
      id: '5',
      front: 'What is the difference between vertical and horizontal scaling?',
      back: 'Vertical scaling: Increasing resources of existing instances (scale up)\nHorizontal scaling: Adding more instances to handle load (scale out)',
      category: 'HCIP',
      difficulty: 'hard'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setStudyMaterials(mockStudyMaterials)
      setFlashcards(mockFlashcards)
      setLoading(false)
    }, 1000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1)
    }
  }

  const [selectedMaterial, setSelectedMaterial] = useState(null)

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
  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap sm:space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </nav>
    </div>
  </div>

  {/* Filters */}
  {(activeTab === 'materials' || activeTab === 'flashcards') && (
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
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                onChange={(e) => setSelectedDifficulty(e.target.value)}
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedMaterial(null)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      ← Back to materials
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedMaterial.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : selectedMaterial.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {selectedMaterial.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {selectedMaterial.category}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                    {selectedMaterial.title}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedMaterial.readTime}
                    </div>
                    <div>Updated {selectedMaterial.lastUpdated}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line">
                      {selectedMaterial.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {material.category}
                        </span>
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
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search study materials and flashcards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                          onClick={() => {
                            setSelectedMaterial(material)
                            setActiveTab('materials')
                          }}
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
                {searchQuery && flashcards.filter(card => 
                  card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  card.back.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Flashcards ({flashcards.filter(card => 
                        card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        card.back.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length})
                    </h3>
                    <div className="space-y-4">
                      {flashcards.filter(card => 
                        card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        card.back.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((card) => (
                        <div
                          key={card.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                          onClick={() => {
                            const cardIndex = filteredFlashcards.findIndex(c => c.id === card.id)
                            if (cardIndex !== -1) {
                              setCurrentFlashcardIndex(cardIndex)
                              setActiveTab('flashcards')
                            }
                          }}
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
                {searchQuery && filteredMaterials.length === 0 && 
                 flashcards.filter(card => 
                   card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   card.back.toLowerCase().includes(searchQuery.toLowerCase())
                 ).length === 0 && (
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
        )}
      </>
    )}
  </div>
</div>
  )
}