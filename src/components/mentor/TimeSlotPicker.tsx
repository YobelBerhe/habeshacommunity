import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface TimeSlotPickerProps {
  mentorId: string;
  selectedDate: Date | undefined;
  onSlotSelect: (slotId: string, startTime: string, endTime: string) => void;
  selectedSlotId?: string;
}

export default function TimeSlotPicker({
  mentorId,
  selectedDate,
  onSlotSelect,
  selectedSlotId,
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && mentorId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, mentorId]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('available_date', dateStr)
      .eq('is_booked', false)
      .order('start_time');

    if (!error && data) {
      setTimeSlots(data);
    }

    setLoading(false);
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8 px-4 bg-muted/50 rounded-lg border border-dashed">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Select a date from the calendar above
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-muted/50 rounded-lg border border-dashed">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="font-medium mb-1">No slots available</p>
        <p className="text-sm text-muted-foreground">
          Try selecting a different date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Available Times</p>
        <Badge variant="secondary" className="text-xs">
          {timeSlots.length} slot{timeSlots.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant={selectedSlotId === slot.id ? 'default' : 'outline'}
            className={cn(
              'justify-center h-auto py-3 transition-all',
              selectedSlotId === slot.id && 'ring-2 ring-primary ring-offset-2 shadow-lg'
            )}
            onClick={() => onSlotSelect(slot.id, slot.start_time, slot.end_time)}
          >
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {slot.start_time}
              </span>
              <span className="text-[10px] opacity-70">
                {slot.end_time}
              </span>
            </div>
          </Button>
        ))}
      </div>
      {selectedSlotId && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in">
          <p className="text-sm text-center">
            <span className="font-medium">Selected time slot</span>
            <br />
            <span className="text-xs text-muted-foreground">
              Click "Book Session" below to continue
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
