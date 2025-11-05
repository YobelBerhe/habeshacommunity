import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, MapPin, Users, FileText } from 'lucide-react';
import { EVENT_THEMES } from '@/config/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  calendarId: z.string().min(1, 'Please select a calendar'),
  theme: z.enum(['minimal', 'quantum', 'warp', 'emoji', 'confetti', 'pattern', 'seasonal']),
  startDate: z.string(),
  endDate: z.string(),
  timezone: z.string(),
  locationType: z.enum(['physical', 'virtual', 'hybrid']),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  virtualLink: z.string().url().optional().or(z.literal('')),
  capacity: z.number().int().positive().optional(),
  requireApproval: z.boolean().default(false),
  privacy: z.enum(['public', 'private']).default('public'),
});

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  defaultValues?: Partial<EventFormData>
  calendars: Array<{ id: string; name: string }>
  onSubmit: (data: EventFormData) => Promise<void>
}

export function EventForm({ defaultValues, calendars, onSubmit }: EventFormProps) {
  const [selectedTheme, setSelectedTheme] = useState(defaultValues?.theme || 'minimal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      privacy: 'public',
      requireApproval: false,
      locationType: 'physical',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...defaultValues,
    },
  });

  const locationType = watch('locationType');

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Theme Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Event Theme</h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {EVENT_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                const themeId = theme.id as 'minimal' | 'quantum' | 'warp' | 'emoji' | 'confetti' | 'pattern' | 'seasonal';
                setSelectedTheme(themeId);
                setValue('theme', themeId);
              }}
              className={`flex-shrink-0 transition-all rounded-xl ${
                selectedTheme === theme.id
                  ? 'ring-4 ring-primary ring-offset-2'
                  : 'hover:ring-2 hover:ring-muted'
              }`}
            >
              <div className="w-40 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-sm font-medium">{theme.name}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Calendar Selection */}
      <div>
        <Label>Calendar</Label>
        <Select onValueChange={(value) => setValue('calendarId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a calendar" />
          </SelectTrigger>
          <SelectContent>
            {calendars.map((cal) => (
              <SelectItem key={cal.id} value={cal.id}>
                {cal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.calendarId && (
          <p className="mt-1 text-sm text-destructive">{errors.calendarId.message}</p>
        )}
      </div>

      {/* Event Title */}
      <div>
        <Label>Event Name</Label>
        <Input
          {...register('title')}
          placeholder="Give your event a name"
          className="text-lg font-medium"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>
            <Calendar className="inline h-4 w-4 mr-1" />
            Start Date & Time
          </Label>
          <Input
            {...register('startDate')}
            type="datetime-local"
          />
        </div>
        <div>
          <Label>
            <Calendar className="inline h-4 w-4 mr-1" />
            End Date & Time
          </Label>
          <Input
            {...register('endDate')}
            type="datetime-local"
          />
        </div>
      </div>

      {/* Location Type */}
      <div>
        <Label>
          <MapPin className="inline h-4 w-4 mr-1" />
          Location Type
        </Label>
        <div className="flex gap-4 mt-2">
          {['physical', 'virtual', 'hybrid'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('locationType')}
                type="radio"
                value={type}
                className="text-primary focus:ring-primary"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Physical Location */}
      {(locationType === 'physical' || locationType === 'hybrid') && (
        <div className="space-y-4">
          <Input {...register('address')} placeholder="Address" />
          <div className="grid grid-cols-2 gap-4">
            <Input {...register('city')} placeholder="City" />
            <Input {...register('state')} placeholder="State" />
          </div>
        </div>
      )}

      {/* Virtual Link */}
      {(locationType === 'virtual' || locationType === 'hybrid') && (
        <Input
          {...register('virtualLink')}
          type="url"
          placeholder="Zoom, Google Meet, or other virtual link"
        />
      )}

      {/* Description */}
      <div>
        <Label>
          <FileText className="inline h-4 w-4 mr-1" />
          Description
        </Label>
        <Textarea
          {...register('description')}
          rows={6}
          placeholder="Tell people about your event..."
        />
      </div>

      {/* Event Options */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Event Options</h3>

        <div>
          <Label>
            <Users className="inline h-4 w-4 mr-1" />
            Capacity (leave empty for unlimited)
          </Label>
          <Input
            {...register('capacity', { valueAsNumber: true })}
            type="number"
            min="1"
            placeholder="Unlimited"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            {...register('requireApproval')}
            type="checkbox"
            className="h-5 w-5 rounded"
          />
          <div>
            <p className="font-medium">Require Approval</p>
            <p className="text-sm text-muted-foreground">
              Manually approve each registration
            </p>
          </div>
        </label>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? 'Creating Event...' : 'Create Event'}
      </Button>
    </form>
  );
}
