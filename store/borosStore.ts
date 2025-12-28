import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aiService } from '@/services/aiService';
import { licenseService } from '@/services/licenseService';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  artifacts?: Artifact[];
  isStreaming?: boolean;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'code' | 'text' | 'html' | 'markdown';
  content: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  messages: Message[];
  artifacts: Artifact[];
  createdAt: Date;
  updatedAt: Date;
}

interface BorosState {
  // User state
  userName: string;
  isProUser: boolean;
  licenseKey: string;
  messageCount: number;
  lastResetTime: Date;

  // Chat state
  messages: Message[];
  isTyping: boolean;
  currentProject: Project | null;

  // Artifacts
  artifacts: Artifact[];
  
  // Projects
  projects: Project[];

  // Actions
  setUserName: (name: string) => void;
  setLicenseKey: (key: string) => Promise<boolean>;
  sendMessage: (content: string) => Promise<void>;
  checkMessageLimit: () => boolean;
  resetMessageCount: () => void;
  createProject: (name: string, description: string) => void;
  loadProject: (projectId: string) => void;
  saveArtifact: (artifact: Artifact) => void;
  deleteArtifact: (artifactId: string) => void;
}

export const useBorosStore = create<BorosState>()(
  persist(
    (set, get) => ({
      // Initial state
      userName: '',
      isProUser: false,
      licenseKey: '',
      messageCount: 0,
      lastResetTime: new Date(),
      messages: [],
      isTyping: false,
      currentProject: null,
      artifacts: [],
      projects: [],

      // Actions
      setUserName: (name: string) => {
        set({ userName: name });
      },

      setLicenseKey: async (key: string) => {
        try {
          const isValid = await licenseService.validateLicense(key);
          if (isValid) {
            set({ licenseKey: key, isProUser: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('License validation error:', error);
          return false;
        }
      },

      sendMessage: async (content: string) => {
        const state = get();
        const userMessage: Message = {
          id: Date.now().toString(),
          content,
          role: 'user',
          timestamp: new Date(),
        };

        // Add user message
        set({
          messages: [...state.messages, userMessage],
          isTyping: true,
          messageCount: state.messageCount + 1,
        });

        try {
          // Send to AI service
          const response = await aiService.sendMessage(content, state.messages);
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.content,
            role: 'assistant',
            timestamp: new Date(),
            artifacts: response.artifacts,
          };

          // Add assistant message
          set(state => ({
            messages: [...state.messages, assistantMessage],
            isTyping: false,
            artifacts: response.artifacts 
              ? [...state.artifacts, ...response.artifacts]
              : state.artifacts,
          }));

        } catch (error) {
          console.error('AI service error:', error);
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: 'I apologize, but I encountered an error. Please try again.',
            role: 'assistant',
            timestamp: new Date(),
          };

          set(state => ({
            messages: [...state.messages, errorMessage],
            isTyping: false,
          }));
        }
      },

      checkMessageLimit: () => {
        const state = get();
        
        if (state.isProUser) return true;

        // Check if 5 hours have passed since last reset
        const now = new Date();
        const timeDiff = now.getTime() - state.lastResetTime.getTime();
        const hoursPassed = timeDiff / (1000 * 60 * 60);

        if (hoursPassed >= 5) {
          set({
            messageCount: 0,
            lastResetTime: now,
          });
          return true;
        }

        return state.messageCount < 5;
      },

      resetMessageCount: () => {
        set({
          messageCount: 0,
          lastResetTime: new Date(),
        });
      },

      createProject: (name: string, description: string) => {
        const newProject: Project = {
          id: Date.now().toString(),
          name,
          description,
          messages: [],
          artifacts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          messages: [],
        }));
      },

      loadProject: (projectId: string) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        
        if (project) {
          set({
            currentProject: project,
            messages: project.messages,
          });
        }
      },

      saveArtifact: (artifact: Artifact) => {
        set(state => ({
          artifacts: [...state.artifacts.filter(a => a.id !== artifact.id), artifact],
        }));
      },

      deleteArtifact: (artifactId: string) => {
        set(state => ({
          artifacts: state.artifacts.filter(a => a.id !== artifactId),
        }));
      },
    }),
    {
      name: 'boros-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userName: state.userName,
        isProUser: state.isProUser,
        licenseKey: state.licenseKey,
        messageCount: state.messageCount,
        lastResetTime: state.lastResetTime,
        artifacts: state.artifacts,
        projects: state.projects,
      }),
    }
  )
);