import { useState } from "react";
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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onUpdateItem: (taskId: number, itemId: number, checked: boolean) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdateItem,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isTaskCompleted = task.items.every((item) => item.checked);

  return (
    <Card className={`flex flex-col ${isTaskCompleted ? "bg-green-100" : ""}`}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex-grow">
          <div className="flex items-center justify-between">
            <span>{task.title}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expanded && (
          <div className="space-y-2">
            {task.items.map((item) => (
              <TaskItem
                key={item.id}
                item={item}
                onUpdate={(checked) => onUpdateItem(task.id, item.id, checked)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
