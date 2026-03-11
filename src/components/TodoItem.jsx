import { useState } from "react";
import CategoryBadge from "./CategoryBadge";
import { CATEGORIES } from "../constants/categories";

const DueBadge = ({ dueDate, done }) => {
  if (!dueDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  const isToday = dueDate === today;
  const isPast = dueDate < today;
  if (done)
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
        Tamamlandı
      </span>
    );
  if (isPast)
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-800">
        Gecikti
      </span>
    );
  if (isToday)
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
        Bugün
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
      Son: {dueDate}
    </span>
  );
};

export default function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(todo.text);
  const [tempDue, setTempDue] = useState(todo.dueDate || "");
  const [tempCat, setTempCat] = useState(todo.category || "personal");

  const save = () => {
    const v = tempText.trim();
    if (!v) {
      setIsEditing(false);
      return;
    }
    // Düne güncelleme engeli
    const today = new Date().toISOString().slice(0, 10);
    if (tempDue && tempDue < today) {
      alert("Düne tarih veremezsin.");
      return;
    }
    onUpdate(todo.id, { text: v, dueDate: tempDue || null, category: tempCat });
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-3 border rounded-lg px-3 py-2 bg-white transition-all duration-300">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="mt-1 size-4 accent-emerald-600"
        title={todo.done ? "Tamamlandı olarak işaretli" : "Tamamla"}
      />

      <div className="flex-1">
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              className="sm:col-span-2 border rounded-md px-2 py-1"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") {
                  setTempText(todo.text);
                  setTempDue(todo.dueDate || "");
                  setTempCat(todo.category || "personal");
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={tempCat}
              onChange={(e) => setTempCat(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="border rounded-md px-2 py-1 text-sm"
              value={tempDue}
              onChange={(e) => setTempDue(e.target.value)}
            />
          </div>
        ) : (
          <>
            <div
              className={`flex items-center flex-wrap gap-2 ${
                todo.done ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              <span className="font-medium">{todo.text}</span>
              <CategoryBadge category={todo.category} />
              <DueBadge dueDate={todo.dueDate} done={todo.done} />
            </div>
            <div className="text-xs text-gray-500">
              {new Date(todo.createdAt).toLocaleDateString("tr-TR")}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <button
            onClick={save}
            className="p-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 active:scale-95 transition"
            title="Kaydet"
          >
            ✅
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600 active:scale-95 transition"
            title="Düzenle"
          >
            ✏️
          </button>
        )}

        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700 active:scale-95 transition"
          title="Sil"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}