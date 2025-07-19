import React from 'react';
import { Calendar, Repeat, Check } from 'lucide-react';
import useRecurringStore from '../store/recurrenceStore';

export default function WeeklySettings() {
  const { settings, setSettings } = useRecurringStore();

  // TODO: Maybe add "Select All" and "Clear All" buttons later
  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' },
  ];

  const handleIntervalChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 52) {
      setSettings({ everyXWeeks: value });
    }
  };

  const toggleDay = (dayId) => {
    const currentDays = settings.daysOfWeek || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(id => id !== dayId)
      : [...currentDays, dayId];
    
    setSettings({ daysOfWeek: newDays });
  };

  const selectedDays = settings.daysOfWeek || [];

  return (
    <div className="space-y-6">
      {/* Week Interval */}
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
              max="52"
              value={settings.everyXWeeks || 1}
              onChange={handleIntervalChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-semibold"
            />
          </div>
          <span className="text-gray-700 font-medium">
            {settings.everyXWeeks === 1 ? 'week' : 'weeks'}
          </span>
        </div>
      </div>

      {/* Day Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Select days of the week
        </label>
        
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 text-gray-600'
                }`}
              >
                <div className="text-xs font-medium">{day.short}</div>
                {isSelected && (
                  <Check className="w-3 h-3 mx-auto mt-1 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Pattern Summary
            </h4>
            <p className="text-sm text-blue-700">
              {settings.everyXWeeks === 1 ? 'Every week' : `Every ${settings.everyXWeeks} weeks`}
              {selectedDays.length > 0 && (
                <span> on {selectedDays
                  .map(id => daysOfWeek.find(d => d.id === id)?.name)
                  .filter(Boolean)
                  .join(', ')}</span>
              )}
            </p>
            {selectedDays.length === 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Please select at least one day of the week
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Select one or more days of the week</p>
        <p>• Maximum interval: 52 weeks</p>
        <p>• Pattern will continue until end date (if specified) or for 1 year</p>
        {/* FIXME: Add tooltip for better UX */}
      </div>
    </div>
  );
}
