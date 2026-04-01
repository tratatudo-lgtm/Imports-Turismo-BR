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

  // TrataTudo API Configuration
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;
  const LEGACY_API_BASE_URL = "https://api.tratatudo.pt/api";
  const SITE_KEY = "imports-turismo-br";
  const GLOBAL_ADMIN_PHONE = process.env.GLOBAL_ADMIN_PHONE;

  /**
   * Universal Proxy Helper for Platform API (v1)
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

  /**
   * Unified Auth Proxy Helper
   * Handles WhatsApp/OTP login for both Admin and Client.
   * Implements special logic for Global Admin within the tenant scope.
   */
  const unifiedAuthProxy = async (req: express.Request, res: express.Response, endpoint: string) => {
    try {
      const url = `${LEGACY_API_BASE_URL}/auth${endpoint}`;
      const method = req.method;
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-site-key": SITE_KEY,
      };

      // Forward cookies from the client to the legacy API
      if (req.headers.cookie) {
        headers["cookie"] = req.headers.cookie as string;
      }

      // Special Rule: If it's the Global Admin requesting OTP, we try to bypass the tenant-only check
      // by removing the x-site-key header if the backend requires it for client association.
      // This allows the Global Admin to receive OTP even if not explicitly a client of this tenant.
      if (endpoint === '/send-otp' && req.body.phone_e164 === GLOBAL_ADMIN_PHONE && !!GLOBAL_ADMIN_PHONE) {
        delete headers["x-site-key"];
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (['POST', 'PATCH', 'PUT'].includes(method)) {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(url, options);
      
      // Forward Set-Cookie headers
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        res.setHeader('set-cookie', setCookie);
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return res.status(response.status).json(data || { error: `Auth API error: ${response.statusText}` });
      }

      // Enrichment logic for Global Admin and Role Detection
      if (endpoint === '/verify-otp' || endpoint === '/session') {
        const phone = data.phone_e164 || (req.body && req.body.phone_e164);
        const isGlobalAdmin = phone === GLOBAL_ADMIN_PHONE && !!GLOBAL_ADMIN_PHONE;

        // If it's a session check and not authenticated, just return the original data
        if (endpoint === '/session' && !data.authenticated) {
          return res.json(data);
        }

        return res.json({
          ...data,
          can_act_as_admin: isGlobalAdmin || !!data.is_admin || !!data.is_consultant,
          can_act_as_client: true, // Everyone can act as client in this context
          is_global_admin: isGlobalAdmin
        });
      }

      res.json(data);
    } catch (error: any) {
      console.error(`[Unified Auth Proxy] Error communicating with /auth${endpoint}:`, error);
      res.status(500).json({ error: "Failed to communicate with Auth API." });
    }
  };

  // --- Platform API Proxy Routes ---
  app.get("/api/platform/client/profile", (req, res) => platformProxy(req, res, "/client/profile"));
  app.get("/api/platform/client/config", (req, res) => platformProxy(req, res, "/client/config"));
  app.get("/api/platform/dashboard/summary", (req, res) => platformProxy(req, res, "/dashboard/summary"));
  app.get("/api/platform/travel/orders", (req, res) => platformProxy(req, res, "/travel/orders"));
  app.get("/api/platform/messages", (req, res) => platformProxy(req, res, "/messages"));
  app.post("/api/platform/messages/send", (req, res) => platformProxy(req, res, "/messages/send"));
  app.post("/api/platform/travel/orders", (req, res) => platformProxy(req, res, "/travel/orders"));

  // --- Unified Auth Proxy Routes ---
  app.post("/api/auth/send-otp", (req, res) => unifiedAuthProxy(req, res, "/send-otp"));
  app.post("/api/auth/verify-otp", (req, res) => unifiedAuthProxy(req, res, "/verify-otp"));
  app.get("/api/auth/session", (req, res) => unifiedAuthProxy(req, res, "/session"));
  app.post("/api/auth/logout", (req, res) => unifiedAuthProxy(req, res, "/logout"));

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
