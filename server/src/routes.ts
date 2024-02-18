import { Application } from "express"
import { authRoute } from "./routes/auth"


export default (app:Application) => {
    const routes = () => {
        app.use("/api/v1",authRoute.getRouter())
    }

    routes()
}