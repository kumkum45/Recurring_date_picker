import React, { useEffect } from "react";
import { Calendar, Clock, Settings, Zap } from "lucide-react";
import useRecurringStore from "../store/recurrenceStore";
import DailySettings from "./DailySettings";
import WeeklySettings from "./WeeklySettings";
import MonthlySettings from "./MonthlySettings";
import YearlySettings from "./YearlySettings";
import CalendarPreview from "./CalendarPreview";
import DateRangeSelector from "./DateRangeSelector";

// TODO: Add keyboard shortcuts for power users
// FIXME: Mobile layout needs some tweaking on smaller screens
export default function RecurringDatePicker() {
  const {
    recurrenceType,
    setRecurrenceType,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    validateDates,
    generateRecurringDates,
    validationError,
    setValidationError,
    settings,
  } = useRecurringStore();

  // Generate dates when settings change - this could be optimized with useMemo
  useEffect(() => {
    if (startDate) {
      const error = validateDates();
      if (error) {
        setValidationError(error);
      } else {
        setValidationError('');
        generateRecurringDates();
      }
    }
  }, [startDate, endDate, recurrenceType, settings]);

  // This mapping could be moved to a constant file later
  const recurrenceTypes = [
    { id: 'daily', label: 'Daily', icon: Clock, description: 'Every day or every X days' },
    { id: 'weekly', label: 'Weekly', icon: Calendar, description: 'Specific days of the week' },
    { id: 'monthly', label: 'Monthly', icon: Settings, description: 'Day of month or week pattern' },
    { id: 'yearly', label: 'Yearly', icon: Zap, description: 'Same date every year' },
  ];

  const settingsComponent = {
    daily: <DailySettings />,
    weekly: <WeeklySettings />,
    monthly: <MonthlySettings />,
    yearly: <YearlySettings />,
  };

  // Quick hack to get current settings label - should refactor this
  const getCurrentSettingsLabel = () => {
    const current = recurrenceTypes.find(t => t.id === recurrenceType);
    return current ? current.label : 'Settings';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Recurring Date Picker
          </h1>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Date Range Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Date Range
              </h2>
              <DateRangeSelector />
            </div>

            {/* Recurrence Type Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Recurrence Pattern
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {recurrenceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setRecurrenceType(type.id)}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md group text-left ${
                        recurrenceType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          recurrenceType === type.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className={`font-semibold ${
                            recurrenceType === type.id ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {type.label}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recurrence Settings */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                  {getCurrentSettingsLabel()} Settings
                </h3>
                <div className="animate-fade-in">
                  {settingsComponent[recurrenceType]}
                </div>
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 animate-slide-up">
                <div className="flex items-center gap-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">{validationError}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1 mt-4 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6 sticky top-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                Preview
              </h2>
              <CalendarPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
