'use client'

import { motion } from 'framer-motion'
import { CpuChipIcon } from '@heroicons/react/24/outline'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="chat-message ai-message"
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
          <CpuChipIcon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Bhindi AI
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              typing...
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              Thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}