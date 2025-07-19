import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock date-fns to have consistent dates in tests
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  }),
  addDays: vi.fn((date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return new Date(result)
  }),
  addMonths: vi.fn((date, months) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return new Date(result)
  }),
  addYears: vi.fn((date, years) => {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return new Date(result)
  }),
  startOfWeek: vi.fn((date) => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day
    result.setDate(diff)
    return new Date(result)
  }),
  endOfWeek: vi.fn((date) => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + 6
    result.setDate(diff)
    return new Date(result)
  }),
  getDay: vi.fn((date) => new Date(date).getDay()),
  getDate: vi.fn((date) => new Date(date).getDate()),
  getMonth: vi.fn((date) => new Date(date).getMonth()),
  getYear: vi.fn((date) => new Date(date).getFullYear()),
  isSameDay: vi.fn((date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.toDateString() === d2.toDateString()
  }),
  isSameMonth: vi.fn((date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
  }),
  isSameYear: vi.fn((date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.getFullYear() === d2.getFullYear()
  }),
  parseISO: vi.fn((dateString) => new Date(dateString)),
  isValid: vi.fn((date) => !isNaN(new Date(date).getTime())),
  startOfMonth: vi.fn((date) => {
    const d = new Date(date);
    d.setDate(1);
    return new Date(d);
  }),
  endOfMonth: vi.fn((date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return new Date(d);
  }),
  eachDayOfInterval: vi.fn(({ start, end }) => {
    const days = [];
    let current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }),
})) 