import { Router } from "express";
import {
  create, 
  findMany, 
  update, 
  remove
} from "../controllers/task";

const router: Router = Router();

router.post("/", create);
router.get("/", findMany);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;