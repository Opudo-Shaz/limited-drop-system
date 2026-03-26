import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api", userRoutes);
import reservationRoutes from "./routes/reservations.routes";
app.use("/api", reservationRoutes);

import checkoutRoutes from "./routes/checkout.routes";
app.use("/api", checkoutRoutes);

export default app;