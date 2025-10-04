/**
 * Consistent button style utilities for action buttons across the app
 * Use these to maintain a unified look across mentors, rentals, marketplace, and dating sections
 */

export const actionButtonClasses = {
  // Primary action buttons - for main CTAs like "Contact", "Message", "Book Session"
  primary: "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto",
  
  // Secondary action buttons - for less prominent actions
  secondary: "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto",
  
  // Outline buttons - for tertiary actions
  outline: "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border-2 border-border bg-background hover:bg-muted hover:border-primary/30 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto",
  
  // Destructive actions - for delete, remove, etc.
  danger: "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto",
};

/**
 * Mobile-first button utilities
 * These ensure buttons work well on mobile devices with proper touch targets
 */
export const mobileButtonClasses = {
  // Full width on mobile, auto width on larger screens
  responsive: "w-full sm:w-auto",
  
  // Always full width
  fullWidth: "w-full",
  
  // Minimum touch target size for mobile (48px height)
  touchTarget: "min-h-[48px] sm:min-h-[40px]",
};

/**
 * Helper to combine action button styles with custom classes
 */
export const getActionButtonClass = (
  variant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary',
  customClasses?: string
) => {
  const baseClass = actionButtonClasses[variant];
  return customClasses ? `${baseClass} ${customClasses}` : baseClass;
};
