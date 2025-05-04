import { supabase } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const params = context.params;
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', Number(params.id))

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}