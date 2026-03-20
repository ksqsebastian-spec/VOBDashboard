'use client'

import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'

interface DownloadReportProps {
  url: string | null
  label?: string
}

export function DownloadReport({ url, label = 'Bericht herunterladen' }: DownloadReportProps) {
  if (!url) return null

  return (
    <a href={url} download target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all">
        <FileDown size={14} className="mr-1.5" />
        {label}
      </Button>
    </a>
  )
}
