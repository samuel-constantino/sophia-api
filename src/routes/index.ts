// routes/index.ts

import { Router } from "express";
import TaskRouter from "./task";
import JobRouter from "./job";

const router: Router = Router();

router.use("/job", JobRouter);
router.use("/task", TaskRouter);

export default router;