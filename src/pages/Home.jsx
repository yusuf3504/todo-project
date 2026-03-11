import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import StatsBar from "../components/StatsBar";
import Calendar from "../components/Calendar";
import NextUp from "../components/NextUp";
import ProgressBar from "../components/ProgressBar";
import AddFromCalendarModal from "../components/AddFromCalendarModal";

// YYYY-MM-DD (sadece tarih anahtarı)
const toKey = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10);

// İnsan okunur "Bugün" başlığı için
const fmtFull = (d = new Date()) =>
  d.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function Home() {
  // Kalıcı veriler: todos, doneDates, dailyGoal
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [doneDates, setDoneDates] = useState(() => {
    const saved = localStorage.getItem("doneDates");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem("dailyGoal");
    return saved ? Number(saved) : 5;
  });

  // Takvim görünümü (gezilebilir ay)
  const [viewDate, setViewDate] = useState(() => new Date());

  // Liste filtresi + banner
  const [filter, setFilter] = useState("all"); // all | active | completed | (istersen kategori filtresi de eklenebilir)
  const [banner, setBanner] = useState(null);

  // Takvimden ekleme modalı
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => localStorage.setItem("todos", JSON.stringify(todos)), [todos]);
  useEffect(
    () => localStorage.setItem("doneDates", JSON.stringify([...doneDates])),
    [doneDates]
  );
  useEffect(
    () => localStorage.setItem("dailyGoal", String(dailyGoal)),
    [dailyGoal]
  );

  // CRUD
  const addTodo = (text, dueDate, category = "personal") => {
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      done: false,
      createdAt: Date.now(),
      completedAt: null,
      dueDate: dueDate || null, // "YYYY-MM-DD"
      category, // yeni alan
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id, patch) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Konfeti patlat
  const burst = (power = 1) => {
    confetti({
      particleCount: 120 * power,
      spread: 70,
      origin: { y: 0.6 },
      scalar: 0.9,
      ticks: 200,
    });
  };

  const toggleDone = (id) => {
    const todayKey = toKey();

    setTodos((prev) => {
      // Bugün tamamlanan sayısını "önce" hesapla (hedefe ulaşıldı mı kontrolü için)
      const todayCompletedBefore = prev.filter(
        (t) =>
          t.completedAt &&
          new Date(t.completedAt).toISOString().slice(0, 10) === todayKey
      ).length;

      const nextList = prev.map((t) => {
        if (t.id !== id) return t;
        const toggled = { ...t, done: !t.done };
        if (toggled.done) {
          toggled.completedAt = Date.now();
        } else {
          toggled.completedAt = null;
        }
        return toggled;
      });

      // Eğer tamamlandı ise: bugünün doneDates setine ekle + konfeti
      const justCompleted = nextList.find((t) => t.id === id)?.done;
      if (justCompleted) {
        // Done gün işaretle
        setDoneDates((prevDays) => new Set(prevDays).add(todayKey));
        // Anlık konfeti
        burst(0.8);

        // Hedefi tam vurduysa ekstra konfeti
        const willBeCompleted =
          todayCompletedBefore + 1; // bu tıklamayla artacak
        if (willBeCompleted === dailyGoal) {
          setTimeout(() => burst(1.4), 250);
        }
      }

      return nextList;
    });
  };

  // Sayaçlar + filtreli liste
  const counts = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.done).length;
    const active = total - completed;
    return { total, active, completed };
  }, [todos]);

  // Bugün tamamlanan sayısı (progress bar için)
  const todayCompleted = useMemo(() => {
    const key = toKey();
    return todos.filter(
      (t) =>
        t.completedAt &&
        new Date(t.completedAt).toISOString().slice(0, 10) === key
    ).length;
  }, [todos]);

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  // Hatırlatıcı banner (dueDate bugün/öncesi ve done=false)
  useEffect(() => {
    const today = toKey();
    const overdue = todos.filter((t) => t.dueDate && !t.done && t.dueDate <= today);
    if (overdue.length) {
      setBanner(`🔔 ${overdue.length} görevin bugün/öncesinde bitiş tarihi var!`);
    } else {
      setBanner(null);
    }
  }, [todos]);

  // Sıradaki görev (en yakın dueDate, done=false, dueDate>=bugün)
  const nextTodo = useMemo(() => {
    const today = toKey();
    const upcoming = todos
      .filter((t) => !t.done && t.dueDate && t.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return upcoming[0] || null;
  }, [todos]);

  // Takvim ay navigasyonu
  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => setViewDate(new Date());

  // Takvim gün tıklama → modal aç
  const handleDayClick = (dateKey) => {
    setSelectedDate(dateKey);
    setOpenModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Üst başlık + Bugün tarihi */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">🎯 Todo App</h1>
        <div className="text-sm text-gray-600">
          Bugün: <span className="font-medium text-gray-900">{fmtFull()}</span>
        </div>
      </header>

      {banner && (
        <div className="rounded-md border border-amber-200 bg-amber-50 text-amber-900 p-3 animate-fadeIn">
          {banner}
        </div>
      )}

      <StatsBar counts={counts} filter={filter} onChangeFilter={setFilter} />

      {/* Günlük ilerleme çubuğu */}
      <ProgressBar
        todayCompleted={todayCompleted}
        goal={dailyGoal}
        onChangeGoal={setDailyGoal}
      />

      {/* Sıradaki görev kartı */}
      <NextUp todo={nextTodo} onToggle={toggleDone} />

      {/* Liste */}
      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <TodoForm addTodo={addTodo} />
        <div className="h-px bg-gray-200 my-4" />
        <TodoList
          todos={filtered}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onToggle={toggleDone}
        />
      </div>

      {/* Takvim: aylar arasında gezilebilir */}
      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">📅 Takvim</h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-gray-700"
              aria-label="Önceki Ay"
            >
              ←
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-gray-700"
            >
              Bugün
            </button>
            <button
              onClick={nextMonth}
              className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-gray-700"
              aria-label="Sonraki Ay"
            >
              →
            </button>
          </div>
        </div>

        <Calendar doneDates={doneDates} viewDate={viewDate} onDayClick={handleDayClick} />
        <p className="text-sm text-gray-500 mt-3">
          * Bir günde en az bir görev tamamlandıysa gün{" "}
          <span className="inline-block align-middle w-3 h-3 bg-emerald-500 rounded-sm" /> olarak görünür.
        </p>
      </div>

      {/* Takvimden ekleme modalı */}
      <AddFromCalendarModal
        open={openModal}
        date={selectedDate}
        onClose={() => setOpenModal(false)}
        onAdd={addTodo}
      />
    </div>
  );
}