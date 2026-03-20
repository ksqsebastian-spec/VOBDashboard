'use client'

import { Badge } from '@/components/ui/badge'
import { UrgencyBadge } from './UrgencyBadge'
import { NewBadge } from './NewBadge'
import { formatDeadline, daysUntilDeadline, getRelevanceBgClass, computeUrgency } from '@/lib/utils'
import { CalendarDays, Building } from 'lucide-react'
import type { DashboardRow } from '@/lib/types'

interface TenderCardProps {
  tender: DashboardRow
  isNew?: boolean
  onClick?: () => void
}

export function TenderCard({ tender, isNew, onClick }: TenderCardProps) {
  const urgency = tender.urgency || computeUrgency(tender.deadline_date)
  const days = daysUntilDeadline(tender.deadline_date)

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {tender.company_color && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: tender.company_color }} />
      )}
      <div className={tender.company_color ? 'pl-3' : ''}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-slate-900">{tender.title}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isNew && <NewBadge />}
            <UrgencyBadge urgency={urgency} />
          </div>
        </div>

        {tender.authority && (
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <Building size={12} className="text-slate-400" />
            {tender.authority}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tender.deadline_date && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CalendarDays size={12} className="text-slate-400" />
              {formatDeadline(tender.deadline_date)}
              {days !== null && days >= 0 && (
                <span className={`font-medium ${days <= 7 ? 'text-red-600' : days <= 14 ? 'text-amber-600' : 'text-slate-600'}`}>
                  ({days}d)
                </span>
              )}
            </span>
          )}
          {tender.category && (
            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">{tender.category}</Badge>
          )}
          {tender.relevance && (
            <Badge variant="outline" className={`text-[10px] ${getRelevanceBgClass(tender.relevance)}`}>
              {tender.relevance}
            </Badge>
          )}
        </div>

        {tender.reason && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-1">{tender.reason}</p>
        )}
      </div>
    </div>
  )
}
