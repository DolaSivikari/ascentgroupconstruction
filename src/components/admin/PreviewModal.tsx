import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/ui/Button';
import { Monitor, Tablet, Smartphone, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string;
  title: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportSizes = {
  desktop: { width: '100%', height: '100%', icon: Monitor, label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', icon: Tablet, label: 'Tablet' },
  mobile: { width: '375px', height: '667px', icon: Smartphone, label: 'Mobile' },
};

export const PreviewModal = ({
  open,
  onOpenChange,
  previewUrl,
  title,
}: PreviewModalProps) => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>Preview: {title}</DialogTitle>
            <div className="flex items-center gap-2">
              {/* Viewport toggles */}
              <div className="flex items-center gap-1 mr-4">
                {(Object.keys(viewportSizes) as ViewportSize[]).map((size) => {
                  const Icon = viewportSizes[size].icon;
                  return (
                    <Button
                      key={size}
                      variant={viewport === size ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewport(size)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{viewportSizes[size].label}</span>
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted p-4 flex items-center justify-center">
          <div
            className={cn(
              "bg-background rounded-lg shadow-lg overflow-hidden transition-all",
              viewport === 'desktop' && "w-full h-full",
              viewport === 'tablet' && "w-[768px] h-[1024px]",
              viewport === 'mobile' && "w-[375px] h-[667px]"
            )}
            style={{
              maxWidth: viewportSizes[viewport].width,
              maxHeight: viewportSizes[viewport].height,
            }}
          >
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={`Preview of ${title}`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
