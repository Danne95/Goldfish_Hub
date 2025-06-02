import { StorageKey } from '../types';

export const saveToStorage = <T>(key: StorageKey, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromStorage = <T>(key: StorageKey): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 