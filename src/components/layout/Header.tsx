'use client'

import { formatDate } from '@/lib/utils'
import { Radio, CalendarDays } from 'lucide-react'
import type { VobScan } from '@/lib/types'

interface HeaderProps {
  latestScan?: VobScan | null
}

export function Header({ latestScan }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center px-6 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
      {/* Subtle gradient glow at bottom */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

      <div className="flex items-center justify-between w-full">
        <h1 className="text-sm font-semibold text-slate-800 lg:hidden tracking-tight">
          VOB Monitor
        </h1>
        <div className="flex items-center gap-4 text-sm ml-auto">
          {latestScan ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 hidden sm:inline">
                Letzter Scan
              </span>
              <div className="flex items-center gap-2 bg-slate-50/80 border border-slate-200/60 rounded-full px-3.5 py-1.5">
                <span className="font-semibold text-slate-800 text-xs tracking-tight">KW {latestScan.calendar_week}</span>
                <span className="text-slate-300 text-xs">·</span>
                <span className="text-slate-500 text-[11px]">{formatDate(latestScan.scan_date)}</span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <Radio size={13} />
              <span className="text-[11px]">Kein Scan vorhanden</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
