import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DonateSuccess() {
  const [params] = useSearchParams();
  const amt = Number(params.get("amt") || 0);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">🙏</div>
        <h1 className="text-3xl font-bold mb-3">Thank you!</h1>
        <p className="text-muted-foreground mb-6">
          Your donation of <strong>${(amt / 100).toFixed(2)}</strong> helps us
          keep HabeshaCommunity running and growing.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}