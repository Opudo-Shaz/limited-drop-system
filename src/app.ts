import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.routes";
import reservationRoutes from "./routes/reservations.routes";
import checkoutRoutes from "./routes/checkout.routes";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api", userRoutes);
app.use("/api", reservationRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", productRoutes);

export default app;