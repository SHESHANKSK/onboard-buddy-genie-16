import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
  nextStep?: string;
}

const OnboardingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your onboarding buddy 👋 I'm here to help you navigate your first weeks at the company. Ask me anything about your team, tools, or processes!",
      sender: 'bot',
      timestamp: new Date(),
      nextStep: "Try asking me about your team members or development tools"
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleResponses = {
    'team': {
      answer: "Your team consists of Sarah Chen (Engineering Manager), Alex Rivera (Senior Frontend Developer), and Maya Patel (Backend Developer). Sarah manages the team and handles project planning, while Alex and Maya work on development tasks.",
      nextStep: "Want to know more about specific team members or see the org chart?",
      sources: ["org-chart", "team-directory"]
    },
    'tools': {
      answer: "The main tools you'll be using are: Slack for communication, Jira for project management, Jenkins for CI/CD, and our Git workflow for code management. All these are covered in your onboarding checklist.",
      nextStep: "Check out the learning section to understand our Git workflow better",
      sources: ["engineering-handbook", "onboarding-checklist"]
    },
    'git': {
      answer: "We use a feature branch workflow. Create branches from main, open pull requests for reviews (need 2+ approvals), and squash-merge when ready. The main branch is protected and auto-deployed.",
      nextStep: "Ready to set up your development environment?",
      sources: ["engineering-handbook"]
    },
    'default': {
      answer: "I can help you with information about your team, development tools, company processes, and more. I have access to your onboarding materials, org chart, and engineering handbook.",
      nextStep: "Try asking about your team members, development tools, or company processes",
      sources: []
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const lowerMessage = currentMessage.toLowerCase();
      let response = sampleResponses.default;

      if (lowerMessage.includes('team') || lowerMessage.includes('member') || lowerMessage.includes('who')) {
        response = sampleResponses.team;
      } else if (lowerMessage.includes('tool') || lowerMessage.includes('slack') || lowerMessage.includes('jira')) {
        response = sampleResponses.tools;
      } else if (lowerMessage.includes('git') || lowerMessage.includes('workflow') || lowerMessage.includes('branch')) {
        response = sampleResponses.git;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources,
        nextStep: response.nextStep
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed right-6 z-50 ${isMinimized ? 'bottom-6' : 'bottom-6 top-6'}`}
    >
      <Card className={`shadow-2xl ${isMinimized ? 'w-80' : 'w-96 h-[600px]'} transition-all duration-300`}>
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Onboarding Buddy</CardTitle>
                <p className="text-sm text-muted-foreground">Your AI assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-0 h-[400px] flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'bot' && (
                          <div className="bg-primary/10 p-1.5 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {message.sources.map((source, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {message.nextStep && (
                            <div className="mt-2 p-2 bg-accent/20 rounded text-xs text-accent-foreground">
                              💡 {message.nextStep}
                            </div>
                          )}
                        </div>

                        {message.sender === 'user' && (
                          <div className="bg-secondary p-1.5 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="bg-primary/10 p-1.5 rounded-full h-8 w-8 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your onboarding..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default OnboardingChatbot;