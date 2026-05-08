import { useEffect, useRef, useState } from 'react'
import {
  HiPlay, HiPause, HiVolumeUp, HiVolumeOff,
  HiChevronRight, HiChevronLeft, HiDownload,
  HiMusicNote,
} from 'react-icons/hi'
import { usePlayerStore } from '../store'

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function GlobalPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isLoading,
    setIsPlaying, setCurrentTime, setDuration, setVolume, setIsLoading,
    playNext, playPrev, queue, queueIndex,
  } = usePlayerStore()

  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [prevVol, setPrevVol] = useState(0.8)

  // Sync audio element with store
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDuration   = () => setDuration(audio.duration)
    const onEnded      = () => { setIsPlaying(false); playNext() }
    const onCanPlay    = () => setIsLoading(false)
    const onWaiting    = () => setIsLoading(true)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('waiting', onWaiting)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('waiting', onWaiting)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.src = currentTrack.url
    audio.load()
    if (isPlaying) audio.play().catch(() => {})
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  const togglePlay = () => setIsPlaying(!isPlaying)

  const onSeek = (e) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const onVolumeChange = (e) => {
    const v = Number(e.target.value)
    setVolume(v)
    setMuted(v === 0)
  }

  const toggleMute = () => {
    if (muted) {
      setMuted(false)
      setVolume(prevVol || 0.8)
    } else {
      setPrevVol(volume)
      setMuted(true)
    }
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  if (!currentTrack) return <audio ref={audioRef} className="hidden" />

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 animate-slideInBottom">
      <audio ref={audioRef} className="hidden" />

      {/* Progress bar (thin top strip) */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 relative">
        <div
          className="absolute top-0 right-0 h-full bg-gradient-to-l from-teal-700 to-teal-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-player border-t border-teal-700/10 dark:border-teal-700/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">

            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center flex-shrink-0 ${isLoading ? 'animate-pulse-soft' : ''}`}>
                <HiMusicNote className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-teal-800 dark:text-teal-400 truncate">
                  سورة {currentTrack.surahName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentTrack.reciterName}
                  {currentTrack.rewayah ? ` • ${currentTrack.rewayah}` : ''}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Prev */}
              <button
                onClick={playPrev}
                disabled={queueIndex <= 0}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-30 transition-all"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-2xl bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 active:scale-95 transition-all shadow-md"
              >
                {isLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : isPlaying
                    ? <HiPause className="w-5 h-5" />
                    : <HiPlay className="w-5 h-5" />
                }
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                disabled={queueIndex >= queue.length - 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-30 transition-all"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Seek + time */}
            <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-slate-400 w-8 text-center tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={onSeek}
                className="flex-1"
                style={{
                  background: `linear-gradient(to left, #0f766e ${progress}%, #e2e8f0 ${progress}%)`,
                }}
              />
              <span className="text-xs text-slate-400 w-8 text-center tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Volume + Download */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={toggleMute} className="text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                {muted || volume === 0
                  ? <HiVolumeOff className="w-5 h-5" />
                  : <HiVolumeUp className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={onVolumeChange}
                className="w-20"
              />
            </div>

            {/* Download */}
            <a
              href={currentTrack.url}
              download
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
              title="تحميل"
            >
              <HiDownload className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile seek bar */}
          <div className="flex sm:hidden items-center gap-2 mt-2">
            <span className="text-xs text-slate-400 tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={onSeek}
              className="flex-1"
              style={{
                background: `linear-gradient(to left, #0f766e ${progress}%, #e2e8f0 ${progress}%)`,
              }}
            />
            <span className="text-xs text-slate-400 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
