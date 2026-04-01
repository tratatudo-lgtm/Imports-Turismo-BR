import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const LEGACY_API_BASE_URL = "https://api.tratatudo.pt/api";
  const SITE_KEY = "imports-turismo-br";
  const GLOBAL_ADMIN_PHONE = process.env.GLOBAL_ADMIN_PHONE;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-site-key": SITE_KEY,
    };

    if (req.headers.cookie) {
      headers["cookie"] = req.headers.cookie as string;
    }

    // Special Rule: If it's the Global Admin requesting OTP, we try to bypass the tenant-only check
    if (req.body && req.body.phone_e164 === GLOBAL_ADMIN_PHONE && !!GLOBAL_ADMIN_PHONE) {
      delete headers["x-site-key"];
    }

    const targetUrl = `${LEGACY_API_BASE_URL}/auth/send-otp`;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
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
    console.error(`[Auth Proxy] Error communicating with /auth/send-otp:`, error);
    res.status(500).json({ error: "Failed to communicate with Auth API." });
  }
}
