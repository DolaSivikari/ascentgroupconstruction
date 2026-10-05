# Accessibility Guide (WCAG 2.1 AA)

## Overview

This website is designed to meet WCAG 2.1 AA accessibility standards, ensuring usability for all visitors including those using assistive technologies.

## Compliance Standards

- **WCAG 2.1 Level AA**: Full compliance
- **AODA (Ontario)**: Compliant
- **Section 508**: Compliant

## Implemented Features

### 1. Keyboard Navigation

#### Skip to Content Link
- Press `Tab` on page load to reveal skip link
- Allows keyboard users to bypass navigation
- Implemented on all pages

#### Tab Order
- Logical tab order follows visual flow
- All interactive elements are keyboard accessible
- No keyboard traps

#### Keyboard Shortcuts
- `Tab`: Navigate forward
- `Shift + Tab`: Navigate backward
- `Enter/Space`: Activate buttons and links
- `Escape`: Close modals and dropdowns
- `Arrow keys`: Navigate menus

### 2. Screen Reader Support

#### ARIA Landmarks
```html
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<footer role="contentinfo">
```

#### ARIA Labels
- All interactive elements have descriptive labels
- Icons have `aria-label` attributes
- Complex widgets use appropriate ARIA attributes

#### ARIA States
- `aria-expanded`: Dropdown menus, accordions
- `aria-current="page"`: Active navigation links
- `aria-hidden`: Decorative elements
- `aria-live`: Dynamic content updates

### 3. Visual Accessibility

#### Color Contrast
All text meets WCAG AA contrast requirements:
- **Normal text**: 4.5:1 minimum
- **Large text** (18px+): 3:1 minimum
- **UI components**: 3:1 minimum

#### Focus Indicators
```css
*:focus-visible {
  outline: 2px solid hsl(var(--secondary));
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### Text Sizing
- Base font size: 16px
- Responsive scaling with viewport
- No text below 14px (except fine print)
- Text can be zoomed to 200% without breaking layout

### 4. Content Structure

#### Semantic HTML
- Proper heading hierarchy (H1 → H2 → H3)
- One H1 per page
- Semantic elements (`<article>`, `<section>`, `<nav>`)
- Lists use `<ul>`, `<ol>`, `<dl>`

#### Alt Text Guidelines
```tsx
// Informative images
<OptimizedImage 
  src={project} 
  alt="Downtown office tower with reflective glass facade and steel frame"
/>

// Decorative images
<OptimizedImage 
  src={pattern} 
  alt=""
  role="presentation"
/>

// Linked images
<OptimizedImage 
  src={thumbnail} 
  alt="View case study: Heritage building restoration project"
/>
```

### 5. Forms and Inputs

#### Labels
- All inputs have associated `<label>` elements
- Labels are visible and descriptive
- Placeholder text is not used as labels

#### Error Messages
- Clearly identified with icons and color
- Associated with inputs using `aria-describedby`
- Announced to screen readers
- Provide guidance on how to fix errors

#### Required Fields
- Marked with `required` attribute
- Indicated visually (asterisk)
- Announced to screen readers

## Testing Procedures

### Automated Testing Tools

#### Browser Extensions
- **WAVE**: Web accessibility evaluation tool
- **axe DevTools**: Automated accessibility testing
- **Lighthouse**: Built into Chrome DevTools

#### Testing Checklist
```bash
# Run automated tests
1. Chrome Lighthouse (Accessibility audit)
2. WAVE browser extension
3. axe DevTools scan
```

### Manual Testing

#### Keyboard Navigation Test
- [ ] Tab through entire page
- [ ] Verify skip link appears
- [ ] All interactive elements are reachable
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Dropdowns work with keyboard

#### Screen Reader Test
##### NVDA (Windows - Free)
```
1. Download from: https://www.nvaccess.org
2. Start NVDA
3. Navigate with Tab and Arrow keys
4. Verify all content is announced
```

##### JAWS (Windows - Commercial)
```
1. Popular enterprise screen reader
2. Test with most common version
3. Verify complex widgets work
```

##### VoiceOver (macOS - Built-in)
```
1. Enable: Cmd + F5
2. Navigate: Ctrl + Option + Arrow keys
3. Interact: Ctrl + Option + Space
```

#### Color Contrast Test
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Lighthouse**: Automated contrast checking
- Test with:
  - Normal text
  - Large text
  - UI components
  - Hover states

#### Zoom Test
- Zoom browser to 200%
- Verify layout doesn't break
- Verify no horizontal scrolling
- Verify all functionality works

### Real User Testing
- Test with actual assistive technology users
- Gather feedback on usability
- Document pain points
- Iterate based on feedback

## Accessibility Checklist for New Features

When adding new features:

- [ ] Semantic HTML elements used
- [ ] Heading hierarchy is correct
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] ARIA labels are appropriate
- [ ] Forms have proper labels
- [ ] Error messages are clear
- [ ] Tested with screen reader
- [ ] No flashing content (seizure risk)
- [ ] Animations respect `prefers-reduced-motion`

## Common Issues and Solutions

### Issue: Decorative Images
**Problem**: Screen readers announce irrelevant decorative images
**Solution**: Use empty alt text `alt=""` and `role="presentation"`

### Issue: Icon Buttons
**Problem**: Icon-only buttons have no label
**Solution**: Add `aria-label` attribute
```tsx
<button aria-label="Close menu">
  <X className="h-5 w-5" />
</button>
```

### Issue: Color-Only Information
**Problem**: Information conveyed by color alone
**Solution**: Add icons, text labels, or patterns

### Issue: Focus Not Visible
**Problem**: Focus indicator is removed or unclear
**Solution**: Use `:focus-visible` with clear styling

### Issue: Inaccessible Dropdowns
**Problem**: Dropdowns don't work with keyboard
**Solution**: Implement proper ARIA and keyboard handlers

## Motion and Animation

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users with vestibular disorders can enable this in their OS settings.

## Resources

### Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

### Testing Tools
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Learning Resources
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

---

**Last Updated**: March 2024
**Maintained By**: Development Team
**WCAG Version**: 2.1 Level AA
