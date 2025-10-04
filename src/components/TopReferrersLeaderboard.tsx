import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface TopReferrer {
  user_id: string;
  display_name: string;
  email: string;
  total_referrals: number;
  successful_referrals: number;
  total_credits_earned: number;
}

export function TopReferrersLeaderboard() {
  const [referrers, setReferrers] = useState<TopReferrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopReferrers();
  }, []);

  const fetchTopReferrers = async () => {
    try {
      const { data, error } = await supabase.rpc("top_referrers");
      
      if (error) throw error;
      
      setReferrers(data || []);
    } catch (error) {
      console.error("Error fetching top referrers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (referrers.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No referrals yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Total Referrals</TableHead>
          <TableHead className="text-right">Successful</TableHead>
          <TableHead className="text-right">Credits Earned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrers.map((referrer, index) => (
          <TableRow key={referrer.user_id}>
            <TableCell className="font-medium">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </TableCell>
            <TableCell>{referrer.display_name || "Anonymous"}</TableCell>
            <TableCell className="text-muted-foreground">{referrer.email}</TableCell>
            <TableCell className="text-right">{referrer.total_referrals}</TableCell>
            <TableCell className="text-right font-semibold text-primary">
              {referrer.successful_referrals}
            </TableCell>
            <TableCell className="text-right font-bold">
              ${referrer.total_credits_earned}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
