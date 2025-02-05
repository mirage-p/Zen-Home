export function futureDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10); // Add 10 minutes to ensure the reminder is in the future
  return now.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
}

export function futureTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10); // Add 10 minutes
  return `${now.getHours()}:${
    now.getMinutes() < 10 ? "0" : ""
  }${now.getMinutes()}`;
}
