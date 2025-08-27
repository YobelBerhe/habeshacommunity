import React, { useMemo } from "react";
import type { Listing } from "@/types";
import { getListingsByCity } from "@/utils/storage";

type Props = { city: string };

export default function HomeDigest({ city }: Props) {
  const listings = getListingsByCity(city);

  const groups = useMemo(() => {
    // group last 7 days by YYYY-MM-DD
    const now = Date.now();
    const sevenDays = now - 7 * 86400 * 1000;
    const recent = listings.filter((l) => l.createdAt >= sevenDays);
    const g = new Map<string, Listing[]>();
    for (const l of recent) {
      const d = new Date(l.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      g.set(key, [...(g.get(key) || []), l]);
    }
    // newest day first
    return Array.from(g.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [listings]);

  if (!groups.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-4">
      <div className="rounded-2xl border border-border/50 bg-gradient-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl md:text-2xl font-bold">This week in {city}</h2>
          <div className="text-sm text-muted-foreground">
            {recentCount(listings)} new posts
          </div>
        </div>

        <div className="space-y-5">
          {groups.map(([day, arr]) => (
            <div key={day}>
              <div className="text-sm text-muted-foreground mb-2">{formatDay(day)}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {arr.slice(0, 6).map((l) => (
                  <article
                    key={l.id}
                    className="rounded-xl border border-border/50 bg-card p-3 hover:bg-muted/40 transition"
                  >
                    <div className="font-semibold line-clamp-1">{l.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {prettyCat(l.category)} • {l.price ? currency(l.price, l.currency) : "—"}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function currency(n?: number, cur?: string) {
  if (n == null) return "";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur || "USD" }).format(n);
  } catch {
    return `${n} ${cur || ""}`;
  }
}
function prettyCat(c: string) {
  return { housing: "Housing", jobs: "Jobs", services: "Services", community: "Community" }[c] || c;
}
function formatDay(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m as number) - 1, d as number).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
function recentCount(listings: Listing[]) {
  const seven = Date.now() - 7 * 86400 * 1000;
  return listings.filter((l) => l.createdAt >= seven).length;
}