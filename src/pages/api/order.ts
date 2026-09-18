import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      fulfillmentType,
      shippingAddress,
      notes,
      items,
      subtotal,
    } = data;

    if (!customerName || !customerEmail || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required order details.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate readable order reference
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `BKSTP-${randomSuffix}`;
    const createdAt = new Date().toISOString();

    const orderRecord = {
      orderId,
      createdAt,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      fulfillment: {
        type: fulfillmentType,
        address: shippingAddress || null,
      },
      notes: notes || null,
      items: items.map((it: any) => ({
        id: it.id,
        title: it.title,
        price: it.price,
        quantity: it.quantity,
        coverStyle: it.coverStyle,
        customNotes: it.customNotes || null,
      })),
      subtotal,
      currency: 'CAD',
      targetEmail: 'graciep910@gmail.com',
    };

    // Edge logging for Cloudflare Workers / Pages
    console.log(`[The Book Stop] NEW ORDER ${orderId}:`, JSON.stringify(orderRecord, null, 2));

    // Optional webhook support if configured in Cloudflare environment
    const env = (locals as any)?.runtime?.env || process.env;
    const webhookUrl = env?.ORDER_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `📚 **New Order: ${orderId}**\n**Customer:** ${customerName} (${customerEmail}, ${customerPhone})\n**Fulfillment:** ${fulfillmentType}\n**Total:** $${subtotal} CAD\n**Items:** ${items.map((i: any) => `${i.quantity}x ${i.title} (${i.coverStyle})`).join(', ')}`,
            order: orderRecord,
          }),
        });
      } catch (webhookErr) {
        console.error('Webhook notification failed:', webhookErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        createdAt,
        subtotal,
        message: 'Order recorded successfully.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Order processing error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error while processing order.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
