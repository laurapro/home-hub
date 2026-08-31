import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tailwind class names for interactive card affordances.
 * Includes cursor, hover state, focus ring, and active state.
 * Use on cards that will eventually be navigable or support interactions.
 */
export function getInteractiveCardClasses(): string {
  return cn(
    "cursor-pointer transition-all duration-200",
    // Hover state
    "hover:shadow-md hover:border-foreground/20",
    // Focus state (keyboard navigation)
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2",
    // Active/press state
    "active:scale-98 active:shadow-sm",
  );
}
