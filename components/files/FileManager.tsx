'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DocumentIcon, 
  PhotoIcon, 
  FilmIcon, 
  MusicalNoteIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  url?: string
  thumbnail?: string
  folder?: string
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  // Load files from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bhindi-files')
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          uploadedAt: new Date(item.uploadedAt)
        }))
        setFiles(parsed)
      } catch (error) {
        console.error('Failed to load files:', error)
      }
    }
  }, [])

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('bhindi-files', JSON.stringify(files))
  }, [files])

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const fileItem: FileItem = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        url: URL.createObjectURL(file),
        folder: getFileFolder(file.type)
      }
      
      setFiles(prev => [fileItem, ...prev])
    })
    
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json', '.csv', '.xml'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
      'video/*': ['.mp4', '.webm', '.ogg', '.mov'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const getFileFolder = (type: string): string => {
    if (type.startsWith('image/')) return 'images'
    if (type.startsWith('video/')) return 'videos'
    if (type.startsWith('audio/')) return 'audio'
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'documents'
    return 'others'
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return PhotoIcon
    if (type.startsWith('video/')) return FilmIcon
    if (type.startsWith('audio/')) return MusicalNoteIcon
    return DocumentIcon
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
    toast.success('File deleted successfully!')
  }

  const downloadFile = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFilteredFiles = () => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder
      return matchesSearch && matchesFolder
    })
  }

  const getFolders = () => {
    const folders = Array.from(new Set(files.map(file => file.folder || 'others')))
    return [
      { key: 'all', label: 'All Files', count: files.length },
      ...folders.map(folder => ({
        key: folder,
        label: folder.charAt(0).toUpperCase() + folder.slice(1),
        count: files.filter(file => file.folder === folder).length
      }))
    ]
  }

  const filteredFiles = getFilteredFiles()

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          File Manager
        </h2>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mb-6 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          {isDragActive ? (
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Drop files here...
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Drop files or click
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max 50MB per file
              </p>
            </div>
          )}
        </div>

        {/* Folders */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Folders
          </h3>
          {getFolders().map(folder => (
            <button
              key={folder.key}
              onClick={() => setSelectedFolder(folder.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolder === folder.key
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FolderIcon className="w-4 h-4" />
                <span>{folder.label}</span>
              </div>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                {folder.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Files
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="btn-secondary"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <DocumentIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No files found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery 
                  ? `No files match "${searchQuery}"`
                  : "Upload your first file to get started"
                }
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-2'
            }>
              <AnimatePresence>
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type)
                  
                  if (viewMode === 'grid') {
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col items-center text-center">
                          {file.type.startsWith('image/') && file.url ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-16 h-16 object-cover rounded-lg mb-3"
                            />
                          ) : (
                            <FileIcon className="w-16 h-16 text-gray-400 mb-3" />
                          )}
                          
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate w-full">
                            {file.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {format(file.uploadedAt, 'MMM dd, yyyy')}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedFile(file)}
                              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                              title="View"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadFile(file)}
                              className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                              title="Download"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  } else {
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatFileSize(file.size)} • {format(file.uploadedAt, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedFile(file)}
                              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="View"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadFile(file)}
                              className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Download"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  }
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <FilePreview
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// File Preview Component
interface FilePreviewProps {
  file: FileItem
  onClose: () => void
}

function FilePreview({ file, onClose }: FilePreviewProps) {
  const renderPreview = () => {
    if (file.type.startsWith('image/') && file.url) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      )
    } else if (file.type.startsWith('video/') && file.url) {
      return (
        <video
          src={file.url}
          controls
          className="max-w-full max-h-96 rounded-lg"
        />
      )
    } else if (file.type.startsWith('audio/') && file.url) {
      return (
        <audio
          src={file.url}
          controls
          className="w-full"
        />
      )
    } else {
      return (
        <div className="text-center py-8">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Preview not available for this file type
          </p>
        </div>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)} • {format(file.uploadedAt, 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="text-center">
            {renderPreview()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}