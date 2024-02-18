import express, { Router } from "express";
import { authController } from "../controller/auth";

class AuthRoute {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }

  public getRouter() {
    this.router.post("/register", authController.register);
    return this.router;
  }
}

export const authRoute: AuthRoute = new AuthRoute();
