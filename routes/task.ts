import { Router } from "express";
import { addTask, deleteTask, getTasks, updateTask } from "../controllers/task";
import { authMiddleware } from "../controllers/auth";

const router = Router();
router.post("/addTask", authMiddleware, addTask);
router.get("/getTasks", authMiddleware, getTasks);
router.post("/updateTask", updateTask);
router.post("/deleteTask", deleteTask);

export default router;
