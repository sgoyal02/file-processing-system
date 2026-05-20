import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router";

const router = Router();
router.use('/login', authRouter);
export {router as globalRoute};