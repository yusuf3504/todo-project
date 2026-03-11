import { useState } from "react";
import { CATEGORIES } from "../constants/categories";
import CategoryBadge from "./CategoryBadge";

export default function TodoForm({ addTodo }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("personal");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;

    const today = new Date().toISOString().slice(0, 10);
    if (dueDate && dueDate < today) {
      setError("Düne görev ekleyemezsin! Lütfen bugünden sonrası için tarih seç.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    addTodo(v, dueDate || null, category);
    setText("");
    setDueDate("");
  };

  return (
    <div className="space-y-2">
      {/* Hata bildirimi (düne tarih verildiyse) */}
      {error && (
        <div className="text-sm px-3 py-2 bg-rose-100 text-rose-800 rounded-md border border-rose-300 animate-shake">
          {error}
        </div>
      )}

      {/* 1) ÜST SATIR: geniş tek input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yeni görev..."
          className="w-full border rounded-lg px-4 py-3 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Yeni görev"
        />

        {/* 2) ALT SATIR: Kategori - Tarih - Sağda +Ekle */}
        <div
          className="
            grid grid-cols-1 gap-2
            sm:grid-cols-3
            md:grid-cols-[1fr_minmax(180px,220px)_minmax(120px,140px)]
          "
        >
          {/* Kategori */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Kategori"
            title="Kategori"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Tarih */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Bitiş tarihi"
            title="Bitiş tarihi"
            placeholder="gg.aa.yyyy"
          />

          {/* + Ekle butonu */}
          <div className="flex sm:justify-start md:justify-end">
            <button
              type="submit"
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gray-900 text-white hover:bg-black active:scale-95 transition
                w-full sm:w-auto
              "
              title="Görev ekle"
              aria-label="Görev ekle"
            >
              <span className="text-lg leading-none">+</span>
              <span>Ekle</span>
            </button>
          </div>
        </div>
      </form>

      {/* Seçili kategori rozeti (isteğe bağlı gösterim) */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        Seçili kategori: <CategoryBadge category={category} />
      </div>
    </div>
  );
}