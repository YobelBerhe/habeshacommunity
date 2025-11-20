import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  currentTheme: string;
  currentArchetypeId: string;
  playSound: (sound: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'default',
  currentArchetypeId: 'default',
  playSound: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = {
    currentTheme: 'default',
    currentArchetypeId: 'default',
    playSound: () => {},
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
