'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { daysUntilDeadline, formatDeadline } from '@/lib/utils'
import type { Company, DashboardRow, CompanyTrend } from '@/lib/types'

interface CompanyCardProps {
  company: Company
  tenders: DashboardRow[]
  trend?: CompanyTrend
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
  const trendArrow = weekChange > 0 ? '↑' : weekChange < 0 ? '↓' : '→'
  const trendColor = weekChange > 0 ? 'text-green-600' : weekChange < 0 ? 'text-red-600' : 'text-gray-400'

  return (
    <Link href={`/unternehmen/${company.slug}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: company.color }} />
        <div className="pl-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#1E293B] text-sm truncate">{company.name}</h3>
            {urgentCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-[#1E293B]">{activeTenders.length}</span>
            <span className="text-xs text-[#94A3B8]">aktiv</span>
            {weekChange !== 0 && (
              <span className={`text-xs font-medium ${trendColor}`}>
                {trendArrow} {Math.abs(weekChange)}
              </span>
            )}
          </div>

          {nextDeadline && daysLeft !== null && (
            <p className="text-xs text-[#64748B]">
              Nächste Frist: {formatDeadline(nextDeadline.deadline_date)}{' '}
              <span className={daysLeft <= 7 ? 'text-red-600 font-medium' : ''}>
                (noch {daysLeft} {daysLeft === 1 ? 'Tag' : 'Tage'})
              </span>
            </p>
          )}
          {!nextDeadline && (
            <p className="text-xs text-[#94A3B8]">Keine anstehenden Fristen</p>
          )}
        </div>
      </Card>
    </Link>
  )
}
