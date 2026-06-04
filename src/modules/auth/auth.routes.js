import express from "express";
import { validate } from "../../middlewares/validate.js";
import { registerSchema,loginSchme } from "./auth.validation.js";

import { register,login } from "./auth.controller.js";

const router = express.Router();

router.post("/register", validate(registerSchema),register);
//validate(registerSchema) to validate input data
//register is the controller

router.post("/login", validate(loginSchme),login);
export default router;