import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes intelligently, resolving conflicts
 * (e.g. cn("p-2", "p-4") => "p-4").
 * Standard shadcn/ui utility, used by every UI primitive.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
