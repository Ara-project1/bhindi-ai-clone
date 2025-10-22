# Bhindi AI Clone

A full-featured AI assistant clone built with Next.js, TypeScript, and modern web technologies. This project replicates all the free features of Bhindi AI with a beautiful, responsive interface.

![Bhindi AI Clone](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop)

## ✨ Features

### 🤖 **AI Chat Interface**
- Real-time conversations with AI
- Markdown support with syntax highlighting
- File upload and analysis
- Voice recording capability
- Multiple chat sessions
- Message history persistence

### 📅 **Schedule Manager**
- Create reminders, tasks, and meetings
- Recurring schedules (daily, weekly, monthly)
- Smart filtering and organization
- Due date tracking and notifications
- Calendar integration ready

### 📁 **File Manager**
- Drag & drop file uploads
- Support for documents, images, audio, video
- File preview and organization
- Folder-based categorization
- Search and filter capabilities
- Export and download functionality

### 🔗 **Integrations Panel**
- Web search integration
- File analysis tools
- Basic scheduling features
- Premium integrations preview
- Easy connection management

### ⚙️ **Settings & Customization**
- Dark/Light/System theme modes
- AI model configuration
- OpenAI API key integration
- Privacy and data controls
- Export/import functionality
- Multi-language support ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ara-project1/bhindi-ai-clone.git
   cd bhindi-ai-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (Optional)
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to enable real AI responses:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **State Management**: Zustand
- **File Handling**: React Dropzone
- **Date Handling**: date-fns
- **Markdown**: React Markdown with syntax highlighting
- **Notifications**: React Hot Toast

## 📱 Features Overview

### Free Features (Included)
- ✅ AI Chat with GPT integration
- ✅ File upload and basic analysis
- ✅ Schedule management
- ✅ Web search simulation
- ✅ Dark/Light themes
- ✅ Data export/import
- ✅ Responsive design
- ✅ Offline functionality

### Premium Features (UI Only)
- 🔒 Gmail integration
- 🔒 Google Calendar sync
- 🔒 Slack messaging
- 🔒 Advanced file processing
- 🔒 Real-time notifications
- 🔒 Cloud synchronization

## 🎨 Customization

### Themes
The app supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes
- **System**: Follows your OS preference

### AI Configuration
- Choose between GPT models
- Adjust temperature for creativity
- Set response length limits
- Configure API endpoints

## 📂 Project Structure

```
bhindi-ai-clone/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── chat/             # Chat interface
│   ├── files/            # File management
│   ├── integrations/     # Integration panel
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── schedule/         # Schedule manager
│   └── settings/         # Settings panel
├── hooks/                # Custom React hooks
├── services/             # API services
├── store/                # State management
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: OpenAI API Key for real AI responses
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here

# Optional: Custom API endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.openai.com/v1
```

### Customizing AI Behavior
Edit `services/chatService.ts` to:
- Change AI personality
- Add custom prompts
- Integrate different AI providers
- Modify response processing

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [Bhindi AI](https://bhindi.io)
- Built with modern React patterns
- Designed for extensibility and customization

## 📞 Support

- 🐛 [Report Issues](https://github.com/Ara-project1/bhindi-ai-clone/issues)
- 💡 [Feature Requests](https://github.com/Ara-project1/bhindi-ai-clone/discussions)
- 📧 Contact: [your-email@example.com]

---

**⭐ Star this repo if you find it useful!**

Built with ❤️ using Next.js and TypeScript