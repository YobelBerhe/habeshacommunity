import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function MentorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="h-64 w-full bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      
      <CardHeader className="space-y-3">
        {/* Name & badges */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-5 w-5 bg-muted rounded-full animate-pulse" />
        </div>
        
        {/* Location */}
        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bio */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-muted rounded-full animate-pulse" />
        </div>
      </CardContent>
      
      <CardFooter className="gap-2">
        <div className="h-9 flex-1 bg-muted rounded-md animate-pulse" />
        <div className="h-9 flex-1 bg-muted rounded-md animate-pulse" />
      </CardFooter>
    </Card>
  );
}
