import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative inline-flex items-center p-3 rounded-full transition-all duration-500 ${
        isDark
          ? 'bg-stone-700 hover:bg-stone-600'
          : 'bg-amber-100 hover:bg-amber-200'
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 360 : 0, scale: isDark ? 1 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-amber-400" />
        ) : (
          <Sun className="w-5 h-5 text-amber-600" />
        )}
      </motion.div>
    </motion.button>
  );
};
