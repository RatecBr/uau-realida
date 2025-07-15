import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import Header from '../components/layout/Header'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}
