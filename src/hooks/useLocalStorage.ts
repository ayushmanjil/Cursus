import { useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch (err) {
      console.error(`Failed to read localStorage key "${key}"`, err);
      return initialValue;
    }
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      try {
        const raw = window.localStorage.getItem(key);
        setValue(raw ? (JSON.parse(raw) as T) : initialValue);
      } catch (err) {
        console.error(`Failed to read localStorage key "${key}"`, err);
        setValue(initialValue);
      }
    } else {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error(`Failed to write localStorage key "${key}"`, err);
      }
    }
  }, [key, value, initialValue]);

  return [value, setValue] as const;
}
