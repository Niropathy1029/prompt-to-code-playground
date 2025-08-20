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
  onHtmlGenerate: (html: string) => void;
}

export const ChatPanel = ({ onCodeGenerate, onHtmlGenerate }: ChatPanelProps) => {
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
    if (prompt.toLowerCase().includes('website') || prompt.toLowerCase().includes('webpage') || prompt.toLowerCase().includes('html')) {
      const html = `<div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <header style="text-align: center; margin-bottom: 40px;">
    <h1 style="color: #333; font-size: 2.5em; margin-bottom: 10px;">Welcome to My Website</h1>
    <p style="color: #666; font-size: 1.2em;">Generated based on your request: "${prompt}"</p>
  </header>
  
  <main>
    <section style="margin-bottom: 30px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">About</h2>
      <p style="line-height: 1.6; color: #555;">This is a beautiful website created with HTML and CSS. It features a clean design with modern styling.</p>
    </section>
    
    <section style="margin-bottom: 30px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Features</h2>
      <ul style="line-height: 1.8; color: #555;">
        <li>Responsive design</li>
        <li>Clean typography</li>
        <li>Modern color scheme</li>
      </ul>
    </section>
    
    <section>
      <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Get Started
      </button>
    </section>
  </main>
</div>`;
      
      onHtmlGenerate(html);
      return {
        message: 'I\'ve generated a beautiful website for you! Check the preview panel.',
        code: `<!-- Generated HTML Website -->
${html}`
      };
    }

    if (prompt.toLowerCase().includes('button')) {
      const html = `<button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'">
  Beautiful Button
</button>`;
      
      onHtmlGenerate(html);
      return {
        message: 'I\'ve generated a beautiful button for you!',
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
      const html = `<div style="background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 24px; max-width: 400px; margin: 20px auto; border: 1px solid #e1e5e9;">
  <h3 style="color: #2c3e50; font-size: 1.5em; margin-bottom: 12px; font-weight: 600;">Beautiful Card</h3>
  <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">This is a sleek card component with modern styling and subtle shadows.</p>
  <button style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: background 0.3s;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">
    Learn More
  </button>
</div>`;
      
      onHtmlGenerate(html);
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

    // Default response with basic HTML
    const defaultHtml = `<div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
  <h2 style="color: #2c3e50; font-size: 2em; margin-bottom: 20px;">Generated Component</h2>
  <p style="color: #666; font-size: 1.1em; line-height: 1.6;">
    This component was generated based on your prompt: "${prompt}"
  </p>
  <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3498db;">
    <p style="color: #555; margin: 0;">Try asking for specific components like "button", "card", or "website" for better results!</p>
  </div>
</div>`;
    
    onHtmlGenerate(defaultHtml);
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