import { ListingContactRow } from "@/types/db";

// Helper function to safely access contact data
export function getContactValue(
  contact: ListingContactRow | undefined,
  method: 'phone' | 'whatsapp' | 'telegram' | 'email'
): string | null {
  if (!contact || contact.contact_method !== method) {
    return null;
  }
  return contact.contact_value;
}

// Helper to check if contact data exists and is for authenticated users
export function hasContactAccess(
  user: any,
  rowWithContact: any
): rowWithContact is { contact: ListingContactRow } {
  return !!(user && rowWithContact && 'contact' in rowWithContact && rowWithContact.contact);
}