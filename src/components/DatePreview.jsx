import { useRecurrenceStore } from '../store/recurrenceStore'

export default function DatePreview() {
  const { dates } = useRecurrenceStore()

  return (
    <section className="bg-white rounded-lg shadow p-4 w-full max-w-md mx-auto border border-gray-200 mt-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Preview Dates</h2>
      {Array.isArray(dates) && dates.length > 0 ? (
        <ul className="max-h-48 overflow-y-auto divide-y divide-gray-100">
          {dates.map((date, idx) => (
            <li key={idx} className="py-1 px-2 text-gray-800">
              {typeof date === 'string' ? date : new Date(date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 italic">No dates generated yet. Adjust your settings above.</div>
      )}
    </section>
  )
}
