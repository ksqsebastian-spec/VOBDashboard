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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8FAFC]">
            <TableHead className="text-xs">Titel</TableHead>
            <TableHead className="text-xs">Auftraggeber</TableHead>
            <TableHead className="text-xs">Frist</TableHead>
            <TableHead className="text-xs">Gewerk</TableHead>
            <TableHead className="text-xs">Unternehmen</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-[#94A3B8] py-8">
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
                className={`cursor-pointer hover:bg-[#F8FAFC] ${!hasMatch ? 'opacity-60' : ''}`}
                onClick={() => onRowClick?.(tender)}
              >
                <TableCell className="text-sm max-w-xs">
                  <div className="flex items-center gap-1.5">
                    {hasMatch && tender.company_color && (
                      <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: tender.company_color }} />
                    )}
                    <span className="line-clamp-1">{tender.title}</span>
                    {isNew && <NewBadge />}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-[#64748B]">{tender.authority ?? '—'}</TableCell>
                <TableCell className="text-xs">{formatDeadline(tender.deadline_date)}</TableCell>
                <TableCell className="text-xs">{tender.category ?? '—'}</TableCell>
                <TableCell className="text-xs">
                  {tender.company_name ? (
                    <Badge variant="outline" className="text-[10px]" style={{ borderColor: tender.company_color ?? undefined }}>
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
