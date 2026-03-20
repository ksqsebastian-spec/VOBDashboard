'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UrgencyBadge } from './UrgencyBadge'
import { formatDeadline, daysUntilDeadline, getRelevanceBgClass, computeUrgency } from '@/lib/utils'
import { ExternalLink, Download } from 'lucide-react'
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
      <SheetContent className="w-full sm:max-w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-[14px] leading-snug pr-6 text-neutral-900 font-semibold">
            {tender.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-2">
            <UrgencyBadge urgency={urgency} />
            {tender.category && (
              <Badge variant="outline" className="text-[10px] text-neutral-500 border-neutral-200">{tender.category}</Badge>
            )}
          </div>

          <div className="space-y-3 text-[12px]">
            {tender.authority && (
              <div>
                <p className="text-[10px] text-neutral-400 mb-0.5">Auftraggeber</p>
                <p className="text-neutral-700">{tender.authority}</p>
              </div>
            )}
            {tender.deadline && (
              <div>
                <p className="text-[10px] text-neutral-400 mb-0.5">Abgabefrist</p>
                <p className="text-neutral-700">
                  {tender.deadline}
                  {days !== null && days >= 0 && (
                    <span className={days <= 7 ? ' text-red-500' : ' text-neutral-400'}>
                      {' '}({days}d)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <a href={tender.url} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-[12px]">
              <ExternalLink size={13} className="mr-1.5" />
              Auf hamburg.de öffnen
            </Button>
          </a>

          <div className="h-px bg-neutral-100" />

          {allMatches.length > 0 && (
            <div>
              <p className="text-[10px] text-neutral-400 mb-2">Zugeordnete Unternehmen</p>
              <div className="space-y-2">
                {allMatches.map((match, i) => (
                  match.company_name && (
                    <div key={i} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: match.company_color ?? '#a3a3a3' }} />
                        <span className="text-[12px] font-medium text-neutral-700">{match.company_name}</span>
                        {match.relevance && (
                          <Badge variant="outline" className={`text-[10px] ${getRelevanceBgClass(match.relevance)}`}>
                            {match.relevance}
                          </Badge>
                        )}
                      </div>
                      {match.reason && (
                        <p className="text-[11px] text-neutral-400 pl-4">{match.reason}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {tender.reason && allMatches.length === 0 && (
            <div>
              <p className="text-[10px] text-neutral-400 mb-1">Match-Begründung</p>
              <p className="text-[12px] text-neutral-500">{tender.reason}</p>
            </div>
          )}

          <div className="h-px bg-neutral-100" />

          <Button
            variant="outline"
            className="w-full text-[12px] text-neutral-600 border-neutral-200"
            onClick={async () => {
              const { generateSingleTenderPdf } = await import('@/lib/pdf-generator')
              const doc = await generateSingleTenderPdf(tender, allMatches)
              const today = new Date().toISOString().slice(0, 10)
              doc.save(`VOB_Tender_${tender.tender_id}_${today}.pdf`)
            }}
          >
            <Download size={13} className="mr-1.5" />
            PDF exportieren
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
