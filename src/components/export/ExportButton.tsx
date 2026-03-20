'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ExportButtonProps {
  slug: string
  label?: string
}

export function ExportButton({ slug, label = 'PDF exportieren' }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/export/${slug}`)
      const { company, tenders } = await res.json()

      const { generateCompanyPdf } = await import('@/lib/pdf-generator')
      const doc = await generateCompanyPdf(company.name, tenders)
      const today = new Date().toISOString().slice(0, 10)
      doc.save(`VOB_${slug}_${today}.pdf`)
    } catch (e) {
      console.error('PDF export failed:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-[#1F4E79] border-[#1F4E79] hover:bg-[#D6E4F0]"
      onClick={handleExport}
      disabled={loading}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {loading ? 'Wird erstellt...' : label}
    </Button>
  )
}
