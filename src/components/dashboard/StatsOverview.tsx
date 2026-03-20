'use client'

import { formatDate } from '@/lib/utils'
import { CalendarDays, FileSearch, Building2 } from 'lucide-react'
import type { VobScan } from '@/lib/types'

interface StatsOverviewProps {
  latestScan: VobScan | null
  totalActive: number
  totalMatched: number
}

const stats = [
  {
    key: 'scan',
    label: 'Letzter Scan',
    icon: CalendarDays,
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    shadow: 'shadow-blue-500/25',
  },
  {
    key: 'active',
    label: 'Aktive Ausschreibungen',
    icon: FileSearch,
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    shadow: 'shadow-emerald-500/25',
  },
  {
    key: 'matched',
    label: 'Zuordnungen',
    icon: Building2,
    gradient: 'from-violet-500 via-violet-600 to-purple-700',
    shadow: 'shadow-violet-500/25',
  },
] as const

export function StatsOverview({ latestScan, totalActive, totalMatched }: StatsOverviewProps) {
  const values = {
    scan: {
      main: latestScan ? `KW ${latestScan.calendar_week}` : '—',
      sub: latestScan ? formatDate(latestScan.scan_date) : 'Kein Scan vorhanden',
    },
    active: {
      main: String(totalActive),
      sub: 'Gesamt im System',
    },
    matched: {
      main: String(totalMatched),
      sub: 'Unternehmen-Matches',
    },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
      {stats.map(stat => {
        const Icon = stat.icon
        const { main, sub } = values[stat.key]
        return (
          <div
            key={stat.key}
            className={`noise-overlay relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white shadow-lg ${stat.shadow} transition-shadow hover:shadow-xl`}
          >
            {/* Background icon */}
            <div className="absolute -right-3 -top-3 opacity-[0.12]">
              <Icon size={88} strokeWidth={0.8} />
            </div>
            {/* Shimmer line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            {/* Content */}
            <div className="relative">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.15] backdrop-blur-sm mb-3">
                <Icon size={17} className="text-white" />
              </div>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.08em]">{stat.label}</p>
              <p className="text-[32px] font-black mt-0.5 tracking-tight leading-none">{main}</p>
              <p className="text-[11px] text-white/50 mt-1.5">{sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
