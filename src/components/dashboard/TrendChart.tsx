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
import { Card } from '@/components/ui/card'
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
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Trend</h2>
        <p className="text-sm text-[#94A3B8]">Noch keine Trenddaten vorhanden.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1E293B]">Trend</h2>
        <div className="flex gap-1 bg-[#F1F5F9] rounded-lg p-0.5">
          {([
            ['week', 'Woche'],
            ['month', 'Monat'],
            ['4weeks', '4 Wochen'],
          ] as [TimeFrame, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeFrame(key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeFrame === key
                  ? 'bg-white text-[#1E293B] shadow-sm font-medium'
                  : 'text-[#64748B] hover:text-[#1E293B]'
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {companies.map(([slug, { name, color }]) => (
              <Line
                key={slug}
                type="monotone"
                dataKey={slug}
                name={name}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
