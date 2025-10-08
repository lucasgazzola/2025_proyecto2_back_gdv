import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("Health API", () => {
  it("debe responder con estado básico", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
  });

  it("debe responder con estado completo", async () => {
    const res = await request(app).get("/api/health/full");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
  });
});
