import { useState } from 'react';
import { Copy, Download, Play, FileText, FolderOpen, ChevronRight, ChevronDown, File as FileIcon, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useToast } from '@/components/ui/use-toast';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  extension?: string;
  content?: string;
}

const mockFileTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          { id: '3', name: 'ChatPanel.tsx', type: 'file', extension: 'tsx', content: '// ChatPanel component code here...' },
          { id: '4', name: 'CodeEditor.tsx', type: 'file', extension: 'tsx', content: '// CodeEditor component code here...' },
          { id: '5', name: 'WebsiteViewer.tsx', type: 'file', extension: 'tsx', content: '// WebsiteViewer component code here...' },
        ]
      },
      { id: '14', name: 'App.tsx', type: 'file', extension: 'tsx', content: '// Main App component...' },
      { id: '15', name: 'main.tsx', type: 'file', extension: 'tsx', content: '// Entry point...' },
      { id: '16', name: 'index.css', type: 'file', extension: 'css', content: '/* Main styles */' },
    ]
  },
  { id: '20', name: 'package.json', type: 'file', extension: 'json', content: '{\n  "name": "jv3"\n}' },
  { id: '23', name: 'README.md', type: 'file', extension: 'md', content: '# JV3 Project' },
];

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onFileClick: (file: FileNode) => void;
  selectedFileId?: string;
}

const FileTreeNode = ({ node, level, onFileClick, selectedFileId }: FileTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'tsx':
      case 'ts':
        return <FileIcon className="h-4 w-4 text-syntax-keyword" />;
      case 'css':
        return <FileIcon className="h-4 w-4 text-syntax-string" />;
      case 'json':
        return <FileIcon className="h-4 w-4 text-syntax-number" />;
      case 'md':
        return <FileIcon className="h-4 w-4 text-accent" />;
      default:
        return <FileIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(node);
    }
  };

  const isSelected = node.id === selectedFileId;

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent/10 rounded ${
          isSelected ? 'bg-primary/20 text-primary' : 'text-foreground'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-accent" />
            ) : (
              <Folder className="h-4 w-4 text-accent" />
            )}
          </>
        ) : (
          <>
            <div className="w-3" />
            {getFileIcon(node.extension)}
          </>
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              selectedFileId={selectedFileId}
            />
          ))}
        </>
      )}
    </>
  );
};

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export const CodeEditor = ({ code, onCodeChange }: CodeEditorProps) => {
  const [currentCode, setCurrentCode] = useState(code);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [openTabs, setOpenTabs] = useState<FileNode[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const { toast } = useToast();

  // Update current code when external code changes
  useState(() => {
    if (code !== currentCode) {
      setCurrentCode(code);
    }
  });

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      
      // Add to tabs if not already open
      if (!openTabs.find(tab => tab.id === file.id)) {
        setOpenTabs(prev => [...prev, file]);
      }
      setActiveTabId(file.id);
      
      // Set the file content to editor
      if (file.content) {
        setCurrentCode(file.content);
        onCodeChange(file.content);
      }
    }
  };

  const closeTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        const newActiveTab = remainingTabs[remainingTabs.length - 1];
        setActiveTabId(newActiveTab.id);
        setSelectedFile(newActiveTab);
        setCurrentCode(newActiveTab.content || '');
      } else {
        setActiveTabId(null);
        setSelectedFile(null);
        setCurrentCode(code);
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCurrentCode(newCode);
    onCodeChange(newCode);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
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

  const downloadCode = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile ? selectedFile.name : 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Code file downloaded",
    });
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* File Explorer Panel */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <div className="h-full bg-card border-r border-border">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">EXPLORER</span>
            </div>
          </div>
          <div className="p-2 max-h-full overflow-y-auto">
            {mockFileTree.map((node) => (
              <FileTreeNode
                key={node.id}
                node={node}
                level={0}
                onFileClick={handleFileSelect}
                selectedFileId={selectedFile?.id}
              />
            ))}
          </div>
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Code Editor Panel */}
      <ResizablePanel defaultSize={75} minSize={60}>
        <div className="h-full bg-code-bg border border-code-border rounded-lg overflow-hidden flex flex-col">
          {/* Header with tabs */}
          <div className="bg-card border-b border-border">
            {/* File Tabs */}
            {openTabs.length > 0 && (
              <div className="flex border-b border-border">
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer text-sm ${
                      activeTabId === tab.id 
                        ? 'bg-code-bg text-primary border-b-2 border-primary' 
                        : 'bg-card hover:bg-accent/10'
                    }`}
                    onClick={() => {
                      setActiveTabId(tab.id);
                      setSelectedFile(tab);
                      setCurrentCode(tab.content || '');
                    }}
                  >
                    <FileIcon className="h-3 w-3" />
                    <span>{tab.name}</span>
                    <button
                      onClick={(e) => closeTab(tab.id, e)}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {selectedFile ? selectedFile.name : 'Code Editor'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadCode}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex">
              {/* Line Numbers */}
              <div className="w-12 bg-muted/20 border-r border-border flex-shrink-0">
                <div className="p-2 text-xs text-muted-foreground font-mono leading-5">
                  {Array.from({ length: currentCode.split('\n').length }, (_, i) => (
                    <div key={i + 1} className="text-right">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 relative">
                <textarea
                  value={currentCode}
                  onChange={handleCodeChange}
                  className="w-full h-full bg-transparent text-foreground font-mono text-sm p-3 resize-none outline-none leading-5"
                  placeholder={selectedFile ? `Start editing ${selectedFile.name}...` : "Select a file to start editing or enter your code here..."}
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};