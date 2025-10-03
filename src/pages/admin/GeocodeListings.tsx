import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeocodeListings() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Geocoding Admin</CardTitle>
          <CardDescription>Administrative tool for adding coordinates to listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This feature requires the street_address column in the database.
            </p>
            <p className="text-sm mt-2">
              Contact support to enable geocoding functionality.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
