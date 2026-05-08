import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalPlayer from './components/GlobalPlayer'
import TelegramFloat from './components/TelegramFloat'
import HomePage from './pages/HomePage'
import ReciterPage from './pages/ReciterPage'
import ReaderPage from './pages/ReaderPage'
import { useThemeStore } from './store'
import { usePlayerStore } from './store'

export default function App() {
  const { init } = useThemeStore()
  const currentTrack = usePlayerStore(s => s.currentTrack)

  useEffect(() => { init() }, [])

  return (
    <HashRouter>
      {/* Main layout */}
      <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300 ${currentTrack ? 'pb-32' : ''}`}>
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/reciter/:id" element={<ReciterPage />} />
            <Route path="/reader"      element={<ReaderPage />} />
          </Routes>
        </main>

        <Footer />
      </div>

      {/* Persistent global player */}
      <GlobalPlayer />

      {/* Floating Telegram button */}
      <TelegramFloat />
    </HashRouter>
  )
}
