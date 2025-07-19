import { create } from 'zustand';
import { addDays, addMonths, addYears, format, isValid, parseISO } from 'date-fns';

const useRecurringStore = create((set, get) => ({
  // Basic state
  startDate: '',
  endDate: '',
  recurrenceType: 'daily', // 'daily', 'weekly', 'monthly', 'yearly'
  settings: {
    // Daily settings
    everyXDays: 1,
    
    // Weekly settings
    everyXWeeks: 1,
    daysOfWeek: [],
    
    // Monthly settings
    everyXMonths: 1,
    dayOfMonth: 1,
    weekOfMonth: 1, // 1-5 (first, second, third, fourth, last)
    dayOfWeek: 0, // 0-6 (Sunday-Saturday)
    
    // Yearly settings
    everyXYears: 1,
    month: 0, // 0-11 (January-December)
    day: 1,
  },
  validationError: '',
  generatedDates: [],

  // Actions
  setStartDate: (date) => {
    console.log('Setting start date:', date); // Debug log
    set({ startDate: date });
  },
  setEndDate: (date) => {
    console.log('Setting end date:', date); // Debug log
    set({ endDate: date });
  },
  setRecurrenceType: (type) => {
    console.log('Changing recurrence type to:', type); // Debug log
    set({ recurrenceType: type });
  },
  
  setSettings: (newSettings) => {
    console.log('Updating settings:', newSettings); // Debug log
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  setValidationError: (msg) => set({ validationError: msg }),

  // Validation
  validateDates: () => {
    const { startDate, endDate } = get();
    
    if (!startDate) {
      return 'Start date is required';
    }
    
    if (!isValid(parseISO(startDate))) {
      return 'Invalid start date';
    }
    
    if (endDate && !isValid(parseISO(endDate))) {
      return 'Invalid end date';
    }
    
    if (endDate && parseISO(startDate) > parseISO(endDate)) {
      return 'End date must be after start date';
    }
    
    return null;
  },

  // Generate recurring dates
  generateRecurringDates: () => {
    const { startDate, endDate, recurrenceType, settings } = get();

    // Robust validation as suggested by user
    function isValidDate(date) {
      return date && !isNaN(new Date(date).getTime());
    }
    if (!startDate || !isValidDate(startDate)) {
      return [];
    }
    if (endDate && !isValidDate(endDate)) {
      return [];
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      return [];
    }

    console.log('Generating dates for:', { startDate, endDate, recurrenceType, settings }); // Debug log

    const start = parseISO(startDate);
    const end = endDate ? parseISO(endDate) : addYears(start, 1);
    const dates = [];

    switch (recurrenceType) {
      case 'daily':
        dates.push(...generateDailyDates(start, end, settings.everyXDays));
        break;
      case 'weekly':
        dates.push(...generateWeeklyDates(start, end, settings));
        break;
      case 'monthly':
        dates.push(...generateMonthlyDates(start, end, settings));
        break;
      case 'yearly':
        dates.push(...generateYearlyDates(start, end, settings));
        break;
      default:
        console.warn('Unknown recurrence type:', recurrenceType); // Debug warning
    }

    console.log('Generated', dates.length, 'dates'); // Debug log
    set({ generatedDates: dates });
    return dates;
  },

  clearRecurrence: () => {
    console.log('Clearing all recurrence data'); // Debug log
    set({
      startDate: '',
      endDate: '',
      recurrenceType: 'daily',
      settings: {
        everyXDays: 1,
        everyXWeeks: 1,
        daysOfWeek: [],
        everyXMonths: 1,
        dayOfMonth: 1,
        weekOfMonth: 1,
        dayOfWeek: 0,
        everyXYears: 1,
        month: 0,
        day: 1,
      },
      validationError: '',
      generatedDates: [],
    });
  },
}));

// Helper functions for date generation
function generateDailyDates(start, end, interval) {
  const dates = [];
  let current = new Date(start);
  
  while (current <= end && dates.length < 100) {
    dates.push(new Date(current));
    current = addDays(current, interval);
  }
  
  return dates;
}

function generateWeeklyDates(start, end, settings) {
  const dates = [];
  let { everyXWeeks, daysOfWeek } = settings;
  if (!daysOfWeek || daysOfWeek.length === 0) {
    daysOfWeek = [start.getDay()];
  }
  // Find the first week start (Sunday before or on start)
  let weekStart = new Date(start);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  while (weekStart <= end && dates.length < 100) {
    daysOfWeek.forEach(dayIdx => {
      // Calculate the date for this day in the current week
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + ((dayIdx + 7) % 7));
      // Only add if within range and not before start
      if (d >= start && d <= end && d >= weekStart && d < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        dates.push(new Date(d));
      }
    });
    // Move to next interval week
    weekStart.setDate(weekStart.getDate() + everyXWeeks * 7);
  }
  // Sort and deduplicate
  return Array.from(new Set(dates.map(d => d.getTime()))).map(t => new Date(t)).sort((a, b) => a - b);
}

function generateMonthlyDates(start, end, settings) {
  const dates = [];
  let current = new Date(start);
  const { everyXMonths, dayOfMonth, weekOfMonth, dayOfWeek } = settings;
  
  while (current <= end && dates.length < 100) {
    if (weekOfMonth === 0) {
      // Specific day of month
      const targetDate = new Date(current.getFullYear(), current.getMonth(), dayOfMonth);
      if (targetDate >= start && targetDate <= end) {
        dates.push(targetDate);
      }
    } else {
      // Nth day of week in month
      const targetDate = getNthDayOfWeekInMonth(current.getFullYear(), current.getMonth(), weekOfMonth, dayOfWeek);
      if (targetDate >= start && targetDate <= end) {
        dates.push(targetDate);
      }
    }
    
    current = addMonths(current, everyXMonths);
  }
  
  return dates;
}

function generateYearlyDates(start, end, settings) {
  const dates = [];
  let current = new Date(start);
  const { everyXYears, month, day } = settings;
  
  while (current <= end && dates.length < 100) {
    const targetDate = new Date(current.getFullYear(), month, day);
    if (targetDate >= start && targetDate <= end) {
      dates.push(targetDate);
    }
    current = addYears(current, everyXYears);
  }
  
  return dates;
}

function getNthDayOfWeekInMonth(year, month, weekOfMonth, dayOfWeek) {
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();
  let targetDate;
  
  if (weekOfMonth === 5) {
    // Last occurrence
    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfWeek = lastDay.getDay();
    const daysFromLast = (lastDayOfWeek - dayOfWeek + 7) % 7;
    targetDate = new Date(year, month + 1, lastDay.getDate() - daysFromLast);
  } else {
    // Nth occurrence
    const daysFromFirst = (dayOfWeek - firstDayOfWeek + 7) % 7;
    targetDate = new Date(year, month, 1 + daysFromFirst + (weekOfMonth - 1) * 7);
  }
  
  return targetDate;
}

export default useRecurringStore;
