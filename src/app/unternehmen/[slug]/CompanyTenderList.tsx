'use client'

import { useState, useMemo } from 'react'
import { TenderCard } from '@/components/tenders/TenderCard'
import { TenderTable } from '@/components/tenders/TenderTable'
import { TenderDrawer } from '@/components/tenders/TenderDrawer'
import { SearchBar } from '@/components/filters/SearchBar'
import { StatusFilter } from '@/components/filters/StatusFilter'
import type { DashboardRow } from '@/lib/types'

interface CompanyTenderListProps {
  tenders: DashboardRow[]
}

export function CompanyTenderList({ tenders }: CompanyTenderListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [selectedTender, setSelectedTender] = useState<DashboardRow | null>(null)

  const filtered = useMemo(() => {
    let result = tenders
    if (status === 'active') result = result.filter(t => t.status === 'active')
    if (status === 'expired') result = result.filter(t => t.status === 'expired')
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.authority?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [tenders, status, search])

  const allMatches = selectedTender
    ? tenders.filter(t => t.tender_id === selectedTender.tender_id)
    : []

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="flex gap-3 items-center flex-wrap">
          <StatusFilter value={status} onChange={setStatus} />
          <SearchBar value={search} onChange={setSearch} placeholder="Suchen..." />
        </div>
        <div className="flex gap-px bg-neutral-100 rounded-lg p-px">
          <button
            onClick={() => setView('cards')}
            className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
              view === 'cards' ? 'bg-white text-neutral-900 shadow-sm font-medium' : 'text-neutral-400'
            }`}
          >
            Karten
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
              view === 'table' ? 'bg-white text-neutral-900 shadow-sm font-medium' : 'text-neutral-400'
            }`}
          >
            Tabelle
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[12px] text-neutral-400 py-12 text-center">
          Keine passenden Ausschreibungen.
        </p>
      ) : view === 'cards' ? (
        <div className="space-y-2">
          {filtered.map((tender, i) => (
            <TenderCard
              key={`${tender.tender_id}-${i}`}
              tender={tender}
              onClick={() => setSelectedTender(tender)}
            />
          ))}
        </div>
      ) : (
        <TenderTable
          tenders={filtered}
          onRowClick={tender => setSelectedTender(tender)}
        />
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
