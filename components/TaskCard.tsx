import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, Settings, Edit2, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { getContrastColor } from "@/utils/colorContrast";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onUpdateItem: (taskId: number, itemId: number, checked: boolean) => void;
  viewMode: "list" | "grid";
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdateItem,
  viewMode,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isTaskCompleted = task.items.every((item) => item.checked);

  const textColor = useMemo(() => getContrastColor(task.color), [task.color]);

  return (
    <Card
      className={`flex flex-col ${
        isTaskCompleted ? "bg-completed dark:bg-completed-dark" : ""
      } ${viewMode === "list" ? "w-full" : ""}`}
      style={{ backgroundColor: task.color, color: textColor }}
    >
      <CardHeader className="flex flex-col space-y-2 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              style={{ color: textColor }}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" style={{ color: textColor }}>
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Task Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded mb-2"
                style={{
                  backgroundColor: tag.color,
                  color: getContrastColor(tag.color),
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {expanded && (
          <div className="space-y-2">
            {task.items.map((item) => (
              <TaskItem
                key={item.id}
                item={item}
                backgroundColor={task.color}
                onUpdate={(checked) => onUpdateItem(task.id, item.id, checked)}
                textColor={textColor}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
