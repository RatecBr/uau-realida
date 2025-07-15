import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { db } from '../lib/supabase'
import Button from '../components/ui/Button'
import FileUpload from '../components/upload/FileUpload'

const Dashboard = () => {
  const { user, profile, loading } = useAuth()
  const { success, error } = useNotification()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    targetImageUrl: '',
    contentUrl: '',
    contentType: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Load user projects
  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    try {
      setLoadingProjects(true)
      const userProjects = await db.getUserProjects(user.id)
      setProjects(userProjects)
    } catch (err) {
      console.error('Error loading projects:', err)
      error('Erro ao carregar projetos')
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleCreateProject = () => {
    setShowCreateProject(true)
    setCurrentStep(1)
    setNewProject({
      name: '',
      description: '',
      targetImageUrl: '',
      contentUrl: '',
      contentType: ''
    })
  }

  const handleTargetUpload = (uploadResult) => {
    setNewProject(prev => ({
      ...prev,
      targetImageUrl: uploadResult.url
    }))
    setCurrentStep(2)
    success('Imagem target enviada com sucesso!')
  }

  const handleContentUpload = (uploadResult) => {
    setNewProject(prev => ({
      ...prev,
      contentUrl: uploadResult.url,
      contentType: uploadResult.mimeType.split('/')[0] // video, audio, image
    }))
    setCurrentStep(3)
    success('Conteúdo enviado com sucesso!')
  }

  const handleSaveProject = async () => {
    if (!newProject.name) {
      error('Digite um nome para o projeto')
      return
    }

    try {
      const projectData = {
        ...newProject,
        user_id: user.id,
        status: 'draft'
      }
      
      await db.createProject(projectData)
      success('Projeto criado com sucesso!')
      setShowCreateProject(false)
      loadProjects()
    } catch (err) {
      console.error('Error creating project:', err)
      error('Erro ao criar projeto')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <>
      <Head>
        <title>Dashboard - UAU</title>
        <meta name="description" content="Gerencie seus projetos de realidade aumentada" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Olá, {profile?.full_name || user.email}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Bem-vindo ao seu dashboard de projetos AR
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Projetos', value: projects.length, icon: '📁' },
                { label: 'Visualizações', value: projects.reduce((acc, p) => acc + (p.view_count || 0), 0), icon: '👁️' },
                { label: 'Publicados', value: projects.filter(p => p.is_published).length, icon: '🌐' },
                { label: 'Este mês', value: projects.filter(p => new Date(p.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: '📅' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{stat.icon}</span>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Meus Projetos</h2>
                <Button onClick={handleCreateProject}>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Projeto
                </Button>
              </div>
            </div>

            <div className="p-6">
              {loadingProjects ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando projetos...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum projeto ainda
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Crie seu primeiro projeto AR e comece a impressionar!
                  </p>
                  <Button onClick={handleCreateProject}>
                    Criar Primeiro Projeto
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        {project.target_image_url ? (
                          <img 
                            src={project.target_image_url} 
                            alt={project.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-4xl">🎯</span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>Criado em {formatDate(project.created_at)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.is_published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {project.view_count || 0} visualizações
                        </span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm">
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Criar Novo Projeto</h3>
                  <button
                    onClick={() => setShowCreateProject(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Steps */}
                <div className="flex items-center justify-center mt-6 space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-0.5 ${
                          step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">📸 Upload da Imagem Target</h4>
                      <p className="text-gray-600 mb-4">
                        Faça upload da imagem que será usada como marcador AR
                      </p>
                    </div>
                    
                    <FileUpload
                      bucket="targets"
                      allowedTypes={['image/jpeg', 'image/png']}
                      onUploadSuccess={handleTargetUpload}
                      accept="image/*"
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">🎬 Upload do Conteúdo</h4>
                      <p className="text-gray-600 mb-4">
                        Adicione o vídeo, áudio ou imagem que aparecerá sobre o target
                      </p>
                    </div>
                    
                    <FileUpload
                      bucket="content"
                      allowedTypes={['video/mp4', 'audio/mp3', 'image/jpeg', 'image/png']}
                      onUploadSuccess={handleContentUpload}
                      accept="video/*,audio/*,image/*"
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">⚙️ Configurações do Projeto</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Projeto *
                        </label>
                        <input
                          type="text"
                          value={newProject.name}
                          onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Digite o nome do projeto"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição
                        </label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Descreva seu projeto"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        onClick={handleSaveProject}
                        className="flex-1"
                      >
                        Criar Projeto
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard
