import { Router } from "express";
import {reminder} from "../controllers/job";

const router: Router = Router();

router.get("/reminder", reminder);

export default router;