import { Express } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "./controllers/product.controller";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controllers/session.controller";
import { createUserHandler } from "./controllers/user.controller";
import validateResource from "./middlewares/validateResource";
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductSchema,
} from "./schema/product.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import { deserializeUser } from "./middlewares/deserializeUser";

function routes(app: Express) {
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );
  
  app.get(
    "/api/products/:productId",
    validateResource(getProductSchema),
    getProductHandler
  );

  app.use(deserializeUser);

  app.get("/api/sessions", getUserSessionsHandler);

  app.delete("/api/sessions", deleteSessionHandler);

  app.post(
    "/api/products",
    validateResource(createProductSchema),
    createProductHandler
  );

  app.put(
    "/api/products/:productId",
    validateResource(updateProductSchema),
    updateProductHandler
  );
  app.delete(
    "/api/products/:productId",
    validateResource(deleteProductSchema),
    deleteProductHandler
  );
}

export default routes;
