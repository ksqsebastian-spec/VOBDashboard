'use client'

import { formatDate } from '@/lib/utils'
import type { VobScan } from '@/lib/types'

interface HeaderProps {
  latestScan?: VobScan | null
}

export function Header({ latestScan }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold text-[#1E293B] lg:hidden">
          VOB Monitor
        </h1>
        <div className="flex items-center gap-4 text-sm text-[#64748B]">
          {latestScan ? (
            <span>
              Letzter Scan: <strong className="text-[#1E293B]">KW {latestScan.calendar_week}</strong>{' '}
              ({formatDate(latestScan.scan_date)})
            </span>
          ) : (
            <span>Kein Scan vorhanden</span>
          )}
        </div>
      </div>
    </header>
  )
}
