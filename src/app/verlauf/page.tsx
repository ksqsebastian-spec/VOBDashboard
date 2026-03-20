import { getAllScans } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { formatDate } from '@/lib/utils'
import { DownloadReport } from '@/components/export/DownloadReport'
import { Card } from '@/components/ui/card'

export const revalidate = 300

export default async function VerlaufPage() {
  const scans = await getAllScans()

  return (
    <>
      <Header />
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold text-[#1E293B]">Verlauf</h1>

        {scans.length === 0 ? (
          <p className="text-sm text-[#94A3B8] py-8 text-center">
            Noch keine Scans vorhanden.
          </p>
        ) : (
          <div className="space-y-3">
            {scans.map(scan => (
              <Card key={scan.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-bold text-[#1E293B]">
                        KW {scan.calendar_week}
                      </span>
                      <span className="text-sm text-[#64748B]">
                        {formatDate(scan.scan_date)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-[#64748B]">
                      <span>Gesamt: <strong className="text-[#1E293B]">{scan.total_listings ?? 0}</strong></span>
                      <span>Matches: <strong className="text-[#1E293B]">{scan.matched_count ?? 0}</strong></span>
                      <span>Neu: <strong className="text-[#1E293B]">{scan.new_listings ?? 0}</strong></span>
                    </div>
                  </div>
                  <DownloadReport url={scan.report_url} label="DOCX herunterladen" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
