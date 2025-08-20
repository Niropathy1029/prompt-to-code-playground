import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onCodeGenerate: (code: string) => void;
}

export const ChatPanel = ({ onCodeGenerate }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your coding assistant. Describe what you want to build and I\'ll generate the code for you.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response with code generation
    setTimeout(() => {
      const aiResponse = generateCodeResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      onCodeGenerate(aiResponse.code);
    }, 1000);

    setInput('');
  };

  const generateCodeResponse = (prompt: string) => {
    // Simple code generation based on keywords
    if (prompt.toLowerCase().includes('button')) {
      return {
        message: 'I\'ve generated a beautiful button component for you!',
        code: `import React from 'react';

const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button 
      className={\`\${baseStyles} \${variants[variant]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`
      };
    }

    if (prompt.toLowerCase().includes('card')) {
      return {
        message: 'Here\'s a sleek card component!',
        code: `import React from 'react';

const Card = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};

export default Card;`
      };
    }

    return {
      message: 'I\'ve generated a React component based on your request!',
      code: `import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Generated Component</h2>
      <p className="text-gray-600">
        This component was generated based on your prompt: "${prompt}"
      </p>
    </div>
  );
};

export default MyComponent;`
    };
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Code Assistant</h2>
        <p className="text-sm text-muted-foreground">Describe what you want to build</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md ${
                message.type === 'user' 
                  ? 'bg-chat-user text-primary-foreground' 
                  : 'bg-chat-assistant text-foreground'
              }`}>
                {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-chat-user text-primary-foreground ml-auto'
                  : 'bg-chat-assistant text-foreground'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};