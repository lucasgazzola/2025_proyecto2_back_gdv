import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("Auth API", () => {
  let userId: string;
  let token: string;

  const email = `test${Date.now()}@example.com`;
  const password = "password123";

  it("debe registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password, name: "Test User" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    userId = res.body.user.id;
  });

  it("debe loguear un usuario", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("debe obtener el perfil del usuario autenticado", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  it("debe hacer logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  it("debe poder eliminar el usuario", async () => {
    const res = await request(app)
      .delete(`/api/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    if (userId) {
      await request(app).delete(`/api/users/${userId}`);
    }
  });
});
