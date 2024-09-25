export interface TaskItem {
  id: number;
  name: string;
  checked: boolean;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  userId: number;
}

export interface Task {
  id: number;
  title: string;
  color: string;
  items: TaskItem[];
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewTaskItem {
  name: string;
  checked: boolean;
}

export interface NewTag {
  name: string;
  color?: string;
}

export interface NewTask {
  title: string;
  color?: string;
  authorId: number;
  items: NewTaskItem[];
  tags: number[];
}
