import { createClient } from '@supabase/supabase-js'

/**
 * Cặp URL + anon key là giá trị PUBLIC (nằm trong bundle chạy ở trình duyệt).
 * Lớp bảo vệ thật sự là Row Level Security trên từng bảng.
 * Fallback hardcode để app vẫn chạy nếu thiếu biến môi trường.
 */
const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://nugynjiebvzvnfnvpuov.supabase.co'

const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z3luamllYnZ6dm5mbnZwdW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTgyMzYsImV4cCI6MjEwMDQzNDIzNn0.RgC5bEPJSqd9TaF--h6kqhjqMLyEBtfR45JSd9qFRIY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
