import React, { useState, useEffect } from 'react';
import { Calendar, Repeat } from 'lucide-react';
import useRecurringStore from '../store/recurrenceStore';

export default function DailySettings() {
  const { settings, setSettings, generateRecurringDates } = useRecurringStore();
  const [inputValue, setInputValue] = useState(settings.everyXDays || 1);

  useEffect(() => {
    setInputValue(settings.everyXDays || 1);
  }, [settings.everyXDays]);

  const handleIntervalChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (/^\d+$/.test(value) && +value > 0 && +value <= 365) {
      setSettings({ everyXDays: +value });
      generateRecurringDates();
    }
  };

  // Defensive fallback for summary
  const days = settings.everyXDays && settings.everyXDays > 0 ? settings.everyXDays : 1;

  // Experimental feature - might remove later
  const quickPresets = [1, 2, 3, 7, 14, 30];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Repeat className="w-4 h-4" />
        <span>Repeat every</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="number"
            min="1"
            max="365"
            value={inputValue}
            onChange={handleIntervalChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-semibold"
          />
        </div>
        <span className="text-gray-700 font-medium">
          {days === 1 ? 'day' : 'days'}
        </span>
      </div>

      {/* Quick presets - experimental */}
      <div className="space-y-2">
        <label className="block text-xs text-gray-500">Quick presets:</label>
        <div className="flex flex-wrap gap-2">
          {quickPresets.map(preset => (
            <button
              key={preset}
              onClick={() => setSettings({ everyXDays: preset })}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                settings.everyXDays === preset
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {preset} {preset === 1 ? 'day' : 'days'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Pattern Summary
            </h4>
            <p className="text-sm text-blue-700">
              {(days === 1 
                ? 'Every day' 
                : `Every ${days} days`).replace(/\s+/g, ' ').trim()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Starting from the selected start date
            </p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>• Maximum interval: 365 days</p>
        <p>• Pattern will continue until end date (if specified) or for 1 year</p>
        {/* TODO: Add more validation messages */}
      </div>
    </div>
  );
}
