import { Router } from "express";
import { authenticate, authorize, logout } from "../controllers/auth";

const router = Router();
router.post("/authenticate", authenticate);
router.get("/authorize", authorize);
router.get("/logout", logout);

export default router;
