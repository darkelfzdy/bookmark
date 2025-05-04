import { supabase } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { url, title } = await request.json()
  
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([{ url, title }])
    .select()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}