import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean; // Support meta key for Mac compatibility
  shift?: boolean;
  alt?: boolean;
  handler?: (e: KeyboardEvent) => void;
  callback?: () => void; // Support callback for compatibility
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        // Support both ctrl and meta (for Mac)
        const ctrlMatch = (shortcut.ctrl || shortcut.meta) 
          ? (e.ctrlKey || e.metaKey) 
          : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          // Support both handler and callback
          if (shortcut.handler) {
            shortcut.handler(e);
          } else if (shortcut.callback) {
            shortcut.callback();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
