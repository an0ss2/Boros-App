# Boros AI Workspace

A premium AI workspace mobile application built with React Native and Expo, featuring Claude-inspired UX and dual AI model routing.

## Features

- **Dual AI Model Routing**: Groq Mixtral for general chat, Mistral Devstral for code generation
- **Artifact System**: Auto-detection and live preview of code, HTML, and documents
- **Time-Aware Greetings**: Personalized messages based on time of day
- **Usage Limits**: Free tier with 5 messages per 5-hour session, Pro tier with unlimited access
- **Project Management**: Organize conversations and artifacts into projects
- **Premium Design**: Claude-inspired UI with smooth animations and micro-interactions

## Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: Zustand with AsyncStorage persistence
- **Animations**: React Native Reanimated
- **Styling**: StyleSheet with custom design system
- **AI Integration**: Groq API with intelligent model routing
- **License Validation**: External PostgreSQL database

## Color Palette

- **Primary**: Crail (#C15F3C) - warm rust/terracotta
- **Background**: Pampas (#F4F3EE) - soft off-white
- **Secondary**: Cloudy (#B1ADA1) - warm gray
- **Assistant**: #FAF9F5 with soft rounded corners
- **User**: Light gray with minimal shadow

## Installation

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Expo CLI**: `npm install -g @expo/cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. **Android Studio** (for Android development)

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd boros-ai-workspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Building for Android

### Using EAS Build (Recommended)

1. **Login to Expo**:
   ```bash
   eas login
   ```

2. **Configure the project**:
   ```bash
   eas build:configure
   ```

3. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

### Using Termux (Local Build)

1. **Install Termux** on your Android device
2. **Setup build environment**:
   ```bash
   pkg update && pkg upgrade
   pkg install nodejs git
   npm install -g @expo/cli eas-cli
   ```

3. **Clone and build**:
   ```bash
   git clone <repository-url>
   cd boros-ai-workspace
   npm install
   eas build --platform android --profile preview --local
   ```

## License Server

The app includes a license validation system for Pro features. Contact `anos.wille@proton.me` for license inquiries.

### License Server Setup

The license server is a separate Node.js application that handles:
- License key validation
- Usage tracking
- Pro feature access control

## Project Structure

```
boros-ai-workspace/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Chat screen
│   │   ├── artifacts.tsx  # Artifacts management
│   │   ├── projects.tsx   # Project management
│   │   └── settings.tsx   # Settings screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ChatMessage.tsx    # Message bubble component
│   ├── TypingIndicator.tsx # AI typing animation
│   ├── TimeGreeting.tsx   # Time-based greeting
│   ├── CodeBlock.tsx      # Syntax highlighted code
│   └── ArtifactPreview.tsx # Artifact preview cards
├── services/              # API services
│   ├── aiService.ts       # Groq API integration
│   └── licenseService.ts  # License validation
├── store/                 # State management
│   └── borosStore.ts      # Zustand store
└── hooks/                 # Custom hooks
    └── useFrameworkReady.ts # Framework initialization
```

## Key Features Implementation

### AI Model Routing

The app intelligently routes requests between two AI models:

- **Groq Mixtral**: General conversation, analysis, creative tasks
- **Mistral Devstral**: Code generation, debugging, technical content

### Artifact System

Automatically detects and extracts code blocks using `<artifact>` tags:

```xml
<artifact type="code" language="javascript" title="React Component">
// Your code here
</artifact>
```

### Time-Aware Greetings

Personalized greetings based on time of day:
- Morning (05:00-11:59): "Good morning, [Name]. Ready to start fresh?"
- Afternoon (12:00-17:59): "Good afternoon, [Name]. Let's keep things moving."
- Evening (18:00-21:59): "Good evening, [Name]. How can I help you tonight?"
- Late Night (22:00-04:59): "It's late, [Name]. Let's focus and get this done."

### Usage Limits

- **Free Tier**: 5 messages per 5-hour session
- **Pro Tier**: Unlimited messages with license key validation

## Development

### Running the App

```bash
# Start development server
npm run dev

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

### Building

```bash
# Build for production
npm run build:web

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Deployment

### Android APK

1. **EAS Build**:
   ```bash
   eas build --platform android --profile production
   ```

2. **Download APK** from EAS dashboard
3. **Install** on Android device

### License Server Deployment

Deploy the license server to Render or similar platform:

1. **Create PostgreSQL database**
2. **Deploy Node.js application**
3. **Configure environment variables**
4. **Update app configuration**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For technical support or license inquiries, contact:
**anos.wille@proton.me**

## License

This project is proprietary software. All rights reserved.

---

**Boros AI Workspace** - Premium AI productivity for mobile devices.