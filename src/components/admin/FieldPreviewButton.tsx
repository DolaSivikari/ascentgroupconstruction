import { Eye } from 'lucide-react';
import { Button } from '@/ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FieldPreviewButtonProps {
  onClick: () => void;
  tooltip?: string;
}

export const FieldPreviewButton = ({ 
  onClick, 
  tooltip = "Preview on public site" 
}: FieldPreviewButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="h-8 w-8 ml-2"
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
