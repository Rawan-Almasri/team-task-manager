import express from "express" ; 

import { requireAuth } from "../../middlewares/requireAuth.js";
import { validate } from "../../middlewares/validate.js";
import { createTaskSchema,updateTaskSchema,updateTaskStatusSchema } from "./tasks.validation.js";
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,

} from "./tasks.controller.js";
const router = express.Router();

router.post("/projects/:projectId/tasks",requireAuth, validate(createTaskSchema),createTask);
router.get("/projects/:projectId/tasks", requireAuth,getProjectTasks );
router.get("/tasks/:taskId",requireAuth,getTaskById);
router.patch( "/tasks/:taskId", requireAuth, validate(updateTaskSchema), updateTask );
router.delete( "/tasks/:taskId", requireAuth,deleteTask);
router.patch( "/tasks/:taskId/status",requireAuth,validate(updateTaskStatusSchema),updateTaskStatus);

export default router;