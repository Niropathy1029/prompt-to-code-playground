import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatPanel } from "./ChatPanel";
import { CodeEditor } from "./CodeEditor";
import { WebsiteViewer } from "./WebsiteViewer";
import { ViewSwitcher } from "./ViewSwitcher";
import { FileExplorer } from "./FileExplorer";
import { Menu } from "lucide-react";

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
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Header with sidebar trigger */}
        <div className="fixed top-0 left-0 z-50 p-2">
          <SidebarTrigger className="bg-card/80 backdrop-blur-sm border border-border hover:bg-accent/50">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>

        {/* File Explorer Sidebar */}
        <FileExplorer onFileSelect={(file) => console.log('Selected file:', file.name)} />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
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
        </div>
      </div>
    </SidebarProvider>
  );
};