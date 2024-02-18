import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    user_agent: { type: String, required: true },
    ip: { type: String, required: true },
    time: { type: String, required: true },
    token: {type:String, required:true, unique:true},
    device_info: {type:Object, default:{}},
  },
  { timestamps: true }
);

export const LoginHistory = mongoose.model("LoginHistory", LoginHistorySchema, "LoginHistory");