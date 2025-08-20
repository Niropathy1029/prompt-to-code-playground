import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";

interface WebsiteViewerProps {
  htmlCode: string;
}

export const WebsiteViewer = ({ htmlCode }: WebsiteViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        // Create a complete HTML document
        const fullHtml = htmlCode.includes('<!DOCTYPE html') 
          ? htmlCode 
          : `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        * { box-sizing: border-box; }
    </style>
</head>
<body>
    ${htmlCode}
</body>
</html>`;

        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  };

  useEffect(() => {
    updatePreview();
  }, [htmlCode]);

  const handleRefresh = () => {
    updatePreview();
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      const fullHtml = htmlCode.includes('<!DOCTYPE html') 
        ? htmlCode 
        : `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        * { box-sizing: border-box; }
    </style>
</head>
<body>
    ${htmlCode}
</body>
</html>`;

      newWindow.document.write(fullHtml);
      newWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Website Preview</h2>
          <p className="text-sm text-muted-foreground">Live HTML preview</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative bg-white">
        {htmlCode ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20">
            <div className="text-center">
              <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No HTML to preview</p>
              <p className="text-sm">Generate HTML code to see the live preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};