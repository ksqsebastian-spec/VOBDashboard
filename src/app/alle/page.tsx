import { getAllTenders } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { AllTendersClient } from './AllTendersClient'
import { FileText } from 'lucide-react'

export const revalidate = 300

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AlleTendersPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10))
  const { tenders, total } = await getAllTenders(page, 50)

  return (
    <>
      <Header />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alle Ausschreibungen</h1>
        </div>
        <AllTendersClient tenders={tenders} total={total} page={page} />
      </div>
    </>
  )
}
