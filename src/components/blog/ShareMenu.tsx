import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ShareMenu = () => {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    }
  };

  return (
    <Button 
      onClick={handleShare} 
      variant="outline" 
      size="default"
      className="touch-target"
      aria-label="Share this page"
    >
      <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
      Share
    </Button>
  );
};

export default ShareMenu;
