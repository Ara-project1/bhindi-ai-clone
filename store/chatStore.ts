import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'file' | 'image' | 'code'
  metadata?: {
    fileName?: string
    fileSize?: number
    fileType?: string
    language?: string
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  initializeChat: () => void
  createSession: (title?: string) => string
  deleteSession: (sessionId: string) => void
  setCurrentSession: (sessionId: string) => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (messageId: string, content: string) => void
  deleteMessage: (messageId: string) => void
  clearCurrentSession: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getCurrentSession: () => ChatSession | null
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,

      initializeChat: () => {
        const state = get()
        if (state.sessions.length === 0) {
          const sessionId = state.createSession('New Chat')
          state.setCurrentSession(sessionId)
        } else if (!state.currentSessionId) {
          state.setCurrentSession(state.sessions[0].id)
        }
      },

      createSession: (title = 'New Chat') => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newSession: ChatSession = {
          id: sessionId,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: sessionId,
        }))

        return sessionId
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const filteredSessions = state.sessions.filter(s => s.id !== sessionId)
          const newCurrentId = state.currentSessionId === sessionId 
            ? (filteredSessions.length > 0 ? filteredSessions[0].id : null)
            : state.currentSessionId

          return {
            sessions: filteredSessions,
            currentSessionId: newCurrentId,
          }
        })
      },

      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId })
      },

      addMessage: (message) => {
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newMessage: Message = {
          ...message,
          id: messageId,
          timestamp: new Date(),
        }

        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: [...session.messages, newMessage],
                updatedAt: new Date(),
                title: session.messages.length === 0 && message.role === 'user' 
                  ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                  : session.title
              }
            }
            return session
          })

          return { sessions }
        })
      },

      updateMessage: (messageId: string, content: string) => {
        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: session.messages.map(msg => 
                  msg.id === messageId ? { ...msg, content } : msg
                ),
                updatedAt: new Date(),
              }
            }
            return session
          })

          return { sessions }
        })
      },

      deleteMessage: (messageId: string) => {
        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: session.messages.filter(msg => msg.id !== messageId),
                updatedAt: new Date(),
              }
            }
            return session
          })

          return { sessions }
        })
      },

      clearCurrentSession: () => {
        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: [],
                updatedAt: new Date(),
              }
            }
            return session
          })

          return { sessions }
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      getCurrentSession: () => {
        const state = get()
        return state.sessions.find(s => s.id === state.currentSessionId) || null
      },
    }),
    {
      name: 'bhindi-chat-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
)