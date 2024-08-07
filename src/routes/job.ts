// routes/job.ts

import { Router } from "express";
import {reminder, dailyReset, postman} from "../controllers/job";

const router: Router = Router();

router.get("/task/reminder", reminder);
router.get("/task/reset", dailyReset);
// router.get("/postman", postman);

export default router;