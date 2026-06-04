import { requireAuth } from "../../middlewares/requireAuth.js";
import { validate } from "../../middlewares/validate.js";
import express from "express";
import { addMemberSchema, changeMemberRoleSchema } from "./members.validation.js";

import { getTeamMembers,addMember,changeMemberRole,removeMember} from "./members.controller.js";

const router = express.Router();

router.get('/teams/:teamId/members', requireAuth,getTeamMembers)
router.post('/teams/:teamId/members/add', requireAuth,validate(addMemberSchema),addMember)
router.patch('/teams/:teamId/members/changeRole', requireAuth,validate(changeMemberRoleSchema),changeMemberRole)
router.delete("/teams/:teamId/members/:memberId",requireAuth,removeMember);
export default router;