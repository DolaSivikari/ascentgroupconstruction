import { sanitizeRichText } from "@/lib/richText";
export function RichText({
  content,
  className,
}: {
  content?: string | null;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(content || "") }}
    />
  );
}
