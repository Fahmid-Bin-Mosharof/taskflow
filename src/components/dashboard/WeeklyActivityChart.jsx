import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from './ChartCard'
import ChartTooltip from './ChartTooltip'
import LoadingSpinner from '../common/LoadingSpinner'
import { ACTIVITY_COLORS, getWeeklyActivity } from '../../utils/chartUtils'

const axisTick = { fill: 'currentColor', fontSize: 12 }

export default function WeeklyActivityChart({ tasks, loading }) {
  const data = useMemo(() => getWeeklyActivity(tasks), [tasks])
  const hasActivity = data.some((day) => day.created > 0 || day.completed > 0)

  const renderBody = () => {
    if (loading) return <LoadingSpinner label="Loading chart..." />

    if (!hasActivity) {
      return (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-16 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No task activity in the last 7 days.
        </p>
      )
    }

    return (
      <>
        <div className="h-64 text-slate-500 dark:text-slate-400" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.15} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={28}
                tick={axisTick}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: 'currentColor', fillOpacity: 0.06 }}
              />
              <Bar
                dataKey="created"
                name="Created"
                fill={ACTIVITY_COLORS.created}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill={ACTIVITY_COLORS.completed}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: ACTIVITY_COLORS.created }}
              aria-hidden="true"
            />
            Created
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: ACTIVITY_COLORS.completed }}
              aria-hidden="true"
            />
            Completed (by last update)
          </li>
        </ul>

        {/* Text alternative for screen readers */}
        <table className="sr-only">
          <caption>Tasks created and completed in the last 7 days</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Created</th>
              <th scope="col">Completed</th>
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <tr key={day.key}>
                <th scope="row">{day.label}</th>
                <td>{day.created}</td>
                <td>{day.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  }

  return (
    <ChartCard title="Weekly Activity" description="Tasks created and completed over the last 7 days.">
      {renderBody()}
    </ChartCard>
  )
}