import React from 'react';
import { Calendar, Repeat, Gift } from 'lucide-react';
import useRecurringStore from '../store/recurrenceStore';

export default function YearlySettings() {
  const { settings, setSettings } = useRecurringStore();

  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  const handleIntervalChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setSettings({ everyXYears: value });
    }
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSettings({ month });
  };

  const handleDayChange = (e) => {
    const day = parseInt(e.target.value);
    if (day >= 1 && day <= 31) {
      setSettings({ day });
    }
  };

  const getMaxDaysForMonth = (month) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month] || 31;
  };

  const getPatternDescription = () => {
    const month = months.find(m => m.value === settings.month)?.label || 'January';
    const day = settings.day || 1;
    const interval = settings.everyXYears || 1;
    
    return `${month} ${day}${getOrdinalSuffix(day)} every ${interval} ${interval === 1 ? 'year' : 'years'}`;
  };

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="space-y-6">
      {/* Year Interval */}
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
              max="10"
              value={settings.everyXYears || 1}
              onChange={handleIntervalChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-semibold"
            />
          </div>
          <span className="text-gray-700 font-medium">
            {settings.everyXYears === 1 ? 'year' : 'years'}
          </span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Month</label>
            <select
              value={settings.month || 0}
              onChange={handleMonthChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Day</label>
            <select
              value={settings.day || 1}
              onChange={handleDayChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {Array.from({ length: getMaxDaysForMonth(settings.month || 0) }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day}{getOrdinalSuffix(day)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pattern Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Gift className="w-5 h-5 text-blue-600 mt-0.5" />
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
        <p>• Perfect for birthdays, anniversaries, and annual events</p>
        <p>• Maximum interval: 10 years</p>
        <p>• Pattern will continue until end date (if specified) or for 10 years</p>
        <p>• February 29th will be handled automatically for leap years</p>
      </div>
    </div>
  );
}
