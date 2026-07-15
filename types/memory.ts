export interface Memory {
  id: string
  raw_text?: string
  content?: string
  title: string
  summary: string
  tags: string[]
  created_at: string | Date
  source_url?: string | null
}

