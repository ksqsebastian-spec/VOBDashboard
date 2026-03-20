import { getCompany, getCompanyTenders, getCompanyStats } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { ExportButton } from '@/components/export/ExportButton'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { CompanyTenderList } from './CompanyTenderList'

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

  return (
    <>
      <Header />
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-8 rounded" style={{ backgroundColor: company.color }} />
              <h1 className="text-2xl font-bold text-[#1E293B]">{company.name}</h1>
            </div>
            <div className="flex gap-1.5 flex-wrap ml-6">
              {company.trades.map(trade => (
                <Badge key={trade} variant="outline" className="text-xs">
                  {trade}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-[#1E293B]">{activeTenders.length}</p>
              <p className="text-xs text-[#94A3B8]">aktive Ausschreibungen</p>
            </div>
            <ExportButton slug={slug} />
          </div>
        </div>

        <CompanyTenderList tenders={tenders} />
      </div>
    </>
  )
}
