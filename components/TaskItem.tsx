import { Checkbox } from "@/components/ui/checkbox";
import { TaskItem as TaskItemType } from "@/types/task";

interface TaskItemProps {
  item: TaskItemType;
  onUpdate: (checked: boolean) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ item, onUpdate }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={item.checked}
        onCheckedChange={(checked) => onUpdate(checked as boolean)}
      />
      <span
        className={item.checked ? "line-through text-muted-foreground" : ""}
      >
        {item.name}
      </span>
    </div>
  );
};
