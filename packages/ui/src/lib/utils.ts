import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * @param {...ClassValue[]} inputs - Class names to merge.
 * @returns {string} Merged class string.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
