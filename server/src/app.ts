import express, { Express } from 'express';
import { SetupServer } from './setupServer';



class MainApplication {
    public initServer():void{
        const app:Express = express();
        const server = new SetupServer(app);
        server.start();
    }
}

const application: MainApplication = new MainApplication();
application.initServer();

