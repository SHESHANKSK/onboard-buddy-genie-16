import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTasks, createTask, getEmployeeList } from '@/utils/taskStorage';
import { Task } from '@/types/Task';
import { motion } from 'framer-motion';
import { Users, Plus, ClipboardList, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees] = useState(getEmployeeList());
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    const allTasks = getAllTasks();
    setTasks(allTasks);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskTitle || !taskDescription || !selectedEmployee) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    // Simulate backend delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      const newTask = createTask(taskTitle, taskDescription, selectedEmployee);
      const updatedTasks = getAllTasks();
      setTasks(updatedTasks);
      
      // Reset form
      setTaskTitle('');
      setTaskDescription('');
      setSelectedEmployee('');
      
      toast({
        title: "Success",
        description: `Task assigned to ${selectedEmployee}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTasksByEmployee = () => {
    const tasksByEmployee: Record<string, Task[]> = {};
    employees.forEach(employee => {
      tasksByEmployee[employee] = tasks.filter(task => task.assignedTo === employee);
    });
    return tasksByEmployee;
  };

  const tasksByEmployee = getTasksByEmployee();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Onboarding
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Société Générale</h1>
                <p className="text-muted-foreground">Manager Dashboard - Welcome, {user?.username}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Task Assignment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Assign New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle">Task Title</Label>
                    <Input
                      id="taskTitle"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Enter task title"
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea
                      id="taskDescription"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Enter task description"
                      rows={3}
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employee">Assign to Employee</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={isCreating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee} value={employee}>
                            {employee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Task...
                      </>
                    ) : (
                      'Assign Task'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map(employee => {
                    const employeeTasks = tasksByEmployee[employee] || [];
                    const incompleteTasks = employeeTasks.filter(task => task.status === 'incomplete');
                    const completedTasks = employeeTasks.filter(task => task.status === 'complete');
                    
                    return (
                      <div key={employee} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{employee}</h4>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {incompleteTasks.length} pending
                            </Badge>
                            <Badge variant="default">
                              {completedTasks.length} done
                            </Badge>
                          </div>
                        </div>
                        
                        {incompleteTasks.length > 0 ? (
                          <div className="space-y-1">
                            {incompleteTasks.slice(0, 2).map(task => (
                              <p key={task.id} className="text-sm text-muted-foreground">
                                • {task.title}
                              </p>
                            ))}
                            {incompleteTasks.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{incompleteTasks.length - 2} more tasks
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No pending tasks</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* All Tasks Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                All Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge variant={task.status === 'complete' ? 'default' : 'secondary'}>
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: <span className="capitalize">{task.assignedTo}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                        {task.completedAt && (
                          <p className="text-xs text-primary">
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tasks created yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;