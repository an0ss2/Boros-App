import axios from 'axios';
import { Message, Artifact } from '@/store/borosStore';

interface AIResponse {
  content: string;
  artifacts?: Artifact[];
}

class AIService {
  private readonly baseURL = 'https://api.groq.com/openai/v1';
  private readonly apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

  async sendMessage(content: string, history: Message[]): Promise<AIResponse> {
    try {
      // Determine which model to use based on content
      const useDevstral = this.shouldUseDevstral(content);
      const model = useDevstral ? 'mixtral-8x7b-32768' : 'mixtral-8x7b-32768';

      // Prepare conversation history
      const messages = [
        {
          role: 'system',
          content: this.getSystemPrompt(useDevstral),
        },
        ...history.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content,
        },
      ];

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model,
          messages,
          temperature: 0.7,
          max_tokens: 4000,
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const aiContent = response.data.choices[0].message.content;
      
      // Extract artifacts if present
      const artifacts = this.extractArtifacts(aiContent);
      
      return {
        content: this.cleanContent(aiContent),
        artifacts,
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  private shouldUseDevstral(content: string): boolean {
    const codeKeywords = [
      'code', 'function', 'class', 'component', 'algorithm',
      'debug', 'fix', 'implement', 'create app', 'build',
      'programming', 'development', 'software', 'api',
    ];

    const lowerContent = content.toLowerCase();
    return codeKeywords.some(keyword => lowerContent.includes(keyword));
  }

  private getSystemPrompt(isDevstral: boolean): string {
    if (isDevstral) {
      return `You are Boros Architect, a specialized AI assistant focused on code generation, software development, and technical problem-solving. You excel at:

- Writing clean, efficient, and well-documented code
- Creating complete applications and components
- Debugging and optimizing existing code
- Explaining complex technical concepts
- Generating artifacts for code, HTML, and technical content

When creating code or technical content, wrap it in artifact tags:
<artifact type="code" language="javascript" title="Component Name">
// Your code here
</artifact>

Available artifact types: code, html, markdown, text
Always provide complete, production-ready solutions with proper error handling and best practices.`;
    }

    return `You are Boros, a helpful AI assistant focused on general conversation, analysis, and creative tasks. You excel at:

- Engaging in natural conversation
- Providing detailed explanations and analysis
- Creative writing and content generation
- Problem-solving and strategic thinking
- Answering questions across various domains

Be conversational, helpful, and insightful. When appropriate, create artifacts for substantial content:
<artifact type="text" title="Document Title">
Your content here
</artifact>

Keep responses concise but comprehensive, and always maintain a friendly, professional tone.`;
  }

  private extractArtifacts(content: string): Artifact[] {
    const artifacts: Artifact[] = [];
    const artifactRegex = /<artifact\s+type="([^"]+)"\s*(?:language="([^"]+)")?\s*title="([^"]+)"\s*>([\s\S]*?)<\/artifact>/g;
    
    let match;
    while ((match = artifactRegex.exec(content)) !== null) {
      const [, type, language, title, artifactContent] = match;
      
      artifacts.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title,
        type: type as 'code' | 'text' | 'html' | 'markdown',
        content: artifactContent.trim(),
        language: language || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return artifacts;
  }

  private cleanContent(content: string): string {
    // Remove artifact tags from the main content
    return content.replace(/<artifact[\s\S]*?<\/artifact>/g, '').trim();
  }
}

export const aiService = new AIService();