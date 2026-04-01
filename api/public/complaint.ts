import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;
  const SITE_KEY = "imports-turismo-br";

  if (!TRATATUDO_API_KEY) {
    console.error("[Public Complaint Proxy] TRATATUDO_API_KEY is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nome, telefone, email, ...metadata } = req.body;

    // Construct Platform API Lead for complaints
    const leadData = {
      name: nome || metadata.name,
      phone: telefone || metadata.phone,
      email: email || metadata.email,
      source: SITE_KEY,
      metadata: {
        ...metadata,
        site_key: SITE_KEY,
        type: 'reclamacao'
      }
    };

    const response = await fetch(`${TRATATUDO_API_URL}/leads`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${TRATATUDO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[Public Complaint Proxy] Platform API error:", data);
      return res.status(response.status).json(data || { error: `Platform API error: ${response.statusText}` });
    }

    return res.status(200).json({
      ok: true,
      trackingCode: data.tracking_code || data.id || `REC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      message: "Reclamação recebida com sucesso. Analisaremos o caso brevemente."
    });

  } catch (error: any) {
    console.error(`[Public Complaint Proxy] Error:`, error);
    res.status(500).json({ error: "Falha ao processar a reclamação." });
  }
}
