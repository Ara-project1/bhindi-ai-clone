'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { UserIcon, CpuChipIcon, DocumentIcon, PhotoIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '@/store/chatStore'
import { useTheme } from '@/hooks/useTheme'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { isDark } = useTheme()
  const isUser = message.role === 'user'

  const getMessageIcon = () => {
    if (isUser) return UserIcon
    
    switch (message.type) {
      case 'file':
        return DocumentIcon
      case 'image':
        return PhotoIcon
      case 'code':
        return CodeBracketIcon
      default:
        return CpuChipIcon
    }
  }

  const MessageIcon = getMessageIcon()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderContent = () => {
    if (message.type === 'file' && message.metadata) {
      return (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <DocumentIcon className="w-8 h-8 text-blue-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              {message.metadata.fileName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message.metadata.fileSize && formatFileSize(message.metadata.fileSize)} • {message.metadata.fileType}
            </p>
          </div>
        </div>
      )
    }

    if (message.type === 'code' && message.metadata?.language) {
      return (
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 text-sm text-gray-300">
            {message.metadata.language}
          </div>
          <SyntaxHighlighter
            language={message.metadata.language}
            style={isDark ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 0.5rem 0.5rem',
            }}
          >
            {message.content}
          </SyntaxHighlighter>
        </div>
      )
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-sm dark:prose-invert max-w-none"
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={isDark ? oneDark : oneLight}
                customStyle={{
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}>
          <MessageIcon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isUser ? 'You' : 'Bhindi AI'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
          
          <div className="text-gray-800 dark:text-gray-200">
            {renderContent()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}