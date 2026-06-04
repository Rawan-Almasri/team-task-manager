import express from "express";

import { requireAuth } from "../../middlewares/requireAuth.js";
import { validate } from "../../middlewares/validate.js";
import { createTeamSchema,updateTeamSchema } from "./teams.validation.js";
import { 
    createTeam,
    getMyTeams,
    getTeamById,
    updateTeam,
    deleteTeam
} from "./teams.controller.js";

const router = express.Router();

router.post("/", requireAuth, validate(createTeamSchema), createTeam);
router.get("/",requireAuth,getMyTeams );
router.get("/:teamId",requireAuth,getTeamById );
router.patch("/:teamId",requireAuth, validate(updateTeamSchema),updateTeam );
router.delete("/:teamId",requireAuth,deleteTeam );
export default router;