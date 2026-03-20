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

  const newMatches = latestScan
    ? recentTenders.filter(t => t.scan_date === latestScan.scan_date).length
    : 0

  return (
    <>
      <Header latestScan={latestScan} />
      <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Übersicht</h1>
            {latestScan && newMatches > 0 && (
              <p className="text-sm text-slate-500 mt-0.5">
                <span className="font-semibold text-emerald-600">{newMatches} neue Treffer</span> im letzten Scan
              </p>
            )}
          </div>
          <DownloadReport url={latestScan?.report_url ?? null} />
        </div>

        {/* Stats */}
        <StatsOverview
          latestScan={latestScan}
          totalActive={totalActive}
          totalMatched={totalMatched}
        />

        {/* Companies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-slate-800">Unternehmen</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              {companies.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
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

        {/* Trend + Recent feed side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          <TrendChart trends={trends} />

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800">Neueste</h2>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Letzte Ausschreibungen</span>
            </div>
            <RecentFeed tenders={recentTenders} latestScanDate={latestScan?.scan_date} />
          </div>
        </div>
      </div>
    </>
  )
}
