import { Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sanitizePhone } from '@/utils/sanitize';

interface ContactButtonProps {
  contact?: string;
  className?: string;
}

function normalizeDigits(s: string) {
  const sanitized = sanitizePhone(s);
  // Validate length (international max is 15 digits)
  if (sanitized.length < 10 || sanitized.length > 15) {
    return null;
  }
  // Validate format
  if (!/^\+?\d{10,15}$/.test(sanitized)) {
    return null;
  }
  return sanitized.startsWith('+') ? sanitized : `+${sanitized}`;
}

export default function ContactButton({ contact, className = "" }: ContactButtonProps) {
  if (!contact) return null;

  let href = '';
  let icon = <Phone className="w-4 h-4" />;
  let label = 'Call';
  
  const c = contact.trim().toLowerCase();

  if (c.startsWith('@') || c.includes('telegram') || c.includes('t.me')) {
    const username = c.startsWith('@') ? c.slice(1) : c.split('/').pop() || c;
    href = `https://t.me/${username}`;
    icon = <MessageCircle className="w-4 h-4" />;
    label = 'Telegram';
  } else if (c.includes('whatsapp') || c.includes('wa.me')) {
    const digits = normalizeDigits(c);
    if (!digits) return null; // Invalid phone number
    href = `https://wa.me/${encodeURIComponent(digits.replace(/^\+/, ''))}`;
    icon = <MessageCircle className="w-4 h-4" />;
    label = 'WhatsApp';
  } else if (/^\+?\d[\d\s\-().]{5,}$/.test(c)) {
    const digits = normalizeDigits(c);
    if (!digits) return null; // Invalid phone number
    href = `tel:${digits}`;
    icon = <Phone className="w-4 h-4" />;
    label = 'Call';
  } else if (c.startsWith('http') || c.includes('.')) {
    href = c.startsWith('http') ? c : `https://${c}`;
    icon = <ExternalLink className="w-4 h-4" />;
    label = 'Visit';
  } else {
    const digits = normalizeDigits(c);
    if (!digits) return null; // Invalid phone number
    href = `tel:${digits}`;
    icon = <Phone className="w-4 h-4" />;
    label = 'Call';
  }

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className={`bg-green-600 hover:bg-green-700 text-white border-green-600 ${className}`}
    >
      <a href={href} target="_blank" rel="noreferrer">
        {icon}
        <span className="ml-2">{label}</span>
      </a>
    </Button>
  );
}