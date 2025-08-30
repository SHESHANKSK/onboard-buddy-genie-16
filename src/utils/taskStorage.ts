import { Task } from '@/types/Task';

const TASKS_KEY = 'employeeTasks';

// Initialize sample tasks if not present
const initializeSampleTasks = () => {
  const existingTasks = localStorage.getItem(TASKS_KEY);
  
  if (!existingTasks) {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Complete Onboarding Checklist',
        description: 'Go through all onboarding items and mark them as complete',
        status: 'incomplete',
        assignedTo: 'alice',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Setup Development Environment',
        description: 'Install required software and configure your workspace',
        status: 'incomplete',
        assignedTo: 'alice',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Meet your Team',
        description: 'Schedule meetings with all team members',
        status: 'complete',
        assignedTo: 'bob',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Review Company Policies',
        description: 'Read through the employee handbook and compliance documents',
        status: 'incomplete',
        assignedTo: 'bob',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Security Training',
        description: 'Complete mandatory security awareness training',
        status: 'incomplete',
        assignedTo: 'charlie',
        createdAt: new Date().toISOString(),
      },
    ];
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(sampleTasks));
  }
};

export const getTasksForEmployee = (username: string): Task[] => {
  initializeSampleTasks();
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]') as Task[];
  return tasks.filter(task => task.assignedTo === username);
};

export const getAllTasks = (): Task[] => {
  initializeSampleTasks();
  return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]') as Task[];
};

export const updateTaskStatus = (taskId: string, status: 'incomplete' | 'complete'): void => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].status = status;
    if (status === 'complete') {
      tasks[taskIndex].completedAt = new Date().toISOString();
    } else {
      delete tasks[taskIndex].completedAt;
    }
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
};

export const createTask = (title: string, description: string, assignedTo: string): Task => {
  const tasks = getAllTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    description,
    status: 'incomplete',
    assignedTo,
    createdAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return newTask;
};

export const getEmployeeList = (): string[] => {
  return ['alice', 'bob', 'charlie'];
};