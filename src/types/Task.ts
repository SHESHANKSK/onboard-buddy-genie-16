export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'incomplete' | 'complete';
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
}