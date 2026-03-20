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
    gradient: 'from-blue-600 to-blue-800',
    iconBg: 'bg-blue-500/30',
  },
  {
    key: 'active',
    label: 'Aktive Ausschreibungen',
    icon: FileSearch,
    gradient: 'from-emerald-600 to-emerald-800',
    iconBg: 'bg-emerald-500/30',
  },
  {
    key: 'matched',
    label: 'Zuordnungen',
    icon: Building2,
    gradient: 'from-violet-600 to-violet-800',
    iconBg: 'bg-violet-500/30',
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
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white shadow-lg`}
          >
            {/* Background icon */}
            <div className="absolute -right-2 -top-2 opacity-10">
              <Icon size={80} strokeWidth={1} />
            </div>
            {/* Content */}
            <div className="relative">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.iconBg} mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-xs font-medium text-white/70 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-black mt-1 tracking-tight">{main}</p>
              <p className="text-xs text-white/60 mt-1">{sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
