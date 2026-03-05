export default function RoadmapConnector({
  orientation = "vertical",
  variant = "solid",
  length = "md",
}) {
  const isVertical = orientation === "vertical";
  const dashed = variant === "dashed";

  const lengthClass =
    length === "sm" ? "h-6" : length === "lg" ? "h-16" : "h-10";

  const verticalClasses = `w-px ${lengthClass} -my-[2px] border-l-2 ${
    dashed ? "border-dashed border-blue-400" : "border-blue-500"
  }`;

  const horizontalLengthClass =
    length === "sm" ? "w-6" : length === "lg" ? "w-20" : "w-12";

  const horizontalClasses = `${horizontalLengthClass} h-px border-t-2 ${
    dashed ? "border-dashed border-blue-400" : "border-blue-500"
  }`;

  return (
    <div className="flex items-center justify-center">
      <div className={isVertical ? verticalClasses : horizontalClasses} />
    </div>
  );
}
