import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Edit2, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { getContrastColor } from "@/utils/colorContrast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isTaskCompleted = task.items.every((item) => item.checked);

  const textColor = useMemo(() => getContrastColor(task.color), [task.color]);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task);
  };

  return (
    <>
      <Card
        className={`flex flex-col cursor-pointer ${
          isTaskCompleted ? "bg-completed dark:bg-completed-dark" : ""
        } ${viewMode === "list" ? "w-full" : ""}`}
        style={{ backgroundColor: task.color, color: textColor }}
        onClick={handleOpenDrawer}
      >
        <CardHeader className="flex flex-col space-y-2 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: textColor }}
                    onClick={(e) => e.stopPropagation()} // Prevent triggering the drawer
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Task Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
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
          {/* Optionally, you can add a summary or preview of task items here */}
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div
            className="mx-auto w-full max-w-md"
            style={{ backgroundColor: task.color, color: textColor }}
          >
            <DrawerHeader>
              <DrawerTitle>{task.title}</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <div className="space-y-4 p-4">
              {task.items.map((item) => (
                <TaskItem
                  key={item.id}
                  item={item}
                  backgroundColor={task.color}
                  onUpdate={(checked) =>
                    onUpdateItem(task.id, item.id, checked)
                  }
                  textColor={textColor}
                />
              ))}
            </div>
            <DrawerFooter>
              <Button onClick={handleCloseDrawer}>Close</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
