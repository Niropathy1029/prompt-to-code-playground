import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Edit3, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export const CodeEditor = ({ code, onCodeChange }: CodeEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditableCode(code);
    setIsEditing(true);
  };

  const handleSave = () => {
    onCodeChange(editableCode);
    setIsEditing(false);
    toast({
      title: "Saved!",
      description: "Code changes saved",
    });
  };

  const handleCancel = () => {
    setEditableCode(code);
    setIsEditing(false);
  };

  const renderSyntaxHighlightedCode = (codeString: string) => {
    // Simple syntax highlighting for demonstration
    return codeString
      .split('\n')
      .map((line, index) => {
        let highlightedLine = line;
        
        // Keywords
        highlightedLine = highlightedLine.replace(
          /\b(import|export|const|let|var|function|return|if|else|for|while|class|extends|default|from|as)\b/g,
          '<span class="text-syntax-keyword font-semibold">$1</span>'
        );
        
        // Strings
        highlightedLine = highlightedLine.replace(
          /(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g,
          '<span class="text-syntax-string">$&</span>'
        );
        
        // Comments
        highlightedLine = highlightedLine.replace(
          /(\/\/.*$|\/\*[\s\S]*?\*\/)/g,
          '<span class="text-syntax-comment italic">$1</span>'
        );

        return (
          <div key={index} className="flex">
            <span className="text-muted-foreground text-xs w-8 text-right mr-4 select-none">
              {index + 1}
            </span>
            <span 
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: highlightedLine || '&nbsp;' }}
            />
          </div>
        );
      });
  };

  return (
    <div className="flex flex-col h-full bg-code-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-code-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Code Output</h2>
          <p className="text-sm text-muted-foreground">Generated React component</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 relative">
        {isEditing ? (
          <textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="w-full h-full p-4 bg-code-bg text-foreground border-none resize-none font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
          />
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4">
              {code ? (
                <pre className="font-mono text-sm leading-relaxed text-foreground">
                  {renderSyntaxHighlightedCode(code)}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No code generated yet</p>
                    <p className="text-sm">Start a conversation to generate code</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};