import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const LEGACY_API_BASE_URL = "https://api.tratatudo.pt/api";
  const SITE_KEY = "imports-turismo-br";

  // Extract the path from the query parameters (Vercel catch-all)
  // path will be an array of strings
  const { path } = req.query;
  const pathString = Array.isArray(path) ? `/${path.join('/')}` : `/${path || ''}`;

  try {
    const url = `${LEGACY_API_BASE_URL}/admin/auth${pathString}`;
    const method = req.method;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-site-key": SITE_KEY,
    };

    // Forward cookies from the client to the legacy API (critical for session)
    if (req.headers.cookie) {
      headers["cookie"] = req.headers.cookie as string;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (['POST', 'PATCH', 'PUT'].includes(method || '')) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    
    // Forward Set-Cookie headers from legacy API back to the client
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('set-cookie', setCookie);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(data || { error: `Admin API error: ${response.statusText}` });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error(`[Admin Proxy] Error communicating with /admin/auth${pathString}:`, error);
    res.status(500).json({ error: "Failed to communicate with Admin API." });
  }
}
