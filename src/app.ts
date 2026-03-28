import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "node:path";

import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservations.routes";
import checkoutRoutes from "./routes/checkout.routes";
import productRoutes from "./routes/product.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

// Determine allowed origins based on environment
const isDevelopment = process.env.NODE_ENV !== "production";
const allowedOrigins = isDevelopment
  ? "http://localhost:3000"
  : process.env.FRONTEND_URL || "http://localhost:3000";

// CORS
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: "Too many requests" }
});

app.use(limiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/metrics", (req, res) => {
  res.json({
    uptime: process.uptime(),
    reservationsActive: 0,
    totalOrders: 0
  });
});

app.use("/api", userRoutes);
app.use("/api", reservationRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", productRoutes);

// Serve static frontend build in production
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../limited-drop-frontend/build");
  app.use(express.static(frontendBuildPath));
  
  // Fallback to index.html for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

app.use(errorHandler);

export default app;