'use client'

import { useState, useMemo } from 'react'
import { TenderCard } from '@/components/tenders/TenderCard'
import { TenderTable } from '@/components/tenders/TenderTable'
import { TenderDrawer } from '@/components/tenders/TenderDrawer'
import { SearchBar } from '@/components/filters/SearchBar'
import { StatusFilter } from '@/components/filters/StatusFilter'
import { LayoutGrid, List, FileSearch } from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <StatusFilter value={status} onChange={setStatus} />
          <SearchBar value={search} onChange={setSearch} placeholder="Ausschreibungen suchen..." />
        </div>
        <div className="flex gap-0.5 bg-slate-100 rounded-xl p-0.5">
          <button
            onClick={() => setView('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-150 ${
              view === 'cards' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid size={13} />
            Karten
          </button>
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-150 ${
              view === 'table' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List size={13} />
            Tabelle
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <FileSearch size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Aktuell keine passenden Ausschreibungen.</p>
        </div>
      ) : view === 'cards' ? (
        <div className="space-y-3">
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
