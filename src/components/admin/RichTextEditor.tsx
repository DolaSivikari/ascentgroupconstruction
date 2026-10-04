import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

interface RichTextEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minHeight?: string;
  maxLength?: number;
  className?: string;
}

export const RichTextEditor = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Start typing...",
  required = false,
  minHeight = "200px",
  maxLength,
  className,
}: RichTextEditorProps) => {
  const textLength = value.replace(/<[^>]*>/g, "").length;
  const showWarning = Boolean(maxLength && textLength > maxLength * 0.9);
  const showError = Boolean(maxLength && textLength >= maxLength);

  const handleChange = (next: string) => {
    if (maxLength && next.length > maxLength) return;
    const sanitized = DOMPurify.sanitize(next);
    onChange(sanitized);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          showError && "border-destructive"
        )}
        style={{ minHeight }}
      />
      {maxLength && (
        <p className={cn(
          "text-xs mt-1",
          showError ? "text-destructive" : showWarning ? "text-warning" : "text-muted-foreground"
        )}>
          {textLength.toLocaleString()} / {maxLength.toLocaleString()} characters
        </p>
      )}
    </div>
  );
};
