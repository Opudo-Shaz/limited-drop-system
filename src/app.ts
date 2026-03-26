import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservations.routes";
import checkoutRoutes from "./routes/checkout.routes";
import productRoutes from "./routes/product.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:3000",
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
app.use(errorHandler);

export default app;