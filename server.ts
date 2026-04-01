/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

  // TrataTudo Platform API Proxy Routes
  const TRATATUDO_API_URL = process.env.TRATATUDO_API_URL || "https://platform-api.tratatudo.pt/v1";
  const TRATATUDO_API_KEY = process.env.TRATATUDO_API_KEY;

  const platformProxy = async (req: express.Request, res: express.Response, endpoint: string) => {
    if (!TRATATUDO_API_KEY) {
      return res.status(500).json({ error: "TRATATUDO_API_KEY is not configured on the server." });
    }

    try {
      const response = await fetch(`${TRATATUDO_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${TRATATUDO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json(errorData || { error: `Platform API error: ${response.statusText}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error(`Error proxying to ${endpoint}:`, error);
      res.status(500).json({ error: "Internal server error while communicating with Platform API." });
    }
  };

  app.get("/api/platform/profile", (req, res) => platformProxy(req, res, "/client/profile"));
  app.get("/api/platform/dashboard", (req, res) => platformProxy(req, res, "/dashboard/summary"));
  app.get("/api/platform/orders", (req, res) => platformProxy(req, res, "/travel/orders"));
  app.get("/api/platform/messages", (req, res) => platformProxy(req, res, "/messages"));

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
