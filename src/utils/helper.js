export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
export const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12; // convert 0 → 12

  return `${h}:${minute} ${ampm}`;
};