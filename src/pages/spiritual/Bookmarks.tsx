import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Card } from "@/components/ui/card";
import { getUserBookmarks } from "@/lib/api/spiritual/bible";
import type { UserVerseBookmark } from "@/types/spiritual";

const BookmarksPage = () => {
  useSEO({ title: "My Bookmarks - HabeshaCommunity", description: "Your saved verses" });
  const [bookmarks, setBookmarks] = useState<UserVerseBookmark[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getUserBookmarks();
      setBookmarks(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        {bookmarks.length === 0 ? (
          <Card className="p-6">No bookmarks yet.</Card>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((b) => (
              <Card key={b.id} className="p-4">
                <div className="text-sm text-muted-foreground">{b.verse?.usfm}</div>
                <div>{b.verse?.text}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
