import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChatPanel } from "./ChatPanel";
import { CodeEditor } from "./CodeEditor";
import { WebsiteViewer } from "./WebsiteViewer";

export const ResizablePanels = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handleCodeGenerate = (code: string) => {
    setGeneratedCode(code);
  };

  const handleHtmlGenerate = (html: string) => {
    setGeneratedHtml(html);
  };

  const handleCodeChange = (code: string) => {
    setGeneratedCode(code);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
        <ChatPanel onCodeGenerate={handleCodeGenerate} onHtmlGenerate={handleHtmlGenerate} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={30}>
        <CodeEditor code={generatedCode} onCodeChange={handleCodeChange} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={30}>
        <WebsiteViewer htmlCode={generatedHtml} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};