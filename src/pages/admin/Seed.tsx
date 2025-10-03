import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSeed() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Seeding</CardTitle>
          <CardDescription>Add demo data to populate your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This admin feature is temporarily disabled pending database schema updates.
            </p>
            <p className="text-sm mt-2">
              Required tables: forum_boards, match_questions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
