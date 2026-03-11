export default function ProgressBar({ todayCompleted, goal, onChangeGoal }) {
  const pct = Math.min(100, Math.round((todayCompleted / Math.max(1, goal)) * 100));

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="text-sm text-gray-700 text-center sm:text-left">
          <span className="font-medium">Bugün:</span> {todayCompleted}/{goal}
        </div>
        <label className="text-sm text-gray-600 flex items-center gap-2 justify-center sm:justify-end">
          Günlük hedef:
          <input
            type="number"
            min={1}
            value={goal}
            onChange={(e) => onChangeGoal(Math.max(1, Number(e.target.value)))}
            className="w-24 border rounded-md px-2 py-1 text-center"
          />
        </label>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 transition-all"
          style={{ width: `${pct}%` }}
          aria-label={`İlerleme: ${pct}%`}
        />
      </div>
    </div>
  );
}