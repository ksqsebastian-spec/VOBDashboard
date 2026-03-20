'use client'

import { useState } from 'react'
import { TenderCard } from '@/components/tenders/TenderCard'
import { TenderDrawer } from '@/components/tenders/TenderDrawer'
import type { DashboardRow } from '@/lib/types'

interface RecentFeedProps {
  tenders: DashboardRow[]
  latestScanDate?: string | null
}

export function RecentFeed({ tenders, latestScanDate }: RecentFeedProps) {
  const [selectedTender, setSelectedTender] = useState<DashboardRow | null>(null)

  // Deduplicate by tender_id, keeping first occurrence
  const seen = new Set<string>()
  const uniqueTenders = tenders.filter(t => {
    if (seen.has(t.tender_id)) return false
    seen.add(t.tender_id)
    return true
  }).slice(0, 10)

  // Get all matches for selected tender
  const allMatches = selectedTender
    ? tenders.filter(t => t.tender_id === selectedTender.tender_id)
    : []

  return (
    <>
      <div className="space-y-3">
        {uniqueTenders.length === 0 && (
          <p className="text-sm text-[#94A3B8] py-8 text-center">
            Noch keine Ausschreibungen vorhanden.
          </p>
        )}
        {uniqueTenders.map(tender => (
          <TenderCard
            key={tender.tender_id}
            tender={tender}
            isNew={!!latestScanDate && tender.scan_date === latestScanDate}
            onClick={() => setSelectedTender(tender)}
          />
        ))}
      </div>

      <TenderDrawer
        tender={selectedTender}
        allMatches={allMatches}
        open={!!selectedTender}
        onOpenChange={open => { if (!open) setSelectedTender(null) }}
      />
    </>
  )
}
