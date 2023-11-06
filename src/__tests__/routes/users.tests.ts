import request from "supertest";
import { connect, disconnect } from "../utils/database";
import app from "../../index";
import { User } from "../../shared";

beforeEach(async () => {
  await connect();
});

afterEach(async () => {
  await disconnect();
});

describe("GET /users", () => {
  const saveUsers = async () => {
    await request(app)
      .post("/user")
      .send(users[0]);
    await request(app)
      .post("/user")
      .send(users[1]);
  };

  it("gets the user collection", async () => {
    await saveUsers()
    const response = await request(app)
      .get("/users")
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject(users[0]);
    expect(response.body[1]).toMatchObject(users[1]);
  });

  it("gets the user collection sorted by createdAt ascending", async () => {
    await saveUsers()
    const response = await request(app)
      .get("/users?created=ascending")
      .send();
    
    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject(users[1]);
    expect(response.body[1]).toMatchObject(users[0]);
  });

  it("gets the user collection sorted by createdAt descending", async () => {
    await saveUsers()
    const response = await request(app)
      .get("/users?created=descending")
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject(users[0]);
    expect(response.body[1]).toMatchObject(users[1]);
  });

  it("returns 500", async () => {
    await disconnect();
    const response = await request(app)
      .get("/users")
      .send();

    expect(response.status).toBe(500);
  });

  describe("validation error handling", () => {
    it("returns 422 given a wrong created query value", async () => {
      const response = await request(app)
        .get("/users?created=invalid-query-param")
        .send();

      expect(response.status).toBe(422);
    });
  });
});

const users: User[] = [
  {
    id: "1",
    email: "testmail@mail.com",
    createdAt: "2023-12-01",
  },
  {
    id: "2",
    email: "testmai2@mail.com",
    createdAt: "2023-11-01",
  },
];