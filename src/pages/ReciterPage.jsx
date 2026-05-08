import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HiArrowRight, HiPlay, HiVolumeUp, HiMusicNote } from 'react-icons/hi'
import { FaQuran } from 'react-icons/fa'
import { SURAH_NAMES, getSurahById } from '../data/surahs'
import { usePlayerStore } from '../store'

export default function ReciterPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore()

  const [reciter, setReciter] = useState(location.state?.reciter || null)
  const [loading, setLoading] = useState(!reciter)
  const [selectedMoshaf, setSelectedMoshaf] = useState(null)

  // Fetch reciter details if not in state
  useEffect(() => {
    if (reciter) {
      setSelectedMoshaf(reciter.moshaf?.[0] || null)
      return
    }
    fetch(`https://www.mp3quran.net/api/v3/reciters?language=ar`)
      .then(r => r.json())
      .then(data => {
        const found = data.reciters?.find(r => String(r.id) === String(id))
        if (found) {
          setReciter(found)
          setSelectedMoshaf(found.moshaf?.[0] || null)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (reciter && !selectedMoshaf) setSelectedMoshaf(reciter.moshaf?.[0] || null)
  }, [reciter])

  const getSurahList = () => {
    if (!selectedMoshaf?.surah_list) return []
    return selectedMoshaf.surah_list.split(',').map(Number).filter(Boolean)
  }

  const getAudioUrl = (surahNum) => {
    if (!selectedMoshaf?.server) return null
    const num = String(surahNum).padStart(3, '0')
    return `${selectedMoshaf.server}${num}.mp3`
  }

  const buildQueue = () =>
    getSurahList().map((num) => {
      const surah = getSurahById(num)
      return {
        url: getAudioUrl(num),
        surahName: surah.ar,
        surahNumber: num,
        reciterName: reciter?.name,
        rewayah: selectedMoshaf?.name,
      }
    })

  const playSurah = (num) => {
    const queue = buildQueue()
    const idx = queue.findIndex(t => t.surahNumber === num)
    if (idx === -1) return
    setTrack(queue[idx], queue, idx)
  }

  const isCurrentlyPlaying = (num) =>
    currentTrack?.surahNumber === num &&
    currentTrack?.reciterName === reciter?.name &&
    isPlaying

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-2xl w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!reciter) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">لم يتم العثور على القارئ</p>
        <button onClick={() => navigate('/')} className="mt-4 text-teal-700 dark:text-teal-400 hover:underline">
          العودة للرئيسية
        </button>
      </div>
    )
  }

  const surahList = getSurahList()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 mb-6 transition-colors"
      >
        <HiArrowRight className="w-4 h-4" />
        العودة
      </button>

      {/* Reciter header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-6 mb-6 animate-fadeInUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-md flex-shrink-0">
            <HiMusicNote className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{reciter.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {reciter.moshaf?.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoshaf(m)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedMoshaf?.id === m.id
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FaQuran className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            {surahList.length} سورة
          </div>
        </div>
      </div>

      {/* Play all button */}
      {surahList.length > 0 && (
        <button
          onClick={() => playSurah(surahList[0])}
          className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 active:scale-95 transition-all shadow-md text-sm font-medium animate-fadeInUp delay-100"
        >
          <HiVolumeUp className="w-4 h-4" />
          تشغيل الكل
        </button>
      )}

      {/* Surah grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fadeInUp delay-150">
        {surahList.map((num, idx) => {
          const surah = getSurahById(num)
          const playing = isCurrentlyPlaying(num)
          return (
            <button
              key={num}
              onClick={() => playSurah(num)}
              className={`group relative flex items-center gap-3 p-4 rounded-2xl border text-right transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                playing
                  ? 'bg-teal-700 border-teal-700 shadow-md text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-card hover:border-teal-700/30 hover:shadow-md'
              }`}
              style={{ animationDelay: `${(idx % 20) * 30}ms` }}
            >
              {/* Number badge */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                playing
                  ? 'bg-white/20 text-white'
                  : 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
              }`}>
                {playing
                  ? <HiPlay className="w-3.5 h-3.5 animate-pulse-soft" />
                  : num
                }
              </div>
              <span className={`font-bold text-sm truncate ${
                playing ? 'text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400'
              }`}>
                {surah.ar}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
