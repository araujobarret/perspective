import { Document, model, Schema } from "mongoose";
import { User } from "../shared";

export type UserDocument = Document & User
  
const userSchema = new Schema<UserDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

export const userModel = model<UserDocument>("user", userSchema);