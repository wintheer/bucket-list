export type MoodScore = 1 | 2 | 3 | 4 | 5

export interface Journal {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface PersonalEntry {
  id: string
  journalId?: string
  title?: string
  text: string
  mood?: MoodScore
  moodWords: string[]
  linkedGoalIds: string[]
  createdAt: string
  updatedAt: string
}

export const JOURNAL_COLORS: { value: string; hex: string }[] = [
  { value: 'violet',  hex: '#a78bfa' },
  { value: 'rose',    hex: '#fb7185' },
  { value: 'amber',   hex: '#fbbf24' },
  { value: 'emerald', hex: '#34d399' },
  { value: 'sky',     hex: '#38bdf8' },
  { value: 'orange',  hex: '#fb923c' },
]

export const MOOD_CONFIG: Record<MoodScore, { label: string; words: string[] }> = {
  1: { label: 'Struggling', words: ['anxious', 'overwhelmed', 'exhausted', 'sad', 'frustrated', 'lost', 'hopeless'] },
  2: { label: 'Heavy',      words: ['worried', 'tired', 'drained', 'uneasy', 'uncertain', 'melancholy', 'distant'] },
  3: { label: 'Okay',       words: ['calm', 'neutral', 'steady', 'reflective', 'quiet', 'balanced', 'present'] },
  4: { label: 'Good',       words: ['grateful', 'content', 'hopeful', 'motivated', 'proud', 'focused', 'peaceful'] },
  5: { label: 'Wonderful',  words: ['joyful', 'inspired', 'energized', 'excited', 'alive', 'loved', 'unstoppable'] },
}
