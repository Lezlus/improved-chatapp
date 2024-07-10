export function dateFormatter(date: string) {
  const formattedDate = new Date(date);
  let hours = formattedDate.getHours();
  const minutes = formattedDate.getMinutes() >= 10 ? (formattedDate.getMinutes()) : (`0${formattedDate.getMinutes()}`);
  const day = formattedDate.getDate()
  const month = formattedDate.getMonth() + 1;
  const year = formattedDate.getFullYear();
  const timeOfDay = hours > 11 ? "PM" : "AM"

  if (timeOfDay === "PM") {
    hours -= 12;
  }

  return `${month}/${day}/${year} ${hours}:${minutes} ${timeOfDay}`
}