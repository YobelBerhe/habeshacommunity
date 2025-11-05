// Event Theme System - Luma-inspired

export type EventTheme = {
  id: string
  name: string
  preview: string
  description: string
  colors: {
    background: string
    text: string
    accent: string
  }
  fonts: string[]
  styles: string[]
}

export const EVENT_THEMES: EventTheme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    preview: '/themes/minimal.png',
    description: 'Clean and simple',
    colors: {
      background: '#FFFFFF',
      text: '#1F2937',
      accent: '#8B5CF6',
    },
    fonts: ['Inter', 'Helvetica', 'Arial'],
    styles: ['clean', 'modern', 'simple'],
  },
  {
    id: 'quantum',
    name: 'Quantum',
    preview: '/themes/quantum.png',
    description: 'Gradient and futuristic',
    colors: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF',
      accent: '#A78BFA',
    },
    fonts: ['Space Grotesk', 'Inter', 'Outfit'],
    styles: ['gradient', 'futuristic', 'bold'],
  },
  {
    id: 'warp',
    name: 'Warp',
    preview: '/themes/warp.png',
    description: 'Dynamic and energetic',
    colors: {
      background: '#0F172A',
      text: '#F1F5F9',
      accent: '#38BDF8',
    },
    fonts: ['JetBrains Mono', 'Fira Code', 'IBM Plex Mono'],
    styles: ['dynamic', 'tech', 'motion'],
  },
  {
    id: 'emoji',
    name: 'Emoji',
    preview: '/themes/emoji.png',
    description: 'Fun and playful',
    colors: {
      background: '#FEF3C7',
      text: '#78350F',
      accent: '#F59E0B',
    },
    fonts: ['Comic Neue', 'Quicksand', 'Nunito'],
    styles: ['playful', 'casual', 'friendly'],
  },
  {
    id: 'confetti',
    name: 'Confetti',
    preview: '/themes/confetti.png',
    description: 'Celebration and party',
    colors: {
      background: '#DDD6FE',
      text: '#4C1D95',
      accent: '#8B5CF6',
    },
    fonts: ['Outfit', 'Poppins', 'Raleway'],
    styles: ['party', 'celebration', 'vibrant'],
  },
  {
    id: 'pattern',
    name: 'Pattern',
    preview: '/themes/pattern.png',
    description: 'Geometric and modern',
    colors: {
      background: '#1E293B',
      text: '#F1F5F9',
      accent: '#818CF8',
    },
    fonts: ['Inter', 'Manrope', 'DM Sans'],
    styles: ['geometric', 'modern', 'structured'],
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    preview: '/themes/seasonal.png',
    description: 'Themed for occasions',
    colors: {
      background: '#FF6B35',
      text: '#FFFBF0',
      accent: '#FFE66D',
    },
    fonts: ['Crimson Pro', 'Lora', 'Merriweather'],
    styles: ['seasonal', 'themed', 'festive'],
  },
]

export const HABESHA_COLORS = {
  gold: '#F59E0B',
  red: '#DC2626',
  green: '#22C55E',
}
