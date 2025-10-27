import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Settings, BookMarked, Heart } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { getBibleBooks, getBibleVersions, getChapterVerses, searchVerses } from "@/lib/api/spiritual/bible";
import type { BibleBook, BibleVersion, BibleVerse } from "@/types/spiritual";

const BibleReader = () => {
  useSEO({ 
    title: "Bible Reader - HabeshaCommunity", 
    description: "Read the Holy Bible in multiple translations" 
  });
  const navigate = useNavigate();
  const [selectedBookUsfm, setSelectedBookUsfm] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState("KJV");
  const [fontSize, setFontSize] = useState("medium");
  const [searchQuery, setSearchQuery] = useState("");

  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BibleVerse[] | null>(null);

  const fontSizes = [
    { id: "small", label: "Small" },
    { id: "medium", label: "Medium" },
    { id: "large", label: "Large" },
    { id: "x-large", label: "Extra Large" },
  ];

  const selectedBook = useMemo(() => books.find((b) => b.usfm === selectedBookUsfm), [books, selectedBookUsfm]);
  const selectedVersionObj = useMemo(() => versions.find((v) => v.abbreviation === selectedVersion), [versions, selectedVersion]);
  const selectedVersionId = selectedVersionObj?.version_id;
  const maxChapter = selectedBook?.chapters_count || 150;

  // Load books and versions on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [booksData, versionsData] = await Promise.all([
          getBibleBooks(),
          getBibleVersions(),
        ]);
        if (!isMounted) return;
        setBooks(booksData);
        setVersions(versionsData);
        // Default to first book if none selected
        if (!selectedBookUsfm && booksData.length > 0) {
          setSelectedBookUsfm(booksData[0].usfm);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Fetch verses when selection changes
  useEffect(() => {
    if (!selectedBookUsfm) return;
    let isActive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getChapterVerses(selectedBookUsfm, selectedChapter, selectedVersionId);
        if (!isActive) return;
        setVerses(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isActive) setIsLoading(false);
      }
    })();
  }, [selectedBookUsfm, selectedChapter, selectedVersionId]);

  // Search verses (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await searchVerses(searchQuery.trim(), selectedVersionId || undefined, 50);
        setSearchResults(res);
      } catch (e) {
        console.error(e);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery, selectedVersionId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Bible Reader 📖</h1>
          </div>
          <p className="text-xl opacity-90">Read the Holy Scriptures in multiple translations</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Controls Panel */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Book Selection */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Book</label>
              <Select value={selectedBookUsfm} onValueChange={(val) => { setSelectedBookUsfm(val); setSelectedChapter(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedBook?.name || "Select book"} />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.usfm} value={book.usfm}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter Selection */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Chapter</label>
              <Input
                type="number"
                min="1"
                max="150"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
              />
            </div>

            {/* Version Selection */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Translation</label>
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedVersionObj?.name || "Select version"} />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.abbreviation} value={v.abbreviation}>
                      {v.name} ({v.language_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Font Size</label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search verses... (e.g., 'love', 'faith', 'John 3:16')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Reader Content */}
        <Card className="p-8">
          {/* Chapter Header */}
          <div className="mb-8 pb-4 border-b">
            <h2 className="text-3xl font-bold mb-2">
              {selectedBook?.name} {selectedChapter}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedVersionObj?.name}
            </p>
          </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <div className={`space-y-4 ${
                fontSize === 'small' ? 'text-base' :
                fontSize === 'medium' ? 'text-lg' :
                fontSize === 'large' ? 'text-xl' :
                'text-2xl'
              } leading-relaxed`}>
                {(searchResults ?? verses).map((verse) => (
                  <div
                    key={verse.id}
                    className="group hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <sup className="text-primary font-bold mr-2 select-none">
                      {verse.verse_number}
                    </sup>
                    <span>{verse.text}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button className="inline-flex items-center justify-center w-6 h-6 text-xs hover:text-yellow-500 transition-colors" title="Highlight">
                        ✨
                      </button>
                      <button className="inline-flex items-center justify-center w-6 h-6 text-xs hover:text-blue-500 transition-colors" title="Bookmark">
                        🔖
                      </button>
                      <button className="inline-flex items-center justify-center w-6 h-6 text-xs hover:text-green-500 transition-colors" title="Share">
                        🔗
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}

          {/* Coming Soon Notice */}
          <div className="mt-8 p-6 bg-muted/30 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Full Reader Features Coming Soon:
            </h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>Complete Bible in all translations</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>Verse-by-verse search</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>Highlight colors & notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>Bookmarks & favorites</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>Audio narration</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span>Reading history</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t">
            <Button variant="outline" disabled={selectedChapter <= 1} onClick={() => setSelectedChapter((c) => Math.max(1, c - 1))}>
              ← Previous Chapter
            </Button>
            <Button variant="outline" disabled={selectedChapter >= maxChapter} onClick={() => setSelectedChapter((c) => Math.min(maxChapter, c + 1))}>
              Next Chapter →
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/spiritual/bookmarks")}>
            <BookMarked className="w-10 h-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">My Bookmarks</h3>
            <p className="text-sm text-muted-foreground">View saved verses</p>
          </Card>
          
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/spiritual/highlights")}>
            <Heart className="w-10 h-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Highlights</h3>
            <p className="text-sm text-muted-foreground">See all highlights</p>
          </Card>
          
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/spiritual/plans")}>
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Reading Plans</h3>
            <p className="text-sm text-muted-foreground">Join a study plan</p>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/spiritual")}>
            Back to Spiritual Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BibleReader;
