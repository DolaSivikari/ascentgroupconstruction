import type { KeyboardEvent, MouseEvent } from "react";

const interactive =
  'a, button, input, textarea, select, label, [role="button"], [role="checkbox"], [role="combobox"], [contenteditable="true"]';

/** Whole-row opening must leave nested actions and text selection alone. */
export function requestActivation(open: () => void) {
  return {
    tabIndex: 0,
    onClick(event: MouseEvent<HTMLElement>) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      )
        return;
      const target = event.target as Element;
      const control = target.closest(interactive);
      if (control && control !== event.currentTarget) return;
      const selection = window.getSelection();
      if (
        selection?.toString() &&
        selection.anchorNode &&
        event.currentTarget.contains(selection.anchorNode)
      )
        return;
      open();
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      if (
        event.target !== event.currentTarget ||
        event.defaultPrevented ||
        !["Enter", " "].includes(event.key)
      )
        return;
      event.preventDefault();
      open();
    },
  };
}
