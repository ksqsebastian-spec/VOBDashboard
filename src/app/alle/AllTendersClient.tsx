'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TenderTable } from '@/components/tenders/TenderTable'
import { TenderDrawer } from '@/components/tenders/TenderDrawer'
import { SearchBar } from '@/components/filters/SearchBar'
import { Button } from '@/components/ui/button'
import type { DashboardRow } from '@/lib/types'

interface AllTendersClientProps {
  tenders: DashboardRow[]
  total: number
  page: number
}

export function AllTendersClient({ tenders, total, page }: AllTendersClientProps) {
  const [search, setSearch] = useState('')
  const [selectedTender, setSelectedTender] = useState<DashboardRow | null>(null)

  const pageSize = 50
  const totalPages = Math.ceil(total / pageSize)

  const filtered = search
    ? tenders.filter(t => {
        const q = search.toLowerCase()
        return (
          t.title.toLowerCase().includes(q) ||
          t.authority?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.company_name?.toLowerCase().includes(q)
        )
      })
    : tenders

  const allMatches = selectedTender
    ? tenders.filter(t => t.tender_id === selectedTender.tender_id)
    : []

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Suchen..." />
        <p className="text-[11px] text-neutral-400 whitespace-nowrap tabular-nums">{total} Ergebnisse</p>
      </div>

      <TenderTable
        tenders={filtered}
        onRowClick={tender => setSelectedTender(tender)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {page > 1 && (
            <Link href={`/alle?page=${page - 1}`}>
              <Button variant="outline" size="sm" className="text-[11px] text-neutral-500 border-neutral-200">Zurück</Button>
            </Link>
          )}
          <span className="text-[11px] text-neutral-400 tabular-nums">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/alle?page=${page + 1}`}>
              <Button variant="outline" size="sm" className="text-[11px] text-neutral-500 border-neutral-200">Weiter</Button>
            </Link>
          )}
        </div>
      )}

      <TenderDrawer
        tender={selectedTender}
        allMatches={allMatches}
        open={!!selectedTender}
        onOpenChange={open => { if (!open) setSelectedTender(null) }}
      />
    </>
  )
}
