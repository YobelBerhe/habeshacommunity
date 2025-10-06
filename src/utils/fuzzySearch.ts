export function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
}

export function fuzzyScore(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (textLower.includes(queryLower)) {
    return 100; // Exact substring match
  }
  
  let score = 0;
  let queryIndex = 0;
  let previousMatchIndex = -1;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 10;
      
      // Bonus for consecutive matches
      if (i === previousMatchIndex + 1) {
        score += 5;
      }
      
      // Bonus for matching at word start
      if (i === 0 || textLower[i - 1] === ' ') {
        score += 3;
      }
      
      previousMatchIndex = i;
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length ? score : 0;
}

export function fuzzySort<T>(
  items: T[],
  query: string,
  getText: (item: T) => string
): T[] {
  return items
    .map(item => ({
      item,
      score: fuzzyScore(getText(item), query),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
