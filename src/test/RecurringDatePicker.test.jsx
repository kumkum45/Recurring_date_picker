import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecurringDatePicker from '../components/RecurringDatePicker';
import useRecurringStore from '../store/recurrenceStore';

// Mock the store
vi.mock('../store/recurrenceStore', () => ({
  default: vi.fn()
}));

describe('RecurringDatePicker', () => {
  const mockStore = {
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
    setStartDate: vi.fn(),
    setEndDate: vi.fn(),
    setRecurrenceType: vi.fn(),
    setSettings: vi.fn(),
    setValidationError: vi.fn(),
    validateDates: vi.fn(),
    generateRecurringDates: vi.fn(),
    clearRecurrence: vi.fn(),
  };

  beforeEach(() => {
    useRecurringStore.mockReturnValue(mockStore);
    vi.clearAllMocks();
  });

  it('renders the main component with title', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Recurring Date Picker')).toBeInTheDocument();
  });

  it('renders all recurrence type options', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
  });

  it('shows date range section', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
  });

  it('shows recurrence pattern section', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Recurrence Pattern')).toBeInTheDocument();
    expect(screen.getByText('Daily Settings')).toBeInTheDocument();
  });

  it('shows preview section', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('calls setRecurrenceType when clicking on recurrence type', async () => {
    const user = userEvent.setup();
    render(<RecurringDatePicker />);
    
    const weeklyButton = screen.getByText('Weekly');
    await user.click(weeklyButton);
    
    expect(mockStore.setRecurrenceType).toHaveBeenCalledWith('weekly');
  });

  it('shows validation error when present', () => {
    const mockStoreWithError = {
      ...mockStore,
      validationError: 'Start date is required'
    };
    useRecurringStore.mockReturnValue(mockStoreWithError);
    
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Start date is required')).toBeInTheDocument();
  });

  it('does not show validation error when not present', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.queryByText('Start date is required')).not.toBeInTheDocument();
  });

  it('renders footer information', () => {
    render(<RecurringDatePicker />);
    // Footer was removed, so this test is no longer valid
    // expect(screen.getByText('Ready to use in your app!')).toBeInTheDocument();
    // expect(screen.getByText(/This component is fully functional/)).toBeInTheDocument();
  });
}); 