'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TenderDrawer } from '@/components/tenders/TenderDrawer'
import { SearchBar } from '@/components/filters/SearchBar'
import { StatusFilter } from '@/components/filters/StatusFilter'
import { UrgencyBadge } from '@/components/tenders/UrgencyBadge'
import { Button } from '@/components/ui/button'
import { formatDeadline, computeUrgency } from '@/lib/utils'
import { Download, Trash2 } from 'lucide-react'
import type { DashboardRow } from '@/lib/types'

interface CompanyTenderListProps {
  tenders: DashboardRow[]
}

export function CompanyTenderList({ tenders }: CompanyTenderListProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedTender, setSelectedTender] = useState<DashboardRow | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

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

  const allFilteredIds = new Set(filtered.map(t => t.tender_id))
  const allSelected = filtered.length > 0 && filtered.every(t => selected.has(t.tender_id))

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        for (const id of allFilteredIds) next.delete(id)
        return next
      })
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        for (const id of allFilteredIds) next.add(id)
        return next
      })
    }
  }

  async function handleDelete() {
    if (selected.size === 0) return
    setDeleting(true)
    try {
      const res = await fetch('/api/tenders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      if (res.ok) {
        setSelected(new Set())
        router.refresh()
      }
    } finally {
      setDeleting(false)
    }
  }

  async function handleExportSelected() {
    if (selected.size === 0) return
    setExporting(true)
    try {
      const selectedTenders = tenders.filter(t => selected.has(t.tender_id))
      const { generateCompanyPdf } = await import('@/lib/pdf-generator')
      const companyName = selectedTenders[0]?.company_name ?? 'Ausgewählte'
      const doc = await generateCompanyPdf(companyName, selectedTenders)
      const today = new Date().toISOString().slice(0, 10)
      doc.save(`VOB_${companyName.replace(/\s+/g, '_')}_Auswahl_${today}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="flex gap-3 items-center flex-wrap">
          <StatusFilter value={status} onChange={setStatus} />
          <SearchBar value={search} onChange={setSearch} placeholder="Suchen..." />
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <>
              <span className="text-[11px] text-neutral-500 tabular-nums">{selected.size} ausgewählt</span>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] text-neutral-500 border-neutral-200"
                onClick={handleExportSelected}
                disabled={exporting}
              >
                <Download size={12} className="mr-1" />
                {exporting ? '...' : 'PDF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 size={12} className="mr-1" />
                {deleting ? '...' : 'Löschen'}
              </Button>
            </>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[12px] text-neutral-400 py-12 text-center">
          Keine passenden Ausschreibungen.
        </p>
      ) : (
        <div className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-neutral-300 accent-neutral-900 w-3.5 h-3.5"
                  />
                </th>
                <th className="text-left text-[11px] text-neutral-400 font-medium px-3 py-2">Titel</th>
                <th className="text-left text-[11px] text-neutral-400 font-medium px-3 py-2">Auftraggeber</th>
                <th className="text-left text-[11px] text-neutral-400 font-medium px-3 py-2">Frist</th>
                <th className="text-left text-[11px] text-neutral-400 font-medium px-3 py-2">Gewerk</th>
                <th className="text-left text-[11px] text-neutral-400 font-medium px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tender, i) => {
                const urgency = tender.urgency || computeUrgency(tender.deadline_date)
                return (
                  <tr
                    key={`${tender.tender_id}-${i}`}
                    className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(tender.tender_id)}
                        onChange={() => toggleSelect(tender.tender_id)}
                        className="rounded border-neutral-300 accent-neutral-900 w-3.5 h-3.5"
                      />
                    </td>
                    <td
                      className="text-[12px] max-w-xs px-3 py-2 cursor-pointer"
                      onClick={() => setSelectedTender(tender)}
                    >
                      <span className="line-clamp-1 text-neutral-800">{tender.title}</span>
                    </td>
                    <td
                      className="text-[11px] text-neutral-400 px-3 py-2 cursor-pointer"
                      onClick={() => setSelectedTender(tender)}
                    >
                      {tender.authority ?? '—'}
                    </td>
                    <td
                      className="text-[11px] text-neutral-500 px-3 py-2 cursor-pointer"
                      onClick={() => setSelectedTender(tender)}
                    >
                      {formatDeadline(tender.deadline_date)}
                    </td>
                    <td
                      className="text-[11px] text-neutral-400 px-3 py-2 cursor-pointer"
                      onClick={() => setSelectedTender(tender)}
                    >
                      {tender.category ?? '—'}
                    </td>
                    <td
                      className="px-3 py-2 cursor-pointer"
                      onClick={() => setSelectedTender(tender)}
                    >
                      <UrgencyBadge urgency={urgency} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <TenderDrawer
        tender={selectedTender}
        allMatches={allMatches}
        open={!!selectedTender}
        onOpenChange={open => { if (!open) setSelectedTender(null) }}
        onDelete={() => router.refresh()}
      />
    </>
  )
}
