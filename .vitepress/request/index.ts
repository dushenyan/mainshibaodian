import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wgpwadhwutzjzukllrfw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncHdhZGh3dXR6anp1a2xscmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTc4NTAsImV4cCI6MjA3MjYzMzg1MH0.K7XTjOMQXeRw9U7xCsAjxcMcbZhrt-2efXQguQDk6-w'
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }
