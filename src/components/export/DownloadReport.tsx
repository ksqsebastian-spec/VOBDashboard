'use client'

import { Button } from '@/components/ui/button'

interface DownloadReportProps {
  url: string | null
  label?: string
}

export function DownloadReport({ url, label = 'Bericht herunterladen' }: DownloadReportProps) {
  if (!url) return null

  return (
    <a href={url} download target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        {label}
      </Button>
    </a>
  )
}
