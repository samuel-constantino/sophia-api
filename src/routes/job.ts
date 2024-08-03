import { Router } from "express";
import {reminder, postman} from "../controllers/job";

const router: Router = Router();

router.get("/reminder", reminder);
router.get("/postman", postman);

export default router;