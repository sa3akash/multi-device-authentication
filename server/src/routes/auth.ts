import express, { Router } from "express";
import { authController } from "../controller/auth";
import { authMiddleware } from "../middlewares/auth";

class AuthRoute {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }

  public getRouter() {
    this.router.post("/register", authController.register);
    this.router.post("/login", authController.login);
    this.router.put("/logout",authMiddleware.authenticate, authController.logOut);
    this.router.put("/logout-all",authMiddleware.authenticate, authController.logOutAll);
    this.router.get("/sessions",authMiddleware.authenticate, authController.getSession);
    return this.router;
  }
}

export const authRoute: AuthRoute = new AuthRoute();
