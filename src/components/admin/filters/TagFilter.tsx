import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export const TagFilter = ({ tags, selectedTags, onChange, className }: TagFilterProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  if (tags.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Tags</span>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant={isSelected ? "primary" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {isSelected && <X className="ml-1 h-3 w-3" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
