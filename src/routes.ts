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
  /**
   * @openapi
   * /test:
   *  get:
   *     tags:
   *     - test
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get('/test', (req, res) => res.sendStatus(200));

   /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  /* session endpoints */

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );
  
  app.get("/api/sessions", deserializeUser, getUserSessionsHandler);

  app.delete("/api/sessions", deserializeUser, deleteSessionHandler);

  /* products endpoints */

  app.get(
    "/api/products/:productId",
    validateResource(getProductSchema),
    getProductHandler
  );

  app.post(
    "/api/products",
    deserializeUser,
    validateResource(createProductSchema),
    createProductHandler
  );

 /**
   * @openapi
   * '/api/products/{productId}':
   *  get:
   *     tags:
   *     - Products
   *     summary: Get a single product by the productId
   *     parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Product'
   *       404:
   *         description: Product not found
   */
  app.put(
    "/api/products/:productId",
    deserializeUser,
    validateResource(updateProductSchema),
    updateProductHandler
  );
  app.delete(
    "/api/products/:productId",
    deserializeUser,
    validateResource(deleteProductSchema),
    deleteProductHandler
  );
}

export default routes;
