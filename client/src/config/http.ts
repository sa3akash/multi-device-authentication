import axios, { AxiosInstance } from "axios";
import { ILogin, IRegister } from "../interface/type";

class ApiCall {
  private api: AxiosInstance;
  private baseUrl: string =
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:5500/api/v1"
      : "/api/v1";
  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
  }

  register(data: IRegister) {
    return this.api.post("/register", data);
  }

  login(data: ILogin) {
    return this.api.post("/login", data);
  }
  
  getSessions() {
    return this.api.get("/sessions");
  }
}

export const apiCall: ApiCall = new ApiCall();
