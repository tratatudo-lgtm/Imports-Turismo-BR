import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;
  const SITE_KEY = "imports-turismo-br";

  if (!TRATATUDO_API_KEY) {
    console.error("[Public Request Proxy] TRATATUDO_API_KEY is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nome, telefone, email, ...metadata } = req.body;

    // Construct Platform API Lead
    // We map the frontend fields to the Platform API Lead structure
    const leadData = {
      name: nome || metadata.name,
      phone: telefone || metadata.phone,
      email: email || metadata.email,
      source: SITE_KEY,
      metadata: {
        ...metadata,
        site_key: SITE_KEY,
        type: req.body.type || 'orcamento'
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
      console.error("[Public Request Proxy] Platform API error:", data);
      return res.status(response.status).json(data || { error: `Platform API error: ${response.statusText}` });
    }

    // Return a tracking code for the frontend
    // If the Platform API returns a tracking_code, we use it.
    // Otherwise, we use the ID or generate a fallback.
    return res.status(200).json({
      ok: true,
      trackingCode: data.tracking_code || data.id || `IMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      message: "Solicitação recebida com sucesso. Entraremos em contacto brevemente."
    });

  } catch (error: any) {
    console.error(`[Public Request Proxy] Error:`, error);
    res.status(500).json({ error: "Falha ao processar a solicitação de orçamento." });
  }
}
