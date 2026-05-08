import { FaTelegram } from 'react-icons/fa'

export default function TelegramFloat() {
  return (
    <a
      href="https://t.me/lmn_o"
      target="_blank"
      rel="noreferrer"
      title="تواصل معنا عبر تيليغرام"
      className="fixed left-4 bottom-24 sm:bottom-28 z-40 group flex items-center gap-2 bg-[#0088cc] hover:bg-[#006fa8] text-white rounded-2xl px-3 py-3 sm:py-2 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
    >
      <FaTelegram className="w-6 h-6 flex-shrink-0" />
      <span className="hidden sm:inline text-sm font-medium">تواصل معنا</span>
    </a>
  )
}
