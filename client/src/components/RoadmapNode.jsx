export default function RoadmapNode({
  title,
  onClick,
  selected = false,
  variant = "primary",
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl border-2 px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap transition-colors";

  const stylesByVariant = {
    primary:
      "bg-yellow-300 border-black shadow-[0_3px_0_rgba(0,0,0,0.45)] text-black",
    secondary:
      "bg-yellow-300 border-black shadow-[0_2px_0_rgba(0,0,0,0.35)] text-black",
  };

  const selectedRing = selected ? " ring-2 ring-purple-500" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${stylesByVariant[variant] ?? stylesByVariant.primary}${selectedRing}`}
    >
      {title}
    </button>
  );
}
