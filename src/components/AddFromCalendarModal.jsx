import { useState, useEffect } from "react";
import { CATEGORIES } from "../constants/categories";

export default function AddFromCalendarModal({ open, date, onClose, onAdd }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("personal");

  useEffect(() => {
    if (open) {
      setText("");
      setCategory("personal");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // Dünden eklemeyi engelle (kullanıcı bugünden önce bir gün tıkladıysa)
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      alert("Düne görev ekleyemezsin!");
      return;
    }
    onAdd(text, date, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 shadow-lg w-full max-w-md animate-fadeIn">
        <h2 className="text-lg font-semibold mb-3">📅 {date} tarihine görev ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Görev adı..."
            className="w-full border rounded-md px-3 py-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3 py-1.5 border rounded-md"
            >
              İptal
            </button>

            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}