/**
 * Color contrast utilities for WCAG 2.1 compliance
 */

export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAG_AA(ratio: number, fontSize: number, isBold: boolean): boolean {
  // Large text: 18pt+ or 14pt+ bold = 3:1 ratio
  // Normal text: 4.5:1 ratio
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

export function meetsWCAG_AAA(ratio: number, fontSize: number, isBold: boolean): boolean {
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
