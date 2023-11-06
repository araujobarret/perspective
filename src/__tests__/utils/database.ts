import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userModel } from "../../models/user";

let mongod: MongoMemoryServer;

// Connect to the in-memory database
export const connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  await userModel.ensureIndexes();
};

// Drop the test database and close the connection
export const disconnect = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop()
  }
};