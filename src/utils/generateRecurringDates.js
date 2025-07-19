// utils/generateRecurringDates.js

// Monthly recurrence: generates dates for a given day of month and interval
export function generateMonthlyPreview(startDate, endDate, dayOfMonth, interval = 1) {
  const result = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  // Set to the first occurrence on/after startDate
  current.setDate(dayOfMonth);
  if (current < new Date(startDate)) {
    current.setMonth(current.getMonth() + 1);
    current.setDate(dayOfMonth);
  }

  while (current <= end) {
    // Only add if valid (e.g., skip 31st Feb)
    if (current.getDate() === parseInt(dayOfMonth)) {
      result.push(new Date(current));
    }
    current.setMonth(current.getMonth() + interval);
    current.setDate(dayOfMonth);
  }

  return result;
}

// Daily recurrence (stub)
export function generateDailyPreview(startDate, endDate, interval = 1) {
  // TODO: Implement
  return [];
}

// Weekly recurrence (stub)
export function generateWeeklyPreview(startDate, endDate, daysOfWeek, interval = 1) {
  // TODO: Implement
  return [];
}

// Yearly recurrence (stub)
export function generateYearlyPreview(startDate, endDate, month, day, interval = 1) {
  // TODO: Implement
  return [];
}
