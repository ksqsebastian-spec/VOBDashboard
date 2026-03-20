'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
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

  const companyMap = new Map<string, { name: string; color: string }>()
  for (const t of trends) {
    if (!companyMap.has(t.company_slug)) {
      companyMap.set(t.company_slug, { name: t.company_name, color: t.color })
    }
  }

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
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">VOB-Trends</h2>
        </div>
        <p className="text-xs text-slate-400">Noch keine Trenddaten vorhanden.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">VOB-Trends</h2>
        </div>
        <div className="flex gap-0.5 bg-slate-100/80 rounded-xl p-0.5">
          {([
            ['week', 'Woche'],
            ['month', 'Monat'],
            ['4weeks', '4 Wochen'],
          ] as [TimeFrame, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeFrame(key)}
              className={`px-3 py-1.5 text-[11px] rounded-lg transition-all duration-200 ${
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
          <AreaChart data={chartData}>
            <defs>
              {companies.map(([slug, { color }]) => (
                <linearGradient key={slug} id={`gradient-${slug}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid rgba(226,232,240,0.6)',
                fontSize: '11px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                padding: '10px 14px',
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255,255,255,0.95)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '10px', paddingTop: '12px' }}
              iconType="circle"
              iconSize={6}
            />
            {companies.map(([slug, { name, color }]) => (
              <Area
                key={slug}
                type="monotone"
                dataKey={slug}
                name={name}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${slug})`}
                dot={{ r: 2.5, fill: 'white', strokeWidth: 1.5, stroke: color }}
                activeDot={{ r: 4.5, fill: color, strokeWidth: 0, stroke: 'transparent' }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
