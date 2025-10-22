'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import ChatInterface from '@/components/chat/ChatInterface'
import ScheduleManager from '@/components/schedule/ScheduleManager'
import FileManager from '@/components/files/FileManager'
import IntegrationsPanel from '@/components/integrations/IntegrationsPanel'
import SettingsPanel from '@/components/settings/SettingsPanel'
import { useChatStore } from '@/store/chatStore'
import { useTheme } from '@/hooks/useTheme'

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat')
  const { isDark } = useTheme()
  const { initializeChat } = useChatStore()

  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />
      case 'schedule':
        return <ScheduleManager />
      case 'files':
        return <FileManager />
      case 'integrations':
        return <IntegrationsPanel />
      case 'settings':
        return <SettingsPanel />
      default:
        return <ChatInterface />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Bhindi AI Clone
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your intelligent assistant for productivity and automation
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}