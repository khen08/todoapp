import { Checkbox } from "@/components/ui/checkbox";
import { getContrastColor } from "@/utils/colorContrast";

interface TaskItemProps {
  item: {
    id: number;
    name: string;
    checked: boolean;
  };
  onUpdate: (checked: boolean) => void;
  backgroundColor: string;
  textColor: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  item,
  onUpdate,
  backgroundColor,
}) => {
  const textColor = getContrastColor(backgroundColor);

  return (
    <div className="flex items-center space-x-2" style={{ backgroundColor }}>
      <Checkbox
        id={`task-${item.id}`}
        checked={item.checked}
        onCheckedChange={(checked) => onUpdate(checked as boolean)}
      />
      <label
        htmlFor={`task-${item.id}`}
        className={`flex-grow text-sm px-2 py-1 rounded ${
          item.checked ? "line-through opacity-70" : ""
        }`}
        style={{ color: textColor }}
      >
        {item.name}
      </label>
    </div>
  );
};
