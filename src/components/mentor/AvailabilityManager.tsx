import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimeSlot {
  id?: string;
  start_time: string;
  end_time: string;
  is_booked?: boolean;
}

interface AvailabilityManagerProps {
  mentorId: string;
}

export default function AvailabilityManager({ mentorId }: AvailabilityManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState({ start_time: '', end_time: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const fetchTimeSlots = async () => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('available_date', dateStr)
      .order('start_time');

    if (error) {
      console.error('Error fetching slots:', error);
      return;
    }

    setTimeSlots(data || []);
  };

  const addTimeSlot = async () => {
    if (!selectedDate || !newSlot.start_time || !newSlot.end_time) {
      toast({
        title: 'Missing information',
        description: 'Please select a date and enter start/end times',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];

    const { error } = await supabase
      .from('mentor_availability')
      .insert({
        mentor_id: mentorId,
        available_date: dateStr,
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add time slot',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Time slot added',
      });
      setNewSlot({ start_time: '', end_time: '' });
      fetchTimeSlots();
    }

    setLoading(false);
  };

  const deleteTimeSlot = async (slotId: string) => {
    const { error } = await supabase
      .from('mentor_availability')
      .delete()
      .eq('id', slotId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete time slot',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Time slot removed',
      });
      fetchTimeSlots();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {selectedDate ? `Slots for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate && (
            <>
              <div className="space-y-3">
                <Label>Add New Time Slot</Label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    placeholder="Start"
                  />
                  <Input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    placeholder="End"
                  />
                  <Button onClick={addTimeSlot} disabled={loading} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Existing Slots</Label>
                {timeSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No slots added yet</p>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {slot.start_time} - {slot.end_time}
                          </span>
                          {slot.is_booked && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-2 py-1 rounded">
                              Booked
                            </span>
                          )}
                        </div>
                        {!slot.is_booked && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTimeSlot(slot.id!)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
