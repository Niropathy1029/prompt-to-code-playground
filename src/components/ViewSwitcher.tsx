import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Globe, ChevronLeft, ChevronRight } from "lucide-react";

interface ViewSwitcherProps {
  activeView: 'code' | 'preview';
  onViewChange: (view: 'code' | 'preview') => void;
}

export const ViewSwitcher = ({ activeView, onViewChange }: ViewSwitcherProps) => {
  const tabs = [
    { id: 'code', label: 'Code Editor', icon: Code },
    { id: 'preview', label: 'Website Preview', icon: Globe }
  ];

  const currentIndex = tabs.findIndex(tab => tab.id === activeView);

  const handleScroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(tabs.length - 1, currentIndex + 1);
    
    onViewChange(tabs[newIndex].id as 'code' | 'preview');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-card border-b border-border">
      {/* Scroll Navigation */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleScroll('left')}
          disabled={currentIndex === 0}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Active Tab Indicator */}
        <div className="flex items-center space-x-4 min-w-0">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeView;
            
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id as 'code' | 'preview')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent hover-scale'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <div className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleScroll('right')}
          disabled={currentIndex === tabs.length - 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* View Counter */}
      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
        {currentIndex + 1} of {tabs.length}
      </div>
    </div>
  );
};