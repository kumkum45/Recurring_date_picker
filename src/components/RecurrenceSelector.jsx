import { useRecurrenceStore } from '../store/recurrenceStore'

export default function RecurrenceSelector() {
  const { recurrenceType, setRecurrenceType } = useRecurrenceStore()

  const options = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ]

  return (
    <fieldset className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 w-full max-w-md mx-auto border border-gray-200">
      <legend className="text-lg font-semibold mb-2 text-gray-700">Recurrence Type</legend>
      <div className="flex gap-4 justify-between">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex flex-col items-center px-3 py-2 rounded cursor-pointer transition border-2
              ${recurrenceType === opt.value
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-blue-50'}
            `}
            tabIndex={0}
            aria-checked={recurrenceType === opt.value}
            role="radio"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setRecurrenceType(opt.value)
            }}
          >
            <input
              type="radio"
              name="recurrence"
              value={opt.value}
              checked={recurrenceType === opt.value}
              onChange={() => setRecurrenceType(opt.value)}
              className="accent-blue-500 w-4 h-4 mb-1"
              aria-label={opt.label}
            />
            <span className="text-base font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
