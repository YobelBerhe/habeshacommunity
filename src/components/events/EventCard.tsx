import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: {
    id: string
    slug: string
    title: string
    cover_image?: string | null
    start_date: string
    city?: string | null
    rsvp_count: number
    capacity?: number | null
    calendar?: {
      name: string
      avatar?: string | null
    }
  }
  variant?: 'default' | 'compact' | 'featured'
}

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';
  const startDate = new Date(event.start_date);

  return (
    <Link to={`/community/events/${event.slug || event.id}`}>
      <Card className={`group overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
        isFeatured ? 'lg:flex lg:flex-row' : ''
      }`}>
        {/* Cover Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ${
          isCompact ? 'h-40' : 'h-56'
        } ${isFeatured ? 'lg:w-2/5' : ''}`}>
          {event.cover_image ? (
            <img
              src={event.cover_image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute left-4 top-4 flex flex-col items-center rounded-lg bg-background px-3 py-2 shadow-xl border border-border/50 backdrop-blur-sm">
            <span className="text-xs font-semibold text-primary uppercase">
              {format(startDate, 'MMM')}
            </span>
            <span className="text-2xl font-bold">
              {format(startDate, 'd')}
            </span>
          </div>

          {/* Calendar Badge */}
          {event.calendar && (
            <Badge className="absolute right-4 top-4 shadow-lg" variant="secondary">
              {event.calendar.name}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col p-6 ${isFeatured ? 'lg:w-3/5' : ''}`}>
          <h3 className={`font-bold line-clamp-2 transition-colors group-hover:text-primary ${
            isCompact ? 'text-lg' : 'text-xl'
          } ${isFeatured ? 'lg:text-2xl' : ''}`}>
            {event.title}
          </h3>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              {format(startDate, 'EEE, MMM d')} · {format(startDate, 'h:mm a')}
            </span>
          </div>

          {event.city && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.city}</span>
            </div>
          )}

          <div className="mt-auto pt-5 flex items-center justify-between border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>
                {event.rsvp_count || 0} {event.rsvp_count === 1 ? 'guest' : 'guests'}
                {event.capacity && ` · ${event.capacity} capacity`}
              </span>
            </div>

            <span className="text-sm font-semibold text-primary group-hover:underline flex items-center gap-1">
              View Event 
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function EventGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
