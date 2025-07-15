import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import Button from '../ui/Button'
import Input from '../ui/Input'

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('signin') // signin, signup, forgot
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signUp, signInWithMagicLink } = useAuth()
  const { success, error } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName)
        success('Conta criada! Verifique seu email para confirmar.')
        setMode('signin')
      } 
      else if (mode === 'signin') {
        await signIn(email, password)
        success('Login realizado com sucesso!')
        onClose()
      }
      else if (mode === 'forgot') {
        await signInWithMagicLink(email)
        success('Email de recuperação enviado! Verifique sua caixa de entrada.')
        setMode('signin')
      }
    } catch (err) {
      console.error('Auth error:', err)
      error(err.message || 'Erro na autenticação')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      error('Digite seu email primeiro')
      return
    }

    setIsLoading(true)
    try {
      await signInWithMagicLink(email)
      success('Link mágico enviado! Verifique seu email.')
    } catch (err) {
      error(err.message || 'Erro ao enviar link mágico')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setIsLoading(false)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
            >
              UAU
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'signin' && 'Entrar na sua conta'}
              {mode === 'signup' && 'Criar nova conta'}
              {mode === 'forgot' && 'Recuperar senha'}
            </h2>
            <p className="text-gray-600">
              {mode === 'signin' && 'Acesse sua conta para continuar criando'}
              {mode === 'signup' && 'Crie sua conta gratuita em segundos'}
              {mode === 'forgot' && 'Digite seu email para recuperar a senha'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Nome completo"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            {mode !== 'forgot' && (
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              {mode === 'signin' && 'Entrar'}
              {mode === 'signup' && 'Criar conta'}
              {mode === 'forgot' && 'Enviar link'}
            </Button>
          </form>

          {/* Magic Link */}
          {mode === 'signin' && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleMagicLink}
                disabled={isLoading}
              >
                <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Entrar com link mágico
              </Button>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
                <div className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Criar conta gratuita
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Entrar
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                Voltar para login
              </button>
            )}
          </div>

          {/* Terms */}
          <div className="mt-6 text-xs text-gray-500 text-center">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-purple-600 hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-purple-600 hover:underline">
              Política de Privacidade
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal
