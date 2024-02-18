import express, { Express } from "express";
import { SetupServer } from "./setupServer";
import { config } from "./config";
import setupDatabase from "./setupDatabase";

class MainApplication {
  public initServer(): void {
    config.validateConfig();
    setupDatabase();
    const app: Express = express();
    const server = new SetupServer(app);
    server.start();
  }
}

const application: MainApplication = new MainApplication();
application.initServer();
