import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixImgurUrl(url: string): string {
    if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        if (id) {
           return `https://i.imgur.com/${id}.png`;
        }
    }
    return url;
}
