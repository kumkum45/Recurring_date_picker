import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useRecurringStore from '../store/recurrenceStore';

// Mock date-fns
vi.mock('date-fns', () => ({
  addDays: vi.fn((date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return new Date(result);
  }),
  addMonths: vi.fn((date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return new Date(result);
  }),
  addYears: vi.fn((date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return new Date(result);
  }),
  isValid: vi.fn((date) => !isNaN(new Date(date).getTime())),
  parseISO: vi.fn((dateString) => new Date(dateString)),
}));

describe('Recurrence Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useRecurringStore());
    act(() => {
      result.current.clearRecurrence();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useRecurringStore());
      expect(result.current.startDate).toBe('');
      expect(result.current.endDate).toBe('');
      expect(result.current.recurrenceType).toBe('daily');
      expect(result.current.validationError).toBe('');
      expect(result.current.generatedDates).toEqual([]);
      expect(result.current.settings).toEqual({
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
      });
    });
  });

  describe('Date Setters', () => {
    it('should set start date', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
      });
      expect(result.current.startDate).toBe('2024-01-15');
    });

    it('should set end date', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setEndDate('2024-12-31');
      });
      expect(result.current.endDate).toBe('2024-12-31');
    });
  });

  describe('Recurrence Type', () => {
    it('should set recurrence type', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setRecurrenceType('weekly');
      });
      expect(result.current.recurrenceType).toBe('weekly');
    });

    it('should accept all valid recurrence types', () => {
      const { result } = renderHook(() => useRecurringStore());
      const types = ['daily', 'weekly', 'monthly', 'yearly'];
      types.forEach(type => {
        act(() => {
          result.current.setRecurrenceType(type);
        });
        expect(result.current.recurrenceType).toBe(type);
      });
    });
  });

  describe('Settings', () => {
    it('should update settings', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setSettings({ everyXDays: 3 });
      });
      expect(result.current.settings.everyXDays).toBe(3);
    });

    it('should merge settings correctly', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setSettings({ everyXDays: 3 });
      });
      act(() => {
        result.current.setSettings({ daysOfWeek: [1, 3, 5] });
      });
      expect(result.current.settings.everyXDays).toBe(3);
      expect(result.current.settings.daysOfWeek).toEqual([1, 3, 5]);
    });
  });

  describe('Validation', () => {
    it('should return error for missing start date', () => {
      const { result } = renderHook(() => useRecurringStore());
      const error = result.current.validateDates();
      expect(error).toBe('Start date is required');
    });

    it('should return null for valid dates', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
      });
      const error = result.current.validateDates();
      expect(error).toBeNull();
    });

    it('should return error for invalid start date', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('invalid-date');
      });
      const error = result.current.validateDates();
      expect(error).toBe('Invalid start date');
    });

    it('should return error for invalid end date', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
        result.current.setEndDate('invalid-date');
      });
      const error = result.current.validateDates();
      expect(error).toBe('Invalid end date');
    });

    it('should return error when end date is before start date', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-12-31');
        result.current.setEndDate('2024-01-01');
      });
      const error = result.current.validateDates();
      expect(error).toBe('End date must be after start date');
    });
  });

  describe('Date Generation', () => {
    it('should return empty array when no start date', () => {
      const { result } = renderHook(() => useRecurringStore());
      const dates = result.current.generateRecurringDates();
      expect(dates).toEqual([]);
    });

    it('should return empty array when validation fails', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('invalid-date');
      });
      const dates = result.current.generateRecurringDates();
      expect(dates).toEqual([]);
    });

    it('should generate daily dates', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
        result.current.setRecurrenceType('daily');
        result.current.setSettings({ everyXDays: 2 });
      });
      let dates;
      act(() => {
        dates = result.current.generateRecurringDates();
      });
      expect(dates.length).toBeGreaterThan(0);
      expect(result.current.generatedDates.length).toBeGreaterThan(0);
    });

    it('should generate weekly dates', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
        result.current.setRecurrenceType('weekly');
        result.current.setSettings({ daysOfWeek: [1, 3, 5] });
      });
      let dates;
      act(() => {
        dates = result.current.generateRecurringDates();
      });
      expect(dates.length).toBeGreaterThan(0);
    });

    it('should generate monthly dates', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
        result.current.setRecurrenceType('monthly');
        result.current.setSettings({ dayOfMonth: 15 });
      });
      let dates;
      act(() => {
        dates = result.current.generateRecurringDates();
      });
      expect(dates.length).toBeGreaterThan(0);
    });

    it('should generate yearly dates', () => {
      const { result } = renderHook(() => useRecurringStore());
      act(() => {
        result.current.setStartDate('2024-01-15');
        result.current.setRecurrenceType('yearly');
        result.current.setSettings({ month: 0, day: 15 });
      });
      let dates;
      act(() => {
        dates = result.current.generateRecurringDates();
      });
      expect(dates.length).toBeGreaterThan(0);
    });
  });

  describe('Clear Recurrence', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useRecurringStore());
      // Set some values
      act(() => {
        result.current.setStartDate('2024-01-15');
        result.current.setEndDate('2024-12-31');
        result.current.setRecurrenceType('weekly');
        result.current.setSettings({ everyXWeeks: 2 });
        result.current.setValidationError('Some error');
      });
      // Clear everything
      act(() => {
        result.current.clearRecurrence();
      });
      // Check if everything is reset
      expect(result.current.startDate).toBe('');
      expect(result.current.endDate).toBe('');
      expect(result.current.recurrenceType).toBe('daily');
      expect(result.current.validationError).toBe('');
      expect(result.current.generatedDates).toEqual([]);
      expect(result.current.settings).toEqual({
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
      });
    });
  });
}); 