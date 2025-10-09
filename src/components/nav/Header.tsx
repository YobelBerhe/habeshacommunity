// At the top with imports
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';

// Inside the Header component
const Header = () => {
  const { theme, setTheme } = useTheme();
  // ... rest of your code

  // In the right side actions section, replace the theme button with:
  
  {/* Theme Switcher */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun className="w-4 h-4 mr-2" />
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon className="w-4 h-4 mr-2" />
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Laptop className="w-4 h-4 mr-2" />
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}
