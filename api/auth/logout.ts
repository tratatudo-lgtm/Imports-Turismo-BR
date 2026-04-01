import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const LEGACY_API_BASE_URL = "https://api.tratatudo.pt/api";
  const SITE_KEY = "imports-turismo-br";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-site-key": SITE_KEY,
    };

    if (req.headers.cookie) {
      headers["cookie"] = req.headers.cookie as string;
    }

    const targetUrl = `${LEGACY_API_BASE_URL}/auth/logout`;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body || {}),
    });
    
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('set-cookie', setCookie);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(data || { error: `Auth API error: ${response.statusText}` });
    }

    return res.status(200).json(data);

  } catch (error: any) {
    console.error(`[Auth Proxy] Error communicating with /auth/logout:`, error);
    res.status(500).json({ error: "Failed to communicate with Auth API." });
  }
}
