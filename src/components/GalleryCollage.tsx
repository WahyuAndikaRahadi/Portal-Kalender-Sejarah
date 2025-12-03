import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GalleryCollageProps {
  images: string[];
}

export const GalleryCollage = ({ images }: GalleryCollageProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { isDark } = useTheme();

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 6);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        className={`rounded-2xl overflow-hidden shadow-lg border ${
          isDark ? 'border-stone-700 bg-stone-800' : 'border-stone-200 bg-stone-50'
        }`}
      >
        <div className="p-6">
          <h3 className={`text-2xl font-serif font-bold mb-6 flex items-center gap-3 ${
            isDark ? 'text-stone-100' : 'text-stone-800'
          }`}>
            <div className="h-1 w-12 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" />
            Galeri Kolase
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedIndex(index)}
                className="group relative overflow-hidden rounded-xl cursor-pointer h-48 md:h-56"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <span className="text-white text-sm font-semibold">
                    Lihat Besar
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <motion.img
                src={displayImages[selectedIndex]}
                alt="Full view"
                className="w-full h-full object-contain rounded-xl shadow-2xl"
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {displayImages.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === selectedIndex ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
