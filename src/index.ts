import express, { Express } from 'express';
import { config as dotEnvConfig } from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors';
import user from "./routes/user";
import users from "./routes/users";

dotEnvConfig();

const app: Express = express();

if (process.env.NODE_ENV !== 'test') {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on("connected", () => {
    console.log("[info]: Connected to MongoDB");
  });
}

app.use(cors())
app.use(express.json())
app.options('*', cors());

app.use("/user", user)
app.use("/users", users)

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3111;
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
