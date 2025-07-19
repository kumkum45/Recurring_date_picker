import React from 'react';
import { Calendar, X } from 'lucide-react';
import useRecurringStore from '../store/recurrenceStore';

export default function DateRangeSelector() {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useRecurringStore();

  const clearEndDate = () => {
    setEndDate('');
  };

  // Temporary helper function - might move to utils later
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error); // Debug error
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="start-date"
              type="date"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            End Date <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="end-date"
              type="date"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
            {endDate && (
              <button
                onClick={clearEndDate}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Clear end date"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Date Range Summary */}
      {(startDate || endDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Selected Range:</h4>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <span className="font-medium">
              {startDate ? formatDateForDisplay(startDate) : 'No start date'}
            </span>
            {endDate && (
              <>
                <span className="text-blue-400">→</span>
                <span className="font-medium">
                  {formatDateForDisplay(endDate)}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick validation - temporary implementation */}
      {startDate && endDate && new Date(startDate) > new Date(endDate) && (
        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
          ⚠️ End date should be after start date
        </div>
      )}
    </div>
  );
}
