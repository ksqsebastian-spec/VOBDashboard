import { getCompany, getCompanyTenders, getCompanyStats } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { ExportButton } from '@/components/export/ExportButton'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { CompanyTenderList } from './CompanyTenderList'
import { FileSearch, Calendar } from 'lucide-react'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params
  const [company, tenders, stats] = await Promise.all([
    getCompany(slug),
    getCompanyTenders(slug),
    getCompanyStats(slug),
  ])

  if (!company) notFound()

  const activeTenders = tenders.filter(t => t.status === 'active')
  const expiredTenders = tenders.filter(t => t.status === 'expired')

  return (
    <>
      <Header />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Company hero */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6">
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
            style={{ backgroundColor: company.color }}
          />
          <div className="pl-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md"
                  style={{ backgroundColor: company.color }}
                >
                  {company.name.split(/[\s.]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{company.name}</h1>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {company.trades.map(trade => (
                  <Badge key={trade} variant="outline" className="text-xs border-slate-200 text-slate-500">
                    {trade}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">{activeTenders.length}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Aktiv</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-300">{expiredTenders.length}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Abgelaufen</p>
              </div>
              <ExportButton slug={slug} />
            </div>
          </div>
        </div>

        <CompanyTenderList tenders={tenders} />
      </div>
    </>
  )
}
