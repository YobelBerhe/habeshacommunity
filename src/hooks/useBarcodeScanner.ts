import { useState, useRef } from 'react';

export function useBarcodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScanning = () => {
    setScanning(true);
    setIsScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
    setIsScanning(false);
  };

  const manualEntry = (barcode: string) => {
    setDetectedBarcode(barcode);
    setResult(barcode);
  };

  const reset = () => {
    setDetectedBarcode(null);
    setResult(null);
    setError(null);
  };

  return {
    scanning,
    result,
    startScan: startScanning,
    stopScan: stopScanning,
    videoRef,
    isScanning,
    detectedBarcode,
    error,
    startScanning,
    stopScanning,
    manualEntry,
    reset,
  };
}
