export const barcodeCache = {
  get: (barcode: string) => null,
  set: (barcode: string, data: any) => {},
  clear: () => {},
  getStats: () => ({ hits: 0, misses: 0, size: 0 }),
};
