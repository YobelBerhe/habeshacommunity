import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="text-center py-6 text-muted-foreground">
        Please select a date to see available time slots
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Loading available slots...
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-3">Available Time Slots</p>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant={selectedSlotId === slot.id ? 'default' : 'outline'}
            className={cn(
              'justify-start',
              selectedSlotId === slot.id && 'ring-2 ring-primary'
            )}
            onClick={() => onSlotSelect(slot.id, slot.start_time, slot.end_time)}
          >
            <Clock className="w-4 h-4 mr-2" />
            {slot.start_time} - {slot.end_time}
          </Button>
        ))}
      </div>
    </div>
  );
}
