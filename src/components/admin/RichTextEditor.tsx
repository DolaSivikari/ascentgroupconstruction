import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import 'react-quill/dist/quill.snow.css';

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
  placeholder = 'Start typing...',
  required = false,
  minHeight = '200px',
  maxLength,
  className,
}: RichTextEditorProps) => {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import React Quill to avoid SSR issues
    import('react-quill')
      .then((module) => {
        setReactQuill(() => module.default);
      })
      .catch((error) => {
        console.error('Failed to load React Quill editor:', error);
      });
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'indent',
    'align',
    'link',
  ];

  const handleChange = (content: string) => {
    // Strip HTML tags for character count
    const textContent = content.replace(/<[^>]*>/g, '');
    
    if (maxLength && textContent.length > maxLength) {
      return; // Don't update if exceeding max length
    }
    
    onChange(content);
  };

  if (!ReactQuill) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id}>
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="border rounded-md p-4 bg-muted/20 animate-pulse" style={{ minHeight }}>
          Loading editor...
        </div>
      </div>
    );
  }

  const textLength = value.replace(/<[^>]*>/g, '').length;
  const showWarning = maxLength && textLength > maxLength * 0.9;
  const showError = maxLength && textLength >= maxLength;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div 
        className={cn(
          "rich-text-editor border rounded-md overflow-hidden bg-background",
          showError && "border-destructive"
        )}
        style={{ minHeight }}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ height: '100%', minHeight }}
        />
      </div>
      {maxLength && (
        <p className={cn(
          "text-xs mt-1",
          showError ? "text-destructive" : showWarning ? "text-warning" : "text-muted-foreground"
        )}>
          {textLength.toLocaleString()} / {maxLength.toLocaleString()} characters
          {showWarning && !showError && (
            <span className="ml-2">⚠️ Approaching limit</span>
          )}
          {showError && (
            <span className="ml-2">⛔ Maximum reached</span>
          )}
        </p>
      )}
    </div>
  );
};
