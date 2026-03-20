'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
    <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 border-b border-slate-200/80">
            <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Titel</TableHead>
            <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Auftraggeber</TableHead>
            <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Frist</TableHead>
            <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Gewerk</TableHead>
            <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Unternehmen</TableHead>
            <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-slate-400 py-12">
                Keine Ausschreibungen gefunden.
              </TableCell>
            </TableRow>
          )}
          {tenders.map((tender, i) => {
            const urgency = tender.urgency || computeUrgency(tender.deadline_date)
            const isNew = latestScanDate && tender.scan_date === latestScanDate
            const hasMatch = !!tender.company_slug

            return (
              <TableRow
                key={`${tender.tender_id}-${i}`}
                className={`cursor-pointer hover:bg-slate-50/80 transition-colors ${!hasMatch ? 'opacity-50' : ''}`}
                onClick={() => onRowClick?.(tender)}
              >
                <TableCell className="text-sm max-w-xs">
                  <div className="flex items-center gap-2">
                    {hasMatch && tender.company_color && (
                      <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: tender.company_color }} />
                    )}
                    <span className="line-clamp-1 font-medium text-slate-800">{tender.title}</span>
                    {isNew && <NewBadge />}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{tender.authority ?? '—'}</TableCell>
                <TableCell className="text-xs text-slate-600">{formatDeadline(tender.deadline_date)}</TableCell>
                <TableCell className="text-xs text-slate-500">{tender.category ?? '—'}</TableCell>
                <TableCell className="text-xs">
                  {tender.company_name ? (
                    <Badge variant="outline" className="text-[10px] border-slate-200" style={{ borderColor: tender.company_color ?? undefined }}>
                      {tender.company_name}
                    </Badge>
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
