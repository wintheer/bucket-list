export interface PersonalValue {
  id: string
  userId: string
  name: string
  description?: string
  color: string
  domain?: string
  createdAt: string
}

export interface WhoAmIVersion {
  id: string
  userId: string
  text: string
  createdAt: string
}

export interface Memory {
  id: string
  userId: string
  title: string
  date: string
  description?: string
  feelings: string[]
  createdAt: string
  updatedAt: string
}

export interface Letter {
  id: string
  userId: string
  subject: string
  body: string
  openOn: string
  createdAt: string
}

export const VALUE_COLORS: { value: string; hex: string }[] = [
  { value: 'violet',  hex: '#a78bfa' },
  { value: 'rose',    hex: '#fb7185' },
  { value: 'amber',   hex: '#fbbf24' },
  { value: 'emerald', hex: '#34d399' },
  { value: 'sky',     hex: '#38bdf8' },
  { value: 'orange',  hex: '#fb923c' },
]

export function valueHex(color?: string): string {
  return VALUE_COLORS.find(c => c.value === color)?.hex ?? '#a78bfa'
}

export type ValueDomain =
  | 'family'
  | 'relationships'
  | 'parenting'
  | 'friendship'
  | 'career'
  | 'growth'
  | 'recreation'
  | 'spirituality'
  | 'community'
  | 'health'
  | 'nature'

export const VALUE_DOMAINS: { value: ValueDomain; label: string; icon: string }[] = [
  { value: 'family',       label: 'Family & Home',        icon: 'i-lucide-home' },
  { value: 'relationships', label: 'Relationships & Love', icon: 'i-lucide-heart' },
  { value: 'parenting',    label: 'Parenting',             icon: 'i-lucide-baby' },
  { value: 'friendship',   label: 'Friendship',            icon: 'i-lucide-users' },
  { value: 'career',       label: 'Work & Career',         icon: 'i-lucide-briefcase' },
  { value: 'growth',       label: 'Learning & Growth',     icon: 'i-lucide-graduation-cap' },
  { value: 'recreation',   label: 'Play & Recreation',     icon: 'i-lucide-palette' },
  { value: 'spirituality', label: 'Spirituality & Meaning', icon: 'i-lucide-sparkles' },
  { value: 'community',    label: 'Community & Citizenship', icon: 'i-lucide-landmark' },
  { value: 'health',       label: 'Health & Wellbeing',    icon: 'i-lucide-heart-pulse' },
  { value: 'nature',       label: 'Nature & Environment',  icon: 'i-lucide-leaf' },
]

export interface ValueWord {
  word: string
  description: string
}

