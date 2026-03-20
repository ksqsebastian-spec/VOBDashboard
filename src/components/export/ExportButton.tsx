'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
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
      className="text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all"
      onClick={handleExport}
      disabled={loading}
    >
      <Download size={14} className="mr-1.5" />
      {loading ? 'Wird erstellt...' : label}
    </Button>
  )
}
