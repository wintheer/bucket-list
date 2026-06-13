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

export interface Note {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

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
  notes?: Note[]
  isPrivate?: boolean
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
  'idea':        { label: 'Dreaming',  color: 'neutral' },
  'in-progress': { label: 'Happening', color: 'info' },
  'done':        { label: 'Lived it',  color: 'success' },
}

export const PRIORITY_CONFIG: Record<ItemPriority, { label: string }> = {
  'someday':   { label: 'One day' },
  'near-term': { label: 'Next year or two' },
  'soon':      { label: 'This year' },
}

export const DISCOVER_PROMPTS: Record<ItemCategory, string[]> = {
  travel: [
    'See the Northern Lights in Iceland',
    'Hike the Camino de Santiago',
    'Visit Kyoto during cherry blossom season',
    'Road trip through Patagonia',
    'Spend a week in a remote mountain cabin',
    'Take the Trans-Siberian Railway across Russia',
    'Safari in the Serengeti at sunrise',
    'Sleep in an overwater bungalow in the Maldives',
    'Walk the Inca Trail to Machu Picchu',
    'See the midnight sun in northern Norway',
    'Explore the temples of Angkor Wat',
    'Swim in a turquoise cenote in Mexico',
    'Cross a country entirely by local transport',
    'Spend a month living like a local somewhere foreign',
    'Watch the sunrise from a mountain summit abroad',
  ],
  skills: [
    'Learn to play an instrument well enough to perform',
    'Become conversational in a new language',
    'Learn to code a real project from scratch',
    'Take a pottery or ceramics class',
    'Master a martial art to a belt level',
    'Learn to sail a boat solo',
    'Become a confident public speaker',
    'Learn to cook 10 dishes from memory',
    'Get a pilot\'s license',
    'Learn to weld or do metalwork',
    'Read 50 books in a year',
    'Learn sign language',
    'Build a piece of furniture entirely by hand',
    'Study philosophy seriously for six months',
    'Learn to draw well enough to sketch people',
  ],
  experiences: [
    'Watch a live rocket launch',
    'Attend a world-class music festival',
    'Try skydiving or base jumping',
    'Sleep under the stars in the desert',
    'Go on a silent meditation retreat',
    'Ride a hot air balloon at sunrise',
    'See a total solar eclipse',
    'Swim with whale sharks in open water',
    'Attend a sporting world championship live',
    'Spend a night in an ice hotel',
    'Go storm chasing with a guide',
    'Watch a volcanic eruption up close',
    'Attend a traditional ceremony in another culture',
    'Spend 24 hours completely alone in nature',
    'Experience zero gravity on a parabolic flight',
  ],
  relationships: [
    'Write a letter to someone who changed your life',
    'Reconnect with a lost friend',
    'Cook a dinner for everyone who matters to you',
    'Take a trip with a parent or sibling',
    'Mentor someone younger than you',
    'Interview your grandparents about their life story',
    'Build a real friendship with someone very different from you',
    'Tell someone you love them before it\'s too late',
    'Spend a week offline with your family',
    'Write letters to your children to open in 20 years',
    'Have an honest conversation you\'ve been avoiding for years',
    'Build a tradition that will last for decades',
    'Throw a gathering for no reason at all',
    'Volunteer side-by-side with someone you love',
    'Take a road trip with your best friend',
  ],
  creativity: [
    'Write a short story or novel',
    'Record an original song',
    'Complete a 365-day photo project',
    'Design and build something with your hands',
    'Perform something in front of an audience',
    'Paint a mural on a wall',
    'Make a documentary or short film',
    'Write and publish a personal essay',
    'Build a product that real people use',
    'Do a stand-up comedy set',
    'Create an illustrated journal of a journey',
    'Write a children\'s book',
    'Start a creative project and actually finish it',
    'Design and self-publish a book',
    'Compose a piece of music from scratch',
  ],
  health: [
    'Run a marathon or ultramarathon',
    'Complete a multi-day cycling trip',
    'Learn to free dive',
    'Do a 30-day fitness transformation',
    'Climb a mountain over 4000m',
    'Complete an Ironman triathlon',
    'Learn to surf',
    'Do a 10-day digital detox',
    'Swim across a lake',
    'Hike a long-distance trail over multiple days',
    'Master yoga or another mindful movement practice',
    'Compete in a sport as an adult',
    'Sleep outside for an entire week',
    'Do a full health audit and actually act on it',
    'Train for and finish a physical challenge that scared you',
  ],
  career: [
    'Start your own project or company',
    'Give a talk at a conference',
    'Publish something you are proud of',
    'Find work that genuinely excites you',
    'Build something that outlasts you',
    'Get a mentor who has done what you want to do',
    'Earn money doing something you love',
    'Take a sabbatical and use it well',
    'Work or live abroad for at least a year',
    'Build a team from scratch',
    'Land a dream client or collaboration',
    'Write a personal manifesto for how you work',
    'Create a source of income that isn\'t your time',
    'Be publicly recognized as an expert in your field',
    'Do work you would be proud to show your children',
  ],
}
