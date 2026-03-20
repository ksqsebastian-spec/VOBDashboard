import { getDashboardData } from '@/lib/queries'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { CompanyCard } from '@/components/dashboard/CompanyCard'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { Header } from '@/components/layout/Header'
import { DownloadReport } from '@/components/export/DownloadReport'
import { RecentFeed } from './RecentFeed'

export const revalidate = 300

export default async function DashboardPage() {
  const { companies, latestScan, recentTenders, trends } = await getDashboardData()

  const totalActive = new Set(
    recentTenders.filter(t => t.status === 'active').map(t => t.tender_id)
  ).size
  const totalMatched = recentTenders.length

  // Build per-company tenders map
  const companyTenders: Record<string, typeof recentTenders> = {}
  for (const t of recentTenders) {
    if (t.company_slug) {
      if (!companyTenders[t.company_slug]) companyTenders[t.company_slug] = []
      companyTenders[t.company_slug].push(t)
    }
  }

  // Get latest trend per company
  const latestTrends: Record<string, (typeof trends)[0]> = {}
  for (const t of trends) {
    if (!latestTrends[t.company_slug]) {
      latestTrends[t.company_slug] = t
    }
  }

  return (
    <>
      <Header latestScan={latestScan} />
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1E293B]">Übersicht</h1>
          <DownloadReport url={latestScan?.report_url ?? null} />
        </div>

        <StatsOverview
          latestScan={latestScan}
          totalActive={totalActive}
          totalMatched={totalMatched}
        />

        <div>
          <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Unternehmen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {companies.map(company => (
              <CompanyCard
                key={company.slug}
                company={company}
                tenders={companyTenders[company.slug] || []}
                trend={latestTrends[company.slug]}
              />
            ))}
          </div>
        </div>

        <TrendChart trends={trends} />

        <div>
          <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Letzte Ausschreibungen</h2>
          <RecentFeed tenders={recentTenders} latestScanDate={latestScan?.scan_date} />
        </div>
      </div>
    </>
  )
}
