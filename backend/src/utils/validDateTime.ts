export default function isValidDateTime(date: string, time: string): boolean {
  const now = new Date();
  const reminderDateTime = new Date(`${date}T${time}:00.000Z`);
  return reminderDateTime >= now;
}
