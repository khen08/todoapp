import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NewTask, Task, Tag } from "@/types/task";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colorOptions } from "@/constants/colorOptions";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask | Task) => void;
  userId: number;
  tags: Tag[];
  task?: Task | null;
  taskColors: typeof colorOptions;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  tags,
  task,
  taskColors,
}) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState(taskColors[0].value);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setItems(task.items.map((item) => item.name).join("\n"));
      setSelectedTags(task.tags.map((tag) => tag.id));
      setSelectedColor(task.color || taskColors[0].value);
    } else {
      setTitle("");
      setItems("");
      setSelectedTags([]);
      setSelectedColor(taskColors[0].value);
    }
  }, [task, taskColors, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }
    const taskData = {
      title,
      items: items
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((item, index) => ({
          id: task?.items[index]?.id || 0,
          name: item.trim(),
          checked: task?.items[index]?.checked || false,
        })),
      authorId: userId,
      tags: {
        set: selectedTags.map((tagId) => ({ id: tagId })),
      },
      color: selectedColor,
    };

    if (task) {
      onSubmit({
        ...task,
        ...taskData,
        tags: taskData.tags.set.map((tag) => tag.id),
      });
    } else {
      onSubmit({
        ...taskData,
        tags: taskData.tags.set.map((tag) => tag.id),
      } as NewTask);
    }
    onClose();
  };

  const handleTagSelection = (tagId: number) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else if (prev.length < 3) {
        return [...prev, tagId];
      } else {
        toast.error("You can only select up to 3 tags");
        return prev;
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
          <Textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Enter task items (one per line)"
            rows={5}
            required
          />
          <div className="space-y-2">
            <p className="font-medium">Select Task Color:</p>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {taskColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Select Tags (Up to 3):</p>
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagSelection(tag.id)}
                />
                <label htmlFor={`tag-${tag.id}`} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
          <Button type="submit">{task ? "Save Changes" : "Create Task"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
