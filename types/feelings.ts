// Feelings wheel, adapted from Gloria Willcox (1982): core → secondary → specific
export interface FeelingGroup {
  word: string
  specific: string[]
}

export interface CoreFeeling {
  word: string
  hex: string
  groups: FeelingGroup[]
}

export const FEELINGS_WHEEL: CoreFeeling[] = [
  {
    word: 'happy', hex: '#fbbf24',
    groups: [
      { word: 'playful', specific: ['cheeky', 'silly'] },
      { word: 'content', specific: ['free', 'joyful'] },
      { word: 'interested', specific: ['curious', 'inquisitive'] },
      { word: 'proud', specific: ['successful', 'confident'] },
      { word: 'accepted', specific: ['respected', 'valued'] },
      { word: 'powerful', specific: ['courageous', 'creative'] },
      { word: 'peaceful', specific: ['loving', 'thankful'] },
      { word: 'trusting', specific: ['sensitive', 'intimate'] },
      { word: 'optimistic', specific: ['hopeful', 'inspired'] },
    ],
  },
  {
    word: 'surprised', hex: '#a78bfa',
    groups: [
      { word: 'startled', specific: ['shocked', 'dismayed'] },
      { word: 'confused', specific: ['disillusioned', 'perplexed'] },
      { word: 'amazed', specific: ['astonished', 'awed'] },
      { word: 'excited', specific: ['eager', 'energetic'] },
    ],
  },
  {
    word: 'bad', hex: '#94a3b8',
    groups: [
      { word: 'bored', specific: ['indifferent', 'apathetic'] },
      { word: 'busy', specific: ['pressured', 'rushed'] },
      { word: 'stressed', specific: ['overwhelmed', 'out of control'] },
      { word: 'tired', specific: ['sleepy', 'unfocused'] },
    ],
  },
  {
    word: 'fearful', hex: '#34d399',
    groups: [
      { word: 'scared', specific: ['helpless', 'frightened'] },
      { word: 'anxious', specific: ['worried', 'nervous'] },
      { word: 'insecure', specific: ['inadequate', 'inferior'] },
      { word: 'weak', specific: ['worthless', 'insignificant'] },
      { word: 'rejected', specific: ['excluded', 'persecuted'] },
      { word: 'threatened', specific: ['exposed', 'on edge'] },
    ],
  },
  {
    word: 'angry', hex: '#fb7185',
    groups: [
      { word: 'let down', specific: ['betrayed', 'resentful'] },
      { word: 'humiliated', specific: ['disrespected', 'ridiculed'] },
      { word: 'bitter', specific: ['indignant', 'violated'] },
      { word: 'mad', specific: ['furious', 'jealous'] },
      { word: 'aggressive', specific: ['provoked', 'hostile'] },
      { word: 'frustrated', specific: ['infuriated', 'annoyed'] },
      { word: 'distant', specific: ['withdrawn', 'numb'] },
      { word: 'critical', specific: ['sceptical', 'dismissive'] },
    ],
  },
  {
    word: 'disgusted', hex: '#fb923c',
    groups: [
      { word: 'disapproving', specific: ['judgmental', 'embarrassed'] },
      { word: 'disappointed', specific: ['appalled', 'revolted'] },
      { word: 'awful', specific: ['nauseated', 'detestable'] },
      { word: 'repelled', specific: ['horrified', 'hesitant'] },
    ],
  },
  {
    word: 'sad', hex: '#38bdf8',
    groups: [
      { word: 'lonely', specific: ['isolated', 'abandoned'] },
      { word: 'vulnerable', specific: ['victimised', 'fragile'] },
      { word: 'despair', specific: ['grief', 'powerless'] },
      { word: 'guilty', specific: ['ashamed', 'remorseful'] },
      { word: 'depressed', specific: ['empty', 'hopeless'] },
      { word: 'hurt', specific: ['wounded', 'disappointed'] },
    ],
  },
]
