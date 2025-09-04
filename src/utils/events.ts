// lightweight event bus
export type AppEventMap = {
  'city.selected': { city: string; country?: string; lat?: number; lng?: number };
};

export function emit<K extends keyof AppEventMap>(name: K, detail: AppEventMap[K]) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on<K extends keyof AppEventMap>(
  name: K,
  handler: (e: CustomEvent<AppEventMap[K]>) => void
) {
  const wrapped = handler as EventListener;
  document.addEventListener(name, wrapped);
  return () => document.removeEventListener(name, wrapped);
}