'use client'

import Link from 'next/link'
import { daysUntilDeadline, formatDeadline } from '@/lib/utils'
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import type { Company, DashboardRow, CompanyTrend } from '@/lib/types'

interface CompanyCardProps {
  company: Company
  tenders: DashboardRow[]
  trend?: CompanyTrend
}

function getStatusBadge(activeTenders: DashboardRow[], urgentCount: number) {
  if (urgentCount > 0) {
    return { label: 'Dringend', className: 'bg-red-100 text-red-700 border-red-200' }
  }
  if (activeTenders.length > 0) {
    return { label: 'Aktiv', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  }
  return { label: 'Stabil', className: 'bg-slate-100 text-slate-500 border-slate-200' }
}

function MiniSparkline({ color, trend }: { color: string; trend: number }) {
  // Simple SVG sparkline that goes up, down, or flat based on trend
  const paths = {
    up: 'M2 18 Q12 16 22 12 T42 8 T62 4 T78 2',
    down: 'M2 4 Q12 6 22 10 T42 14 T62 18 T78 20',
    flat: 'M2 12 Q12 11 22 12 T42 11 T62 12 T78 11',
  }
  const direction = trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'

  return (
    <svg viewBox="0 0 80 22" className="w-16 h-5" fill="none">
      <path
        d={paths[direction]}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
    </svg>
  )
}

export function CompanyCard({ company, tenders, trend }: CompanyCardProps) {
  const activeTenders = tenders.filter(t => t.status === 'active')
  const urgentCount = activeTenders.filter(t => t.urgency === 'urgent').length

  // Find next deadline
  const upcoming = activeTenders
    .filter(t => t.deadline_date)
    .sort((a, b) => (a.deadline_date! > b.deadline_date! ? 1 : -1))
  const nextDeadline = upcoming[0]
  const daysLeft = nextDeadline ? daysUntilDeadline(nextDeadline.deadline_date) : null

  const weekChange = trend?.week_change ?? 0
  const changePercent = trend && trend.prev_week_count
    ? Math.round((weekChange / trend.prev_week_count) * 100)
    : 0
  const status = getStatusBadge(activeTenders, urgentCount)

  return (
    <Link href={`/unternehmen/${company.slug}`} className="group">
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer">
        {/* Color top accent */}
        <div
          className="absolute left-0 top-0 right-0 h-1 rounded-t-xl"
          style={{ backgroundColor: company.color }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between mb-3 mt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm"
              style={{ backgroundColor: company.color }}
            >
              {company.name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
            </span>
            <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-slate-900">
              {company.name}
            </h3>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                {String(activeTenders.length).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                Ausschreibungen
              </span>
            </div>

            {/* Deadline info */}
            {nextDeadline && daysLeft !== null ? (
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${daysLeft <= 7 ? 'bg-red-500 animate-pulse-soft' : daysLeft <= 14 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                Frist: {formatDeadline(nextDeadline.deadline_date)}
                <span className={daysLeft <= 7 ? 'text-red-600 font-semibold' : ''}>
                  ({daysLeft} {daysLeft === 1 ? 'Tag' : 'Tage'})
                </span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-2">Keine Fristen</p>
            )}
          </div>

          {/* Right side: sparkline + change */}
          <div className="flex flex-col items-end gap-1">
            <MiniSparkline color={company.color} trend={weekChange} />
            {changePercent !== 0 ? (
              <span className={`text-[11px] font-semibold ${changePercent > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {changePercent > 0 ? '+' : ''}{changePercent}%
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">—0%</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
