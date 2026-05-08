import { useEffect, useState, useRef } from 'react'
import { HiChevronRight, HiChevronLeft, HiRefresh, HiBookOpen } from 'react-icons/hi'
import { FaQuran } from 'react-icons/fa'
import { SURAH_NAMES } from '../data/surahs'

export default function ReaderPage() {
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [ayahs, setAyahs] = useState([])
  const [surahInfo, setSurahInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const topRef = useRef(null)

  const fetchSurah = (num) => {
    setLoading(true)
    setError(null)
    setAyahs([])
    fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.uthmani`)
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setAyahs(data.data.ayahs)
          setSurahInfo(data.data)
        } else {
          setError('تعذّر تحميل السورة')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('تعذّر الاتصال بالخادم')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSurah(selectedSurah)
  }, [selectedSurah])

  const goNext = () => { if (selectedSurah < 114) { setSelectedSurah(s => s + 1); scrollTop() } }
  const goPrev = () => { if (selectedSurah > 1)  { setSelectedSurah(s => s - 1); scrollTop() } }

  const scrollTop = () => setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

  const surahMeta = SURAH_NAMES.find(s => s.id === selectedSurah)
  const revelationType = surahInfo?.revelationType === 'Meccan' ? 'مكية' : 'مدنية'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8" ref={topRef}>
      <div className="flex gap-6">

        {/* Sidebar - Surah list */}
        <aside className={`
          fixed inset-y-0 right-0 z-30 w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none lg:w-64 lg:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          border-l border-slate-100 dark:border-slate-800
        `}>
          <div className="flex items-center justify-between px-4 pt-6 pb-3 lg:pt-0">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FaQuran className="text-teal-700 dark:text-teal-400 w-4 h-4" />
              السور
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
            >✕</button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-200px)] lg:h-auto lg:max-h-[70vh] px-2 pb-4">
            {SURAH_NAMES.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedSurah(s.id); setSidebarOpen(false); scrollTop() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-right transition-all ${
                  selectedSurah === s.id
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  selectedSurah === s.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>{s.id}</span>
                <span className="font-medium text-sm">{s.ar}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main reader */}
        <main className="flex-1 min-w-0">

          {/* Header bar */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-card text-sm text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 border border-slate-100 dark:border-slate-700"
            >
              <HiBookOpen className="w-4 h-4" />
              السور
            </button>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-card px-5 py-3 flex items-center justify-between border border-slate-100 dark:border-slate-700">
              <div>
                <h1 className="font-black text-xl text-slate-800 dark:text-slate-100">{surahMeta?.ar}</h1>
                {surahInfo && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {revelationType} • {surahInfo.numberOfAyahs} آية
                  </p>
                )}
              </div>

              {/* Nav arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={goPrev}
                  disabled={selectedSurah <= 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-30 transition-all"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 w-8 text-center">{selectedSurah}/114</span>
                <button
                  onClick={goNext}
                  disabled={selectedSurah >= 114}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-30 transition-all"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-10 text-center">
              <div className="w-10 h-10 border-3 border-teal-700/20 border-t-teal-700 rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: '3px' }} />
              <p className="text-slate-400 dark:text-slate-500 text-sm">جارٍ تحميل السورة...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
              <button
                onClick={() => fetchSurah(selectedSurah)}
                className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium"
              >
                <HiRefresh className="w-4 h-4" /> إعادة المحاولة
              </button>
            </div>
          )}

          {/* Quran text */}
          {!loading && !error && ayahs.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-6 sm:p-8 animate-fadeIn">
              {/* Basmala (not for Al-Tawbah and Al-Fatihah which has it as 1st ayah) */}
              {selectedSurah !== 9 && selectedSurah !== 1 && (
                <div className="text-center mb-8">
                  <p className="text-2xl sm:text-3xl text-teal-800 dark:text-teal-300 font-bold arabic-text">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <div className="w-24 h-0.5 bg-teal-700/20 mx-auto mt-4" />
                </div>
              )}

              {/* Ayahs - continuous flow */}
              <p className="arabic-text text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 leading-[2.4] text-justify">
                {ayahs.map((ayah) => (
                  <span key={ayah.number} className="group">
                    <span className="hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-sm transition-colors px-0.5">
                      {ayah.text}
                    </span>
                    {' '}
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold mx-1 flex-shrink-0 align-middle">
                      {ayah.numberInSurah}
                    </span>
                    {' '}
                  </span>
                ))}
              </p>

              {/* Bottom nav */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={goPrev}
                  disabled={selectedSurah <= 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-700 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-30 transition-all text-sm font-medium"
                >
                  <HiChevronRight className="w-4 h-4" />
                  السورة السابقة
                </button>
                <span className="text-xs text-slate-400 dark:text-slate-500">{surahMeta?.ar}</span>
                <button
                  onClick={goNext}
                  disabled={selectedSurah >= 114}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-700 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-30 transition-all text-sm font-medium"
                >
                  السورة التالية
                  <HiChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
