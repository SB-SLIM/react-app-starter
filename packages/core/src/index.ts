import { clsx, type ClassValue } from 'clsx';

export const core = () => "hello from core";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}