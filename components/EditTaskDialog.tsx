import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/task";

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  task: Task | null;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
}) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setItems(task.items.map((item) => item.name).join("\n"));
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const updatedTask: Task = {
        ...task,
        title,
        items: items
          .split("\n")
          .filter((item) => item.trim() !== "")
          .map((item, index) => ({
            id: task.items[index]?.id || 0,
            name: item.trim(),
            checked: task.items[index]?.checked || false,
          })),
      };
      onSubmit(updatedTask);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
          <Textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Enter task items (one per line)"
            rows={5}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