export const VALUE_WORDS: Record<ValueDomain, ValueWord[]> = {
  family: [
    { word: 'Belonging', description: 'Feeling truly part of your family, not on the outside of it' },
    { word: 'Closeness', description: 'Staying emotionally near to the people you love' },
    { word: 'Loyalty', description: 'Standing by your family through good times and bad' },
    { word: 'Tradition', description: 'Keeping rituals and customs that connect generations' },
    { word: 'Stability', description: 'Creating a steady, dependable home life' },
    { word: 'Warmth', description: 'Making home feel affectionate and welcoming' },
    { word: 'Togetherness', description: 'Spending real time together, not just living side by side' },
    { word: 'Trust', description: 'Being someone your family can rely on completely' },
    { word: 'Care', description: 'Actively looking after the people who depend on you' },
    { word: 'Roots', description: 'Staying connected to where you and your family come from' },
    { word: 'Presence', description: "Being fully there, not just physically in the room" },
    { word: 'Support', description: 'Showing up for family in practical, tangible ways' },
    { word: 'Unity', description: 'Facing life as one family, not scattered individuals' },
    { word: 'Comfort', description: 'Making home a safe place to land' },
  ],
  relationships: [
    { word: 'Intimacy', description: 'Sharing your inner world with someone, not just your time' },
    { word: 'Honesty', description: 'Telling the truth even when it\'s uncomfortable' },
    { word: 'Affection', description: 'Showing love through touch, words, and small gestures' },
    { word: 'Partnership', description: 'Treating your relationship as a true team effort' },
    { word: 'Vulnerability', description: 'Letting someone see you without your guard up' },
    { word: 'Commitment', description: "Choosing this relationship again, especially when it's hard" },
    { word: 'Passion', description: 'Keeping desire and energy alive between you' },
    { word: 'Respect', description: "Valuing your partner's needs and boundaries as much as your own" },
    { word: 'Trust', description: 'Believing in someone enough to be unguarded with them' },
    { word: 'Playfulness', description: 'Keeping lightness and fun alive in love' },
    { word: 'Romance', description: "Making an effort to court the person you're already with" },
    { word: 'Communication', description: "Saying what's actually true, and really listening back" },
    { word: 'Devotion', description: 'Prioritizing this person, consistently, over time' },
  ],
  parenting: [
    { word: 'Nurturing', description: 'Helping a child grow through attention and warmth' },
    { word: 'Patience', description: 'Staying calm while a child learns and stumbles' },
    { word: 'Guidance', description: "Helping a child find their own way, not just following yours" },
    { word: 'Protection', description: 'Keeping a child safe without over-controlling them' },
    { word: 'Encouragement', description: 'Cheering a child on so they believe in themselves' },
    { word: 'Presence', description: 'Being genuinely there for the small, ordinary moments' },
    { word: 'Consistency', description: 'Following through so a child knows what to expect' },
    { word: 'Playfulness', description: 'Getting down on their level and actually playing' },
    { word: 'Role-modeling', description: 'Living the way you want your child to live' },
    { word: 'Unconditional love', description: 'Loving a child regardless of what they do or achieve' },
    { word: 'Structure', description: 'Giving a child clear, dependable boundaries' },
    { word: 'Gentleness', description: 'Correcting and guiding without harshness' },
  ],
  friendship: [
    { word: 'Loyalty', description: "Sticking by friends even when it's inconvenient" },
    { word: 'Fun', description: 'Making time together something to look forward to' },
    { word: 'Honesty', description: 'Being straight with friends, even about hard things' },
    { word: 'Reliability', description: 'Being someone friends can actually count on' },
    { word: 'Acceptance', description: 'Letting friends be exactly who they are' },
    { word: 'Generosity', description: 'Giving your time and energy freely to friends' },
    { word: 'Laughter', description: 'Sharing humor that only your friends really get' },
    { word: 'Support', description: 'Showing up for friends in hard moments, not just easy ones' },
    { word: 'Depth', description: 'Going beyond small talk into what really matters' },
    { word: 'Trust', description: 'Being able to be fully honest without judgment' },
    { word: 'Shared history', description: "Valuing the story you've built with someone over years" },
    { word: 'Spontaneity', description: 'Saying yes to the unplanned adventure with friends' },
    { word: 'Kindness', description: "Treating friends gently, especially when they're struggling" },
  ],
  career: [
    { word: 'Achievement', description: 'Reaching goals that genuinely matter to you' },
    { word: 'Craftsmanship', description: 'Taking pride in doing work well, down to the details' },
    { word: 'Ambition', description: "Reaching for more than what's comfortable" },
    { word: 'Leadership', description: 'Helping others do their best work' },
    { word: 'Autonomy', description: 'Having real control over how you work' },
    { word: 'Impact', description: 'Doing work that actually changes something' },
    { word: 'Recognition', description: 'Having your contribution genuinely seen and valued' },
    { word: 'Collaboration', description: 'Building things better, together with others' },
    { word: 'Innovation', description: 'Finding new ways instead of settling for the old ones' },
    { word: 'Integrity', description: "Working in a way you'd be comfortable explaining to anyone" },
    { word: 'Growth', description: 'Continuing to develop and stretch in your work' },
    { word: 'Excellence', description: "Holding yourself to a high standard, not just 'good enough'" },
    { word: 'Service', description: 'Doing work that genuinely helps other people' },
    { word: 'Security', description: 'Having stability and predictability in your work life' },
  ],
  growth: [
    { word: 'Curiosity', description: 'Staying genuinely interested in learning new things' },
    { word: 'Mastery', description: 'Getting truly skilled at something that matters to you' },
    { word: 'Discipline', description: "Doing the work even when motivation isn't there" },
    { word: 'Open-mindedness', description: 'Staying willing to change your mind' },
    { word: 'Reflection', description: 'Taking time to actually learn from your experience' },
    { word: 'Wisdom', description: "Turning what you've lived through into good judgment" },
    { word: 'Challenge', description: "Choosing things that stretch you, not just what's easy" },
    { word: 'Creativity', description: 'Approaching problems and ideas in your own way' },
    { word: 'Humility', description: 'Staying open to being wrong or still learning' },
    { word: 'Resilience', description: "Getting back up when things don't go your way" },
    { word: 'Self-improvement', description: 'Working deliberately on becoming a better version of yourself' },
    { word: 'Knowledge', description: 'Understanding the world more deeply over time' },
  ],
  recreation: [
    { word: 'Adventure', description: 'Seeking out the unfamiliar and exciting' },
    { word: 'Spontaneity', description: 'Letting plans change when something better comes along' },
    { word: 'Joy', description: 'Making room for things that simply feel good' },
    { word: 'Freedom', description: "Having time that's genuinely your own" },
    { word: 'Exploration', description: 'Discovering new places, ideas, or experiences' },
    { word: 'Rest', description: 'Letting yourself properly switch off and recover' },
    { word: 'Wonder', description: 'Staying open to being amazed by ordinary things' },
    { word: 'Novelty', description: "Trying something you've never done before" },
    { word: 'Thrill', description: 'Chasing the rush of something a little risky' },
    { word: 'Laughter', description: 'Making space for things that are simply fun' },
    { word: 'Simplicity', description: 'Enjoying life without needing it to be complicated' },
    { word: 'Presence', description: "Being fully in the moment, not thinking about what's next" },
  ],
  spirituality: [
    { word: 'Faith', description: 'Trusting in something larger than yourself' },
    { word: 'Gratitude', description: 'Noticing and appreciating what you already have' },
    { word: 'Purpose', description: 'Living in a way that feels meaningful to you' },
    { word: 'Inner peace', description: 'Feeling settled and calm within yourself' },
    { word: 'Connection', description: 'Feeling linked to something beyond your everyday life' },
    { word: 'Reverence', description: 'Holding certain things as sacred or deeply important' },
    { word: 'Mindfulness', description: 'Staying aware and present rather than on autopilot' },
    { word: 'Hope', description: 'Believing things can genuinely get better' },
    { word: 'Surrender', description: "Letting go of what you can't control" },
    { word: 'Transcendence', description: 'Reaching beyond your everyday, ordinary experience' },
    { word: 'Stillness', description: 'Making room for quiet, undistracted moments' },
  ],
  community: [
    { word: 'Justice', description: "Standing up for what's right, even when it's costly" },
    { word: 'Fairness', description: 'Treating people equitably, without favoritism' },
    { word: 'Service', description: 'Giving your time or effort to help others' },
    { word: 'Generosity', description: 'Sharing what you have with people who need it' },
    { word: 'Equality', description: 'Believing everyone deserves the same basic respect and opportunity' },
    { word: 'Responsibility', description: 'Taking ownership of your part in the wider community' },
    { word: 'Solidarity', description: "Standing alongside people, especially when it's hard for them" },
    { word: 'Advocacy', description: 'Speaking up for people or causes that need a voice' },
    { word: 'Contribution', description: 'Adding something real to the world around you' },
    { word: 'Civic duty', description: 'Playing your part in the place you live' },
    { word: 'Compassion', description: "Responding to others' suffering with real care" },
  ],
  health: [
    { word: 'Vitality', description: 'Feeling genuinely alive and energetic in your body' },
    { word: 'Discipline', description: "Sticking with healthy habits, even when it's inconvenient" },
    { word: 'Balance', description: "Not letting any one part of life run your health down" },
    { word: 'Self-care', description: 'Actively looking after your own wellbeing' },
    { word: 'Strength', description: 'Building a body that can do what you ask of it' },
    { word: 'Rest', description: 'Giving your body and mind real recovery time' },
    { word: 'Moderation', description: "Enjoying things without letting them run your life" },
    { word: 'Resilience', description: 'Recovering well when your health takes a hit' },
    { word: 'Energy', description: 'Having the vitality to actually do what you want' },
    { word: 'Consistency', description: 'Showing up for your health day after day' },
    { word: 'Mindfulness', description: 'Paying attention to what your body actually needs' },
    { word: 'Nourishment', description: 'Feeding yourself in a way that truly sustains you' },
  ],
  nature: [
    { word: 'Sustainability', description: 'Living in a way the planet can actually sustain' },
    { word: 'Stewardship', description: 'Taking responsibility for caring for the natural world' },
    { word: 'Simplicity', description: 'Living lighter, with less excess' },
    { word: 'Wonder', description: 'Staying amazed by the natural world around you' },
    { word: 'Conservation', description: 'Actively protecting nature and its resources' },
    { word: 'Harmony', description: 'Living in step with the natural world, not against it' },
    { word: 'Respect', description: 'Treating nature as something to be honored, not just used' },
    { word: 'Presence', description: "Being fully there when you're out in nature" },
    { word: 'Minimalism', description: 'Needing less, so you take less from the world' },
    { word: 'Beauty', description: 'Making space to notice how beautiful the world is' },
    { word: 'Connection', description: 'Feeling genuinely part of the natural world, not separate from it' },
  ],
}
