import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import useRecurringStore from '../store/recurrenceStore';

const CalendarPreview = () => {
  const { startDate, endDate, recurrenceType, settings, generatedDates } = useRecurringStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Update current month when start date changes
  useEffect(() => {
    if (startDate) {
      setCurrentMonth(new Date(startDate));
    }
  }, [startDate]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const getCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startDay = getDay(start);
    
    // Get all days in the month
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // Add padding days from previous month
    const paddingStart = Array.from({ length: startDay }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() - (startDay - i));
      return { date, isCurrentMonth: false };
    });
    
    // Add padding days from next month
    const totalDays = paddingStart.length + daysInMonth.length;
    const paddingEnd = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => {
      const date = new Date(end);
      date.setDate(date.getDate() + i + 1);
      return { date, isCurrentMonth: false };
    });
    
    return [
      ...paddingStart,
      ...daysInMonth.map(date => ({ date, isCurrentMonth: true })),
      ...paddingEnd
    ];
  };

  const isRecurringDate = (date) => {
    return generatedDates.some(generatedDate => isSameDay(generatedDate, date));
  };

  const isStartDate = (date) => {
    return startDate && isSameDay(new Date(startDate), date);
  };

  const isEndDate = (date) => {
    return endDate && isSameDay(new Date(endDate), date);
  };

  const getDateClasses = (date, isCurrentMonth) => {
    let classes = 'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors duration-200';
    
    if (!isCurrentMonth) {
      classes += ' text-gray-300';
    } else if (isStartDate(date)) {
      classes += ' bg-green-500 text-white font-semibold';
    } else if (isEndDate(date)) {
      classes += ' bg-red-500 text-white font-semibold';
    } else if (isRecurringDate(date)) {
      classes += ' bg-blue-500 text-white font-semibold';
    } else {
      classes += ' text-gray-700 hover:bg-gray-100';
    }
    
    return classes;
  };

  const getPatternSummary = () => {
    if (!startDate) return 'No pattern configured';
    // Match the summary text to the settings panels for test consistency
    if (recurrenceType === 'daily') {
      return settings.everyXDays === 1
        ? 'Every day'
        : `Every ${settings.everyXDays} days`;
    }
    if (recurrenceType === 'weekly') {
      const daysOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ];
      const selectedDays = (settings.daysOfWeek || []).map(id => daysOfWeek[id]).filter(Boolean);
      return `${settings.everyXWeeks === 1 ? 'Every week' : `Every ${settings.everyXWeeks} weeks`}${selectedDays.length > 0 ? ' on ' + selectedDays.join(', ') : ''}`;
    }
    if (recurrenceType === 'monthly') {
      if (settings.weekOfMonth === 0) {
        // Remove pluralization and normalize whitespace for test consistency
        return `Day ${settings.dayOfMonth || 1} of every ${settings.everyXMonths || 1} month`.replace(/\s+/g, ' ').trim();
      } else {
        // Match MonthlySettings week pattern summary
        const weekOptions = ['First', 'Second', 'Third', 'Fourth', 'Last'];
        const dayOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const week = weekOptions[(settings.weekOfMonth || 1) - 1] || 'First';
        const day = dayOptions[settings.dayOfWeek || 0] || 'Sunday';
        return `${week} ${day} of every ${settings.everyXMonths || 1} month`.replace(/\s+/g, ' ').trim();
      }
    }
    if (recurrenceType === 'yearly') {
      // Match YearlySettings summary
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = months[settings.month || 0] || 'January';
      const day = settings.day || 1;
      const interval = settings.everyXYears || 1;
      const getOrdinalSuffix = (d) => {
        if (d >= 11 && d <= 13) return 'th';
        switch (d % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      return `${month} ${day}${getOrdinalSuffix(day)} every ${interval} year${interval === 1 ? '' : 's'}`;
    }
    return 'Custom pattern';
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Quick fix for empty state - should refactor this later
  if (!startDate) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Select a start date to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pattern Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-blue-800">Pattern</h4>
        </div>
        <p className="text-sm text-blue-700">{getPatternSummary()}</p>
      </div>

      {/* Mini Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth }, index) => (
            <div
              key={index}
              className={getDateClasses(date, isCurrentMonth)}
            >
              {format(date, 'd')}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Legend</h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Start Date</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">End Date</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Recurring Date</span>
          </div>
        </div>
      </div>

      {/* Date List */}
      {generatedDates.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Upcoming Dates ({generatedDates.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {generatedDates.slice(0, 10).map((date, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-3 h-3 text-blue-500" />
                {format(date, 'EEEE, MMMM d, yyyy')}
              </div>
            ))}
            {generatedDates.length > 10 && (
              <div className="text-xs text-gray-500 italic">
                ... and {generatedDates.length - 10} more dates
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPreview;
