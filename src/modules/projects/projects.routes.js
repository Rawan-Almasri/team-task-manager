import express from "express";

import { requireAuth } from "../../middlewares/requireAuth.js";
import { validate } from "../../middlewares/validate.js";
import { createProjectSchema,updateProjectSchema } from "./projects.validation.js";
import {
  createProject,
  getTeamProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "./projects.controller.js";

const router = express.Router();

router.post("/teams/:teamId/projects", requireAuth, validate(createProjectSchema), createProject);
router.get("/teams/:teamId/projects", requireAuth, getTeamProjects);
router.get("/projects/:projectId"   , requireAuth, getTeamProjects);
router.patch("/projects/:projectId", requireAuth, validate(updateProjectSchema), updateProject);
router.delete("/projects/:projectId", requireAuth,  deleteProject);
export default router;