
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import { errorHandler, notFound } from "./middleware/error.js";

import authRoutes from "./modules/auth/auth.routes.js";
import teamRoutes from "./modules/teams/routes.js";
import objectiveRoutes from "./modules/objectives/routes.js";
import keyResultRoutes from "./modules/keyresults/routes.js";
import updateRoutes from "./modules/updates/routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running fine",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/objectives", objectiveRoutes);
app.use("/api", keyResultRoutes);
app.use("/api/updates", updateRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
