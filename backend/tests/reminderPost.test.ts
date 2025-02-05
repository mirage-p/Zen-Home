import request from "supertest";
import app from "../src/server";
import prisma from "../src/utils/prisma";
import { futureDate, futureTime } from "../src/utils/createDateTime";
import { error } from "console";

describe("POST /reminders", () => {
  let existingReminder: { id: string; name: string; date: Date; time: string };
  beforeAll(async () => {
    const date = futureDate();
    const time = futureTime();
    existingReminder = await prisma.reminder.create({
      data: {
        name: "Test Reminder",
        description: "A pre-existing reminder",
        date: new Date(date),
        time: time,
      },
    });
  });

  afterAll(async () => {
    await prisma.reminder.delete({
      where: {
        id: existingReminder.id,
      },
    });
  });

  it("should create a new reminder when valid data is provided", async () => {
    const createdReminder = {
      name: "Test New Reminder",
      description: "This is a new reminder",
      date: futureDate(),
      time: futureTime(),
    };
    const res = await request(app).post("/reminders").send(createdReminder);
    expect(res.status).toBe(201);
    expect(res.body.newReminder).toHaveProperty("id");
    expect(res.body.newReminder.name).toBe(createdReminder.name);
    await prisma.reminder.delete({ where: { id: res.body.newReminder.id } });
  });

  it("should return an error if required fields are missing", async () => {
    const newReminder = {
      name: "Missing Reminder",
      description: "Missing date and time",
    };
    const res = await request(app).post("/reminders").send(newReminder);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });

  it("should return an error if the reminder already exists with the same name, date, and time", async () => {
    const newReminder = {
      name: existingReminder.name,
      description: "Trying to create an existing reminder",
      date: existingReminder.date,
      time: existingReminder.time,
    };
    const res = await request(app).post("/reminders").send(newReminder);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Reminder already exists with that name, date, and time"
    );
  });
  it("should return an error if the date/time are in the past", async () => {
    const pastDate = new Date();
    pastDate.setMinutes(pastDate.getMinutes() - 30);
    const pastReminder = {
      name: "Past Reminder",
      description: "This reminder has a date in the past",
      date: pastDate.toISOString().split("T")[0],
      time: `${pastDate.getHours()}:${
        pastDate.getMinutes() < 10 ? "0" : ""
      }${pastDate.getMinutes()}`,
    };
    const res = await request(app).post("/reminders").send(pastReminder);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Reminder must be scheduled for a future date and time"
    );
  });

  it("should return an error if there is an internal server error", async () => {
    const mockPrisma = jest
      .spyOn(prisma.reminder, "create")
      .mockImplementation(() => {
        throw new Error("Database Error");
      });

    const newReminder = {
      name: "Server Error Reminder",
      description: "Simulating server error",
      date: futureDate(),
      time: futureTime(),
    };

    const res = await request(app).post("/reminders").send(newReminder);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to create reminder");
    mockPrisma.mockRestore();
  });
});
