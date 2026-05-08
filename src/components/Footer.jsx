import { FaTelegram } from 'react-icons/fa'
import { HiHeart } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-4 h-4 fill-white">
                <path d="M18 3C9.716 3 3 9.716 3 18s6.716 15 15 15 15-6.716 15-15S26.284 3 18 3zm-2 20.5v-11l9 5.5-9 5.5z"/>
              </svg>
            </div>
            <span className="font-bold text-teal-800 dark:text-teal-400">TilawaQuran</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            صُنع بـ <HiHeart className="text-red-400 w-4 h-4" /> لخدمة كتاب الله
          </p>

          {/* Contact */}
          <a
            href="https://t.me/lmn_o"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc] text-white text-sm font-medium hover:bg-[#006fa8] active:scale-95 transition-all shadow-md"
          >
            <FaTelegram className="w-4 h-4" />
            تواصل معنا
          </a>
        </div>
      </div>
    </footer>
  )
}
