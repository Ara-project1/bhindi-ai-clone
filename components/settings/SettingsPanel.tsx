'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '@/hooks/useTheme'
import { chatService } from '@/services/chatService'
import toast from 'react-hot-toast'

interface Settings {
  profile: {
    name: string
    email: string
    avatar?: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    notifications: boolean
    soundEnabled: boolean
  }
  ai: {
    model: string
    temperature: number
    maxTokens: number
    apiKey: string
  }
  privacy: {
    dataCollection: boolean
    analytics: boolean
    crashReports: boolean
  }
}

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState<Settings>({
    profile: {
      name: 'User',
      email: 'user@example.com'
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      notifications: true,
      soundEnabled: true
    },
    ai: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      apiKey: ''
    },
    privacy: {
      dataCollection: false,
      analytics: false,
      crashReports: true
    }
  })
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { theme, setTheme } = useTheme()

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bhindi-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('bhindi-settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (section: keyof Settings, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }))
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    updateSettings('preferences', { theme: newTheme })
  }

  const handleApiKeyChange = (apiKey: string) => {
    updateSettings('ai', { apiKey })
    chatService.setApiKey(apiKey)
    if (apiKey) {
      toast.success('API key updated successfully!')
    }
  }

  const clearAllData = () => {
    localStorage.clear()
    toast.success('All data cleared successfully!')
    setShowDeleteConfirm(false)
    // Reload the page to reset everything
    window.location.reload()
  }

  const exportData = () => {
    const data = {
      settings,
      chats: localStorage.getItem('bhindi-chat-storage'),
      schedules: localStorage.getItem('bhindi-schedules'),
      files: localStorage.getItem('bhindi-files')
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bhindi-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully!')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'preferences', label: 'Preferences', icon: CogIcon },
    { id: 'ai', label: 'AI Settings', icon: KeyIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
    { id: 'data', label: 'Data', icon: TrashIcon }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings('profile', { name: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings('profile', { email: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Appearance & Behavior
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'system', label: 'System' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          theme === option.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => updateSettings('preferences', { language: e.target.value })}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.preferences.timezone}
                    onChange={(e) => updateSettings('preferences', { timezone: e.target.value })}
                    className="input-field"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ai':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OpenAI API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.ai.apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="sk-..."
                      className="input-field pr-20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Add your OpenAI API key to enable real AI responses. Without it, you'll see demo responses.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <select
                    value={settings.ai.model}
                    onChange={(e) => updateSettings('ai', { model: e.target.value })}
                    className="input-field"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</option>
                    <option value="gpt-4">GPT-4 (Premium)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (Premium)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperature: {settings.ai.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.ai.temperature}
                    onChange={(e) => updateSettings('ai', { temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Focused</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    value={settings.ai.maxTokens}
                    onChange={(e) => updateSettings('ai', { maxTokens: parseInt(e.target.value) })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maximum length of AI responses (100-4000 tokens)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Enable Notifications
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications for schedules and reminders
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings('preferences', { notifications: !settings.preferences.notifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.preferences.notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Sound Effects
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Play sounds for notifications and interactions
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings('preferences', { soundEnabled: !settings.preferences.soundEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.preferences.soundEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy & Data
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Data Collection
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow collection of usage data to improve the service
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings('privacy', { dataCollection: !settings.privacy.dataCollection })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.dataCollection ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.dataCollection ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Analytics
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share anonymous analytics to help improve features
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings('privacy', { analytics: !settings.privacy.analytics })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.analytics ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Crash Reports
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically send crash reports to help fix bugs
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings('privacy', { crashReports: !settings.privacy.crashReports })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.crashReports ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.crashReports ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Management
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Export Your Data
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Download all your chats, schedules, files, and settings as a JSON file.
                      </p>
                      <button
                        onClick={exportData}
                        className="mt-3 btn-primary text-sm"
                      >
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                        Clear All Data
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Permanently delete all your chats, schedules, files, and settings. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Clear All Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Settings
        </h2>
        
        <nav className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clear All Data
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete all your data? This will permanently remove:
            </p>
            
            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
              <li>• All chat conversations</li>
              <li>• All scheduled reminders and tasks</li>
              <li>• All uploaded files</li>
              <li>• All settings and preferences</li>
            </ul>
            
            <p className="text-sm text-red-600 dark:text-red-400 mb-6 font-medium">
              This action cannot be undone!
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}