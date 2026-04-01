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

    // Unified OTP Flow
    if (pathString === '/verify-otp') {
      const { phone_e164, code } = req.body;
      
      // Try to verify as Admin first
      const adminVerifyUrl = `${LEGACY_API_BASE_URL}/admin/auth/verify-otp${queryString ? `?${queryString}` : ''}`;
      const adminResponse = await fetch(adminVerifyUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone_e164, code })
      });

      const adminData = await adminResponse.json().catch(() => ({}));
      
      // Forward Set-Cookie if present
      const setCookie = adminResponse.headers.get('set-cookie');
      if (setCookie) {
        res.setHeader('set-cookie', setCookie);
      }

      if (adminResponse.ok) {
        // Success as Admin
        const isGlobalAdmin = phone_e164 === GLOBAL_ADMIN_PHONE;
        return res.status(200).json({
          ...adminData,
          can_act_as_admin: true,
          can_act_as_client: isGlobalAdmin || !!adminData.is_client, // Enrich if needed
          is_global_admin: isGlobalAdmin
        });
      }

      // If Admin fails, try Client
      const clientVerifyUrl = `${LEGACY_API_BASE_URL}/auth/verify-otp${queryString ? `?${queryString}` : ''}`;
      const clientResponse = await fetch(clientVerifyUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone_e164, code })
      });

      const clientData = await clientResponse.json().catch(() => ({}));
      
      const clientSetCookie = clientResponse.headers.get('set-cookie');
      if (clientSetCookie) {
        res.setHeader('set-cookie', clientSetCookie);
      }

      if (clientResponse.ok) {
        const isGlobalAdmin = phone_e164 === GLOBAL_ADMIN_PHONE;
        return res.status(200).json({
          ...clientData,
          can_act_as_admin: isGlobalAdmin,
          can_act_as_client: true,
          is_global_admin: isGlobalAdmin
        });
      }

      return res.status(401).json({ error: "Código inválido ou utilizador não encontrado." });
    }

    // Unified Session Flow
    if (pathString === '/session') {
      // Check Admin Session
      const adminSessionUrl = `${LEGACY_API_BASE_URL}/admin/auth/session${queryString ? `?${queryString}` : ''}`;
      const adminResponse = await fetch(adminSessionUrl, { method: 'GET', headers });
      const adminData = await adminResponse.json().catch(() => ({}));

      if (adminResponse.ok && adminData.authenticated) {
        const isGlobalAdmin = adminData.phone_e164 === GLOBAL_ADMIN_PHONE;
        return res.status(200).json({
          ...adminData,
          can_act_as_admin: true,
          can_act_as_client: isGlobalAdmin || !!adminData.is_client,
          is_global_admin: isGlobalAdmin
        });
      }

      // Check Client Session
      const clientSessionUrl = `${LEGACY_API_BASE_URL}/auth/session${queryString ? `?${queryString}` : ''}`;
      const clientResponse = await fetch(clientSessionUrl, { method: 'GET', headers });
      const clientData = await clientResponse.json().catch(() => ({}));

      if (clientResponse.ok && clientData.authenticated) {
        const isGlobalAdmin = clientData.phone_e164 === GLOBAL_ADMIN_PHONE;
        return res.status(200).json({
          ...clientData,
          can_act_as_admin: isGlobalAdmin,
          can_act_as_client: true,
          is_global_admin: isGlobalAdmin
        });
      }

      return res.status(200).json({ authenticated: false });
    }

    // Generic proxy for other auth routes (send-otp, logout)
    // Default to admin API for send-otp as it's more permissive for global admins
    const targetUrl = `${LEGACY_API_BASE_URL}${pathString.includes('admin') ? '' : '/admin'}/auth${pathString}${queryString ? `?${queryString}` : ''}`;
    
    const options: RequestInit = {
      method,
      headers,
    };

    if (['POST', 'PATCH', 'PUT'].includes(method || '')) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('set-cookie', setCookie);
    }

    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);

  } catch (error: any) {
    console.error(`[Unified Auth Proxy] Error:`, error);
    res.status(500).json({ error: "Failed to communicate with Auth API." });
  }
}
