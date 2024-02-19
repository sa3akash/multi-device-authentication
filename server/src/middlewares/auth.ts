import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { LoginHistory } from "../model/LoginHistory";

interface AuthDataType {
  id: string;
  email: string;
  token: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthDataType;
    }
  }
}

class AuthMiddleware {
  public async authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET!) as AuthDataType;
      const sessions = await LoginHistory.findOne({user_id:decoded.id, token:decoded.token});
        if(sessions){
            req.user = decoded;
            next();
        }else{
            return res.status(401).json({message:"unauthorized"})
        }
    } catch (error) {
      return res.status(401).json({ message: "unauthorized" });
    }
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
