// Domain interfaces (mirrored from icmoscow-projects, with admin extensions)

export interface Project {
  id: string
  title: string
  status: 'active' | 'completed' | 'future'
  shortDescription: string
  goal: number
  raised: number
  remaining: number
  gofundmeLink?: string
  coverImage?: string
}

export interface Donation {
  id: string
  projectId: string
  source: string
  amount: number
  date: string
  note: string
}

export interface Expense {
  id: string
  projectId: string
  item: string
  amount: number
  date: string
  receiptLink?: string
  note?: string
}

export interface TimelineEntry {
  id: string
  projectId: string
  date: string
  title: string
  update: string
}

export interface Photo {
  id: string
  projectId: string
  type: 'progress' | 'cover' | 'update'
  imageLink: string
  caption?: string
}

export interface Activity {
  id: string
  category: string
  title: string
  description: string
  schedule: string
  location: string
}

// Admin-specific payload types

export interface CreateProjectPayload {
  id: string
  title: string
  status: 'active' | 'completed' | 'future'
  shortDescription: string
  goal: number
  gofundmeLink?: string
  coverImage?: string
}

export type UpdateProjectPayload = Omit<CreateProjectPayload, 'id'>

export interface CreateDonationPayload {
  projectId: string
  source: string
  amount: number
  date: string
  note: string
}

export type UpdateDonationPayload = CreateDonationPayload

export interface CreateExpensePayload {
  projectId: string
  item: string
  amount: number
  date: string
  receiptLink?: string
  note?: string
}

export type UpdateExpensePayload = CreateExpensePayload

export interface CreateTimelinePayload {
  projectId: string
  date: string
  title: string
  update: string
}

export type UpdateTimelinePayload = CreateTimelinePayload

export interface CreatePhotoPayload {
  projectId: string
  type: 'progress' | 'cover' | 'update'
  imageLink: string
  caption?: string
}

export type UpdatePhotoPayload = CreatePhotoPayload

export interface CreateActivityPayload {
  category: string
  title: string
  description: string
  schedule: string
  location: string
}

export type UpdateActivityPayload = CreateActivityPayload

export interface ApiError {
  error: string
}

export interface AuthResponse {
  token: string
}

export interface UploadResponse {
  url: string
}

// UI helpers
export const PROJECT_STATUS_LABELS: Record<Project['status'], string> = {
  active: 'Active',
  completed: 'Completed',
  future: 'Future',
}

export const PROJECT_STATUS_COLORS: Record<Project['status'], string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  future: 'bg-yellow-100 text-yellow-800',
}

export const DONATION_SOURCES = ['Zelle', 'Masjid Donation Box', 'Square', 'GoFundMe'] as const

export const ACTIVITY_CATEGORIES = [
  'Quran Classes',
  'Community Events',
  'Volunteer Work',
  'Youth Activities',
  'Future Announcements',
] as const

export const PHOTO_TYPES = ['progress', 'cover', 'update'] as const
