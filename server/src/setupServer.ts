import { Application } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";
import http from "http";
import requestIp from "request-ip";

import mainRoute from "./routes";
import { config } from "./config";

export class SetupServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cors({
        origin:
          config.NODE_ENV === "development" ? "http://localhost:5173" : "*",
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
    app.use(requestIp.mw());
    app.use(cookieParser());
    app.use(helmet());
    app.use(hpp());
    // app.set('trust proxy', true); // Enable trust proxy setting to get correct IP address
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-7",
        legacyHeaders: false,
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private routesMiddleware(app: Application): void {
    mainRoute(app);
  }

  private globalErrorHandler(app: Application): void {
    app.use("*", (req, res) => {
      res.status(500).json({ message: "Server error." });
    });
  }
  private startServer(app: Application): void {
    const httpServer = http.createServer(app);
    httpServer.listen(5500, () => {
      console.log(`STARTING SERVER ON PORT 5500 PROCESS ID =${process.pid}`);
    });
  }
}
