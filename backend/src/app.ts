import express from "express";
import cors from "cors";
import { GroupService } from "./services/groupService";
import { GroupController } from "./controllers/groupController";
import { GroupRepository } from "./repositories/groupRepository";
import { groupRoutes } from "./routes/groupRoute";
import { ExpenseRepository } from "./repositories/expenseRepository";
import { ExpenseService } from "./services/expenseService";
import { ExpenseController } from "./controllers/expenseController";
import { expenseRoutes } from "./routes/expenseRoute";
import { testRoutes } from "./routes/testRoute";
import { TestController } from "./controllers/testController";

export function createApp(
  groupDataPath: string,
  expenseDataPath: string
): express.Express {
  const app: express.Express = express();
  app.use(express.json());

  const options: cors.CorsOptions = {
    origin: ["http://localhost:3001"],
  };
  app.use(cors(options));

  const groupRepository = new GroupRepository(groupDataPath);
  const groupService = new GroupService(groupRepository);
  const groupController = new GroupController(groupService);
  const expenseRepository = new ExpenseRepository(expenseDataPath);
  const expenseService = new ExpenseService(expenseRepository, groupService);
  const expenseController = new ExpenseController(expenseService);

  app.use("/", groupRoutes(groupController));
  app.use("/", expenseRoutes(expenseController));
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err.message);
      res.status(500).send("サーバー内部でエラーが発生しました");
    }
  );

  if (process.env.NODE_ENV === "TEST") {
    app.use("/", testRoutes(new TestController()));
  }

  return app;
}
