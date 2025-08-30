import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Send, Bot, User, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface MicrolearningCard {
  id: string;
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

interface WebLLMChatbotProps {
  onClose: () => void;
}

const WebLLMChatbot: React.FC<WebLLMChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI onboarding assistant. I can help you with questions about company policies, procedures, and generate learning modules. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [microlearningCards, setMicrolearningCards] = useState<MicrolearningCard[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated WebLLM responses based on keywords
  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const message = userMessage.toLowerCase();

    if (message.includes('policy') || message.includes('handbook')) {
      return 'Based on the company handbook, here are key policies you should know:\n\n• **Code of Conduct**: All employees must maintain professional behavior and ethical standards\n• **IT Security**: Use strong passwords and never share credentials\n• **Work from Home**: Available 2 days per week with manager approval\n• **Benefits**: Health insurance, retirement plan, and professional development budget available\n\nWould you like me to generate a learning module about any specific policy?';
    }

    if (message.includes('security') || message.includes('password')) {
      return 'Security is crucial at Société Générale. Here are essential security practices:\n\n• Use multi-factor authentication on all systems\n• Never share passwords or leave systems unlocked\n• Report suspicious emails to IT Security immediately\n• Use only approved software and cloud services\n• Encrypt sensitive data according to company standards\n\nI can create a security awareness learning module if you\'d like!';
    }

    if (message.includes('team') || message.includes('manager') || message.includes('colleague')) {
      return 'Building relationships with your team is important! Here\'s how to get started:\n\n• Schedule 1:1 meetings with your direct manager\n• Join team coffee chats and social events\n• Use Slack for daily communication\n• Attend weekly team standup meetings\n• Check the org chart to understand team structure\n\nWould you like me to create a learning module about effective team collaboration?';
    }

    if (message.includes('learning') || message.includes('module') || message.includes('training')) {
      generateMicrolearning();
      return 'I\'ve generated a microlearning module for you! Check the learning cards below. These bite-sized lessons help you absorb information quickly and test your understanding.';
    }

    // Default response
    return 'I understand you\'re asking about onboarding. Here are some topics I can help with:\n\n• Company policies and procedures\n• IT security best practices\n• Team structure and communication\n• Benefits and HR information\n• Professional development opportunities\n\nFeel free to ask me anything specific, or I can generate a learning module on any topic!';
  };

  const generateMicrolearning = () => {
    const cards: MicrolearningCard[] = [
      {
        id: '1',
        title: 'Company Communication Tools',
        content: 'At Société Générale, we use several key communication tools:\n\n• **Slack** - Daily team communication and quick updates\n• **Microsoft Teams** - Video meetings and file collaboration\n• **Email** - Formal communications and external contacts\n• **Jira** - Project tracking and task management\n\nEach tool has its purpose - use Slack for informal chats, Teams for meetings, and email for official communications.',
        quiz: {
          question: 'Which tool should you use for daily team communication?',
          options: ['Email', 'Slack', 'Jira', 'Phone'],
          correct: 1,
        },
      },
      {
        id: '2',
        title: 'Security Best Practices',
        content: 'Protecting company data is everyone\'s responsibility:\n\n• **Strong Passwords** - Use unique, complex passwords for each system\n• **Two-Factor Authentication** - Always enable 2FA when available\n• **Clean Desk Policy** - Lock your screen and secure physical documents\n• **Phishing Awareness** - Verify sender identity before clicking links\n\nRemember: When in doubt about security, ask the IT team!',
        quiz: {
          question: 'What should you do if you receive a suspicious email?',
          options: ['Delete it immediately', 'Forward to colleagues', 'Report to IT Security', 'Click to investigate'],
          correct: 2,
        },
      },
    ];

    setMicrolearningCards(cards);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: 'Thinking...',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await generateResponse(inputValue);
      
      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat({
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      }));
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat({
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try asking your question again.',
        sender: 'bot',
        timestamp: new Date(),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl h-[80vh] bg-background rounded-lg shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">AI Onboarding Assistant</h3>
              <p className="text-sm text-muted-foreground">Powered by WebLLM</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' ? 'bg-primary' : 'bg-accent'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card border'
                      }`}>
                        {message.isTyping ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                        )}
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about policies, procedures, or request learning modules..."
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Microlearning Cards Sidebar */}
          {microlearningCards.length > 0 && (
            <div className="w-80 border-l bg-card/50">
              <div className="p-4 border-b">
                <h4 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Learning Modules
                </h4>
              </div>
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {microlearningCards.map((card) => (
                    <Card key={card.id} className="p-4">
                      <h5 className="font-medium mb-2">{card.title}</h5>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                        {card.content}
                      </div>
                      {card.quiz && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{card.quiz.question}</p>
                          <div className="space-y-1">
                            {card.quiz.options.map((option, index) => (
                              <Button
                                key={index}
                                variant={index === card.quiz!.correct ? "default" : "outline"}
                                size="sm"
                                className="w-full justify-start text-left"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WebLLMChatbot;