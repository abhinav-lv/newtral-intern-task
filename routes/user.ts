import { Router } from "express";
import { getUser } from "../controllers/user";
import { authMiddleware } from "../controllers/auth";

const router = Router();
router.get("/getUser", authMiddleware, getUser);

export default router;