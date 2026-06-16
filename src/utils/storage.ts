import type { IStorable } from "../types";

export class LocalStore<T> implements IStorable<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  save(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (err) {
      console.warn(`LocalStore: failed to save ${this.key}`, err);
    }
  }

  load(): T | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}

export const StorageKeys = {
  auth: "medkarton:auth",
  patient: "medkarton:patient",
  appointments: "medkarton:appointments",
  records: "medkarton:records",
  recentSearches: "medkarton:recent-searches",
} as const;
