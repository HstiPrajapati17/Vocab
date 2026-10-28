import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./DB/connectdb.js";
import { seedFrontendContent } from "./services/contentSeed.service.js";
import indexRouter from "./routes/index.routes.js";

import dns from "node:dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", indexRouter);

app.use((error, _req, res, _next) => {
  console.error("API error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

await connectDB(process.env.DB_URL);
await seedFrontendContent();
app.listen(port, "0.0.0.0", () => {
  console.log(`Vocab API is running on port ${port}`);
});
