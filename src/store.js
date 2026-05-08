import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  // Current track info
  currentTrack: null,       // { url, surahName, surahNumber, reciterName, rewayah }
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isLoading: false,

  // Queue for next/prev
  queue: [],                // array of track objects
  queueIndex: -1,

  setTrack: (track, queue = [], queueIndex = 0) =>
    set({ currentTrack: track, queue, queueIndex, isPlaying: true, currentTime: 0, isLoading: true }),

  setIsPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (v) => set({ currentTime: v }),
  setDuration: (v) => set({ duration: v }),
  setVolume: (v) => set({ volume: v }),
  setIsLoading: (v) => set({ isLoading: v }),

  playNext: () => {
    const { queue, queueIndex } = get()
    if (queueIndex < queue.length - 1) {
      const next = queue[queueIndex + 1]
      set({ currentTrack: next, queueIndex: queueIndex + 1, isPlaying: true, currentTime: 0, isLoading: true })
    }
  },
  playPrev: () => {
    const { queue, queueIndex } = get()
    if (queueIndex > 0) {
      const prev = queue[queueIndex - 1]
      set({ currentTrack: prev, queueIndex: queueIndex - 1, isPlaying: true, currentTime: 0, isLoading: true })
    }
  },
}))

export const useThemeStore = create((set) => ({
  dark: false,
  toggle: () => set((s) => {
    const next = !s.dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('tilawa-theme', next ? 'dark' : 'light')
    return { dark: next }
  }),
  init: () => {
    const saved = localStorage.getItem('tilawa-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved ? saved === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', dark)
    set({ dark })
  },
}))
