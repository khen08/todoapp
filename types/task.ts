export interface TaskItem {
  id: number;
  name: string;
  checked: boolean;
}

export interface Task {
  id: number;
  title: string;
  items: TaskItem[];
}

export interface NewTask {
  title: string;
  items: Omit<TaskItem, "id">[];
  authorId: number;
}
