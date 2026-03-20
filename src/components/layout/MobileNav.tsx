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
        <SheetTrigger className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 bg-gradient-to-br from-[#0B1929] to-[#132D4A] text-white shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 flex items-center justify-center transition-all duration-200 active:scale-95">
          <Menu size={19} />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-[#0B1929] to-[#0D1F33] text-white border-none">
          <div className="flex items-center h-16 px-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-black text-xs">GW</span>
              </div>
              <span className="font-bold text-white text-sm tracking-tight">VOB Monitor</span>
            </div>
          </div>
          <nav className="py-5 px-3">
            <div className="space-y-0.5">
              {[
                { href: '/', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/alle', label: 'Alle Ausschreibungen', icon: FileText },
              ].map(item => {
                const Icon = item.icon
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all relative',
                      isActive
                        ? 'bg-white/[0.12] text-white font-medium'
                        : 'text-white/50 hover:bg-white/[0.06]'
                    )}
                  >
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-400 rounded-r-full" />}
                    <Icon size={17} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-blue-400' : ''} />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="my-5 border-t border-white/[0.06]" />
            <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">
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
                      'flex items-center justify-between px-2 py-1.5 text-[13px] rounded-lg transition-all relative',
                      pathname === href
                        ? 'bg-white/[0.12] text-white font-medium'
                        : 'text-white/50 hover:bg-white/[0.06]'
                    )}
                  >
                    {pathname === href && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full" style={{ backgroundColor: company.color }} />
                    )}
                    <span className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: company.color }}
                      >
                        {initials}
                      </span>
                      <span className="truncate">{company.name}</span>
                    </span>
                    {count > 0 && (
                      <span className="text-[10px] font-semibold bg-white/10 text-white/70 px-2 py-0.5 rounded-full tabular-nums">{count}</span>
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="my-5 border-t border-white/[0.06]" />
            <Link
              href="/verlauf"
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all relative',
                pathname === '/verlauf'
                  ? 'bg-white/[0.12] text-white font-medium'
                  : 'text-white/50 hover:bg-white/[0.06]'
              )}
            >
              {pathname === '/verlauf' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-400 rounded-r-full" />}
              <Clock size={17} strokeWidth={pathname === '/verlauf' ? 2 : 1.5} className={pathname === '/verlauf' ? 'text-blue-400' : ''} />
              Verlauf
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
