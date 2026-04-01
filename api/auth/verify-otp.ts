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

    const targetUrl = `${LEGACY_API_BASE_URL}/auth/verify-otp`;
    
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

    const phone = data.phone_e164 || (req.body && req.body.phone_e164);
    const isGlobalAdmin = phone === GLOBAL_ADMIN_PHONE && !!GLOBAL_ADMIN_PHONE;

    return res.status(200).json({
      ...data,
      can_act_as_admin: isGlobalAdmin || !!data.is_admin || !!data.is_consultant,
      can_act_as_client: true,
      is_global_admin: isGlobalAdmin
    });

  } catch (error: any) {
    console.error(`[Auth Proxy] Error communicating with /auth/verify-otp:`, error);
    res.status(500).json({ error: "Failed to communicate with Auth API." });
  }
}
