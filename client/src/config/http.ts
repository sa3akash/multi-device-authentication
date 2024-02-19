import axios, { AxiosInstance } from "axios";
import { ILogin, IRegister } from "../interface/type";

class ApiCall {
  private api: AxiosInstance;
  private isRetry: boolean = false;
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

    this.api.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === (401) && originalRequest && !this.isRetry) {
          this.isRetry = true;
          localStorage.clear();
          window.location.replace('/login');
        }
        throw error;
      },
    );

  }

  register(data: IRegister) {
    return this.api.post("/register", data);
  }

  login(data: ILogin) {
    return this.api.post("/login", data);
  }

  logout(userToken:string) {
    return this.api.put("/logout",{userToken});
  }
  
  logoutAll() {
    return this.api.put("/logout-all",{});
  }
  getSessions() {
    return this.api.get("/sessions");
  }
}

export const apiCall: ApiCall = new ApiCall();
