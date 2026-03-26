import { Router } from "express";
import { checkoutReservation } from "../controllers/checkout.controller";

const router = Router();

router.post("/checkout", checkoutReservation);

export default router;