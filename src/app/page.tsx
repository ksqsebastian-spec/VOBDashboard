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

  const companyTenders: Record<string, typeof recentTenders> = {}
  for (const t of recentTenders) {
    if (t.company_slug) {
      if (!companyTenders[t.company_slug]) companyTenders[t.company_slug] = []
      companyTenders[t.company_slug].push(t)
    }
  }

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
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Übersicht</h1>
            {latestScan && newMatches > 0 && (
              <p className="text-[13px] text-slate-500 mt-0.5">
                <span className="font-semibold text-emerald-600">{newMatches} neue Treffer</span>{' '}
                <span className="text-slate-400">im letzten Scan</span>
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

        {/* Divider */}
        <div className="section-divider" />

        {/* Companies */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">Unternehmen</h2>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-semibold tabular-nums">
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

        {/* Divider */}
        <div className="section-divider" />

        {/* Trend + Recent feed */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
          <TrendChart trends={trends} />

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Neueste</h2>
              <span className="text-[9px] text-slate-400 uppercase tracking-[0.1em] font-semibold">Ausschreibungen</span>
            </div>
            <RecentFeed tenders={recentTenders} latestScanDate={latestScan?.scan_date} />
          </div>
        </div>
      </div>
    </>
  )
}
