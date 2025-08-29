import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, BookOpen, Rocket, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  done: boolean;
  category: string;
}

const Index = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    fetch('/data/checklist.json')
      .then(response => response.json())
      .then((data: ChecklistItem[]) => {
        setChecklist(data);
        setCompletedTasks(data.filter(item => item.done).length);
      })
      .catch(error => console.error('Error loading checklist:', error));
  }, []);

  const toggleTask = (taskId: string) => {
    setChecklist(prev => {
      const updated = prev.map(item =>
        item.id === taskId ? { ...item, done: !item.done } : item
      );
      setCompletedTasks(updated.filter(item => item.done).length);
      return updated;
    });
  };

  const progressPercentage = checklist.length > 0 ? (completedTasks / checklist.length) * 100 : 0;

  const quickLinks = [
    {
      label: "Meet your team",
      description: "Explore the org chart",
      target: "/org",
      icon: Users,
      color: "primary"
    },
    {
      label: "Learn Week 1 tasks",
      description: "Micro-learning cards",
      target: "/learn",
      icon: BookOpen,
      color: "accent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Welcome to Your Journey! 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your onboarding companion is here to guide you through your first weeks. 
            Let's make this journey smooth and exciting!
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-primary" />
                  Your Progress
                </CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {completedTasks}/{checklist.length} tasks completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progressPercentage} className="h-4" />
                <p className="text-center text-muted-foreground">
                  You have completed <span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span> of your onboarding tasks 🚀
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Rocket className="w-7 h-7 text-accent" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <Link key={index} to={link.target}>
                    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-card/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            link.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                          }`}>
                            <link.icon className={`w-6 h-6 ${
                              link.color === 'primary' ? 'text-primary' : 'text-accent'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{link.label}</h3>
                            <p className="text-muted-foreground">{link.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Onboarding Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-success" />
                Onboarding Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 ${
                      item.done 
                        ? 'bg-success/5 border-success/20' 
                        : 'bg-card hover:bg-accent/5'
                    }`}
                  >
                    <Checkbox
                      checked={item.done}
                      onCheckedChange={() => toggleTask(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`font-medium ${item.done ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </h4>
                        <Badge variant="outline">
                          {item.category}
                        </Badge>
                      </div>
                      <p className={`text-sm ${item.done ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">
            🎯 Remember: Every expert was once a beginner. You've got this!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
