import { getAllTenders } from '@/lib/queries'
import { Header } from '@/components/layout/Header'
import { AllTendersClient } from './AllTendersClient'

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
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold text-[#1E293B]">Alle Ausschreibungen</h1>
        <AllTendersClient tenders={tenders} total={total} page={page} />
      </div>
    </>
  )
}
