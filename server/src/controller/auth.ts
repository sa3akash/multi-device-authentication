import { Request, Response } from "express";
import { User } from "../model/User";
import { LoginHistory } from "../model/LoginHistory";
import DeviceDetector from "node-device-detector";
import jwt from "jsonwebtoken";
import { config } from "../config";

class Auth {
  public async register(req: Request, res: Response) {
    try {
      const ip = req.clientIp;

      const { email, first_name, last_name, password } = req.body;

      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.json({ message: "user already exist." });
      }

      const newUser = new User({
        first_name,
        last_name,
        email,
        password,
      });

      const currentUser = await newUser.save();

      const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
      });

      const result = detector.detect(req.headers["user-agent"]!);

      console.log(result);

      await LoginHistory.create({
        user_id: currentUser._id,
        user_agent: req.headers["user-agent"]!,
        ip: ip,
        time: new Date().toISOString(),
        token: Math.random() * 1000 + Date.now(),
        device_info: result,
      });

      const token = jwt.sign(
        { id: currentUser._id, email: currentUser.email },
        config.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );
      req.cookies('token',token)

      res.json({ message: "user register successfull" });
    } catch (err) {
      console.log(err);
    }
  }
}

export const authController: Auth = new Auth();
