import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservations.routes";
import checkoutRoutes from "./routes/checkout.routes";
import productRoutes from "./routes/product.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";



const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api", userRoutes);
app.use("/api", reservationRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", productRoutes);
app.use(errorHandler);


import rateLimit from "express-rate-limit";

// CORS
app.use(cors({
  origin: "*", 
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60, // max 60 requests per IP per minute
  message: { success: false, message: "Too many requests" }
});

app.use(limiter);

app.get("/metrics", (req, res) => {
  res.json({
    uptime: process.uptime(),
    reservationsActive: 0, // optional: query DB for ACTIVE count
    totalOrders: 0 // optional: query DB
  });
});

export default app;