import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  extension?: string;
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
          { id: '3', name: 'ChatPanel.tsx', type: 'file', extension: 'tsx' },
          { id: '4', name: 'CodeEditor.tsx', type: 'file', extension: 'tsx' },
          { id: '5', name: 'WebsiteViewer.tsx', type: 'file', extension: 'tsx' },
          { id: '6', name: 'ViewSwitcher.tsx', type: 'file', extension: 'tsx' },
          {
            id: '7',
            name: 'ui',
            type: 'folder',
            children: [
              { id: '8', name: 'button.tsx', type: 'file', extension: 'tsx' },
              { id: '9', name: 'sidebar.tsx', type: 'file', extension: 'tsx' },
              { id: '10', name: 'resizable.tsx', type: 'file', extension: 'tsx' },
            ]
          }
        ]
      },
      {
        id: '11',
        name: 'pages',
        type: 'folder',
        children: [
          { id: '12', name: 'Index.tsx', type: 'file', extension: 'tsx' },
          { id: '13', name: 'NotFound.tsx', type: 'file', extension: 'tsx' },
        ]
      },
      { id: '14', name: 'App.tsx', type: 'file', extension: 'tsx' },
      { id: '15', name: 'main.tsx', type: 'file', extension: 'tsx' },
      { id: '16', name: 'index.css', type: 'file', extension: 'css' },
    ]
  },
  {
    id: '17',
    name: 'public',
    type: 'folder',
    children: [
      { id: '18', name: 'robots.txt', type: 'file', extension: 'txt' },
      { id: '19', name: 'favicon.ico', type: 'file', extension: 'ico' },
    ]
  },
  { id: '20', name: 'package.json', type: 'file', extension: 'json' },
  { id: '21', name: 'tailwind.config.ts', type: 'file', extension: 'ts' },
  { id: '22', name: 'vite.config.ts', type: 'file', extension: 'ts' },
  { id: '23', name: 'README.md', type: 'file', extension: 'md' },
];

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onFileClick?: (file: FileNode) => void;
}

const FileTreeNode = ({ node, level, onFileClick }: FileTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'tsx':
      case 'ts':
        return <File className="h-4 w-4 text-syntax-keyword" />;
      case 'css':
        return <File className="h-4 w-4 text-syntax-string" />;
      case 'json':
        return <File className="h-4 w-4 text-syntax-number" />;
      case 'md':
        return <File className="h-4 w-4 text-accent" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick?.(node);
    }
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={handleClick}
          className="w-full justify-start px-2 py-1 text-sm hover:bg-accent/10"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <div className="flex items-center gap-2 w-full">
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
            <span className="text-foreground truncate">{node.name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {node.type === 'folder' && isExpanded && node.children && (
        <>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </>
      )}
    </>
  );
};

interface FileExplorerProps {
  onFileSelect?: (file: FileNode) => void;
}

export const FileExplorer = ({ onFileSelect }: FileExplorerProps) => {
  const handleFileClick = (file: FileNode) => {
    console.log('File selected:', file.name);
    onFileSelect?.(file);
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-primary border-b border-border">
            JV3 EXPLORER
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-0">
            <SidebarMenu className="space-y-0">
              {mockFileTree.map((node) => (
                <FileTreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  onFileClick={handleFileClick}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};