import { Link, NavLink } from 'react-router-dom'
import { HiSun, HiMoon, HiMenuAlt3, HiX } from 'react-icons/hi'
import { useThemeStore } from '../store'
import { useState } from 'react'

export default function Navbar() {
  const { dark, toggle } = useThemeStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/',        label: 'الرئيسية' },
    { to: '/reader',  label: 'تصفح القرآن' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-teal-700/10 dark:border-teal-700/20 shadow-soft">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 36 36" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3C9.716 3 3 9.716 3 18s6.716 15 15 15 15-6.716 15-15S26.284 3 18 3zm-2 20.5v-11l9 5.5-9 5.5z"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-teal-800 dark:text-teal-400 tracking-tight">TilawaQuran</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="تبديل الوضع"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-200"
          >
            {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt3 className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 animate-fadeInUp border-t border-slate-100 dark:border-slate-800">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
