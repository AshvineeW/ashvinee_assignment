export const getCurrentDay = (): string => {
  const daysOfWeek = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];

  const today = new Date();
  const dayIndex = today.getDay();

  return daysOfWeek[dayIndex];
};
