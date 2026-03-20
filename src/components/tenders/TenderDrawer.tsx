'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UrgencyBadge } from './UrgencyBadge'
import { formatDeadline, daysUntilDeadline, getRelevanceBgClass, computeUrgency } from '@/lib/utils'
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
          <SheetTitle className="text-left text-base leading-snug pr-6">
            {tender.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <UrgencyBadge urgency={urgency} />
            {tender.category && (
              <Badge variant="outline">{tender.category}</Badge>
            )}
          </div>

          <div className="space-y-3">
            {tender.authority && (
              <div>
                <p className="text-xs text-[#94A3B8] mb-0.5">Auftraggeber</p>
                <p className="text-sm text-[#1E293B]">{tender.authority}</p>
              </div>
            )}
            {tender.deadline && (
              <div>
                <p className="text-xs text-[#94A3B8] mb-0.5">Abgabefrist</p>
                <p className="text-sm text-[#1E293B]">
                  {tender.deadline}
                  {days !== null && days >= 0 && (
                    <span className={days <= 7 ? ' text-red-600 font-medium' : ' text-[#64748B]'}>
                      {' '}(noch {days} {days === 1 ? 'Tag' : 'Tage'})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <a
            href={tender.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#1F4E79] hover:bg-[#163A5C]">
              Auf hamburg.de öffnen
            </Button>
          </a>

          <Separator />

          {allMatches.length > 0 && (
            <div>
              <p className="text-xs text-[#94A3B8] mb-2">Zugeordnete Unternehmen</p>
              <div className="space-y-2">
                {allMatches.map((match, i) => (
                  match.company_name && (
                    <div key={i} className="p-2 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: match.company_color ?? '#94A3B8' }} />
                        <span className="text-sm font-medium text-[#1E293B]">{match.company_name}</span>
                        {match.relevance && (
                          <Badge variant="outline" className={`text-[10px] ${getRelevanceBgClass(match.relevance)}`}>
                            {match.relevance}
                          </Badge>
                        )}
                      </div>
                      {match.reason && (
                        <p className="text-xs text-[#64748B] pl-4">{match.reason}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {tender.reason && allMatches.length === 0 && (
            <div>
              <p className="text-xs text-[#94A3B8] mb-1">Match-Begründung</p>
              <p className="text-sm text-[#64748B]">{tender.reason}</p>
            </div>
          )}

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              const { generateSingleTenderPdf } = await import('@/lib/pdf-generator')
              const doc = await generateSingleTenderPdf(tender, allMatches)
              const today = new Date().toISOString().slice(0, 10)
              doc.save(`VOB_Tender_${tender.tender_id}_${today}.pdf`)
            }}
          >
            PDF exportieren
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
