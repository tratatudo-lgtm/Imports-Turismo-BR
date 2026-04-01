import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;

  if (!TRATATUDO_API_KEY) {
    console.error("[Public Track Proxy] TRATATUDO_API_KEY is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing." });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Código de acompanhamento é obrigatório." });
  }

  try {
    // Construct Platform API Track URL
    // Usually leads are tracked by ID or code
    const url = `${TRATATUDO_API_URL}/leads/${code}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${TRATATUDO_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If not found in leads, maybe it's a ticket?
      // For now, return the error
      return res.status(response.status).json(data || { error: `Platform API error: ${response.statusText}` });
    }

    // Map Platform API Lead to TrackingResponse
    return res.status(200).json({
      trackingCode: data.tracking_code || data.id,
      status: data.status || 'pendente',
      nome: data.name,
      destino: data.metadata?.destino || data.metadata?.destination,
      periodo: data.metadata?.periodo,
      createdAt: data.created_at,
      historico: data.history || []
    });

  } catch (error: any) {
    console.error(`[Public Track Proxy] Error:`, error);
    res.status(500).json({ error: "Falha ao consultar o estado do pedido." });
  }
}
