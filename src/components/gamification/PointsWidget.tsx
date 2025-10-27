import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatPoints } from '@/lib/utils';

export interface PointsWidgetProps {
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  recentTransactions?: {
    amount: number;
    reason: string;
    created_at: string;
  }[];
  className?: string;
  onViewAll?: () => void;
  onRedeem?: () => void;
}

export function PointsWidget({
  totalPoints,
  availablePoints,
  lifetimePoints,
  recentTransactions = [],
  className,
  onViewAll,
  onRedeem,
}: PointsWidgetProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Your Points</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Earn and spend points
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <motion.div
          className="text-center py-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-sm text-muted-foreground mb-2">Available to Spend</div>
          <div className="text-5xl font-bold text-primary mb-2">
            {formatPoints(availablePoints)}
          </div>
          <div className="text-xs text-muted-foreground">
            Total Earned: {formatPoints(lifetimePoints)}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={onRedeem} variant="default" size="lg" className="w-full">
            <Trophy className="h-4 w-4 mr-2" />
            Redeem
          </Button>
          <Button onClick={onViewAll} variant="outline" size="lg" className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>

        {recentTransactions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Recent Activity</h4>
            <div className="space-y-2">
              {recentTransactions.slice(0, 3).map((txn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-1.5 rounded-full',
                        txn.amount > 0
                          ? 'bg-accent-500/10 text-accent-500'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      <Coins className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{txn.reason}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(txn.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'text-sm font-semibold',
                      txn.amount > 0 ? 'text-accent-500' : 'text-destructive'
                    )}
                  >
                    {txn.amount > 0 ? '+' : ''}
                    {formatPoints(txn.amount)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
