'use client'

import { useState } from 'react'
import { TenderDrawer } from '@/components/tenders/TenderDrawer'
import { daysUntilDeadline } from '@/lib/utils'
import { FileText } from 'lucide-react'
import type { DashboardRow } from '@/lib/types'

interface RecentFeedProps {
  tenders: DashboardRow[]
  latestScanDate?: string | null
}

export function RecentFeed({ tenders, latestScanDate }: RecentFeedProps) {
  const [selectedTender, setSelectedTender] = useState<DashboardRow | null>(null)

  // Deduplicate by tender_id, keeping first occurrence
  const seen = new Set<string>()
  const uniqueTenders = tenders.filter(t => {
    if (seen.has(t.tender_id)) return false
    seen.add(t.tender_id)
    return true
  }).slice(0, 8)

  // Get all matches for selected tender
  const allMatches = selectedTender
    ? tenders.filter(t => t.tender_id === selectedTender.tender_id)
    : []

  return (
    <>
      <div className="space-y-1">
        {uniqueTenders.length === 0 && (
          <p className="text-sm text-slate-400 py-8 text-center">
            Noch keine Ausschreibungen.
          </p>
        )}
        {uniqueTenders.map(tender => {
          const isNew = !!latestScanDate && tender.scan_date === latestScanDate
          const days = daysUntilDeadline(tender.deadline_date)
          const urgencyColor = days !== null && days <= 7 ? 'text-red-500' : days !== null && days <= 14 ? 'text-amber-500' : 'text-emerald-500'
          const dotColor = days !== null && days <= 7 ? 'bg-red-500' : days !== null && days <= 14 ? 'bg-amber-500' : 'bg-emerald-500'

          return (
            <button
              key={tender.tender_id}
              onClick={() => setSelectedTender(tender)}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group flex items-start gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: tender.company_color ? `${tender.company_color}15` : '#F1F5F9',
                  color: tender.company_color || '#94A3B8',
                }}
              >
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-slate-900">
                    {tender.title}
                  </p>
                  {isNew && (
                    <span className="text-[10px] font-semibold bg-blue-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                      Neu
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{tender.company_name || 'Unbekannt'}</p>
                {days !== null && days >= 0 && (
                  <p className={`text-[11px] mt-1 flex items-center gap-1 ${urgencyColor}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    Noch {days} {days === 1 ? 'Tag' : 'Tage'}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <TenderDrawer
        tender={selectedTender}
        allMatches={allMatches}
        open={!!selectedTender}
        onOpenChange={open => { if (!open) setSelectedTender(null) }}
      />
    </>
  )
}
