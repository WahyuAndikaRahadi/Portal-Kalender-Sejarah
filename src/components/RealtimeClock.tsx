import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const RealtimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[currentTime.getDay()];
  const day = currentTime.getDate();
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl p-6 shadow-lg backdrop-blur-sm border transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-stone-800 to-stone-700 border-stone-700'
          : 'bg-gradient-to-br from-amber-50 to-stone-100 border-amber-200/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className={`w-5 h-5 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
            <motion.p
              key={`${day}-${month}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
            >
              {dayName}
            </motion.p>
          </div>
          <motion.p
            key={`date-${day}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-serif ${isDark ? 'text-stone-100' : 'text-stone-800'}`}
          >
            {day} {month} {year}
          </motion.p>
        </div>

        <div className={`border-l pl-4 ${isDark ? 'border-stone-600' : 'border-amber-300/50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className={`w-5 h-5 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
            <p className={`text-sm font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Waktu</p>
          </div>
          <motion.p
            key={seconds}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            className={`text-3xl font-mono font-bold tabular-nums ${
              isDark ? 'text-amber-400' : 'text-amber-900'
            }`}
          >
            {hours}:{minutes}
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={isDark ? 'text-amber-500' : 'text-amber-600'}
            >
              :{seconds}
            </motion.span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
