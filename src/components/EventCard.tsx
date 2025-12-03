import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { HistoricalEvent } from '../types/event';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: HistoricalEvent;
  index: number;
}

export const EventCard = ({ event, index }: EventCardProps) => {
  const { isDark } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link to={`/pages/${event.slug}`}>
        <div className={`rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border ${
          isDark
            ? 'bg-stone-800 border-stone-700 hover:shadow-amber-900/20'
            : 'bg-white border-stone-200'
        }`}>
          <div className="relative h-56 overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={event.imageURL}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-amber-900/20 backdrop-blur-[2px]"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isDark
                  ? 'bg-amber-900/80 text-amber-200'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {event.category}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className={`w-4 h-4 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-stone-400' : 'text-stone-600'
              }`}>
                {formatDate(event.date)}
              </span>
            </div>

            <h3 className={`text-xl font-serif font-bold mb-3 group-hover:text-amber-500 transition-colors line-clamp-2 ${
              isDark ? 'text-stone-100' : 'text-stone-800'
            }`}>
              {event.title}
            </h3>

            <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}>
              {event.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                    isDark
                      ? 'text-stone-400 bg-stone-700'
                      : 'text-stone-500 bg-stone-100'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <motion.div
              className={`font-semibold text-sm flex items-center gap-2 ${
                isDark ? 'text-amber-400' : 'text-amber-800'
              }`}
              whileHover={{ x: 5 }}
            >
              Baca Selengkapnya
              <span className="text-lg">→</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
