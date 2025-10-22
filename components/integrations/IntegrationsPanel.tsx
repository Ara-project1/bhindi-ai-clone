'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CogIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  CloudIcon,
  CameraIcon,
  MusicalNoteIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Integration {
  id: string
  name: string
  description: string
  category: 'productivity' | 'communication' | 'storage' | 'social' | 'finance' | 'other'
  icon: any
  connected: boolean
  free: boolean
  comingSoon?: boolean
}

const integrations: Integration[] = [
  // Free integrations
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information and get real-time results',
    category: 'productivity',
    icon: GlobeAltIcon,
    connected: true,
    free: true
  },
  {
    id: 'file-analysis',
    name: 'File Analysis',
    description: 'Analyze and extract information from uploaded files',
    category: 'productivity',
    icon: DocumentIcon,
    connected: true,
    free: true
  },
  {
    id: 'basic-scheduling',
    name: 'Basic Scheduling',
    description: 'Create reminders and basic schedule management',
    category: 'productivity',
    icon: CalendarIcon,
    connected: true,
    free: true
  },
  {
    id: 'text-generation',
    name: 'Text Generation',
    description: 'Generate content, summaries, and creative writing',
    category: 'productivity',
    icon: ChatBubbleLeftRightIcon,
    connected: true,
    free: true
  },
  
  // Premium integrations (coming soon)
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send emails, manage inbox, and organize messages',
    category: 'communication',
    icon: EnvelopeIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Manage events, schedule meetings, and sync calendars',
    category: 'productivity',
    icon: CalendarIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Access, organize, and share files in your Drive',
    category: 'storage',
    icon: CloudIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages, manage channels, and team communication',
    category: 'communication',
    icon: ChatBubbleLeftRightIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create pages, manage databases, and organize notes',
    category: 'productivity',
    icon: DocumentIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Manage boards, cards, and project workflows',
    category: 'productivity',
    icon: ChartBarIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Control music playback and manage playlists',
    category: 'other',
    icon: MusicalNoteIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Post photos, manage content, and analyze engagement',
    category: 'social',
    icon: CameraIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Manage products, orders, and e-commerce operations',
    category: 'other',
    icon: ShoppingCartIcon,
    connected: false,
    free: false,
    comingSoon: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments, manage subscriptions, and track revenue',
    category: 'finance',
    icon: BanknotesIcon,
    connected: false,
    free: false,
    comingSoon: true
  }
]

export default function IntegrationsPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { key: 'all', label: 'All Integrations' },
    { key: 'productivity', label: 'Productivity' },
    { key: 'communication', label: 'Communication' },
    { key: 'storage', label: 'Storage' },
    { key: 'social', label: 'Social Media' },
    { key: 'finance', label: 'Finance' },
    { key: 'other', label: 'Other' }
  ]

  const getFilteredIntegrations = () => {
    return integrations.filter(integration => {
      const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }

  const handleConnect = (integration: Integration) => {
    if (integration.comingSoon) {
      toast.error('This integration is coming soon!')
      return
    }

    if (integration.connected) {
      toast.success(`${integration.name} is already connected!`)
    } else {
      toast.error('Premium integrations require a paid plan')
    }
  }

  const getStatusIcon = (integration: Integration) => {
    if (integration.connected) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    } else if (integration.comingSoon) {
      return <CogIcon className="w-5 h-5 text-yellow-500" />
    } else {
      return <XCircleIcon className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (integration: Integration) => {
    if (integration.connected) return 'Connected'
    if (integration.comingSoon) return 'Coming Soon'
    return 'Not Connected'
  }

  const getStatusColor = (integration: Integration) => {
    if (integration.connected) return 'text-green-600 dark:text-green-400'
    if (integration.comingSoon) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-gray-500 dark:text-gray-400'
  }

  const connectedCount = integrations.filter(i => i.connected).length
  const freeCount = integrations.filter(i => i.free).length

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Integrations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Connect your favorite apps and services to enhance your AI experience
        </p>
        
        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {connectedCount} Connected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {freeCount} Free
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {integrations.filter(i => i.comingSoon).length} Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="input-field"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredIntegrations().map((integration) => {
            const Icon = integration.icon
            
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {integration.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration)}
                        <span className={`text-sm ${getStatusColor(integration)}`}>
                          {getStatusText(integration)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {integration.free && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </p>

                <button
                  onClick={() => handleConnect(integration)}
                  disabled={integration.connected}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    integration.connected
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default'
                      : integration.comingSoon
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {integration.connected 
                    ? 'Connected' 
                    : integration.comingSoon 
                    ? 'Coming Soon' 
                    : 'Connect'
                  }
                </button>
              </motion.div>
            )
          })}
        </div>

        {getFilteredIntegrations().length === 0 && (
          <div className="text-center py-12">
            <LinkIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No integrations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery 
                ? `No integrations match "${searchQuery}"`
                : "No integrations available in this category"
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              About Integrations
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Free integrations are available to all users. Premium integrations require a paid plan and offer advanced features like real-time sync, automation, and enhanced functionality. More integrations are being added regularly!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}