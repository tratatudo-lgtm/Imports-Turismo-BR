/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  /**
   * Health Check Route
   */
  app.get("/health", (req, res) => {
    res.json({ ok: true, service: 'imports-turismo-br' });
  });

  // TrataTudo Platform API Proxy Configuration
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;

  /**
   * Universal Proxy Helper for Platform API
   * Handles GET, POST, PATCH, PUT with secure Authorization header
   */
  const platformProxy = async (req: express.Request, res: express.Response, endpoint: string) => {
    if (!TRATATUDO_API_KEY) {
      console.error("[Platform Proxy] TRATATUDO_API_KEY is missing.");
      return res.status(500).json({ error: "Server configuration error: API Key missing." });
    }

    try {
      const url = `${TRATATUDO_API_URL}${endpoint}`;
      const method = req.method;
      
      const options: RequestInit = {
        method,
        headers: {
          "Authorization": `Bearer ${TRATATUDO_API_KEY}`,
          "Content-Type": "application/json",
        },
      };

      if (['POST', 'PATCH', 'PUT'].includes(method)) {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(url, options);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return res.status(response.status).json(data || { error: `Platform API error: ${response.statusText}` });
      }

      res.json(data);
    } catch (error: any) {
      console.error(`[Platform Proxy] Error communicating with ${endpoint}:`, error);
      res.status(500).json({ error: "Failed to communicate with Platform API." });
    }
  };

  // --- Platform API Proxy Routes (Internal) ---

  // GET Endpoints
  app.get("/api/platform/client/profile", (req, res) => platformProxy(req, res, "/client/profile"));
  app.get("/api/platform/client/config", (req, res) => platformProxy(req, res, "/client/config"));
  app.get("/api/platform/dashboard/summary", (req, res) => platformProxy(req, res, "/dashboard/summary"));
  app.get("/api/platform/travel/orders", (req, res) => platformProxy(req, res, "/travel/orders"));
  app.get("/api/platform/messages", (req, res) => platformProxy(req, res, "/messages"));

  // POST Endpoints
  app.post("/api/platform/messages/send", (req, res) => platformProxy(req, res, "/messages/send"));
  app.post("/api/platform/travel/orders", (req, res) => platformProxy(req, res, "/travel/orders"));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Imports-Turismo-BR] Server running on http://localhost:${PORT}`);
  });
}

startServer();
