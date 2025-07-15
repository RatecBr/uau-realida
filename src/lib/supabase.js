import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dgbidkqxomvnxwwcbglz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYmlka3F4b212bnh3d2NiZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTc3OTIsImV4cCI6MjA2ODE3Mzc5Mn0.H-asIc7LX3DMNUL5GwPMmazGVt6_g04ctG2hhzdPURE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage buckets
export const STORAGE_BUCKETS = {
  TARGETS: 'targets',
  CONTENT: 'content',
  PATTERNS: 'patterns',
  AVATARS: 'avatars'
}

// Upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  ALLOWED_MODEL_TYPES: ['.glb', '.gltf']
}

// Upload file function
export async function uploadFile(file, bucket, folder = '') {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return {
      path: data.path,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

// Validate file type
export function validateFileType(file, allowedTypes) {
  if (allowedTypes.includes(file.type)) {
    return true
  }
  
  if (allowedTypes.some(type => type.startsWith('.'))) {
    const fileName = file.name.toLowerCase()
    return allowedTypes.some(ext => fileName.endsWith(ext))
  }
  
  return false
}

// Validate file size
export function validateFileSize(file, maxSize = UPLOAD_LIMITS.MAX_FILE_SIZE) {
  return file.size <= maxSize
}

// Database helpers
export const db = {
  // Projects
  async createProject(projectData) {
    const { data, error } = await supabase
      .from('ar_projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProject(id) {
    const { data, error } = await supabase
      .from('ar_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getUserProjects(userId) {
    const { data, error } = await supabase
      .from('ar_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('ar_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('ar_projects')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Assets
  async createAsset(assetData) {
    const { data, error } = await supabase
      .from('assets')
      .insert(assetData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Analytics
  async trackEvent(eventData) {
    const { error } = await supabase
      .from('project_analytics')
      .insert(eventData)

    if (error) console.error('Analytics error:', error)
  },

  // Profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Auth helpers
export const auth = {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signInWithOTP(email) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

// Utils
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default supabase
