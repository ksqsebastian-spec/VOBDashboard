'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UrgencyBadge } from './UrgencyBadge'
import { NewBadge } from './NewBadge'
import { formatDeadline, daysUntilDeadline, getRelevanceBgClass, computeUrgency } from '@/lib/utils'
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
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      {tender.company_color && (
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: tender.company_color }} />
      )}
      <div className={tender.company_color ? 'pl-3' : ''}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-[#1E293B] text-sm line-clamp-2">{tender.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isNew && <NewBadge />}
            <UrgencyBadge urgency={urgency} />
          </div>
        </div>

        {tender.authority && (
          <p className="text-xs text-[#64748B] mb-1">Auftraggeber: {tender.authority}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tender.deadline_date && (
            <span className="text-xs text-[#64748B]">
              Frist: {formatDeadline(tender.deadline_date)}
              {days !== null && days >= 0 && (
                <span className={days <= 7 ? ' text-red-600 font-medium' : ''}>
                  {' '}(noch {days} {days === 1 ? 'Tag' : 'Tage'})
                </span>
              )}
            </span>
          )}
          {tender.category && (
            <Badge variant="outline" className="text-[10px]">{tender.category}</Badge>
          )}
          {tender.relevance && (
            <Badge variant="outline" className={`text-[10px] ${getRelevanceBgClass(tender.relevance)}`}>
              {tender.relevance}
            </Badge>
          )}
        </div>

        {tender.reason && (
          <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2">{tender.reason}</p>
        )}
      </div>
    </Card>
  )
}
