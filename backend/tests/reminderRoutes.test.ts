import request from "supertest";
import app from "../src/server";

describe("Reminder API tests", () => {
  it("should return API Running Message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("API Running");
  });
});
