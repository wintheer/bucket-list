import type { ValueDomain } from '~/types/me'

export interface WheelCheckIn {
  id: string
  userId: string
  scores: Partial<Record<ValueDomain, number>>
  note?: string
  createdAt: string
}

export interface Vision {
  id: string
  userId: string
  horizonYears: number
  text: string
  createdAt: string
}

export interface GoodThing {
  text: string
  why?: string
}

export interface GratitudeEntry {
  id: string
  userId: string
  date: string // YYYY-MM-DD, local
  things: GoodThing[]
  createdAt: string
  updatedAt: string
}

export const VISION_HORIZONS = [1, 5, 10] as const

// Prompts for the Best Possible Self exercise (Laura King, 2001), one per life area
export const VISION_PROMPTS: Record<ValueDomain, string> = {
  family:        'What does home feel like? Who is around your table?',
  relationships: 'What is your closest relationship like, day to day?',
  parenting:     'What kind of parent, mentor or role model have you become?',
  friendship:    'Who are your people, and what do you do together?',
  career:        'What does a good workday look like? What are you proud of building?',
  growth:        'What have you learned or mastered along the way?',
  recreation:    'How do you play? Where have you been?',
  spirituality:  'What gives your life meaning? When do you feel most at peace?',
  community:     'What are you contributing to the world around you?',
  health:        'How does your body feel? How do you take care of yourself?',
  nature:        'How do you connect with the natural world?',
}

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
