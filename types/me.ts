export interface PersonalValue {
  id: string
  name: string
  description?: string
  color: string
  createdAt: string
}

export interface WhoAmIVersion {
  id: string
  text: string
  createdAt: string
}

export interface Memory {
  id: string
  title: string
  date: string
  description?: string
  feelings: string[]
  createdAt: string
  updatedAt: string
}

export interface Letter {
  id: string
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
