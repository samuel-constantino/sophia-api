import { Router } from "express";
import TaskRouter from "./task";

const router: Router = Router();

router.use("/", TaskRouter);

export default router;