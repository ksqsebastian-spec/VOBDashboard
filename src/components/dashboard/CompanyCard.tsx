'use client'

import Link from 'next/link'
import { daysUntilDeadline, formatDeadline } from '@/lib/utils'
import type { Company, DashboardRow, CompanyTrend } from '@/lib/types'

interface CompanyCardProps {
  company: Company
  tenders: DashboardRow[]
  trend?: CompanyTrend
}

function getStatusBadge(activeTenders: DashboardRow[], urgentCount: number) {
  if (urgentCount > 0) {
    return { label: 'Dringend', className: 'bg-red-50 text-red-600 ring-1 ring-red-200/60' }
  }
  if (activeTenders.length > 0) {
    return { label: 'Aktiv', className: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60' }
  }
  return { label: 'Stabil', className: 'bg-slate-50 text-slate-500 ring-1 ring-slate-200/60' }
}

function MiniSparkline({ color, trend }: { color: string; trend: number }) {
  const paths = {
    up: 'M2 18 Q12 16 22 12 T42 8 T62 4 T78 2',
    down: 'M2 4 Q12 6 22 10 T42 14 T62 18 T78 20',
    flat: 'M2 12 Q12 11 22 12 T42 11 T62 12 T78 11',
  }
  const areaFill = {
    up: 'M2 18 Q12 16 22 12 T42 8 T62 4 T78 2 L78 22 L2 22 Z',
    down: 'M2 4 Q12 6 22 10 T42 14 T62 18 T78 20 L78 22 L2 22 Z',
    flat: 'M2 12 Q12 11 22 12 T42 11 T62 12 T78 11 L78 22 L2 22 Z',
  }
  const direction = trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'

  return (
    <svg viewBox="0 0 80 22" className="w-[72px] h-5" fill="none">
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaFill[direction]}
        fill={`url(#fill-${color.replace('#', '')})`}
      />
      <path
        d={paths[direction]}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />
    </svg>
  )
}

export function CompanyCard({ company, tenders, trend }: CompanyCardProps) {
  const activeTenders = tenders.filter(t => t.status === 'active')
  const urgentCount = activeTenders.filter(t => t.urgency === 'urgent').length

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

  const initials = company.name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <Link href={`/unternehmen/${company.slug}`} className="group">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm p-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:border-slate-300/80 hover:-translate-y-0.5 cursor-pointer">
        {/* Gradient top accent */}
        <div
          className="absolute left-0 top-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, ${company.color}, ${company.color}88)`,
          }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between mb-3 mt-0.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: company.color }}
            >
              {initials}
            </span>
            <h3 className="font-semibold text-slate-800 text-[13px] truncate tracking-tight group-hover:text-slate-900 transition-colors">
              {company.name}
            </h3>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-black text-slate-900 tabular-nums leading-none tracking-tight">
                {activeTenders.length}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.06em]">
                Ausschreibungen
              </span>
            </div>

            {nextDeadline && daysLeft !== null ? (
              <p className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${daysLeft <= 7 ? 'bg-red-500 animate-pulse-soft' : daysLeft <= 14 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-slate-400">Frist:</span>
                {formatDeadline(nextDeadline.deadline_date)}
                <span className={daysLeft <= 7 ? 'text-red-600 font-semibold' : 'text-slate-400'}>
                  ({daysLeft}d)
                </span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-300 mt-2.5">Keine Fristen</p>
            )}
          </div>

          {/* Right: sparkline + change */}
          <div className="flex flex-col items-end gap-1">
            <MiniSparkline color={company.color} trend={weekChange} />
            <span className={`text-[11px] font-semibold tabular-nums ${
              changePercent > 0 ? 'text-emerald-600' : changePercent < 0 ? 'text-red-500' : 'text-slate-300'
            }`}>
              {changePercent > 0 ? '+' : ''}{changePercent}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
