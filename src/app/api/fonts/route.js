//API GOOGLE FONTS
export async function GET() {
    const key = process.env.GOOGLE_FONTS_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing GOOGLE_FONTS_API_KEY' }), { status: 500 });
    }
  //Build the url to fetch the fonts sorted alphabetically
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=alpha`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Google Fonts' }), { status: 502 });
    }
    //Get the data from the response(JSON)
    const data = await res.json();
    //Map the data to the items array. Take the family and the variants
    const items = (data.items || []).map(i => ({ family: i.family, variants: i.variants || []}));
    //Return the items array
    return new Response(JSON.stringify({ items }), { status: 200 });
  }