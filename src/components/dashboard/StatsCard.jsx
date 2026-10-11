import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const tones = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
}

export default function StatsCard({ icon: Icon, label, value, change, tone = 'indigo' }) {
  const hasChange = typeof change === 'number'
  const positive = hasChange && change >= 0
  const TrendIcon = positive ? FiTrendingUp : FiTrendingDown

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={22} aria-hidden="true" />
        </span>
      </div>

      {hasChange && (
        <p
          className={`mt-4 flex items-center gap-1.5 text-xs font-medium ${
            positive
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          <TrendIcon size={14} aria-hidden="true" />
          {positive ? '+' : ''}
          {change}%
          <span className="font-normal text-slate-500 dark:text-slate-400">vs last week</span>
        </p>
      )}
    </article>
  )
}