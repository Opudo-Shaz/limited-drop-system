import { Router } from "express";
import { reserveProduct } from "../controllers/reservation.controller";

const router = Router();

router.post("/reserve", reserveProduct);
router.get("/reservations", (req, res) => {
  res.json({ message: "List of reservations" });
});

export default router;