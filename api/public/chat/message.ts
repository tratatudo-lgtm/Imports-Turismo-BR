import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;
  const SITE_KEY = "imports-turismo-br";

  if (!TRATATUDO_API_KEY) {
    return res.status(500).json({ error: "API Key missing" });
  }

  try {
    const response = await fetch(`${TRATATUDO_API_URL}/chat/message`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${TRATATUDO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ site_key: SITE_KEY, ...req.body }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error: any) {
    console.error(`[Chat Message Proxy] Error:`, error);
    res.status(500).json({ error: "Failed to send message" });
  }
}
