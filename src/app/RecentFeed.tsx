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

  const seen = new Set<string>()
  const uniqueTenders = tenders.filter(t => {
    if (seen.has(t.tender_id)) return false
    seen.add(t.tender_id)
    return true
  }).slice(0, 8)

  const allMatches = selectedTender
    ? tenders.filter(t => t.tender_id === selectedTender.tender_id)
    : []

  return (
    <>
      <div className="relative">
        {/* Timeline line */}
        {uniqueTenders.length > 1 && (
          <div className="absolute left-[18px] top-6 bottom-6 w-px bg-gradient-to-b from-slate-200 via-slate-200/60 to-transparent" />
        )}

        <div className="space-y-0.5">
          {uniqueTenders.length === 0 && (
            <div className="py-8 text-center">
              <FileText size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Noch keine Ausschreibungen.</p>
            </div>
          )}
          {uniqueTenders.map(tender => {
            const isNew = !!latestScanDate && tender.scan_date === latestScanDate
            const days = daysUntilDeadline(tender.deadline_date)
            const urgencyColor = days !== null && days <= 7 ? 'text-red-500' : days !== null && days <= 14 ? 'text-amber-500' : 'text-emerald-500'
            const dotColor = days !== null && days <= 7 ? 'bg-red-400' : days !== null && days <= 14 ? 'bg-amber-400' : 'bg-emerald-400'

            return (
              <button
                key={tender.tender_id}
                onClick={() => setSelectedTender(tender)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200 group flex items-start gap-3 relative"
              >
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105 relative z-10"
                  style={{
                    backgroundColor: tender.company_color ? `${tender.company_color}12` : '#F8FAFC',
                    color: tender.company_color || '#94A3B8',
                  }}
                >
                  <FileText size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-semibold text-slate-700 line-clamp-1 group-hover:text-slate-900 transition-colors tracking-tight">
                      {tender.title}
                    </p>
                    {isNew && (
                      <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-[4px] flex-shrink-0 uppercase tracking-wider">
                        Neu
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{tender.company_name || 'Unbekannt'}</p>
                  {days !== null && days >= 0 && (
                    <p className={`text-[10px] mt-1 flex items-center gap-1 ${urgencyColor}`}>
                      <span className={`inline-block w-1 h-1 rounded-full ${dotColor}`} />
                      Noch {days} {days === 1 ? 'Tag' : 'Tage'}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
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
