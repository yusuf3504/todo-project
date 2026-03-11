import { categoryClasses, CATEGORIES } from "../constants/categories";

export default function CategoryBadge({ category }) {
  const item =
    CATEGORIES.find((c) => c.key === category) || { label: "Diğer", key: "" };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${categoryClasses(
        item.key
      )}`}
    >
      {item.label}
    </span>
  );
}