'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Clock,
} from 'lucide-react'
import type { Company } from '@/lib/types'

interface SidebarProps {
  companies: Company[]
  matchCounts?: Record<string, number>
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alle', label: 'Alle Ausschreibungen', icon: FileText },
]

function CompanyIcon({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <span
      className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}

export function Sidebar({ companies, matchCounts = {} }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-b from-[#0B1929] to-[#0D1F33] text-white z-40">
      {/* Brand */}
      <div className="flex items-center h-16 px-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-shadow group-hover:shadow-blue-500/40">
            <span className="text-white font-black text-sm">GW</span>
          </div>
          <span className="font-bold text-white text-[15px] tracking-[-0.01em]">VOB Monitor</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3">
        {/* Main nav */}
        <div className="space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all duration-200 relative',
                  isActive
                    ? 'bg-white/[0.12] text-white font-medium'
                    : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-400 rounded-r-full" />
                )}
                <Icon size={17} strokeWidth={isActive ? 2 : 1.5} className={cn('transition-colors', isActive ? 'text-blue-400' : '')} />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Companies section */}
        <div className="mt-7">
          <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">
            Unternehmen
          </p>
          <div className="space-y-0.5">
            {companies.map(company => {
              const href = `/unternehmen/${company.slug}`
              const isActive = pathname === href
              const count = matchCounts[company.slug] || 0
              return (
                <Link
                  key={company.slug}
                  href={href}
                  className={cn(
                    'flex items-center justify-between px-2 py-1.5 text-[13px] rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-white/[0.12] text-white font-medium'
                      : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full" style={{ backgroundColor: company.color }} />
                  )}
                  <span className="flex items-center gap-2.5 truncate">
                    <CompanyIcon name={company.name} color={company.color} />
                    <span className="truncate">{company.name}</span>
                  </span>
                  {count > 0 && (
                    <span className="ml-2 text-[10px] font-semibold bg-white/10 text-white/70 px-2 py-0.5 rounded-full tabular-nums">
                      {count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <Link
            href="/verlauf"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all duration-200 relative',
              pathname === '/verlauf'
                ? 'bg-white/[0.12] text-white font-medium'
                : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
            )}
          >
            {pathname === '/verlauf' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-400 rounded-r-full" />
            )}
            <Clock size={17} strokeWidth={pathname === '/verlauf' ? 2 : 1.5} className={pathname === '/verlauf' ? 'text-blue-400' : ''} />
            Verlauf
          </Link>
        </div>
      </nav>

      {/* Bottom subtle gradient fade */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </aside>
  )
}
