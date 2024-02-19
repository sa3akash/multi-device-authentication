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

      const uniquetoken = Math.random() * 1000 + Date.now();

      await LoginHistory.create({
        user_id: currentUser._id,
        user_agent: req.headers["user-agent"]!,
        ip: ip,
        time: new Date().toISOString(),
        token: uniquetoken,
        device_info: result,
      });

      const token = jwt.sign(
        { id: currentUser._id, email: currentUser.email, token: uniquetoken },
        config.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );
      const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      res.clearCookie("token")
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + sevenDaysInMilliseconds),
      });

      res.status(201).json({
        message: "user register successfull",
        sessionKey: uniquetoken,
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const ip = req.clientIp;

      const { email, password } = req.body;

      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res.json({ message: "user not exist." });
      }

      const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
      });

      const uniquetoken = Math.random() * 1000 + Date.now();

      const findSessions = await LoginHistory.findOne({
        $and: [
          { user_id: userExist._id },
          { user_agent: req.headers["user-agent"] },
        ],
      });

      if (findSessions) {
        findSessions.time = new Date();
        findSessions.token = `${uniquetoken}`;
        await findSessions.save();
      } else {
        const result = detector.detect(req.headers["user-agent"]!);

        await LoginHistory.create({
          user_id: userExist._id,
          user_agent: req.headers["user-agent"]!,
          ip: ip,
          time: new Date().toISOString(),
          token: uniquetoken,
          device_info: result,
        });
      }

      const token = jwt.sign(
        { id: userExist._id, email: userExist.email, token: uniquetoken },
        config.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      res.clearCookie("token")
      const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + sevenDaysInMilliseconds),
      });

      res
        .status(200)
        .json({ message: "user login successfull", sessionKey: uniquetoken });
    } catch (err) {
      console.log(err);
    }
  }

  public async getSession(req: Request, res: Response) {
    try {
      const sessions = await LoginHistory.find({ user_id: req.user?.id });

      res.status(200).json({ message: "all sessions", sessions });
    } catch (err) {
      console.log(err);
    }
  }

  public async logOut(req: Request, res: Response) {
    try {

      const {userToken} = req.body;

      await LoginHistory.findOneAndDelete({token:userToken});

      res.status(200).json({ message: "logout", userToken });
    } catch (err) {
      console.log(err);
    }
  }

  public async logOutAll(req: Request, res: Response) {
    try {

      await LoginHistory.deleteMany({$and:[{user_id:req.user?.id},{token:{$ne:req.user?.token}}]});

      res.status(200).json({ message: "logout all" });
    } catch (err) {
      console.log(err);
    }
  }
}

export const authController: Auth = new Auth();
