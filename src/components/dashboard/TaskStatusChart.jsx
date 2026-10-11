import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ChartCard from './ChartCard'
import ChartTooltip from './ChartTooltip'
import LoadingSpinner from '../common/LoadingSpinner'
import { getStatusChartData } from '../../utils/chartUtils'

export default function TaskStatusChart({ tasks, loading }) {
  const data = useMemo(() => getStatusChartData(tasks), [tasks])
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const slices = data.filter((item) => item.value > 0).length

  const renderBody = () => {
    if (loading) return <LoadingSpinner label="Loading chart..." />

    if (total === 0) {
      return (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-16 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No tasks yet. Create tasks to see your status breakdown.
        </p>
      )
    }

    return (
      <>
        <div className="relative h-52 text-slate-500 dark:text-slate-400" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="90%"
                paddingAngle={slices > 1 ? 3 : 0}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{total}</span>
            <span className="text-xs">{total === 1 ? 'task' : 'tasks'}</span>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          {data.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                {item.name}
              </span>
              <span className="font-medium">
                {item.value}
                <span className="ml-1.5 text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <ChartCard title="Task Status" description="How your tasks are distributed.">
      {renderBody()}
    </ChartCard>
  )
}