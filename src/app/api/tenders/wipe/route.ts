import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  // Delete all matches first (cascade should handle it, but be explicit)
  await supabase.from('vob_matches').delete().neq('id', '')

  // Delete all tenders
  const { error: tenderError } = await supabase
    .from('vob_tenders')
    .delete()
    .neq('id', '')

  if (tenderError) {
    return NextResponse.json({ error: tenderError.message }, { status: 500 })
  }

  // Delete all scans
  await supabase.from('vob_scans').delete().neq('id', '')

  return NextResponse.json({ wiped: true })
}
