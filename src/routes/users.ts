import express, { Request, Response, Router } from "express";
import { query, validationResult } from "express-validator";
import { getUsers } from "../services/user";

const router: Router = express.Router();

const getValidator = [
  query("created", "only 'ascending' or 'descending' is accepted'")
    .optional()
    .isIn(["ascending", "descending"])
]

router.get("/", getValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const created = req.query.created as string | undefined
      const users = await getUsers(created);
      return res.status(200).send(users);
    } catch(e) {
      console.error(e);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  return res.status(422).send({ errors: errors.array() });
});

export default router;
