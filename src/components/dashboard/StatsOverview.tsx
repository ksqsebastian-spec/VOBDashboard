'use client'

import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { VobScan } from '@/lib/types'

interface StatsOverviewProps {
  latestScan: VobScan | null
  totalActive: number
  totalMatched: number
}

export function StatsOverview({ latestScan, totalActive, totalMatched }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4">
        <p className="text-sm text-[#64748B]">Letzter Scan</p>
        <p className="text-2xl font-bold text-[#1E293B]">
          {latestScan ? `KW ${latestScan.calendar_week}` : '—'}
        </p>
        <p className="text-xs text-[#94A3B8]">
          {latestScan ? formatDate(latestScan.scan_date) : 'Kein Scan vorhanden'}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-[#64748B]">Aktive Ausschreibungen</p>
        <p className="text-2xl font-bold text-[#1E293B]">{totalActive}</p>
        <p className="text-xs text-[#94A3B8]">Gesamt im System</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-[#64748B]">Zuordnungen</p>
        <p className="text-2xl font-bold text-[#1E293B]">{totalMatched}</p>
        <p className="text-xs text-[#94A3B8]">Unternehmen-Matches</p>
      </Card>
    </div>
  )
}
