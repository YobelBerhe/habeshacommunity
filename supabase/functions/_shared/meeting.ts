export function buildJoinUrl(provider: string | null, base: string | null, bookingId: string) {
  const p = (provider || '').toLowerCase();
  if (p === 'jitsi') return `https://meet.jit.si/habesha-${bookingId}`;
  // For discord/gmeet/zoom/whereby use mentor-provided base link as-is for MVP
  return base || '';
}