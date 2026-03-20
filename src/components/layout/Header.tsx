'use client'

import { formatDate } from '@/lib/utils'
import { Radio, CalendarDays } from 'lucide-react'
import type { VobScan } from '@/lib/types'

interface HeaderProps {
  latestScan?: VobScan | null
}

export function Header({ latestScan }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-14 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-base font-semibold text-slate-800 lg:hidden">
          VOB Monitor
        </h1>
        <div className="flex items-center gap-4 text-sm">
          {latestScan ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays size={14} />
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Letzter Scan</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                <span className="font-semibold text-slate-800 text-sm">KW {latestScan.calendar_week}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 text-xs">{formatDate(latestScan.scan_date)}</span>
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <Radio size={14} />
              <span className="text-xs">Kein Scan vorhanden</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
