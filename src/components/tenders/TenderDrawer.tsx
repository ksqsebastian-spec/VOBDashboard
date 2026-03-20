'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UrgencyBadge } from './UrgencyBadge'
import { formatDeadline, daysUntilDeadline, getRelevanceBgClass, computeUrgency } from '@/lib/utils'
import { ExternalLink, Download, Building, Calendar } from 'lucide-react'
import type { DashboardRow } from '@/lib/types'

interface TenderDrawerProps {
  tender: DashboardRow | null
  allMatches?: DashboardRow[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TenderDrawer({ tender, allMatches = [], open, onOpenChange }: TenderDrawerProps) {
  if (!tender) return null

  const urgency = tender.urgency || computeUrgency(tender.deadline_date)
  const days = daysUntilDeadline(tender.deadline_date)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-base leading-snug pr-6 text-slate-900">
            {tender.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <UrgencyBadge urgency={urgency} />
            {tender.category && (
              <Badge variant="outline" className="border-slate-200 text-slate-500">{tender.category}</Badge>
            )}
          </div>

          <div className="space-y-3">
            {tender.authority && (
              <div className="flex items-start gap-2">
                <Building size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Auftraggeber</p>
                  <p className="text-sm text-slate-800">{tender.authority}</p>
                </div>
              </div>
            )}
            {tender.deadline && (
              <div className="flex items-start gap-2">
                <Calendar size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Abgabefrist</p>
                  <p className="text-sm text-slate-800">
                    {tender.deadline}
                    {days !== null && days >= 0 && (
                      <span className={`ml-1 ${days <= 7 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                        (noch {days} {days === 1 ? 'Tag' : 'Tage'})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          <a
            href={tender.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#0B1929] hover:bg-[#132D4A] rounded-xl">
              <ExternalLink size={14} className="mr-2" />
              Auf hamburg.de öffnen
            </Button>
          </a>

          <Separator className="bg-slate-100" />

          {allMatches.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-2">Zugeordnete Unternehmen</p>
              <div className="space-y-2">
                {allMatches.map((match, i) => (
                  match.company_name && (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: match.company_color ?? '#94A3B8' }}
                        >
                          {match.company_name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{match.company_name}</span>
                        {match.relevance && (
                          <Badge variant="outline" className={`text-[10px] ${getRelevanceBgClass(match.relevance)}`}>
                            {match.relevance}
                          </Badge>
                        )}
                      </div>
                      {match.reason && (
                        <p className="text-xs text-slate-500 pl-8">{match.reason}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {tender.reason && allMatches.length === 0 && (
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-1">Match-Begründung</p>
              <p className="text-sm text-slate-600">{tender.reason}</p>
            </div>
          )}

          <Separator className="bg-slate-100" />

          <Button
            variant="outline"
            className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={async () => {
              const { generateSingleTenderPdf } = await import('@/lib/pdf-generator')
              const doc = await generateSingleTenderPdf(tender, allMatches)
              const today = new Date().toISOString().slice(0, 10)
              doc.save(`VOB_Tender_${tender.tender_id}_${today}.pdf`)
            }}
          >
            <Download size={14} className="mr-2" />
            PDF exportieren
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
