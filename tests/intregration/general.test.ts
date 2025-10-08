// Asegura que Jest esté disponible en el contexto de TypeScript
import "jest";
import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("API General", () => {
  describe("GET /api", () => {
    it("debe responder con un mensaje y código 200", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "ok");
    });
  });

  describe("Rutas no existentes", () => {
    it("debe responder con 404 para rutas no encontradas", async () => {
      const res = await request(app).get("/api/ruta-inexistente");
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Not Found");
    });
  });
});
