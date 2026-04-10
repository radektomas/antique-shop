import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

async function requireAdmin(req: NextRequest) {
  void req; // only used for cookie reading via next/headers
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { data, error } = await getSupabaseAdmin()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const body = await req.json();
  const { name, description, price, category, images } = body;

  if (!name || !price || !category) {
    return NextResponse.json({ error: 'Chybí povinné pole' }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('products')
    .insert({ name, description, price, category, images: images ?? [] })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
