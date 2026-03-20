import { getAllScans } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { formatDate } from '@/lib/utils'
import { DownloadReport } from '@/components/export/DownloadReport'
import { Clock, FileText } from 'lucide-react'

export const revalidate = 300

export default async function VerlaufPage() {
  const scans = await getAllScans()

  return (
    <>
      <Header />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
            <Clock size={16} className="text-slate-400" />
          </div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Verlauf</h1>
        </div>

        {scans.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white py-16 text-center">
            <Clock size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-xs text-slate-400">Noch keine Scans vorhanden.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line with gradient fade */}
            <div className="absolute left-[17px] top-5 bottom-5 w-px bg-gradient-to-b from-blue-300/60 via-slate-200 to-transparent hidden sm:block" />

            <div className="space-y-3 stagger-children">
              {scans.map((scan, i) => (
                <div key={scan.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center flex-shrink-0 relative z-10">
                    <div className={`w-[11px] h-[11px] rounded-full border-2 ${
                      i === 0 ? 'bg-blue-500 border-blue-500 shadow-sm shadow-blue-500/30' : 'bg-white border-slate-300'
                    }`} />
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200/70 bg-white p-4 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-lg font-black text-slate-900 tracking-tight tabular-nums">
                            KW {scan.calendar_week}
                          </span>
                          <span className="text-[12px] text-slate-400">
                            {formatDate(scan.scan_date)}
                          </span>
                          {i === 0 && (
                            <span className="text-[9px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Aktuell
                            </span>
                          )}
                        </div>
                        <div className="flex gap-5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <FileText size={11} className="text-slate-400" />
                            <span className="text-slate-400">Gesamt:</span>
                            <strong className="text-slate-700 tabular-nums">{scan.total_listings ?? 0}</strong>
                          </span>
                          <span>
                            <span className="text-slate-400">Matches:</span>{' '}
                            <strong className="text-emerald-600 tabular-nums">{scan.matched_count ?? 0}</strong>
                          </span>
                          <span>
                            <span className="text-slate-400">Neu:</span>{' '}
                            <strong className="text-blue-600 tabular-nums">{scan.new_listings ?? 0}</strong>
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
