import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NewTask } from "@/types/task";

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask) => void;
  userId: number;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: NewTask = {
      title,
      items: items
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((item) => ({ name: item.trim(), checked: false })),
      authorId: userId,
    };
    onSubmit(newTask);
    setTitle("");
    setItems("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
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
          <Button type="submit">Create Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
