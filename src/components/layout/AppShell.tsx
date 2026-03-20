'use client'

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import type { Company } from '@/lib/types'

interface AppShellProps {
  companies: Company[]
  matchCounts?: Record<string, number>
  children: React.ReactNode
}

export function AppShell({ companies, matchCounts, children }: AppShellProps) {
  return (
    <>
      <Sidebar companies={companies} matchCounts={matchCounts} />
      <MobileNav companies={companies} matchCounts={matchCounts} />
      <div className="lg:pl-64">
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/80">
          {children}
        </main>
      </div>
    </>
  )
}
