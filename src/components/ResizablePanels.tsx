import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChatPanel } from "./ChatPanel";
import { CodeEditor } from "./CodeEditor";

export const ResizablePanels = () => {
  const [generatedCode, setGeneratedCode] = useState('');

  const handleCodeGenerate = (code: string) => {
    setGeneratedCode(code);
  };

  const handleCodeChange = (code: string) => {
    setGeneratedCode(code);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
        <ChatPanel onCodeGenerate={handleCodeGenerate} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={40}>
        <CodeEditor code={generatedCode} onCodeChange={handleCodeChange} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};