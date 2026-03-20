import type { Metadata } from "next"
import "./globals.css"
import { AppShell } from "@/components/layout/AppShell"
import { getCompanies, getMatchCountsByCompany } from "@/lib/queries"

export const metadata: Metadata = {
  title: "VOB Monitor — Gruppenwerk",
  description: "VOB Ausschreibungen Dashboard für Gruppenwerk Unternehmen",
}

export const revalidate = 300

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [companies, matchCounts] = await Promise.all([
    getCompanies(),
    getMatchCountsByCompany(),
  ])

  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <AppShell companies={companies} matchCounts={matchCounts}>
          {children}
        </AppShell>
      </body>
    </html>
  )
}
