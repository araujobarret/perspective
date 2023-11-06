import request from "supertest";
import { connect, disconnect } from "../utils/database";
import app from "../../index"
import { User } from "../../shared";

beforeEach(async () => {
  await connect();
});

afterEach(async () => {
  await disconnect();
});

describe("POST /user", () => {
  const saveUser = (user?: User) => request(app)
    .post("/user")
    .send(user ?? userMock);

  it("successfully saves a user", async () => {
    const response = await saveUser();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(userMock);
  });

  it("returns 400 when trying to save another user with an email already used", async () => {
    await saveUser();
    const response = await saveUser({ ...userMock, id: "post-2" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errorCode: "duplicated_key",
      message: "Duplicated entry found when saving the data",
    });
  });

  it("returns 400 when trying to save another user with an id already used", async () => {
    await saveUser();
    const response = await saveUser({ ...userMock, email: "post-test2@mail.com" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errorCode: "duplicated_key",
      message: "Duplicated entry found when saving the data",
    });
  });

  it("returns 500", async () => {
    await disconnect();
    const response = await saveUser();

    expect(response.status).toBe(500);
  });

  describe("validation error handling", () => {
    it("returns 422 given an invalid email", async () => {
      const response = await saveUser({ ...userMock, email: "email@" });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe("email");
      expect(response.body.errors[0].msg).toBe("invalid email format");
    });

    it("returns 422 given an invalid createdAt date format", async () => {
      const response = await saveUser({ ...userMock, createdAt: "01-12-2023" });

      expect(response.status).toBe(422);
      expect(response.body.errors[0].path).toBe("createdAt");
      expect(response.body.errors[0].msg).toBe("createdAt must be a date in format YYYY-MM-DD");
    });

    it("returns 422 given a missing id", async () => {
      const response = await saveUser({ email: "ab@mail.com", createdAt: "2023-12-01" } as any);

      expect(response.status).toBe(422);
      expect(response.body.errors[0].path).toBe("id");
      expect(response.body.errors[0].msg).toBe("id cannot be empty");
    });

    it("returns 422 given a missing email", async () => {
      const response = await saveUser({ id: "1", createdAt: "2023-12-01" } as any);

      expect(response.status).toBe(422);
      expect(response.body.errors[0].path).toBe("email");
      expect(response.body.errors[0].msg).toBe("email cannot be empty");
    });

    it("returns 422 given a missing createdAt", async () => {
      const response = await saveUser({ id: "1", email: "ab@mail.com" } as any);

      expect(response.status).toBe(422);
      expect(response.body.errors[0].path).toBe("createdAt");
      expect(response.body.errors[0].msg).toBe("createdAt cannot be empty");
    });
  });
});

const userMock = {
  id: "post-1",
  email: "post-test@mail.com",
  createdAt: "2023-12-01",
}