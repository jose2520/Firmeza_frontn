import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center group ${
        isDark
          ? 'bg-brand-navy-light border-slate-700 hover:bg-slate-800 text-brand-gold shadow-sm'
          : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-brand-slate shadow-sm'
      } ${className}`}>
      {isDark ? (
        <Sun className="w-4 h-4 text-brand-gold transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-brand-navy transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
