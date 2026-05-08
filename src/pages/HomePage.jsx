import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiSearch, HiMicrophone, HiChevronLeft, HiRefresh } from 'react-icons/hi'
import { FaQuran } from 'react-icons/fa'

// Teal-tinted avatar initials
const AvatarColors = ['from-teal-600 to-teal-800', 'from-emerald-600 to-teal-700', 'from-cyan-600 to-teal-700']

export default function HomePage() {
  const [reciters, setReciters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchReciters = () => {
    setLoading(true)
    setError(null)
    fetch('https://www.mp3quran.net/api/v3/reciters?language=ar')
      .then((r) => r.json())
      .then((data) => {
        setReciters(data.reciters || [])
        setLoading(false)
      })
      .catch(() => {
        setError('تعذّر تحميل قائمة القرّاء. يرجى التحقق من اتصالك بالإنترنت.')
        setLoading(false)
      })
  }

  useEffect(() => { fetchReciters() }, [])

  const filtered = useMemo(() =>
    reciters.filter((r) =>
      r.name.includes(search) || r.name.toLowerCase().includes(search.toLowerCase())
    ), [reciters, search])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero section */}
      <div className="text-center mb-10 animate-fadeInUp">
        <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-teal-200 dark:border-teal-700/40">
          <FaQuran className="w-4 h-4" />
          مكتبة صوتية شاملة
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-3">
          استمع إلى القرآن الكريم
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
          مجموعة متنوعة من أشهر القرّاء العالميين بأعلى جودة صوتية
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8 animate-fadeInUp delay-100 max-w-lg mx-auto">
        <HiSearch className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث عن قارئ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-12 pl-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 shadow-card transition-all text-sm"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={fetchReciters}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium"
          >
            <HiRefresh className="w-4 h-4" /> إعادة المحاولة
          </button>
        </div>
      )}

      {/* Reciters grid */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <HiMicrophone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 dark:text-slate-500">لا توجد نتائج لـ "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((reciter, idx) => {
                const colorClass = AvatarColors[idx % AvatarColors.length]
                const initials = reciter.name.split(' ').slice(0, 2).map(w => w[0]).join('')
                const firstMoshaf = reciter.moshaf?.[0]
                const surahCount = firstMoshaf?.surah_list?.split(',').length || 0

                return (
                  <button
                    key={reciter.id}
                    onClick={() => navigate(`/reciter/${reciter.id}`, { state: { reciter } })}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-card hover:shadow-lg p-5 flex items-center gap-4 text-right transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] group animate-fadeInUp border border-transparent hover:border-teal-700/20"
                    style={{ animationDelay: `${(idx % 12) * 40}ms` }}
                  >
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <span className="text-white font-bold text-base">{initials}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {reciter.name}
                      </p>
                      {firstMoshaf && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {firstMoshaf.name} • {surahCount} سورة
                        </p>
                      )}
                    </div>

                    <HiChevronLeft className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-teal-700 dark:group-hover:text-teal-400 flex-shrink-0 transition-colors" />
                  </button>
                )
              })}
            </div>
          )}

          {/* Count badge */}
          {filtered.length > 0 && (
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
              {filtered.length} قارئ
            </p>
          )}
        </>
      )}
    </div>
  )
}
