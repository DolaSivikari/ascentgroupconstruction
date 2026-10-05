import { useEffect, useId, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "@/components/ui/label";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { cn } from "@/lib/utils";
import { isSafeEditorLink, sanitizeRichText } from "@/lib/richText";

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
  placeholder = "Start typing…",
  required = false,
  minHeight = "200px",
  maxLength,
  className,
}: RichTextEditorProps) => {
  const generatedId = useId();
  const editorId = id || generatedId;
  const [validationError, setValidationError] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ["https", "mailto"],
          defaultProtocol: "https",
          isAllowedUri: isSafeEditorLink,
          HTMLAttributes: { rel: "noopener noreferrer" },
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: sanitizeRichText(value || ""),
    editorProps: {
      attributes: {
        id: editorId,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": label || "Rich text",
        class: "prose prose-sm max-w-none p-4 focus:outline-none",
      },
      transformPastedHTML: sanitizeRichText,
    },
    onUpdate: ({ editor: current }) => {
      setValidationError("");
      onChange(current.isEmpty ? "" : sanitizeRichText(current.getHTML()));
    },
  });
  useEffect(() => {
    if (
      editor &&
      sanitizeRichText(editor.isEmpty ? "" : editor.getHTML()) !==
        sanitizeRichText(value || "")
    )
      editor.commands.setContent(sanitizeRichText(value || ""), {
        emitUpdate: false,
      });
  }, [editor, value]);
  const length = editor?.getText().length || 0;
  const actions = [
    {
      label: "Bold",
      active: editor?.isActive("bold"),
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      active: editor?.isActive("italic"),
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "H2",
      active: editor?.isActive("heading", { level: 2 }),
      run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      active: editor?.isActive("heading", { level: 3 }),
      run: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bullets",
      active: editor?.isActive("bulletList"),
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      active: editor?.isActive("orderedList"),
      run: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    { label: "Undo", run: () => editor?.chain().focus().undo().run() },
    { label: "Redo", run: () => editor?.chain().focus().redo().run() },
  ];
  return (
    <div className={cn("space-y-2 admin-rich-editor", className)}>
      {label && (
        <Label htmlFor={editorId}>
          {label}
          {required && " *"}
        </Label>
      )}
      <div className="rounded-lg border bg-background">
        <div
          role="toolbar"
          aria-label="Text formatting"
          className="flex flex-wrap gap-1 border-b p-2"
        >
          {actions.map((action) => (
            <Button
              key={action.label}
              type="button"
              size="sm"
              variant={action.active ? "secondary" : "ghost"}
              aria-pressed={action.active}
              onClick={action.run}
              disabled={!editor}
            >
              {action.label}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setLink(String(editor?.getAttributes("link").href || ""));
              setLinkError("");
              setLinkOpen(!linkOpen);
            }}
          >
            Link
          </Button>
        </div>
        {linkOpen && (
          <div className="flex flex-wrap gap-2 p-2 border-b">
            <Input
              aria-label="Link URL"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https:// or mailto:"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (!isSafeEditorLink(link)) {
                  setLinkError("Use an HTTPS or mailto link.");
                  return;
                }
                editor
                  ?.chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: link.trim() })
                  .run();
                setLinkOpen(false);
              }}
            >
              Apply link
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                editor?.chain().focus().unsetLink().run();
                setLinkOpen(false);
              }}
            >
              Remove link
            </Button>
            {linkError && (
              <p role="alert" className="text-destructive text-sm">
                {linkError}
              </p>
            )}
          </div>
        )}
        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <input
        aria-label={`${label || "Rich text"} validation`}
        className="admin-rich-validation"
        tabIndex={-1}
        value={editor?.isEmpty ? "" : editor?.getText() || ""}
        required={required}
        maxLength={maxLength}
        onChange={() => {}}
        onInvalid={(event) => {
          event.preventDefault();
          setValidationError(
            editor?.isEmpty
              ? `${label || "This field"} is required.`
              : `Keep this field within ${maxLength} characters.`,
          );
          editor?.commands.focus();
        }}
        ref={(node) =>
          node?.setCustomValidity(
            maxLength && length > maxLength
              ? `Keep ${label || "this field"} within ${maxLength} characters.`
              : "",
          )
        }
      />
      {validationError && (
        <p role="alert" className="text-sm text-destructive">
          {validationError}
        </p>
      )}
      {maxLength && (
        <p
          className={cn(
            "text-xs",
            length > maxLength ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {length.toLocaleString()} / {maxLength.toLocaleString()} characters
        </p>
      )}
    </div>
  );
};
