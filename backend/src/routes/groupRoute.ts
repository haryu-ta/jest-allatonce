import express from "express";
import { GroupController } from "../controllers/groupController";

const router = express.Router();

export const groupRoutes = (controller: GroupController): express.Router => {
  router.get("/groups", controller.getGroupList);
  router.get("/groups/:name", controller.getGroupByName);
  router.post("/groups", controller.addGroup);
  return router;
};
