'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UrgencyBadge } from './UrgencyBadge'
import { NewBadge } from './NewBadge'
import { formatDeadline, computeUrgency } from '@/lib/utils'
import type { DashboardRow } from '@/lib/types'

interface TenderTableProps {
  tenders: DashboardRow[]
  latestScanDate?: string | null
  onRowClick?: (tender: DashboardRow) => void
}

export function TenderTable({ tenders, latestScanDate, onRowClick }: TenderTableProps) {
  return (
    <div className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="text-[11px] text-neutral-400 font-medium">Titel</TableHead>
            <TableHead className="text-[11px] text-neutral-400 font-medium">Auftraggeber</TableHead>
            <TableHead className="text-[11px] text-neutral-400 font-medium">Frist</TableHead>
            <TableHead className="text-[11px] text-neutral-400 font-medium">Gewerk</TableHead>
            <TableHead className="text-[11px] text-neutral-400 font-medium">Unternehmen</TableHead>
            <TableHead className="text-[11px] text-neutral-400 font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-[12px] text-neutral-400 py-12">
                Keine Ausschreibungen gefunden.
              </TableCell>
            </TableRow>
          )}
          {tenders.map((tender, i) => {
            const urgency = tender.urgency || computeUrgency(tender.deadline_date)
            const isNew = latestScanDate && tender.scan_date === latestScanDate

            return (
              <TableRow
                key={`${tender.tender_id}-${i}`}
                className="cursor-pointer border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                onClick={() => onRowClick?.(tender)}
              >
                <TableCell className="text-[12px] max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-1 text-neutral-800">{tender.title}</span>
                    {isNew && <NewBadge />}
                  </div>
                </TableCell>
                <TableCell className="text-[11px] text-neutral-400">{tender.authority ?? '—'}</TableCell>
                <TableCell className="text-[11px] text-neutral-500">{formatDeadline(tender.deadline_date)}</TableCell>
                <TableCell className="text-[11px] text-neutral-400">{tender.category ?? '—'}</TableCell>
                <TableCell className="text-[11px]">
                  {tender.company_name ? (
                    <span className="flex items-center gap-1.5 text-neutral-500">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tender.company_color ?? '#a3a3a3' }} />
                      {tender.company_name}
                    </span>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <UrgencyBadge urgency={urgency} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
