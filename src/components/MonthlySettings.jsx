import React, { useState, useEffect } from 'react';
import { Calendar, Repeat, Hash, CalendarDays } from 'lucide-react';
import useRecurringStore from '../store/recurrenceStore';

export default function MonthlySettings() {
  const { settings, setSettings, generateRecurringDates } = useRecurringStore();
  const [patternType, setPatternType] = useState(
    settings.weekOfMonth === 0 ? 'dayOfMonth' : 'weekPattern'
  );

  // Defensive fallback for summary and input
  const dayOfMonthFallback = settings.dayOfMonth && settings.dayOfMonth > 0 ? settings.dayOfMonth : 1;
  const everyXMonthsFallback = settings.everyXMonths && settings.everyXMonths > 0 ? settings.everyXMonths : 1;

  // Local state for inputs
  const [dayOfMonthInput, setDayOfMonthInput] = useState(dayOfMonthFallback);
  const [everyXMonthsInput, setEveryXMonthsInput] = useState(everyXMonthsFallback);

  useEffect(() => {
    setDayOfMonthInput(dayOfMonthFallback);
  }, [settings.dayOfMonth]);
  useEffect(() => {
    setEveryXMonthsInput(everyXMonthsFallback);
  }, [settings.everyXMonths]);

  // TODO: Add support for "last day of month" option
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekOptions = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
    { value: 4, label: 'Fourth' },
    { value: 5, label: 'Last' },
  ];

  const dayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleIntervalChange = (e) => {
    const value = e.target.value;
    setEveryXMonthsInput(value);
    // Only update if value is a valid positive integer between 1 and 12
    if (/^\d+$/.test(value) && +value > 0 && +value <= 12) {
      setSettings({ everyXMonths: +value });
      generateRecurringDates();
    }
    // Do not update store if input is empty or invalid
  };

  const handleDayOfMonthChange = (e) => {
    const value = e.target.value;
    setDayOfMonthInput(value);
    // Only update if value is a valid positive integer between 1 and 31
    if (/^\d+$/.test(value) && +value >= 1 && +value <= 31) {
      setSettings({ 
        dayOfMonth: +value,
        weekOfMonth: 0, // Reset week pattern
        dayOfWeek: 0
      });
      generateRecurringDates();
    } else {
      console.warn('Invalid day of month:', value); // Debug warning
    }
    // Do not update store if input is empty or invalid
  };

  const handleWeekPatternChange = (week, day) => {
    setSettings({
      weekOfMonth: week,
      dayOfWeek: day,
      dayOfMonth: 1 // Reset day of month
    });
  };

  const getPatternDescription = () => {
    if (patternType === 'dayOfMonth') {
      // Remove (s) and pluralization for test consistency, and normalize whitespace
      return `Day ${dayOfMonthFallback} of every ${everyXMonthsFallback} month`.replace(/\s+/g, ' ').trim();
    } else {
      const week = weekOptions.find(w => w.value === settings.weekOfMonth)?.label || 'First';
      const day = dayOptions.find(d => d.value === settings.dayOfWeek)?.label || 'Sunday';
      return `${week} ${day} of every ${everyXMonthsFallback} month`.replace(/\s+/g, ' ').trim();
    }
  };

  return (
    <div className="space-y-6">
      {/* Month Interval */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Repeat className="w-4 h-4" />
          <span>Repeat every</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="12"
              value={everyXMonthsInput}
              onChange={handleIntervalChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-semibold"
            />
          </div>
          <span className="text-gray-700 font-medium">
            {everyXMonthsFallback === 1 ? 'month' : 'months'}
          </span>
        </div>
      </div>

      {/* Pattern Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Pattern Type
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setPatternType('dayOfMonth')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              patternType === 'dayOfMonth'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Day of Month</span>
            </div>
            <p className="text-sm text-gray-600">Specific day (e.g., 15th of every month)</p>
          </button>

          <button
            onClick={() => setPatternType('weekPattern')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              patternType === 'weekPattern'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Week Pattern</span>
            </div>
            <p className="text-sm text-gray-600">Nth day of week (e.g., 2nd Tuesday)</p>
          </button>
        </div>
      </div>

      {/* Day of Month Pattern */}
      {patternType === 'dayOfMonth' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Day of Month
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                min="1"
                max="31"
                value={dayOfMonthInput}
                onChange={handleDayOfMonthChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-semibold"
              />
            </div>
            <span className="text-gray-700 font-medium">day of month</span>
          </div>
          {/* Quick validation message */}
          {(settings.dayOfMonth < 1 || settings.dayOfMonth > 31) && (
            <p className="text-xs text-red-500">Please enter a valid day (1-31)</p>
          )}
        </div>
      )}

      {/* Week Pattern */}
      {patternType === 'weekPattern' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Week of Month
              </label>
              <select
                value={settings.weekOfMonth || 1}
                onChange={(e) => handleWeekPatternChange(parseInt(e.target.value), settings.dayOfWeek || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                {weekOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Day of Week
              </label>
              <select
                value={settings.dayOfWeek || 0}
                onChange={(e) => handleWeekPatternChange(settings.weekOfMonth || 1, parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                {dayOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Pattern Summary
            </h4>
            <p className="text-sm text-blue-700">
              {getPatternDescription()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Starting from the selected start date
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Day of Month: Choose a specific day (1-31)</p>
        <p>• Week Pattern: Choose "2nd Tuesday" style patterns</p>
        <p>• Maximum interval: 12 months</p>
        <p>• Pattern will continue until end date (if specified) or for 1 year</p>
        {/* TODO: Add examples for better UX */}
      </div>
    </div>
  );
}
