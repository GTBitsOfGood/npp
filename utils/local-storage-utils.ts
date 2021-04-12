export function getLocalItem<T>(name: string, fallbackValue: T): T {
  const storedValue = localStorage.getItem(name);

  if (storedValue == null) {
    return fallbackValue;
  }

  if (typeof fallbackValue != "object") {
    return (storedValue as unknown) as T;
  }

  return JSON.parse(storedValue);
}
