import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect logged users to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      setIsLoading(true)
      // This will be handled by the header's auth modal
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  const features = [
    {
      icon: '📸',
      title: 'Upload Simples',
      description: 'Faça upload da sua imagem target em poucos cliques'
    },
    {
      icon: '🎬',
      title: 'Múltiplos Formatos',
      description: 'Suporte para vídeos, áudios, modelos 3D e imagens'
    },
    {
      icon: '👁️',
      title: 'Preview Instantâneo',
      description: 'Veja sua experiência AR em tempo real'
    },
    {
      icon: '🌐',
      title: 'Compartilhamento Fácil',
      description: 'Compartilhe via QR Code ou link direto'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Experiências Criadas' },
    { number: '1M+', label: 'Visualizações AR' },
    { number: '95%', label: 'Taxa de Sucesso' },
    { number: '120+', label: 'Países Ativos' }
  ]

  const steps = [
    { step: '01', title: 'Upload Target', desc: 'Faça upload da imagem que será reconhecida', icon: '📸' },
    { step: '02', title: 'Adicione Conteúdo', desc: 'Upload do vídeo, áudio ou modelo 3D', icon: '🎬' },
    { step: '03', title: 'Configure AR', desc: 'Ajuste posição, tamanho e comportamento', icon: '⚙️' },
    { step: '04', title: 'Compartilhe', desc: 'QR Code ou link direto para testar', icon: '🚀' }
  ]

  return (
    <>
      <Head>
        <title>UAU - Realidade Aumentada Simples</title>
        <meta name="description" content="Crie experiências de realidade aumentada de forma simples e rápida. Upload sua imagem target e conteúdo - pronto!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo UAU */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-8xl font-bold text-white mb-4">
                  UAU
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                Realidade Aumentada
                <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Nunca Foi Tão Simples
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
              >
                Transforme qualquer imagem em uma experiência AR interativa. 
                Upload, configure e compartilhe em minutos. Sem código, sem complicação.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="xl"
                  onClick={handleGetStarted}
                  loading={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Começar Agora
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Como Funciona
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Floating AR Elements */}
            <div className="absolute top-20 left-10 opacity-20">
              <motion.div
                animate={{ 
                  rotate: 360,
                  y: [0, -20, 0]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear"
