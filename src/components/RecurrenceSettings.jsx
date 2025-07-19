import DailySettings from './DailySettings';
import WeeklySettings from './WeeklySettings';
import MonthlySettings from './MonthlySettings';
import YearlySettings from './YearlySettings';
import { useRecurrenceStore } from '../store/recurrenceStore';

export default function RecurrenceSettings() {
  const { frequency } = useRecurrenceStore();

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-6 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Recurrence Settings
      </h2>

      {frequency === 'daily' && (
        <div className="transition-opacity duration-300 ease-in-out">
          <DailySettings />
        </div>
      )}
      {frequency === 'weekly' && (
        <div className="transition-opacity duration-300 ease-in-out">
          <WeeklySettings />
        </div>
      )}
      {frequency === 'monthly' && (
        <div className="transition-opacity duration-300 ease-in-out">
          <MonthlySettings />
        </div>
      )}
      {frequency === 'yearly' && (
        <div className="transition-opacity duration-300 ease-in-out">
          <YearlySettings />
        </div>
      )}
    </div>
  );
}
