import { userModel } from "../models/user";
import { User } from "../shared";

export const saveUser = async ({ id, email, createdAt }: User): Promise<User> => {
  const user = new userModel({ id, email, createdAt });

  const data = await user.save();

  return {
    id: data.id,
    email: data.email,
    createdAt: data.createdAt,
  };
};

export const getUsers = async (sortCreatedAt?: string): Promise<User[]> => {
  const sortParams = sortCreatedAt ? [["createdAt", sortCreatedAt]] : {};

  const data = await userModel.find({}, {})
    // normalizes the data coming from db
    .select("-_id -__v")
    .sort(sortParams);

  return data;
}