export default function NextUp({ todo, onToggle }) {
  if (!todo) {
    return (
      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="text-sm text-gray-600">Sıradaki görev bulunmuyor.</div>
      </div>
    );
  }

  // Basit “relative” etiket
  const todayKey = new Date().toISOString().slice(0, 10);
  const label =
    todo.dueDate === todayKey
      ? "Bugün"
      : new Date(todo.dueDate) < new Date(todayKey)
      ? "Gecikmiş"
      : "Yakında";

  const badgeClass =
    label === "Bugün"
      ? "bg-amber-100 text-amber-800"
      : label === "Gecikmiş"
      ? "bg-rose-100 text-rose-800"
      : "bg-indigo-100 text-indigo-800";

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm flex items-start justify-between gap-4">
      <div>
        <div className="text-xs text-gray-500 mb-1">Sıradaki görev</div>
        <div className="flex items-center flex-wrap gap-2">
          <div className="text-base font-medium text-gray-900">{todo.text}</div>
          {todo.dueDate && (
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
              {label} • Son: {todo.dueDate}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onToggle(todo.id)}
        className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
      >
        Tamamla
      </button>
    </div>
  );
}