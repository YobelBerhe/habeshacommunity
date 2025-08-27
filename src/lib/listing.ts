import type { Listing } from "@/types";

export function getListingImages(l: Listing): string[] {
  return (l as any).photos ?? (l as any).images ?? [];
}