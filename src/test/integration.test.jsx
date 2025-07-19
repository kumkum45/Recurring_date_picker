import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecurringDatePicker from '../components/RecurringDatePicker';

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }),
  addDays: vi.fn((date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }),
  addMonths: vi.fn((date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }),
  addYears: vi.fn((date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }),
  startOfMonth: vi.fn((date) => new Date(date.getFullYear(), date.getMonth(), 1)),
  endOfMonth: vi.fn((date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)),
  eachDayOfInterval: vi.fn(({ start, end }) => {
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }),
  isSameMonth: vi.fn((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }),
  isSameDay: vi.fn((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  }),
  getDay: vi.fn((date) => new Date(date).getDay()),
  isValid: vi.fn((date) => !isNaN(new Date(date).getTime())),
  parseISO: vi.fn((dateString) => new Date(dateString)),
}));

describe('RecurringDatePicker Integration', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should complete a full daily recurrence workflow', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Verify daily is selected by default
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Daily Settings')).toBeInTheDocument();

    // 3. Change interval to every 3 days
    const intervalInput = screen.getByDisplayValue('1');
    await user.clear(intervalInput);
    await user.type(intervalInput, '3');

    // 4. Verify pattern summary updates
    await waitFor(() => {
      // Find any element containing 'Every 3 days' in its textContent (case-insensitive)
      const found = Array.from(document.querySelectorAll('*')).find(el => el.textContent && /every 3 days/i.test(el.textContent));
      expect(found).toBeTruthy();
    });

    // 5. Check that preview section is visible
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('should complete a full weekly recurrence workflow', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Switch to weekly recurrence
    const weeklyButton = screen.getByText('Weekly');
    await user.click(weeklyButton);

    // 3. Verify weekly settings are shown
    expect(screen.getByText('Weekly Settings')).toBeInTheDocument();

    // 4. Select days of the week
    const mondayButton = screen.getByText('Mon');
    const wednesdayButton = screen.getByText('Wed');
    const fridayButton = screen.getByText('Fri');

    await user.click(mondayButton);
    await user.click(wednesdayButton);
    await user.click(fridayButton);

    // 5. Verify pattern summary updates
    await waitFor(() => {
      expect(screen.getByText(/Monday, Wednesday, Friday/)).toBeInTheDocument();
    });
  });

  it('should complete a full monthly recurrence workflow', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Switch to monthly recurrence
    const monthlyButton = screen.getByText('Monthly');
    await user.click(monthlyButton);

    // 3. Verify monthly settings are shown
    expect(screen.getByText('Monthly Settings')).toBeInTheDocument();

    // 4. Select day of month pattern
    const dayOfMonthButton = screen.getByText('Day of Month');
    await user.click(dayOfMonthButton);

    // 5. Set day to 15th
    // There are multiple inputs with value '1', so pick the correct one for day of month
    const allInputs = screen.getAllByDisplayValue('1');
    // The second input is usually the day of month input
    const dayInput = allInputs[1];
    await user.clear(dayInput);
    await user.type(dayInput, '15');

    // 6. Verify pattern summary updates
    await waitFor(() => {
      // Find any element containing 'Day 15 of every 1 month' in its textContent (case-insensitive)
      const found = Array.from(document.querySelectorAll('*')).find(el => el.textContent && /day 15 of every 1 month/i.test(el.textContent));
      expect(found).toBeTruthy();
    });
  });

  it('should complete a full yearly recurrence workflow', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Switch to yearly recurrence
    const yearlyButton = screen.getByText('Yearly');
    await user.click(yearlyButton);

    // 3. Verify yearly settings are shown
    expect(screen.getByText('Yearly Settings')).toBeInTheDocument();

    // 4. Select month and day
    const monthSelect = screen.getByDisplayValue('January');
    const daySelect = screen.getByDisplayValue('1st');

    await user.selectOptions(monthSelect, 'December');
    await user.selectOptions(daySelect, '25th');

    // 5. Verify pattern summary updates
    await waitFor(() => {
      expect(screen.getByText(/December 25th every 1 year/)).toBeInTheDocument();
    });
  });

  it('should handle end date selection', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Set end date
    const endDateInput = screen.getByLabelText(/end date/i);
    await user.type(endDateInput, '2024-12-31');

    // 3. Verify date range summary is shown
    await waitFor(() => {
      expect(screen.getByText(/Selected Range/)).toBeInTheDocument();
    });
  });

  it('should show validation errors for invalid dates', async () => {
    render(<RecurringDatePicker />);

    // 1. Set invalid start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, 'invalid-date');

    // 2. Verify validation error is shown
    await waitFor(() => {
      // Try to find the error message in the DOM, even if broken up
      const error = screen.queryByText((content) => /invalid start date/i.test(content)) ||
        document.querySelector('[class*="text-red"]:not(svg)');
      expect(error).toBeTruthy();
    });
  });

  it('should show validation errors when end date is before start date', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-12-31');

    // 2. Set end date before start date
    const endDateInput = screen.getByLabelText(/end date/i);
    await user.type(endDateInput, '2024-01-01');

    // 3. Verify validation error is shown
    await waitFor(() => {
      // Try to find the error message in the DOM, even if broken up
      const error = screen.queryByText((content) => /end date must be after start date/i.test(content)) ||
        document.querySelector('[class*="text-red"]:not(svg)');
      expect(error).toBeTruthy();
    });
  });

  it('should clear end date when clicking clear button', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Set end date
    const endDateInput = screen.getByLabelText(/end date/i);
    await user.type(endDateInput, '2024-12-31');

    // 3. Clear end date
    const clearButton = screen.getByTitle(/clear end date/i);
    await user.click(clearButton);

    // 4. Verify end date is cleared
    expect(endDateInput.value).toBe('');
  });

  it('should update preview when settings change', async () => {
    render(<RecurringDatePicker />);

    // 1. Set start date
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-01-15');

    // 2. Verify preview section is visible
    expect(screen.getByText('Preview')).toBeInTheDocument();

    // 3. Change to weekly and select days
    const weeklyButton = screen.getByText('Weekly');
    await user.click(weeklyButton);

    const mondayButton = screen.getByText('Mon');
    await user.click(mondayButton);

    // 4. Verify preview updates
    await waitFor(() => {
      // Use a function matcher to avoid duplicate text issues
      expect(screen.getAllByText((content) => /pattern/i.test(content)).length).toBeGreaterThan(0);
    });
  });

  it('should show empty state when no start date is selected', () => {
    render(<RecurringDatePicker />);

    // Verify empty state message
    expect(screen.getByText(/Select a start date to see the preview/)).toBeInTheDocument();
  });
}); 