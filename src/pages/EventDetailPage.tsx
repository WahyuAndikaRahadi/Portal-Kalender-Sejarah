import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Menggunakan ikon yang sudah ada
import { Calendar, Tag, ArrowLeft, Clock, Sparkles, MapPin, BookOpen, Quote } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
// Asumsi GalleryCollage mengurus tampilan galeri di bawah
import { GalleryCollage } from '../components/GalleryCollage'; 
import { HistoricalEvent } from '../types/event'; // Pastikan interface ini sudah mengandung isCollage dan galleryImages

// Komponen Separator bergaya klasik
const ClassicSeparator = ({ isDark }: { isDark: boolean }) => (
  <div className="flex items-center my-8">
    <div className={`flex-grow h-px ${isDark ? 'bg-stone-600/70' : 'bg-amber-300/80'}`} />
    <BookOpen className={`w-7 h-7 mx-4 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
    <div className={`flex-grow h-px ${isDark ? 'bg-stone-600/70' : 'bg-amber-300/80'}`} />
    <BookOpen className={`w-7 h-7 mx-4 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} /> {/* Ditambahkan ikon kedua */}
    <div className={`flex-grow h-px ${isDark ? 'bg-stone-600/70' : 'bg-amber-300/80'}`} />
  </div>
);

export const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<HistoricalEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    // Memuat data dari events.json
    fetch('/data/events.json')
      .then((response) => response.json())
      .then((data: HistoricalEvent[]) => {
        const foundEvent = data.find((e) => e.slug === slug);
        setEvent(foundEvent || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading event:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center ${isDark
          ? 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900'
          : 'bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100'
        }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className={`w-12 h-12 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
        </motion.div>
      </div>
    );
  }


  if (!event) {
    return (
      <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center ${isDark
          ? 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900'
          : 'bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100'
        }`}>
        <div className="text-center">
          <h1 className={`text-4xl font-serif font-bold mb-4 ${isDark ? 'text-stone-100' : 'text-stone-800'
            }`}>
            Gulungan Tidak Ditemukan
          </h1>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-semibold ${isDark
                  ? 'bg-amber-700 hover:bg-amber-600 text-white shadow-xl'
                  : 'bg-amber-700 text-white hover:bg-amber-800 shadow-xl'
                }`}
            >
              Kembali ke Arsip
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const year = date.getFullYear();
    const era = year < 0 ? `${Math.abs(year)} SM` : `${year} M`;

    return {
      full: `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${year}`,
      short: `${date.getDate()} ${months[date.getMonth()]} ${era}`
    };
  };

  const dateFormatted = formatDate(event.date);
  
  // Ambil gambar utama untuk banner, atau gunakan placeholder jika tidak ada
  const mainBannerImage = event.imageURL || 'placeholder-default.jpg'; 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      // Latar Belakang Utama Diperkuat
      className={`min-h-screen transition-colors duration-700 ${isDark
          ? 'bg-stone-900 text-stone-300'
          : 'bg-gradient-to-b from-amber-50 to-stone-100 text-stone-800' // Efek perkamen lembut
        } font-serif`}
    >
      <div className="absolute top-8 left-8 z-20">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-md transition-all border ${isDark
                ? 'bg-stone-800/80 text-amber-400 border-amber-800 hover:bg-stone-700'
                : 'bg-white/90 text-stone-700 border-amber-200 hover:bg-amber-100'
              } backdrop-blur-sm`}
          >
            <ArrowLeft className="w-4 h-4" />
            Arsip
          </motion.button>
        </Link>
      </div>
      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      {/* HEADER UTAMA/VISUAL: SELALU GAMBAR TUNGGAL SEBAGAI BANNER */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        className="relative h-[65vh] overflow-hidden shadow-2xl"
      >
        <img
          src={mainBannerImage}
          alt={event.title}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Overlay yang lebih tebal untuk menekankan teks di bawah */}
        <div className={`absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 ${isDark ? 'to-stone-900/95' : 'to-amber-50/90'
          }`} />

        {/* Info Overlay (Teks di Header) */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-block bg-amber-700 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg mb-4">
                {event.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-white mb-6 leading-tight drop-shadow-xl"
            >
              {event.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl font-light text-stone-200 max-w-3xl drop-shadow-md border-l-4 border-amber-500 pl-4"
            >
              "{event.shortDescription}"
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Konten Utama */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Kolom Kiri: Deskripsi Utama */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className={`lg:col-span-3 p-8 md:p-12 shadow-2xl transition-colors duration-500 rounded-lg 
              ${isDark
                ? 'bg-stone-800 border-2 border-amber-900 shadow-amber-900/30' 
                : 'bg-white border-2 border-amber-200 shadow-lg shadow-amber-200/50' 
              }`}
          >
            <h2 className={`text-3xl font-bold mb-6 border-b-2 pb-2 ${isDark ? 'text-amber-500 border-stone-700' : 'text-stone-800 border-amber-300'
              }`}>
              Kronik Utama
            </h2>

            {/* Kutipan Peristiwa (Blockquote Kuno) */}
            {event.quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className={`my-10 p-8 border-l-8 font-bold text-2xl italic leading-relaxed ${isDark
                    ? 'bg-stone-700/70 border-amber-600 text-stone-200 shadow-md'
                    : 'bg-amber-100/70 border-amber-700 text-stone-800 shadow-inner' 
                  }`}
              >
                <div className='flex items-start'>
                  <Quote className={`w-8 h-8 mr-4 mt-1 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                  <p className='flex-grow'>{event.quote}</p>
                </div>
              </motion.blockquote>
            )}

            <div className="max-w-none text-lg">
              {event.description.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className={`leading-relaxed mb-6 indent-8 text-justify ${isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <ClassicSeparator isDark={isDark} />

            {/* Informasi Lokasi (Gaya Catatan Kaki) */}
            {event.location && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className={`p-4 mt-6 rounded-lg ${isDark ? 'bg-stone-700/50' : 'bg-amber-200/50'} border-l-4 border-amber-600`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                  <h3 className={`font-bold italic text-sm ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                    Lokasi Tercatat:
                  </h3>
                </div>
                <p className={`ml-7 text-base ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{event.location}</p>
              </motion.div>
            )}

          </motion.div>

          {/* Kolom Kanan: Meta Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Kartu Tanggal (Gaya Tablet Informasi) */}
            <div className={`rounded-xl p-6 shadow-xl border-t-4 transition-colors duration-500 
              ${isDark
                ? 'bg-stone-800 border-amber-600 shadow-stone-700/50'
                : 'bg-white border-amber-700 shadow-amber-300/50'
              }`}>
              <div className="flex items-center gap-3 mb-4">
                <Clock className={`w-6 h-6 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
                <h3 className={`font-bold text-xl ${isDark ? 'text-stone-100' : 'text-stone-800'
                  }`}>
                  Waktu Kronologis
                </h3>
              </div>
              <p className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'
                }`}>
                {dateFormatted.short}
              </p>
              <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'
                }`}>
                ({dateFormatted.full})
              </p>
            </div>

            {/* Kartu Tag (Gaya Indeks Katalog) */}
            <div className={`rounded-xl p-6 shadow-xl border-t-4 transition-colors duration-500 ${isDark
                ? 'bg-stone-800 border-amber-600 shadow-stone-700/50'
                : 'bg-white border-amber-700 shadow-amber-300/50'
              }`}>
              <div className="flex items-center gap-3 mb-4">
                <Tag className={`w-6 h-6 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
                <h3 className={`font-bold text-xl ${isDark ? 'text-stone-100' : 'text-stone-800'
                  }`}>
                  Indeks Katalog
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-default border ${isDark
                        ? 'bg-stone-700 text-stone-300 border-stone-600 hover:bg-amber-900'
                        : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                      }`}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Galeri Gambar (Menggunakan Component GalleryCollage) */}
        {/* GALERI INI HANYA TAMPIL JIKA event.isCollage = true DAN galleryImages ada/tidak kosong */}
        {event.isCollage && event.galleryImages && event.galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-100px' }}
            className="my-16"
          >
            <h2 className={`text-center text-3xl font-bold italic mb-8 ${isDark ? 'text-amber-500' : 'text-amber-700'
              }`}>
              Arsip Visual
            </h2>
            <GalleryCollage images={event.galleryImages} />
          </motion.div>
        )}

        {/* Footer Kecil (Gaya Cap Naskah) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className={`text-center border-t-2 pt-8 mt-12 transition-colors duration-500 ${isDark ? 'border-stone-700 text-stone-500' : 'border-amber-200 text-stone-600'
            }`}
        >
          <p className="text-base italic font-serif tracking-wider">
            — Halaman ini adalah transkripsi dari arsip Sejarah Digital Indonesia —
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};