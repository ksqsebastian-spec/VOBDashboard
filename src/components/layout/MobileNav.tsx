'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LayoutDashboard, FileText, Clock, Menu } from 'lucide-react'
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
        <SheetTrigger className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 bg-[#0B1929] text-white shadow-xl hover:bg-[#132D4A] flex items-center justify-center transition-colors">
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-[#0B1929] text-white border-none">
          <div className="flex items-center h-16 px-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">GW</span>
              </div>
              <span className="font-bold text-white text-sm">VOB Monitor</span>
            </div>
          </div>
          <nav className="py-5 px-3">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all',
                  pathname === '/'
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/60 hover:bg-white/8'
                )}
              >
                <LayoutDashboard size={18} className={pathname === '/' ? 'text-blue-400' : ''} />
                Dashboard
              </Link>
              <Link
                href="/alle"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all',
                  pathname === '/alle'
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/60 hover:bg-white/8'
                )}
              >
                <FileText size={18} className={pathname === '/alle' ? 'text-blue-400' : ''} />
                Alle Ausschreibungen
              </Link>
            </div>

            <div className="my-5 border-t border-white/10" />
            <p className="px-3 text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-3">
              Unternehmen
            </p>
            <div className="space-y-0.5">
              {companies.map(company => {
                const href = `/unternehmen/${company.slug}`
                const count = matchCounts[company.slug] || 0
                const initials = company.name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
                return (
                  <Link
                    key={company.slug}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-all',
                      pathname === href
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/60 hover:bg-white/8'
                    )}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: company.color }}
                      >
                        {initials}
                      </span>
                      <span className="truncate text-[13px]">{company.name}</span>
                    </span>
                    {count > 0 && (
                      <span className="text-[10px] font-semibold bg-white/15 text-white/80 px-2 py-0.5 rounded-full">{count}</span>
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="my-5 border-t border-white/10" />
            <Link
              href="/verlauf"
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all',
                pathname === '/verlauf'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:bg-white/8'
              )}
            >
              <Clock size={18} className={pathname === '/verlauf' ? 'text-blue-400' : ''} />
              Verlauf
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
