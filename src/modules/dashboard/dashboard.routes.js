import { requireAuth } from "../../middlewares/requireAuth.js";

import {getDashboardStats,getMyAssignedTasks} from "./dashboard.controller.js";

import express from "express";

const router = express.Router();

router.get("/stats", requireAuth, getDashboardStats);
router.get("/my-tasks", requireAuth, getMyAssignedTasks);
export default router;  
