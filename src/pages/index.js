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
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="text-6xl"
              >
                🎯
              </motion.div>
            </div>
            <div className="absolute top-40 right-20 opacity-20">
              <motion.div
                animate={{ 
                  rotate: -360,
                  y: [0, 20, 0]
                }}
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="text-4xl"
              >
                📱
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/10 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-white mb-4">
                Como Funciona
              </h3>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Em apenas 4 passos simples, sua experiência AR estará pronta para ser compartilhada
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
                >
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-white mb-4">
                Processo Simples
              </h3>
              <p className="text-xl text-gray-200">
                Da ideia à realidade em minutos
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{item.icon}</div>
                    <div className="text-sm font-bold text-purple-300 mb-2">
                      PASSO {item.step}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                      {item.title}
                    </h4>
                    <p className="text-gray-300">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Connector Line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-bold text-white mb-4">
                Pronto para Criar Sua Primeira Experiência AR?
              </h3>
              <p className="text-xl text-gray-200 mb-8">
                Junte-se a milhares de criadores que já estão usando o UAU
              </p>
              <Button
                size="xl"
                onClick={handleGetStarted}
                loading={isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Começar Gratuitamente
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <p className="text-gray-400 text-sm mt-4">
                Sem cartão de crédito • Sem instalação • Sem complicação
              </p>
            </motion.div>
          </div>
        </section>

        {/* Development Status */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">🚀 Status do Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      <span className="text-gray-200">Banco de dados configurado</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      <span className="text-gray-200">Sistema de autenticação</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      <span className="text-gray-200">Upload de arquivos</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-3">🔄</span>
                      <span className="text-gray-200">Visualizador AR (em desenvolvimento)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-3">🔄</span>
                      <span className="text-gray-200">Dashboard de projetos (próximo)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-3">📋</span>
                      <span className="text-gray-200">Analytics e compartilhamento</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
