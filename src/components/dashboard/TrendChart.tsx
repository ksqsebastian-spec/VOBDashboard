'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { CompanyTrend } from '@/lib/types'

interface TrendChartProps {
  trends: CompanyTrend[]
}

type TimeFrame = 'week' | 'month' | '4weeks'

export function TrendChart({ trends }: TrendChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week')

  // Get unique companies
  const companyMap = new Map<string, { name: string; color: string }>()
  for (const t of trends) {
    if (!companyMap.has(t.company_slug)) {
      companyMap.set(t.company_slug, { name: t.company_name, color: t.color })
    }
  }

  // Group by week
  const weekMap = new Map<string, Record<string, number>>()
  for (const t of trends) {
    const key = `KW${t.calendar_week}`
    if (!weekMap.has(key)) weekMap.set(key, {})
    weekMap.get(key)![t.company_slug] = t.tender_count
  }

  const chartData = Array.from(weekMap.entries())
    .map(([week, data]) => ({ week, ...data }))
    .reverse()

  const companies = Array.from(companyMap.entries())

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-800">VOB-Trends</h2>
        </div>
        <p className="text-sm text-slate-400">Noch keine Trenddaten vorhanden.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-800">VOB-Trends</h2>
        </div>
        <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {([
            ['week', 'Woche'],
            ['month', 'Monat'],
            ['4weeks', '4 Wochen'],
          ] as [TimeFrame, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeFrame(key)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all duration-150 ${
                timeFrame === key
                  ? 'bg-white text-slate-800 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              stroke="#E2E8F0"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              stroke="#E2E8F0"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '8px 12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
              iconSize={8}
            />
            {companies.map(([slug, { name, color }]) => (
              <Line
                key={slug}
                type="monotone"
                dataKey={slug}
                name={name}
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'white', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
