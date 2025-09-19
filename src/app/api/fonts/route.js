export async function GET() {
    const key = process.env.GOOGLE_FONTS_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing GOOGLE_FONTS_API_KEY' }), { status: 500 });
    }
  
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Google Fonts' }), { status: 502 });
    }
  
    const data = await res.json();
    // Devolvemos solo lo necesario
    const items = (data.items || []).map(i => ({ family: i.family }));
    return new Response(JSON.stringify({ items }), { status: 200 });
  }