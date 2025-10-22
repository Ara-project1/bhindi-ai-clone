'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperAirplaneIcon, PaperClipIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { useChatStore } from '@/store/chatStore'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import FileUpload from './FileUpload'
import { chatService } from '@/services/chatService'
import toast from 'react-hot-toast'

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { 
    getCurrentSession, 
    addMessage, 
    isLoading, 
    setLoading, 
    setError 
  } = useChatStore()

  const currentSession = getCurrentSession()

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    addMessage({
      content: userMessage,
      role: 'user',
      type: 'text'
    })

    setLoading(true)
    setError(null)

    try {
      // Get AI response
      const response = await chatService.sendMessage(userMessage, currentSession?.messages || [])
      
      // Add AI response
      addMessage({
        content: response,
        role: 'assistant',
        type: 'text'
      })
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response'
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Add error message
      addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        type: 'text'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      addMessage({
        content: `Uploaded file: ${file.name}`,
        role: 'user',
        type: 'file',
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      })
    })
    setShowFileUpload(false)
    toast.success(`${files.length} file(s) uploaded successfully`)
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  if (!currentSession) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Bhindi AI
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start a conversation to begin using your AI assistant
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-container p-4 space-y-4">
        <AnimatePresence>
          {currentSession.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => setShowFileUpload(true)}
            className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Upload file"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="input-field resize-none min-h-[48px] max-h-[120px] pr-12"
              disabled={isLoading}
              rows={1}
            />
            
            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
                isRecording 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/30' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            'What can you help me with?',
            'Schedule a reminder',
            'Search the web',
            'Analyze this file'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Modal */}
      <AnimatePresence>
        {showFileUpload && (
          <FileUpload
            onUpload={handleFileUpload}
            onClose={() => setShowFileUpload(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}