import { FiGithub } from 'react-icons/fi'
import Logo from './Logo'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize your work. Get things done.
          </p>
        </div>

        <nav aria-label="Footer" className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-primary dark:text-slate-400"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/your-username/taskflow"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TaskFlow on GitHub"
            className="text-slate-600 hover:text-primary dark:text-slate-400"
          >
            <FiGithub size={20} />
          </a>
        </nav>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} TaskFlow. All rights reserved.
      </div>
    </footer>
  )
}