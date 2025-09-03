import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DonateCancel() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-3xl font-bold mb-3">Donation cancelled</h1>
        <p className="text-muted-foreground mb-6">
          No charge was made. You can try again anytime to support our community.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}