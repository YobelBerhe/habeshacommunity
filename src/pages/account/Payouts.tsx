import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import MentorHeader from "@/components/MentorHeader";

export default function Payouts() {
  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Payouts" backPath="/account/settings" />
      <div className="mx-auto max-w-2xl p-6">
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payout Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-2">
              Payout management feature is being set up.
            </p>
            <p className="text-sm text-muted-foreground">
              This will allow mentors to track their earnings and manage withdrawals.
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
