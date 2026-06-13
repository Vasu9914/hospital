const pad = (value) => String(value).padStart(2, "0");

export const formatDate = (date) => {
  if (!date) return "";

  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return String(date);

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
};

export const formatTime = (time) => {
  if (!time) return "";

  if (time instanceof Date) {
    return `${pad(((time.getHours() + 11) % 12) + 1)}:${pad(time.getMinutes())} ${time.getHours() >= 12 ? "PM" : "AM"}`;
  }

  const normalized = String(time).trim();

  if (/\b(am|pm)\b/i.test(normalized)) {
    return normalized.toUpperCase();
  }

  const parsed = new Date(`1970-01-01T${normalized}`);
  if (!Number.isNaN(parsed.getTime())) {
    const hours = parsed.getHours();
    const minutes = pad(parsed.getMinutes());
    const displayHour = ((hours + 11) % 12) + 1;
    const period = hours >= 12 ? "PM" : "AM";

    return `${displayHour}:${minutes} ${period}`;
  }

  const [hour = "0", minute = "00"] = normalized.split(":");
  const numericHour = Number(hour);

  if (Number.isNaN(numericHour)) return normalized;

  const displayHour = ((numericHour + 11) % 12) + 1;
  const period = numericHour >= 12 ? "PM" : "AM";

  return `${displayHour}:${pad(minute)} ${period}`;
};