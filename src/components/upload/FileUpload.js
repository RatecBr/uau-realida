import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFile, validateFileType, validateFileSize, formatFileSize } from '../../lib/supabase'
import { useNotification } from '../../contexts/NotificationContext'

const FileUpload = ({
  bucket,
  allowedTypes = [],
  maxSize = 10 * 1024 * 1024, // 10MB
  onUploadSuccess,
  onUploadError,
  accept = '*',
  multiple = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { success, error } = useNotification()

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    e.target.value = '' // Reset input
  }, [])

  const validateFile = (file) => {
    if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
      throw new Error(`Tipo de arquivo não permitido: ${file.type}`)
    }
    
    if (!validateFileSize(file, maxSize)) {
      throw new Error(`Arquivo muito grande. Máximo: ${formatFileSize(maxSize)}`)
    }
    
    return true
  }

  const handleFiles = async (files) => {
    if (!files.length) return

    const filesToProcess = multiple ? files : [files[0]]
    
    setUploading(true)
    setUploadProgress(0)

    try {
      const results = []
      
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i]
        
        // Validate file
        validateFile(file)
        
        // Update progress
        setUploadProgress(((i + 1) / filesToProcess.length) * 100)
        
        // Upload file
        const result = await uploadFile(file, bucket)
        results.push(result)
        
        success(`${file.name} enviado com sucesso!`)
      }
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(multiple ? results : results[0])
      }
      
    } catch (err) {
      console.error('Upload error:', err)
      error(err.message || 'Erro no upload')
      
      if (onUploadError) {
        onUploadError(err)
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const getAcceptedTypesText = () => {
    if (allowedTypes.includes('image/jpeg') || allowedTypes.includes('image/png')) {
      return 'PNG, JPG'
    }
    if (allowedTypes.includes('video/mp4')) {
      return 'MP4, WebM'
    }
    if (allowedTypes.includes('audio/mp3')) {
      return 'MP3, WAV'
    }
    if (allowedTypes.includes('.glb')) {
      return 'GLB, GLTF'
    }
    return 'Todos os tipos'
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }
          ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && document.getElementById('file-input').click()}
        whileHover={uploading ? {} : { scale: 1.02 }}
        whileTap={uploading ? {} : { scale: 0.98 }}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="mx-auto w-12 h-12 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Enviando arquivo...</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{Math.round(uploadProgress)}%</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="mx-auto w-12 h-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste arquivos aqui'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getAcceptedTypesText()} até {formatFileSize(maxSize)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default FileUpload
