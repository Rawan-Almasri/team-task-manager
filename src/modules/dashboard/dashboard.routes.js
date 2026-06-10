import { requireAuth } from "../../middlewares/requireAuth.js";

import {getDashboardStats} from "./dashboard.controller.js";

import express from "express";

const router = express.Router();

router.get("/stats", requireAuth, getDashboardStats);

export default router;  
