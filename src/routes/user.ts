import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { saveUser } from "../services/user";
import { MONGO_ERROR_CODES } from "../shared";

const postValidator = [
  body("id", "id cannot be empty").not().isEmpty(),
  body("email", "email cannot be empty").not().isEmpty(),
  body("email", "invalid email format").isEmail(),
  body("createdAt", "createdAt cannot be empty").not().isEmpty(),
  body("createdAt", "createdAt must be a date in format YYYY-MM-DD").isDate({
    format: "YYYY-MM-DD"
  }),
];

const router: Router = express.Router();

router.post("/", postValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = await saveUser(req.body);
      return res.status(201).send(user);
    } catch (e) {
      console.error(e)
      if(e?.code === MONGO_ERROR_CODES.duplicated_key) {
        return res.status(400).send({
          errorCode: "duplicated_key",
          message: "Duplicated entry found when saving the data"
        });
      }
      
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  return res.status(422).send({ errors: errors.array() });
});

export default router;