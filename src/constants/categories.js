// Basit, sabit bir kategori listesi ve renkleri
export const CATEGORIES = [
  { key: "work", label: "İş", color: "indigo" },
  { key: "personal", label: "Kişisel", color: "emerald" },
  { key: "school", label: "Okul", color: "sky" },
  { key: "health", label: "Sağlık", color: "rose" },
  { key: "shopping", label: "Alışveriş", color: "amber" },
];

// Tailwind JIT için statik sınıf döndüren yardımcı
export function categoryClasses(key) {
  switch (key) {
    case "work":
      return "bg-indigo-100 text-indigo-800";
    case "personal":
      return "bg-emerald-100 text-emerald-800";
    case "school":
      return "bg-sky-100 text-sky-800";
    case "health":
      return "bg-rose-100 text-rose-800";
    case "shopping":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}