import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;

  // Extract the path from the query parameters (Vercel catch-all)
  // path will be an array of strings
  const { path, ...queryParams } = req.query;
  const pathString = Array.isArray(path) ? `/${path.join('/')}` : `/${path || ''}`;

  if (!TRATATUDO_API_KEY) {
    console.error("[Platform Proxy] TRATATUDO_API_KEY is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing." });
  }

  try {
    // Construct URL with query parameters
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else if (value) {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const url = `${TRATATUDO_API_URL}${pathString}${queryString ? `?${queryString}` : ''}`;
    const method = req.method;
    
    const options: RequestInit = {
      method,
      headers: {
        "Authorization": `Bearer ${TRATATUDO_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    if (['POST', 'PATCH', 'PUT'].includes(method || '')) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(data || { error: `Platform API error: ${response.statusText}` });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error(`[Platform Proxy] Error communicating with ${pathString}:`, error);
    res.status(500).json({ error: "Failed to communicate with Platform API." });
  }
}
