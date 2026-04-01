import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const LEGACY_API_BASE_URL = "https://api.tratatudo.pt/api";
  const SITE_KEY = "imports-turismo-br";
  const GLOBAL_ADMIN_PHONE = process.env.GLOBAL_ADMIN_PHONE;

  const { path, ...queryParams } = req.query;
  const pathString = Array.isArray(path) ? `/${path.join('/')}` : `/${path || ''}`;

  try {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else if (value) {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const method = req.method;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-site-key": SITE_KEY,
    };

    if (req.headers.cookie) {
      headers["cookie"] = req.headers.cookie as string;
    }

    // Special Rule: If it's the Global Admin requesting OTP, we try to bypass the tenant-only check
    if (pathString === '/send-otp' && req.body && req.body.phone_e164 === GLOBAL_ADMIN_PHONE && !!GLOBAL_ADMIN_PHONE) {
      delete headers["x-site-key"];
    }

    // Unified Auth Proxy Logic
    const targetUrl = `${LEGACY_API_BASE_URL}/auth${pathString}${queryString ? `?${queryString}` : ''}`;
    
    const options: RequestInit = {
      method,
      headers,
    };

    if (['POST', 'PATCH', 'PUT'].includes(method || '')) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    
    // Forward Set-Cookie headers
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('set-cookie', setCookie);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(data || { error: `Auth API error: ${response.statusText}` });
    }

    // Special behavior for Global Admin and Role Enrichment
    if (pathString === '/verify-otp' || pathString === '/session') {
      const phone = data.phone_e164 || (req.body && req.body.phone_e164);
      const isGlobalAdmin = phone === GLOBAL_ADMIN_PHONE && !!GLOBAL_ADMIN_PHONE;

      // If it's a session check and not authenticated, just return the original data
      if (pathString === '/session' && !data.authenticated) {
        return res.status(200).json(data);
      }

      return res.status(200).json({
        ...data,
        can_act_as_admin: isGlobalAdmin || !!data.is_admin || !!data.is_consultant,
        can_act_as_client: true, // Everyone can be a client in this context
        is_global_admin: isGlobalAdmin
      });
    }

    return res.status(200).json(data);

  } catch (error: any) {
    console.error(`[Unified Auth Proxy] Error communicating with /auth${pathString}:`, error);
    res.status(500).json({ error: "Failed to communicate with Auth API." });
  }
}
