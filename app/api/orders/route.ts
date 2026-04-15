import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customer_name,
      customer_email,
      customer_phone,
      note,
      total_price,
    } = body;

    if (!items?.length || !customer_name || !customer_email || !customer_phone) {
      return NextResponse.json({ error: 'Chybí povinné údaje' }, { status: 400 });
    }

    // Insert order
    const { data: order, error } = await getSupabaseAdmin()
      .from('orders')
      .insert({
        items,
        customer_name,
        customer_email,
        customer_phone,
        note: note || null,
        total_price,
        status: 'nová',
      })
      .select()
      .single();

    if (error) throw error;

    // Build email body
    const itemsList = items
      .map((i: { name: string; price: number }) => `<li>${i.name} — ${i.price.toLocaleString('cs-CZ')} Kč</li>`)
      .join('');

    const emailBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2C1810;">
        <h2 style="color: #C9A84C;">Potvrzení objednávky</h2>
        <p>Vážený/á ${customer_name},</p>
        <p>Děkujeme za Vaši objednávku. Brzy Vás kontaktujeme na zadaný telefon pro domluvení osobního předání.</p>
        <h3>Objednané předměty:</h3>
        <ul>${itemsList}</ul>
        <p><strong>Celkem: ${Number(total_price).toLocaleString('cs-CZ')} Kč</strong></p>
        ${note ? `<p><strong>Poznámka:</strong> ${note}</p>` : ''}
        <hr style="border-color: #E8D5C0; margin: 20px 0;" />
        <p style="color: #8B5E3C; font-size: 14px;">Orientální dekorace — Výběrový antikvariát</p>
      </div>
    `;

    const ownerBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2C1810;">
        <h2 style="color: #C9A84C;">Nová objednávka #${order.id.slice(0, 8)}</h2>
        <h3>Zákazník:</h3>
        <p>${customer_name}<br/>
        E-mail: ${customer_email}<br/>
        Telefon: ${customer_phone}</p>
        ${note ? `<p><strong>Poznámka:</strong> ${note}</p>` : ''}
        <h3>Položky:</h3>
        <ul>${itemsList}</ul>
        <p><strong>Celkem: ${Number(total_price).toLocaleString('cs-CZ')} Kč</strong></p>
      </div>
    `;

    // Send emails (fire and forget — don't fail order if email fails)
    const resend = new Resend(process.env.RESEND_API_KEY);
    await Promise.allSettled([
      resend.emails.send({
        from: 'Orientální dekorace <objednavky@resend.dev>',
        to: customer_email,
        subject: 'Potvrzení vaší objednávky — Orientální dekorace',
        html: emailBody,
      }),
      resend.emails.send({
        from: 'Orientální dekorace <objednavky@resend.dev>',
        to: process.env.OWNER_EMAIL!,
        subject: `Nová objednávka od ${customer_name}`,
        html: ownerBody,
      }),
    ]);

    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json(
      { error: 'Nepodařilo se vytvořit objednávku' },
      { status: 500 }
    );
  }
}
