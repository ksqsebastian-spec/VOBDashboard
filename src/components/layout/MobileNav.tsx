'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { Company } from '@/lib/types'
import { useState } from 'react'

interface MobileNavProps {
  companies: Company[]
  matchCounts?: Record<string, number>
}

export function MobileNav({ companies, matchCounts = {} }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 bg-[#1F4E79] text-white shadow-lg hover:bg-[#163A5C] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex items-center h-16 px-6 border-b border-border">
            <span className="font-semibold text-[#1E293B]">VOB Monitor</span>
          </div>
          <nav className="py-4 px-3 space-y-1">
            <Link href="/" onClick={() => setOpen(false)} className={cn('block px-3 py-2 text-sm rounded-md', pathname === '/' ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium' : 'text-[#64748B]')}>
              Übersicht
            </Link>
            <Link href="/alle" onClick={() => setOpen(false)} className={cn('block px-3 py-2 text-sm rounded-md', pathname === '/alle' ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium' : 'text-[#64748B]')}>
              Alle Ausschreibungen
            </Link>

            <div className="my-3 border-t border-border" />
            <p className="px-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Unternehmen</p>
            {companies.map(company => {
              const href = `/unternehmen/${company.slug}`
              const count = matchCounts[company.slug] || 0
              return (
                <Link
                  key={company.slug}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn('flex items-center justify-between px-3 py-2 text-sm rounded-md', pathname === href ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium' : 'text-[#64748B]')}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: company.color }} />
                    <span className="truncate">{company.name}</span>
                  </span>
                  {count > 0 && (
                    <span className="text-xs bg-[#F1F5F9] px-1.5 py-0.5 rounded-full">{count}</span>
                  )}
                </Link>
              )
            })}

            <div className="my-3 border-t border-border" />
            <Link href="/verlauf" onClick={() => setOpen(false)} className={cn('block px-3 py-2 text-sm rounded-md', pathname === '/verlauf' ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium' : 'text-[#64748B]')}>
              Verlauf
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
