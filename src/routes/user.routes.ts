import { Router } from "express";
import { createUser } from "../controllers/user.controller";

const router = Router();

router.post("/users", createUser);
router.get("/users", (req, res) => {
  res.json({ message: "List of users" });
});

export default router;