'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Company } from '@/lib/types'

interface SidebarProps {
  companies: Company[]
  matchCounts?: Record<string, number>
}

export function Sidebar({ companies, matchCounts = {} }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Übersicht' },
    { href: '/alle', label: 'Alle Ausschreibungen' },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 border-r border-border bg-white">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1F4E79] flex items-center justify-center">
            <span className="text-white font-bold text-sm">GW</span>
          </div>
          <span className="font-semibold text-[#1E293B]">VOB Monitor</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="my-4 border-t border-border" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            Unternehmen
          </p>
          {companies.map(company => {
            const href = `/unternehmen/${company.slug}`
            const isActive = pathname === href
            const count = matchCounts[company.slug] || 0
            return (
              <Link
                key={company.slug}
                href={href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: company.color }}
                  />
                  <span className="truncate">{company.name}</span>
                </span>
                {count > 0 && (
                  <span className="ml-2 text-xs bg-[#F1F5F9] text-[#64748B] px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <div className="my-4 border-t border-border" />

        <Link
          href="/verlauf"
          className={cn(
            'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
            pathname === '/verlauf'
              ? 'bg-[#D6E4F0] text-[#1F4E79] font-medium'
              : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
          )}
        >
          Verlauf
        </Link>
      </nav>
    </aside>
  )
}
