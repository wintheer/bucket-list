export type ItemStatus = 'idea' | 'in-progress' | 'done'
export type ItemPriority = 'someday' | 'near-term' | 'soon'

export type ItemCategory =
  | 'travel'
  | 'skills'
  | 'experiences'
  | 'relationships'
  | 'creativity'
  | 'health'
  | 'career'

export type LifeArea =
  | 'adventure'
  | 'growth'
  | 'family'
  | 'career'
  | 'health'
  | 'creativity'
  | 'community'

export interface BucketItem {
  id: string
  title: string
  description: string
  why: string
  category: ItemCategory
  lifeArea: LifeArea
  status: ItemStatus
  priority: ItemPriority
  imageUrl?: string
  location?: string
  reflection?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export const CATEGORIES: { value: ItemCategory; label: string; icon: string; color: string }[] = [
  { value: 'travel',        label: 'Travel',        icon: 'i-lucide-map-pin',      color: 'text-blue-500' },
  { value: 'skills',        label: 'Skills',        icon: 'i-lucide-brain',        color: 'text-purple-500' },
  { value: 'experiences',   label: 'Experiences',   icon: 'i-lucide-sparkles',     color: 'text-yellow-500' },
  { value: 'relationships', label: 'Relationships', icon: 'i-lucide-heart',        color: 'text-rose-500' },
  { value: 'creativity',    label: 'Creativity',    icon: 'i-lucide-palette',      color: 'text-orange-500' },
  { value: 'health',        label: 'Health',        icon: 'i-lucide-activity',     color: 'text-green-500' },
  { value: 'career',        label: 'Career',        icon: 'i-lucide-briefcase',    color: 'text-slate-500' },
]

export const LIFE_AREAS: { value: LifeArea; label: string; icon: string }[] = [
  { value: 'adventure',  label: 'Adventure',  icon: 'i-lucide-mountain' },
  { value: 'growth',     label: 'Growth',     icon: 'i-lucide-trending-up' },
  { value: 'family',     label: 'Family',     icon: 'i-lucide-home' },
  { value: 'career',     label: 'Career',     icon: 'i-lucide-briefcase' },
  { value: 'health',     label: 'Health',     icon: 'i-lucide-heart-pulse' },
  { value: 'creativity', label: 'Creativity', icon: 'i-lucide-palette' },
  { value: 'community',  label: 'Community',  icon: 'i-lucide-users' },
]

export const STATUS_CONFIG: Record<ItemStatus, { label: string; color: 'neutral' | 'info' | 'success' }> = {
  'idea':        { label: 'Idea',        color: 'neutral' },
  'in-progress': { label: 'In Progress', color: 'info' },
  'done':        { label: 'Done',        color: 'success' },
}

export const PRIORITY_CONFIG: Record<ItemPriority, { label: string }> = {
  'someday':   { label: 'Someday' },
  'near-term': { label: 'Near-term' },
  'soon':      { label: 'Soon' },
}

export const DISCOVER_PROMPTS: Record<ItemCategory, string[]> = {
  travel: [
    'See the Northern Lights in Iceland',
    'Hike the Camino de Santiago',
    'Visit Kyoto during cherry blossom season',
    'Road trip through Patagonia',
    'Spend a week in a remote mountain cabin',
  ],
  skills: [
    'Learn to play an instrument',
    'Become conversational in a new language',
    'Learn to code a real project',
    'Take a pottery or ceramics class',
    'Master a martial art',
  ],
  experiences: [
    'Watch a live rocket launch',
    'Attend a world-class music festival',
    'Try skydiving or base jumping',
    'Sleep under the stars in the desert',
    'Go on a silent meditation retreat',
  ],
  relationships: [
    'Write a letter to someone who changed your life',
    'Reconnect with a lost friend',
    'Cook a dinner for everyone who matters to you',
    'Take a trip with a parent or sibling',
    'Mentor someone younger than you',
  ],
  creativity: [
    'Write a short story or novel',
    'Record an original song',
    'Complete a 365-day photo project',
    'Design and build something with your hands',
    'Perform something in front of an audience',
  ],
  health: [
    'Run a marathon or ultramarathon',
    'Complete a multi-day cycling trip',
    'Learn to free dive',
    'Do a 30-day fitness transformation',
    'Climb a mountain over 4000m',
  ],
  career: [
    'Start your own project or company',
    'Give a talk at a conference',
    'Publish something you are proud of',
    'Find work that genuinely excites you',
    'Build something that outlasts you',
  ],
}
