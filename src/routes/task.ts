import { Router } from "express";
import {
  create, 
  // read, 
  // update, 
  // remove
} from "../controllers/task";

const router: Router = Router();

router.post("/task", create);
// router.get("/task", read);
// router.put("/task/:id", update);
// router.delete("/task/:id", remove);

export default router;