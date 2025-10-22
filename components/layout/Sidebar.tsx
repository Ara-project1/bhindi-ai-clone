'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentIcon,
  CogIcon,
  PlusIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { useChatStore } from '@/store/chatStore'
import { useTheme } from '@/hooks/useTheme'
import { formatDistanceToNow } from 'date-fns'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navigationItems = [
  { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
  { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
  { id: 'files', label: 'Files', icon: DocumentIcon },
  { id: 'integrations', label: 'Integrations', icon: Squares2X2Icon },
  { id: 'settings', label: 'Settings', icon: CogIcon },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [showSessions, setShowSessions] = useState(true)
  const { sessions, currentSessionId, createSession, deleteSession, setCurrentSession } = useChatStore()
  const { theme, setTheme, isDark } = useTheme()

  const handleNewChat = () => {
    const sessionId = createSession()
    setActiveTab('chat')
  }

  const handleSessionClick = (sessionId: string) => {
    setCurrentSession(sessionId)
    setActiveTab('chat')
  }

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteSession(sessionId)
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return SunIcon
      case 'dark':
        return MoonIcon
      default:
        return ComputerDesktopIcon
    }
  }

  const ThemeIcon = getThemeIcon()

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bhindi AI
          </h2>
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Current theme: ${theme}`}
          >
            <ThemeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item w-full ${
                  activeTab === item.id ? 'active' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
          >
            <span>Recent Chats</span>
            <motion.div
              animate={{ rotate: showSessions ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {showSessions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-y-auto max-h-96 scrollbar-hide"
              >
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chats yet</p>
                    <p className="text-xs">Start a conversation!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Bhindi AI Clone v1.0</p>
          <p>Built with Next.js & AI</p>
        </div>
      </div>
    </div>
  )
}