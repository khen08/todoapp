import { useState, useEffect } from "react";
import {
  Task,
  NewTaskItem,
  Tag,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types/task";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (newTask: CreateTaskInput) => {
    try {
      const taskToSend = {
        ...newTask,
        tags: newTask.tags || [],
      };
      console.log("Sending task data:", JSON.stringify(taskToSend, null, 2));
      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data]);
      toast.success("Task created successfully!");
      return data;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task.");
      throw error;
    }
  };

  const updateTask = async (taskId: number, updatedFields: UpdateTaskInput) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      toast.success("Task updated successfully!");
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
      throw error;
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting task");
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
      throw error;
    }
  };

  return { tasks, loading, createTask, updateTask, deleteTask };
};
