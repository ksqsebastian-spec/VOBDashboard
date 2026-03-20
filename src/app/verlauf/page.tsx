import { getAllScans } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { formatDate } from '@/lib/utils'
import { DownloadReport } from '@/components/export/DownloadReport'
import { Clock, FileText, ArrowRight } from 'lucide-react'

export const revalidate = 300

export default async function VerlaufPage() {
  const scans = await getAllScans()

  return (
    <>
      <Header />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verlauf</h1>
        </div>

        {scans.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white py-16 text-center">
            <Clock size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Noch keine Scans vorhanden.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-200 hidden sm:block" />

            <div className="space-y-3 stagger-children">
              {scans.map((scan, i) => (
                <div key={scan.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full border-2 z-10 ${i === 0 ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-xl border border-slate-200/80 bg-white p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-lg font-black text-slate-900">
                            KW {scan.calendar_week}
                          </span>
                          <span className="text-sm text-slate-400">
                            {formatDate(scan.scan_date)}
                          </span>
                          {i === 0 && (
                            <span className="text-[10px] font-semibold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                              Aktuell
                            </span>
                          )}
                        </div>
                        <div className="flex gap-5 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <FileText size={12} className="text-slate-400" />
                            Gesamt: <strong className="text-slate-800">{scan.total_listings ?? 0}</strong>
                          </span>
                          <span>
                            Matches: <strong className="text-emerald-600">{scan.matched_count ?? 0}</strong>
                          </span>
                          <span>
                            Neu: <strong className="text-blue-600">{scan.new_listings ?? 0}</strong>
                          </span>
                        </div>
                      </div>
                      <DownloadReport url={scan.report_url} label="DOCX" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
