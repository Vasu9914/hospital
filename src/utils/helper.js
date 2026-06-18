const pad = (value) => String(value).padStart(2, "0");

const parseDate = (date) => {
  if (!date) return null;

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const normalized = String(date).trim();
  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const parsed = new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3])
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (date) => {
  const value = parseDate(date);
  if (!value) return date ? String(date) : "";

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
};

export const formatDisplayDate = (date, style = "medium") => {
  const value = parseDate(date);
  if (!value) return date ? String(date) : "";

  if (style === "long") {
    return value.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (style === "short") {
    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return value.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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