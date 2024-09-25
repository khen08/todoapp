"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { Task, NewTask, Tag } from "@/types/task";
import { TaskCard } from "@/components/TaskCard";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TaskDialog } from "./TaskDialog";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInventoryDialog } from "@/components/TagInventoryDialog";
import { toast } from "react-toastify";
import { colorOptions } from "@/constants/colorOptions";

interface DashboardProps {
  session: any; // Replace 'any' with the actual session type
}

interface DeleteDialogState {
  isOpen: boolean;
  taskToDelete: Task | null;
}

export function Dashboard({ session }: DashboardProps) {
  const router = useRouter();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isTagInventoryOpen, setIsTagInventoryOpen] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(
    {
      isOpen: false,
      taskToDelete: null,
    }
  );

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTag === "all" ||
        (task.tags &&
          task.tags.some((tag) => tag.id.toString() === selectedTag)))
  );

  const completedTasksCount = filteredTasks.filter((task) =>
    task.items.every((item) => item.checked)
  ).length;

  const handleCreateTask = async (newTask: NewTask) => {
    await createTask(newTask);
    setIsTaskDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskDialogOpen(true);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, updatedTask);
    setIsTaskDialogOpen(false);
    setTaskToEdit(null);
  };

  const handleOpenTaskDialog = () => {
    if (tags.length === 0) {
      toast.error("Please create a tag in the Tag Inventory first");
      return;
    }
    setTaskToEdit(null);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteDialogState({ isOpen: true, taskToDelete: task });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.taskToDelete) {
      await deleteTask(deleteDialogState.taskToDelete.id);
      setDeleteDialogState({ isOpen: false, taskToDelete: null });
    }
  };

  const handleUpdateTaskItem = async (
    taskId: number,
    itemId: number,
    checked: boolean
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedItems = task.items.map((item) =>
      item.id === itemId ? { ...item, checked } : item
    );

    await updateTask(taskId, { ...task, items: updatedItems });
  };

  const handleLogout = () => {
    router.push("/auth/signout");
  };

  const handleAddTag = async (tagName: string, color: string) => {
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName, color }),
      });
      if (response.ok) {
        const newTag = await response.json();
        setTags([...tags, newTag]);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleDeleteTags = async (tagIds: number[]) => {
    try {
      const response = await fetch("/api/tags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds }),
      });
      if (response.ok) {
        setTags(tags.filter((tag) => !tagIds.includes(tag.id)));
      }
    } catch (error) {
      console.error("Error deleting tags:", error);
    }
  };

  const handleOpenAddTaskDialog = () => {
    if (tags.length === 0) {
      toast.error("Please create a tag in the Tag Inventory first");
      return;
    }
    setIsTaskDialogOpen(true);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLogout={handleLogout}
          user={session.user}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Select
                value={viewMode}
                onValueChange={(value: "grid" | "list") => setViewMode(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsTagInventoryOpen(true)}>
                Tag Inventory
              </Button>
              <Button onClick={handleOpenTaskDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add New Task
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Progress Overview</h2>
            <Progress
              value={(completedTasksCount / filteredTasks.length) * 100}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTasksCount} of {filteredTasks.length} tasks completed
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-4"
              }
            >
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteClick}
                  onUpdateItem={handleUpdateTaskItem}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        taskColors={colorOptions}
        onSubmit={(task: Task | NewTask) =>
          "id" in task
            ? handleUpdateTask(task as Task)
            : handleCreateTask(task as NewTask)
        }
        userId={session.user.id}
        tags={tags}
        task={taskToEdit}
      />
      <DeleteTaskDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() =>
          setDeleteDialogState({ ...deleteDialogState, isOpen: false })
        }
        onConfirm={handleConfirmDelete}
        taskTitle={deleteDialogState.taskToDelete?.title}
      />
      <TagInventoryDialog
        isOpen={isTagInventoryOpen}
        onClose={() => setIsTagInventoryOpen(false)}
        onAddTag={handleAddTag}
        onDeleteTags={handleDeleteTags}
        tags={tags}
      />
    </div>
  );
}
