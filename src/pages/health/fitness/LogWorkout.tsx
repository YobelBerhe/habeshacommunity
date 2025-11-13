// =====================================================
// LOG WORKOUT PAGE - Strong App Style
// Complete workout logging with exercise library
// =====================================================

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Dumbbell,
  Plus,
  Minus,
  X,
  Search,
  Play,
  Check,
  Trash2,
  Timer,
  Flame,
  Weight,
  Repeat,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { Exercise, CreateWorkoutInput, CreateWorkoutExerciseInput, WORKOUT_TYPES, INTENSITY_LEVELS } from "@/types/health";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkoutExerciseState extends CreateWorkoutExerciseInput {
  tempId: string;
}

const LogWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseState[]>([]);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutType, setWorkoutType] = useState<typeof WORKOUT_TYPES[number]>(
    location.state?.workoutType || 'strength'
  );
  const [intensity, setIntensity] = useState<typeof INTENSITY_LEVELS[number]>('moderate');
  const [location_field, setLocationField] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState("");

  // Calculated values
  const [totalDuration, setTotalDuration] = useState(0);
  const [estimatedCalories, setEstimatedCalories] = useState(0);

  // Search exercises
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchExercises();
    } else {
      setExercises([]);
    }
  }, [searchQuery]);

  // Calculate duration when times change
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diff = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60)));
      setTotalDuration(diff);
    }
  }, [startTime, endTime]);

  // Estimate calories based on duration and intensity
  useEffect(() => {
    const baseCaloriesPerMin = {
      light: 4,
      moderate: 6,
      hard: 8,
      very_hard: 10,
    };
    setEstimatedCalories(Math.round(totalDuration * (baseCaloriesPerMin[intensity] || 6)));
  }, [totalDuration, intensity]);

  const searchExercises = async () => {
    try {
      setSearchLoading(true);
      
      const { data, error } = await supabase
        .from('exercises' as any)
        .select('*')
        .or(`name_en.ilike.%${searchQuery}%,name_am.ilike.%${searchQuery}%,name_ti.ilike.%${searchQuery}%`)
        .eq('category', workoutType === 'traditional_dance' ? 'traditional' : workoutType)
        .order('is_traditional', { ascending: false })
        .order('name_en', { ascending: true })
        .limit(20);

      if (error) throw error;
      
      setExercises((data as any) || []);
    } catch (error: any) {
      console.error('Error searching exercises:', error);
      toast({
        title: "Error searching exercises",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExerciseState = {
      tempId: Date.now().toString(),
      exercise_id: exercise.id,
      exercise_name: exercise.name_en,
      sets: 3,
      reps: 10,
      weight_kg: 0,
      order_index: selectedExercises.length,
    };

    setSelectedExercises([...selectedExercises, newExercise]);
    setShowExerciseDialog(false);
    setSearchQuery("");
    
    toast({
      title: "Exercise added!",
      description: exercise.name_en,
    });
  };

  const removeExercise = (tempId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.tempId !== tempId));
  };

  const updateExercise = (tempId: string, field: keyof WorkoutExerciseState, value: any) => {
    setSelectedExercises(selectedExercises.map(ex => 
      ex.tempId === tempId ? { ...ex, [field]: value } : ex
    ));
  };

  const logWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "No exercises added",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }

    if (!endTime) {
      toast({
        title: "No end time",
        description: "Please set when you finished",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts' as any)
        .insert({
          user_id: user?.id,
          name: workoutName || `${workoutType} Workout`,
          workout_type: workoutType,
          duration_minutes: totalDuration,
          intensity: intensity,
          calories_burned: estimatedCalories,
          location: location_field || undefined,
          notes: notes || undefined,
          started_at: startTime,
          completed_at: endTime,
          date: format(new Date(startTime), 'yyyy-MM-dd'),
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Add exercises
      const exercisesToInsert = selectedExercises.map((ex) => ({
        workout_id: (workout as any).id,
        exercise_id: ex.exercise_id,
        exercise_name: ex.exercise_name,
        order_index: ex.order_index,
        sets: ex.sets,
        reps: ex.reps,
        weight_kg: ex.weight_kg || undefined,
        distance_km: ex.distance_km || undefined,
        duration_minutes: ex.duration_minutes || undefined,
        calories_burned: ex.calories_burned || undefined,
        notes: ex.notes || undefined,
      }));

      const { error: exercisesError } = await supabase
        .from('workout_exercises' as any)
        .insert(exercisesToInsert);

      if (exercisesError) throw exercisesError;

      toast({
        title: "Workout logged successfully! 💪",
        description: `${totalDuration} minutes, ${estimatedCalories} calories burned`,
      });

      navigate('/health/exercise');
    } catch (error: any) {
      console.error('Error logging workout:', error);
      toast({
        title: "Error logging workout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickFinish = () => {
    setEndTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Log Workout</h1>
                <p className="text-blue-50 text-sm">{format(new Date(startTime), 'EEEE, MMM d')}</p>
              </div>
            </div>
            <Dumbbell className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Workout Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workout Name */}
              <div>
                <Label htmlFor="name">Workout Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Strength, Leg Day"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
              </div>

              {/* Workout Type & Intensity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={workoutType} onValueChange={(value: any) => setWorkoutType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKOUT_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <Select value={intensity} onValueChange={(value: any) => setIntensity(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTENSITY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level} className="capitalize">
                          {level.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Start Time</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="end">End Time</Label>
                  <div className="flex gap-2">
                    <Input
                      id="end"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={quickFinish} variant="outline" size="icon">
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Gym, Home, Park"
                  value={location_field}
                  onChange={(e) => setLocationField(e.target.value)}
                />
              </div>

              {/* Summary */}
              {totalDuration > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                        <Timer className="w-5 h-5" />
                        {totalDuration}
                      </div>
                      <div className="text-xs text-muted-foreground">minutes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                        <Flame className="w-5 h-5" />
                        {estimatedCalories}
                      </div>
                      <div className="text-xs text-muted-foreground">calories (est.)</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exercises</CardTitle>
                  <CardDescription>
                    Add exercises to your workout
                  </CardDescription>
                </div>
                <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exercise
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Exercise</DialogTitle>
                      <DialogDescription>
                        Search for exercises or browse the library
                      </DialogDescription>
                    </DialogHeader>
                    
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Results */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {searchLoading ? (
                        [...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-20" />
                        ))
                      ) : exercises.length > 0 ? (
                        exercises.map((exercise) => (
                          <ExerciseSearchResult
                            key={exercise.id}
                            exercise={exercise}
                            onSelect={addExercise}
                          />
                        ))
                      ) : searchQuery.length >= 2 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No exercises found</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Type to search exercises</p>
                          <p className="text-sm mt-1">Try "push up" or "eskista"</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedExercises.length > 0 ? (
                selectedExercises.map((exercise, index) => (
                  <ExerciseRow
                    key={exercise.tempId}
                    exercise={exercise}
                    index={index}
                    onUpdate={updateExercise}
                    onRemove={removeExercise}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No exercises added yet</p>
                  <Button
                    variant="link"
                    onClick={() => setShowExerciseDialog(true)}
                    className="mt-2"
                  >
                    Add your first exercise
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Notes (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How did you feel? Any observations?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={logWorkout}
            disabled={loading || selectedExercises.length === 0}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {loading ? "Logging..." : "Complete Workout"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Exercise Search Result Component
interface ExerciseSearchResultProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

const ExerciseSearchResult = ({ exercise, onSelect }: ExerciseSearchResultProps) => {
  return (
    <div
      onClick={() => onSelect(exercise)}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{exercise.name_en}</h4>
          {exercise.is_traditional && (
            <Badge variant="secondary" className="text-xs">Traditional</Badge>
          )}
        </div>
        {(exercise.name_am || exercise.name_ti) && (
          <p className="text-sm text-muted-foreground mb-1">
            {exercise.name_am || exercise.name_ti}
          </p>
        )}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs capitalize">
            {exercise.category}
          </Badge>
          {exercise.muscle_group && (
            <Badge variant="outline" className="text-xs capitalize">
              {exercise.muscle_group}
            </Badge>
          )}
        </div>
      </div>
      <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  );
};

// Exercise Row Component
interface ExerciseRowProps {
  exercise: WorkoutExerciseState;
  index: number;
  onUpdate: (tempId: string, field: keyof WorkoutExerciseState, value: any) => void;
  onRemove: (tempId: string) => void;
}

const ExerciseRow = ({ exercise, index, onUpdate, onRemove }: ExerciseRowProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">
              {index + 1}
            </div>
            <h4 className="font-medium">{exercise.exercise_name}</h4>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(exercise.tempId)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs mb-1 flex items-center gap-1">
              <Repeat className="w-3 h-3" />
              Sets
            </Label>
            <Input
              type="number"
              value={exercise.sets || ''}
              onChange={(e) => onUpdate(exercise.tempId, 'sets', parseInt(e.target.value) || 0)}
              min="1"
              className="text-center"
            />
          </div>

          <div>
            <Label className="text-xs mb-1">Reps</Label>
            <Input
              type="number"
              value={exercise.reps || ''}
              onChange={(e) => onUpdate(exercise.tempId, 'reps', parseInt(e.target.value) || 0)}
              min="1"
              className="text-center"
            />
          </div>

          <div>
            <Label className="text-xs mb-1 flex items-center gap-1">
              <Weight className="w-3 h-3" />
              Weight (kg)
            </Label>
            <Input
              type="number"
              value={exercise.weight_kg || ''}
              onChange={(e) => onUpdate(exercise.tempId, 'weight_kg', parseFloat(e.target.value) || 0)}
              min="0"
              step="2.5"
              className="text-center"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogWorkout;
