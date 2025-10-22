'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  BellIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import toast from 'react-hot-toast'

interface ScheduleItem {
  id: string
  title: string
  description?: string
  datetime: Date
  type: 'reminder' | 'task' | 'meeting'
  completed: boolean
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly'
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all')

  // Load schedules from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bhindi-schedules')
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          datetime: new Date(item.datetime)
        }))
        setSchedules(parsed)
      } catch (error) {
        console.error('Failed to load schedules:', error)
      }
    }
  }, [])

  // Save schedules to localStorage whenever schedules change
  useEffect(() => {
    localStorage.setItem('bhindi-schedules', JSON.stringify(schedules))
  }, [schedules])

  const createSchedule = (scheduleData: Omit<ScheduleItem, 'id' | 'completed'>) => {
    const newSchedule: ScheduleItem = {
      ...scheduleData,
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      completed: false
    }
    
    setSchedules(prev => [...prev, newSchedule])
    setShowCreateForm(false)
    toast.success('Schedule created successfully!')
  }

  const updateSchedule = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, ...updates } : schedule
    ))
    setEditingSchedule(null)
    toast.success('Schedule updated successfully!')
  }

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id))
    toast.success('Schedule deleted successfully!')
  }

  const toggleComplete = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, completed: !schedule.completed } : schedule
    ))
  }

  const getFilteredSchedules = () => {
    return schedules.filter(schedule => {
      switch (filter) {
        case 'today':
          return isToday(schedule.datetime)
        case 'upcoming':
          return !isPast(schedule.datetime) && !schedule.completed
        case 'completed':
          return schedule.completed
        default:
          return true
      }
    }).sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
  }

  const getScheduleStatus = (schedule: ScheduleItem) => {
    if (schedule.completed) return 'completed'
    if (isPast(schedule.datetime)) return 'overdue'
    if (isToday(schedule.datetime)) return 'today'
    if (isTomorrow(schedule.datetime)) return 'tomorrow'
    return 'upcoming'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'overdue':
        return 'text-red-600 dark:text-red-400'
      case 'today':
        return 'text-blue-600 dark:text-blue-400'
      case 'tomorrow':
        return 'text-purple-600 dark:text-purple-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return BellIcon
      case 'meeting':
        return CalendarIcon
      default:
        return ClockIcon
    }
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Schedule Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your reminders, tasks, and meetings
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Schedule</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'today', label: 'Today' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence>
          {getFilteredSchedules().map((schedule) => {
            const status = getScheduleStatus(schedule)
            const statusColor = getStatusColor(status)
            const TypeIcon = getTypeIcon(schedule.type)

            return (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border transition-all ${
                  schedule.completed
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Completion Toggle */}
                    <button
                      onClick={() => toggleComplete(schedule.id)}
                      className={`mt-1 p-1 rounded-full transition-colors ${
                        schedule.completed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <h3 className={`font-medium ${
                          schedule.completed 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {schedule.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${statusColor}`}>
                          {status}
                        </span>
                      </div>
                      
                      {schedule.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {schedule.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{format(schedule.datetime, 'MMM dd, yyyy')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{format(schedule.datetime, 'HH:mm')}</span>
                        </span>
                        {schedule.recurring !== 'none' && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            {schedule.recurring}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingSchedule(schedule)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {getFilteredSchedules().length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No schedules found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filter === 'all' 
                ? "You haven't created any schedules yet."
                : `No schedules match the "${filter}" filter.`
              }
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Your First Schedule
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {(showCreateForm || editingSchedule) && (
          <ScheduleForm
            schedule={editingSchedule}
            onSave={editingSchedule ? 
              (data) => updateSchedule(editingSchedule.id, data) : 
              createSchedule
            }
            onClose={() => {
              setShowCreateForm(false)
              setEditingSchedule(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Schedule Form Component
interface ScheduleFormProps {
  schedule?: ScheduleItem | null
  onSave: (data: Omit<ScheduleItem, 'id' | 'completed'>) => void
  onClose: () => void
}

function ScheduleForm({ schedule, onSave, onClose }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    title: schedule?.title || '',
    description: schedule?.description || '',
    datetime: schedule?.datetime ? format(schedule.datetime, "yyyy-MM-dd'T'HH:mm") : '',
    type: schedule?.type || 'reminder' as const,
    recurring: schedule?.recurring || 'none' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.datetime) {
      toast.error('Please fill in all required fields')
      return
    }

    onSave({
      title: formData.title,
      description: formData.description,
      datetime: new Date(formData.datetime),
      type: formData.type,
      recurring: formData.recurring
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {schedule ? 'Edit Schedule' : 'Create New Schedule'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Enter schedule title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field resize-none"
                rows={3}
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="input-field"
              >
                <option value="reminder">Reminder</option>
                <option value="task">Task</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recurring
              </label>
              <select
                value={formData.recurring}
                onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.value as any }))}
                className="input-field"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {schedule ? 'Update' : 'Create'} Schedule
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}