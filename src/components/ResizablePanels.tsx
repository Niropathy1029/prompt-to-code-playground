import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChatPanel } from "./ChatPanel";
import { CodeEditor } from "./CodeEditor";
import { WebsiteViewer } from "./WebsiteViewer";
import { ViewSwitcher } from "./ViewSwitcher";

export const ResizablePanels = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');

  const handleCodeGenerate = (code: string) => {
    setGeneratedCode(code);
  };

  const handleHtmlGenerate = (html: string) => {
    setGeneratedHtml(html);
    // Auto-switch to preview when HTML is generated
    setActiveView('preview');
  };

  const handleCodeChange = (code: string) => {
    setGeneratedCode(code);
  };

  const handleViewChange = (view: 'code' | 'preview') => {
    setActiveView(view);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
        <ChatPanel onCodeGenerate={handleCodeGenerate} onHtmlGenerate={handleHtmlGenerate} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="flex flex-col h-full">
          <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} />
          <div className="flex-1 relative overflow-hidden">
            <div 
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                activeView === 'code' 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-full opacity-0'
              }`}
            >
              <CodeEditor code={generatedCode} onCodeChange={handleCodeChange} />
            </div>
            <div 
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                activeView === 'preview' 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-full opacity-0'
              }`}
            >
              <WebsiteViewer htmlCode={generatedHtml} />
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};