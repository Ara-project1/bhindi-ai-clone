import { Message } from '@/store/chatStore'

class ChatService {
  private apiKey: string | null = null
  private baseUrl = 'https://api.openai.com/v1'

  constructor() {
    // In a real app, you'd get this from environment variables or user settings
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendMessage(message: string, conversationHistory: Message[] = []): Promise<string> {
    // If no API key is set, return a mock response
    if (!this.apiKey) {
      return this.getMockResponse(message)
    }

    try {
      const messages = [
        {
          role: 'system',
          content: `You are Bhindi AI, a helpful and intelligent assistant. You can help with:
          - Answering questions and providing information
          - Scheduling reminders and tasks
          - Web searches and research
          - File analysis and processing
          - Code generation and debugging
          - Creative writing and brainstorming
          - Math and calculations
          - And much more!
          
          Be helpful, concise, and friendly. If you need to perform actions like scheduling or web searches, explain what you would do in a real implementation.`
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ]

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    } catch (error) {
      console.error('Chat service error:', error)
      throw new Error('Failed to get AI response. Please check your API key and try again.')
    }
  }

  private getMockResponse(message: string): Promise<string> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const lowerMessage = message.toLowerCase()
        
        if (lowerMessage.includes('schedule') || lowerMessage.includes('remind')) {
          resolve(`I'd be happy to help you schedule that! In a full implementation, I would:

1. Parse your request for date/time information
2. Create a reminder in your calendar
3. Set up notifications
4. Confirm the scheduled item

For now, this is a demo version. To enable full scheduling functionality, you would need to:
- Connect your calendar (Google Calendar, Outlook, etc.)
- Set up notification services
- Configure the scheduling backend

What would you like to schedule?`)
        } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
          resolve(`I can help you search for information! In the full version, I would:

1. Perform web searches using search engines
2. Analyze and summarize results
3. Provide relevant links and sources
4. Filter information based on your needs

For this demo, I can provide general information and guidance. What would you like to search for?`)
        } else if (lowerMessage.includes('file') || lowerMessage.includes('upload')) {
          resolve(`Great! I can help you work with files. In the full implementation, I would:

1. **Analyze documents**: Extract text, summarize content
2. **Process images**: Describe, analyze, extract text (OCR)
3. **Handle code files**: Review, debug, explain
4. **Work with data**: Parse CSV, JSON, analyze spreadsheets

You can upload files using the paperclip icon in the chat. What type of file would you like to work with?`)
        } else if (lowerMessage.includes('what can you') || lowerMessage.includes('help')) {
          resolve(`I'm Bhindi AI, your intelligent assistant! Here's what I can help you with:

🤖 **Chat & Conversation**
- Answer questions on any topic
- Provide explanations and tutorials
- Help with creative writing

📅 **Scheduling & Reminders**
- Set up reminders and tasks
- Schedule meetings and events
- Time management assistance

📁 **File Processing**
- Analyze documents and images
- Extract and summarize content
- Code review and debugging

🔍 **Web Search & Research**
- Find information online
- Summarize articles and papers
- Research assistance

⚙️ **Integrations** (Premium)
- Connect with your favorite apps
- Automate workflows
- Sync data across platforms

This is a demo version showcasing the free features. What would you like to try first?`)
        } else if (lowerMessage.includes('code') || lowerMessage.includes('program')) {
          resolve(`I'd love to help you with coding! I can assist with:

**Programming Languages:**
- JavaScript/TypeScript, Python, Java, C++, Go, Rust
- HTML/CSS, React, Vue, Angular
- SQL, NoSQL databases
- And many more!

**What I can do:**
- Write code from scratch
- Debug and fix issues
- Explain complex concepts
- Code reviews and optimization
- Architecture suggestions

**Example:**
\`\`\`javascript
// Simple React component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

What programming task can I help you with?`)
        } else {
          resolve(`Hello! I'm Bhindi AI, your intelligent assistant. I understand you said: "${message}"

I'm here to help you with a wide variety of tasks including:
- Answering questions and providing information
- Scheduling and reminders
- File analysis and processing
- Web searches and research
- Code generation and debugging
- Creative tasks and brainstorming

This is a demo version showcasing the core free features. In a full implementation, I would have access to real-time data, scheduling systems, and various integrations.

How can I assist you today? Feel free to ask me anything or try uploading a file to see how I can help analyze it!`)
        }
      }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
    })
  }

  // Web search simulation
  async searchWeb(query: string): Promise<string> {
    // In a real implementation, this would use a search API
    return `I would search for "${query}" using web search APIs and provide you with relevant results, summaries, and sources. This feature requires API integration with search services like Google, Bing, or specialized search APIs.`
  }

  // File analysis simulation
  async analyzeFile(file: File): Promise<string> {
    const fileType = file.type
    const fileName = file.name
    const fileSize = file.size

    if (fileType.startsWith('image/')) {
      return `I would analyze this image (${fileName}, ${fileSize} bytes) and provide:
- Description of what's in the image
- Text extraction (OCR) if applicable
- Image metadata and properties
- Suggestions for editing or optimization`
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return `I would process this document (${fileName}, ${fileSize} bytes) and provide:
- Text extraction and content summary
- Key points and insights
- Document structure analysis
- Searchable content indexing`
    } else if (fileType.startsWith('audio/')) {
      return `I would process this audio file (${fileName}, ${fileSize} bytes) and provide:
- Speech-to-text transcription
- Audio content analysis
- Speaker identification
- Key moments and timestamps`
    } else {
      return `I would analyze this file (${fileName}, ${fileSize} bytes) based on its type and content, providing relevant insights and processing options.`
    }
  }
}

export const chatService = new ChatService()