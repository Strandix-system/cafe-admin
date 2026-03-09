export const formatToLocalDateTime = (dateInput) => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};
