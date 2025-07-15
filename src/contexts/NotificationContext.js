import { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NotificationContext = createContext({})

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const notification = { id, message, type, duration }
    
    setNotifications(prev => [...prev, notification])
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const success = (message, duration) => showNotification(message, 'success', duration)
  const error = (message, duration) => showNotification(message, 'error', duration)
  const warning = (message, duration) => showNotification(message, 'warning', duration)
  const info = (message, duration) => showNotification(message, 'info', duration)

  const value = {
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

const NotificationItem = ({ notification, onRemove }) => {
  const { id, message, type } = notification

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
      default:
        return 'bg-blue-500 text-white'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        ${getStyles()}
        px-6 py-4 rounded-lg shadow-lg max-w-sm
        flex items-center gap-3 cursor-pointer
        backdrop-blur-sm
      `}
      onClick={() => onRemove(id)}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(id)
        }}
        className="text-white/80 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </motion.div>
  )
}
