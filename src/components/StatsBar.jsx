export default function StatsBar({ counts, filter, onChangeFilter }) {
  const Btn = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md border text-sm transition
        ${active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm justify-center sm:justify-start">
          <span className="font-medium">Toplam: {counts.total}</span>
          <span className="text-emerald-700">Aktif: {counts.active}</span>
          <span className="text-indigo-700">Tamamlanan: {counts.completed}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Btn active={filter === "all"} onClick={() => onChangeFilter("all")}>
            Tümü
          </Btn>
          <Btn active={filter === "active"} onClick={() => onChangeFilter("active")}>
            Aktif
          </Btn>
          <Btn
            active={filter === "completed"}
            onClick={() => onChangeFilter("completed")}
          >
            Tamamlanan
          </Btn>
        </div>
      </div>
    </div>
  );
}