import { useMemo } from "react";

// YYYY-MM-DD
const keyOf = (y, m, d) => new Date(y, m, d).toISOString().slice(0, 10);

export default function Calendar({ doneDates, viewDate, onDayClick }) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  // Ay bilgileri
  const { days, firstDay } = useMemo(() => {
    const first = new Date(year, month, 1);
    const firstDayIndex = (first.getDay() + 6) % 7; // Pazartesi=0
    const last = new Date(year, month + 1, 0);
    const total = last.getDate();
    return {
      days: Array.from({ length: total }, (_, i) => i + 1),
      firstDay: firstDayIndex,
    };
  }, [year, month]);

  // 7 sütunlu grid: başa boşluklar
  const blanks = Array.from({ length: firstDay }, () => null);
  const grid = [...blanks, ...days];

  const weekNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const monthLabel = viewDate.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-2">{monthLabel}</div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {weekNames.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((d, i) => {
          if (d === null) return <div key={`b-${i}`} />;
          const k = keyOf(year, month, d);
          const done = doneDates.has(k);

          return (
            <div
              key={k}
              onClick={() => onDayClick && onDayClick(k)}
              className={`aspect-square rounded-md border flex items-center justify-center select-none cursor-pointer transition transform
                ${
                  done
                    ? "bg-emerald-500 border-emerald-500 text-white font-medium hover:scale-[1.02]"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:scale-[1.02]"
                }`}
              title={k}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}