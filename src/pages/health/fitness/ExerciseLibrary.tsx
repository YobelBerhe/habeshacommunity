// =====================================================
// EXERCISE LIBRARY - Browse & Discover
// Complete exercise database with traditional dances
// =====================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dumbbell,
  Search,
  Play,
  Heart,
  Zap,
  Target,
  TrendingUp,
  ChevronRight,
  Star,
  Flame,
  Clock,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Exercise } from "@/types/health";
import { Skeleton } from "@/components/ui/skeleton";

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedCategory, exercises]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('exercises' as any)
        .select('*')
        .order('is_traditional', { ascending: false })
        .order('name_en', { ascending: true });

      if (error) throw error;
      
      setExercises((data as any) || []);
    } catch (error: any) {
      console.error('Error loading exercises:', error);
      toast({
        title: "Error loading exercises",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name_en.toLowerCase().includes(query) ||
        ex.name_am?.toLowerCase().includes(query) ||
        ex.name_ti?.toLowerCase().includes(query) ||
        ex.muscle_group?.toLowerCase().includes(query) ||
        ex.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredExercises(filtered);
  };

  const categories = [
    { id: 'all', name: 'All', icon: Dumbbell },
    { id: 'traditional', name: 'Traditional', icon: Play },
    { id: 'strength', name: 'Strength', icon: Dumbbell },
    { id: 'cardio', name: 'Cardio', icon: Zap },
    { id: 'flexibility', name: 'Flexibility', icon: Target },
    { id: 'sports', name: 'Sports', icon: TrendingUp },
  ];

  const viewExerciseDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailDialog(true);
  };

  const traditionalExercises = exercises.filter(ex => ex.is_traditional);
  const popularExercises = exercises.slice(0, 6);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Exercise Library
              </h1>
              <p className="text-purple-50">
                Browse {exercises.length} exercises including traditional dances
              </p>
            </div>
            <Play className="w-12 h-12 opacity-80" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Traditional Dances Spotlight */}
        {traditionalExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-green-600" />
                  Traditional Habesha Dances
                </CardTitle>
                <CardDescription>
                  Cultural fitness - Traditional dances that give you a great workout!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {traditionalExercises.map((exercise) => (
                    <TraditionalDanceCard
                      key={exercise.id}
                      exercise={exercise}
                      onClick={() => viewExerciseDetails(exercise)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search exercises by name, muscle group, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Exercise Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={() => viewExerciseDetails(exercise)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Exercise Detail Dialog */}
      {selectedExercise && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">
                    {selectedExercise.name_en}
                  </DialogTitle>
                  {(selectedExercise.name_am || selectedExercise.name_ti) && (
                    <p className="text-muted-foreground">
                      {selectedExercise.name_am || selectedExercise.name_ti}
                    </p>
                  )}
                </div>
                {selectedExercise.is_traditional && (
                  <Badge className="bg-green-100 text-green-700 ml-2">Traditional</Badge>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Description */}
              {selectedExercise.description_en && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedExercise.description_en}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-accent rounded-lg">
                  <Badge variant="outline" className="mb-2 capitalize">
                    {selectedExercise.category}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Category</p>
                </div>
                
                {selectedExercise.muscle_group && (
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <Badge variant="outline" className="mb-2 capitalize">
                      {selectedExercise.muscle_group}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Muscle</p>
                  </div>
                )}

                {selectedExercise.calories_per_minute && (
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4" />
                      {selectedExercise.calories_per_minute}
                    </div>
                    <p className="text-xs text-muted-foreground">cal/min</p>
                  </div>
                )}

                <div className="text-center p-3 bg-accent rounded-lg">
                  <Badge variant="outline" className="mb-2 capitalize">
                    {selectedExercise.difficulty_level || 'intermediate'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                </div>
              </div>

              {/* Equipment */}
              {selectedExercise.equipment_needed && selectedExercise.equipment_needed.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Equipment Needed</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedExercise.equipment_needed.map((eq) => (
                      <Badge key={eq} variant="secondary" className="capitalize">
                        {eq.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {selectedExercise.instructions_en && selectedExercise.instructions_en.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">How to Perform</h3>
                  <ol className="space-y-2">
                    {selectedExercise.instructions_en.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tags */}
              {selectedExercise.tags && selectedExercise.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedExercise.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => {
                  setShowDetailDialog(false);
                  navigate('/health/exercise/log', { 
                    state: { 
                      preselectedExercise: selectedExercise 
                    } 
                  });
                }}
                className="w-full"
              >
                Add to Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Traditional Dance Card Component
interface TraditionalDanceCardProps {
  exercise: Exercise;
  onClick: () => void;
}

const TraditionalDanceCard = ({ exercise, onClick }: TraditionalDanceCardProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 cursor-pointer transition-all group"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
        <Play className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold mb-1">{exercise.name_en}</h4>
        {exercise.name_am && (
          <p className="text-sm text-muted-foreground mb-1">{exercise.name_am}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {exercise.calories_per_minute && (
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              {exercise.calories_per_minute} cal/min
            </span>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {exercise.difficulty_level || 'intermediate'}
          </Badge>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </div>
  );
};

// Exercise Card Component
interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

const ExerciseCard = ({ exercise, onClick }: ExerciseCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'from-blue-500 to-cyan-500';
      case 'cardio':
        return 'from-orange-500 to-red-500';
      case 'traditional':
        return 'from-green-500 to-emerald-500';
      case 'flexibility':
        return 'from-purple-500 to-pink-500';
      case 'sports':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return Dumbbell;
      case 'cardio':
        return Zap;
      case 'traditional':
        return Play;
      case 'flexibility':
        return Target;
      case 'sports':
        return TrendingUp;
      default:
        return Dumbbell;
    }
  };

  const Icon = getCategoryIcon(exercise.category);
  const color = getCategoryColor(exercise.category);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} p-2.5 flex-shrink-0`}>
            <Icon className="w-full h-full text-white" />
          </div>
          {exercise.is_traditional && (
            <Badge variant="secondary" className="text-xs">Traditional</Badge>
          )}
        </div>

        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
          {exercise.name_en}
        </h3>

        {(exercise.name_am || exercise.name_ti) && (
          <p className="text-sm text-muted-foreground mb-2">
            {exercise.name_am || exercise.name_ti}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs capitalize">
            {exercise.muscle_group || exercise.category}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {exercise.difficulty_level || 'intermediate'}
          </Badge>
        </div>

        {exercise.calories_per_minute && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            Burns ~{exercise.calories_per_minute} cal/min
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-6 w-96 bg-white/20" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-48 mb-8" />
        <Skeleton className="h-12 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
