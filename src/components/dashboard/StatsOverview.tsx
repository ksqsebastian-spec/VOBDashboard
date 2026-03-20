'use client'

import { formatDate } from '@/lib/utils'
import type { VobScan } from '@/lib/types'

interface StatsOverviewProps {
  latestScan: VobScan | null
  totalActive: number
  totalMatched: number
}

export function StatsOverview({ latestScan, totalActive, totalMatched }: StatsOverviewProps) {
  const items = [
    {
      label: 'Letzter Scan',
      value: latestScan ? `KW ${latestScan.calendar_week}` : '—',
      sub: latestScan ? formatDate(latestScan.scan_date) : 'Kein Scan vorhanden',
    },
    {
      label: 'Aktive Ausschreibungen',
      value: String(totalActive),
      sub: 'Gesamt im System',
    },
    {
      label: 'Zuordnungen',
      value: String(totalMatched),
      sub: 'Unternehmen-Matches',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-200/60 rounded-xl overflow-hidden border border-neutral-200/60">
      {items.map(item => (
        <div key={item.label} className="bg-white p-5">
          <p className="text-[11px] text-neutral-400 mb-3">{item.label}</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none tracking-tight">{item.value}</p>
          <p className="text-[11px] text-neutral-400 mt-2">{item.sub}</p>
        </div>
      ))}
    </div>
  )
}
