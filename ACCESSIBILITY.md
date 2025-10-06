# Accessibility Implementation Guide

## Phase 8.1: Keyboard Navigation & Focus Management ✅

### Implemented Features

#### 1. Focus Management Utilities
**File**: `src/utils/focusManagement.ts`

- `trapFocus()` - Traps focus within a container (modals, dialogs)
- `saveFocus()` - Saves currently focused element
- `restoreFocus()` - Restores focus to previous element
- `focusFirstElement()` - Focuses first focusable element in container

#### 2. Accessibility Hooks

**useFocusTrap** (`src/hooks/useFocusTrap.ts`)
- Automatically traps focus in modals/dialogs
- Focuses first focusable element on mount
- Cleans up on unmount

**useKeyboardShortcut** (`src/hooks/useKeyboardShortcut.ts`)
- Register keyboard shortcuts with modifier keys
- Prevents conflicts with input fields
- Example shortcuts implemented in Browse page:
  - `Ctrl + /` - Focus search
  - `Ctrl + N` - Open new post
  - `Ctrl + K` - Open chat
  - `Ctrl + I` - Open inbox

**useRovingTabIndex** (`src/hooks/useRovingTabIndex.ts`)
- Arrow key navigation in lists/grids
- Home/End key support
- Auto-focus active item

**useEscapeKey** (`src/hooks/useEscapeKey.ts`)
- Close modals/dialogs with Escape key
- Conditional activation

#### 3. Skip Navigation Link
**Component**: `src/components/SkipLink.tsx`

- Screen reader accessible
- Visible on keyboard focus
- Jumps directly to main content (#main-content)
- Added to App.tsx root

#### 4. Focus Styles
**File**: `src/index.css`

Custom focus indicators for:
- All interactive elements (`:focus-visible`)
- Buttons and links
- Form inputs with enhanced styling
- Cards and clickable elements
- Screen reader only class (`.sr-only`)
- Active roving tab index items

### Usage Examples

#### Focus Trap in Modal
```tsx
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Modal({ isOpen }) {
  const trapRef = useFocusTrap(isOpen);
  
  return (
    <div ref={trapRef}>
      {/* Modal content */}
    </div>
  );
}
```

#### Keyboard Shortcuts
```tsx
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

function MyComponent() {
  useKeyboardShortcut('s', handleSave, { ctrl: true });
  useKeyboardShortcut('Escape', handleClose);
  
  // ...
}
```

#### Roving Tab Index for Lists
```tsx
import { useRovingTabIndex } from '@/hooks/useRovingTabIndex';

function CardList({ items }) {
  const { activeIndex, getItemProps } = useRovingTabIndex(items.length);
  
  return (
    <div>
      {items.map((item, index) => (
        <Card
          {...getItemProps(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSelect(item);
          }}
        >
          {item.title}
        </Card>
      ))}
    </div>
  );
}
```

### Keyboard Navigation Guide for Users

#### Global Shortcuts
- `Ctrl + /` - Focus search bar
- `Ctrl + N` - Create new post
- `Ctrl + K` - Open chat
- `Ctrl + I` - Open inbox
- `Escape` - Close modal/dialog
- `Tab` - Navigate forward through interactive elements
- `Shift + Tab` - Navigate backward

#### List Navigation
- `Arrow Down` - Move to next item
- `Arrow Up` - Move to previous item
- `Home` - Jump to first item
- `End` - Jump to last item
- `Enter` or `Space` - Activate/select item

### Testing Checklist

#### Basic Keyboard Navigation
- [ ] Tab through entire page - all interactive elements reachable
- [ ] Focus indicators clearly visible on all elements
- [ ] Skip link appears when focused
- [ ] Skip link jumps to main content

#### Keyboard Shortcuts
- [ ] Ctrl+/ focuses search
- [ ] Ctrl+N opens post modal
- [ ] Ctrl+K navigates to chat
- [ ] Escape closes modals
- [ ] Shortcuts don't trigger when typing in inputs

#### Modal Focus Management
- [ ] Opening modal traps focus
- [ ] Tab cycles through modal elements only
- [ ] Escape closes modal
- [ ] Closing modal returns focus to trigger element

#### List Navigation
- [ ] Arrow keys navigate through items
- [ ] Home/End keys jump to start/end
- [ ] Active item clearly highlighted
- [ ] Enter/Space activates items

### Browser Compatibility
✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari
✅ Mobile browsers (touch + keyboard)

### Known Limitations
- Focus trap requires at least one focusable element
- Keyboard shortcuts don't work in some browser extensions
- Some screen readers may need additional ARIA labels (Phase 8.2)

---

## Phase 8.2: Screen Reader Optimization & ARIA (Coming Next)
Will include:
- ARIA labels and descriptions
- Live regions for dynamic content
- Proper heading hierarchy
- Landmark regions
- Alt text optimization

## Phase 8.3: Color Contrast & Visual Accessibility (Future)
Will include:
- WCAG 2.1 AA color contrast compliance
- High contrast mode support
- Font size controls
- Reduced motion preferences
- Color blind friendly palettes

---

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [Focus Management](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/) (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (Mac/iOS)

### Implementation Notes
- All focus management utilities are unit-tested
- Focus styles use CSS `:focus-visible` for better UX
- Keyboard shortcuts respect input field context
- Skip link uses semantic HTML for better screen reader support
