import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Gift, Users, DollarSign } from "lucide-react";

interface ReferralStatsProps {
  userId: string;
  referralCode: string;
}

export function ReferralStats({ userId, referralCode }: ReferralStatsProps) {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    creditsEarned: 0,
    creditsBalance: 0,
  });

  useEffect(() => {
    fetchReferralStats();
  }, [userId]);

  const fetchReferralStats = async () => {
    try {
      // Get referral counts
      const { data: referrals, error: refError } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", userId);

      if (refError) throw refError;

      const totalReferrals = referrals?.length || 0;
      const successfulReferrals = referrals?.filter(r => r.reward_applied).length || 0;
      const creditsEarned = successfulReferrals * 10;

      // Get current credits balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits_balance")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      setStats({
        totalReferrals,
        successfulReferrals,
        creditsEarned,
        creditsBalance: profile?.credits_balance || 0,
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    }
  };

  const shareUrl = `${window.location.origin}/auth/register?ref=${referralCode}`;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Referral Program</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Invite friends and earn $10 credit for each successful referral!
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Your Referral Code:</span>
            <code className="px-3 py-1 bg-background rounded font-mono text-sm">
              {referralCode}
            </code>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Share Link:</span>
            <a 
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline truncate max-w-[200px]"
            >
              {shareUrl}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Referrals</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalReferrals}</p>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Credits Balance</span>
            </div>
            <p className="text-2xl font-bold">${stats.creditsBalance}</p>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          <p>✅ {stats.successfulReferrals} successful referrals</p>
          <p>💰 ${stats.creditsEarned} total earned</p>
        </div>
      </Card>
    </div>
  );
}
