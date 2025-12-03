import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Quote, History, Calendar, ArrowRight, Info, Search, ChevronDown, Filter, Users, Linkedin } from 'lucide-react'; // Menambahkan Users dan Linkedin

// Asumsi import komponen/context eksternal Anda
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { HistoricalEvent } from '../types/event'; 
import { EventCard } from '../components/EventCard';
import { RealtimeClock } from '../components/RealtimeClock';

// --- IMPORT KOMPONEN FOLDER BARU (Sesuai permintaan Anda) ---
import Folder from '../components/Folder';
// --- UTILITY & HELPER FUNCTIONS ---

const getCurrentMonthName = (lang = 'id-ID', style = 'long') => {
  const date = new Date();
  return date.toLocaleString(lang, { month: style });
};
const currentMonthLong = getCurrentMonthName(); 

const getMonthNames = (lang = 'id-ID') => {
    return Array.from({ length: 12 }, (_, i) => 
        new Date(2000, i, 1).toLocaleString(lang, { month: 'long' })
    );
};
const monthNames = getMonthNames();

// --- DATA PAHLAWAN & SKEMA WARNA BARU (Dengan 3 Foto Berbeda) ---
// ASUMSI: Anda memiliki file gambar hero-1a.jpg, hero-1b.jpg, hero-1c.jpg, dst.
const heroesData = [
    { 
        name: "Soekarno", 
        images: ["https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQVQwlV3iDQ60VX7fx1V1lNgRC76PAwDPazTB8v2Wh64Of8CVaoOBIP1rKcl8X9i3sJ5WQNk__tniTpYyY",
             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGS3DWyhpmOaFK49likvRdwG59gGQJI8NzyFrFqQ2OvE5NzK9JyljvUXYe7if6AhSW2seoASnVBD-fDio-nqObUsPOK6Fopq-RFgH0vJIQ&s", 
             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8MQHsAol2hFPiz6VFYe2P03nWK6jN38SMcNtDTx9jHsK_QYBxxnNYv8cS9AvOVAVMd5g&usqp=CAU"], 
        quote: "Perjuanganku lebih mudah karena mengusir penjajah, perjuanganmu akan lebih sulit karena melawan bangsamu sendiri.", 
        color: "#E53E3E" // Merah
    }, 
    { 
        name: "Mohammad Hatta", 
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzjA-OQNZUvKf5Bje-k6kXMTKoATKnYOLxmw&s", 
             "https://upload.wikimedia.org/wikipedia/commons/d/db/Mohammad_Hatta%2C_Pekan_Buku_Indonesia_1954%2C_p242.jpg",
             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmuBtbIFlP9fSmFTdpnqD7RMWiT_ZL6hQMUQ&s"], 
        quote: "Kurang cerdas dapat diperbaiki dengan belajar, kurang cekatan dapat dihilangkan dengan latihan, namun tidak jujur itu sulit diperbaiki.", 
        color: "#38A169" // Hijau
    }, 
    { 
        name: "Raden Ajeng Kartini", 
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOWKqSQ0Qr9PpQ4RxDPhwcgHqwMEu0CRafQ&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Asp099XJXYKVV-9GXZdxFx-vNjivafHjGQ&s","https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/104/2024/04/20/20240420_135731-3512358641.jpg"], 
        quote: "Banyak hal yang bisa menjatuhkanmu. Tapi satu-satunya hal yang benar-benar dapat menjatuhkanmu adalah sikapmu sendiri.", 
        color: "#D69E2E" // Kuning
    }, 
    { 
        name: "Jenderal Soedirman", 
        images: ["https://upload.wikimedia.org/wikipedia/commons/8/82/Jenderal_Sudirman.jpg",
             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDGDqYnw-FpZiEUdyKoVQse8S4QY9UgiJqfw&s",
             "https://pict.sindonews.net/dyn/480/pena/news/2021/11/25/14/609705/perjalanan-berliku-jenderal-soedirman-dari-guru-hingga-panglima-besar-qwg.jpg"], 
        quote: "Jangan sekali-kali mengharapkan bantuan dari orang lain sebelum kita dapat membantu diri kita sendiri.", 
        color: "#3182CE" // Biru
    }, 
    { 
        name: "Bung Tomo", 
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrKoKIPT5C-sibATqZ2MMzS7mYD2e32ehhAw&s", 
             "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Bung_Tomo.jpg/250px-Bung_Tomo.jpg", 
             "https://begandring.com/wp-content/uploads/2022/12/Bung-Tomo-saat-menjabat-sebagai-Menteri-Negara-Urusan-Bekas-Pejuang-di-kantornya-1960an.jpg"], 
        quote: "Selama banteng-banteng Indonesia masih mempunyai darah merah yang dapat membikin secarik kain putih merah dan putih, maka selama itu tidak akan kita mau menyerah kepada siapapun juga!", 
        color: "#805AD5" // Ungu
    }, 
    { 
        name: "Dewi Sartika", 
        images: ["https://upload.wikimedia.org/wikipedia/commons/a/a2/Raden_Dewi_Sartika.jpg", "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/9149511573327fcbad723a27eed7868b4c443b9375400b2e88b7aea8c7c11550.jpg",
             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfHVqqvenDtwhaumZexRDsWvt_bMnxvVP73w&s"], 
        quote: "Seorang guru harus pandai mempergunakan cara yang menarik bagi murid-muridnya.", 
        color: "#F6AD55" // Oranye
    },
];


// --- DATA TIM BARU (9 Anggota) ---
const teamData = [
    { 
        name: "Wahyu Andika Rahadi", 
        role: "Project Manager", // Tambahkan peran yang hilang
        image: "https://via.placeholder.com/150/E53E3E/FFFFFF?text=BS", // Tambahkan gambar yang hilang
        linkedin: "#" // Tambahkan tautan yang hilang
    },
    { 
        name: "Muhammad Bintang", 
        role: "Lead Developer", // Tambahkan peran yang hilang
        image: "https://via.placeholder.com/150/38A169/FFFFFF?text=CD", // Tambahkan gambar yang hilang
        linkedin: "#" // Tambahkan tautan yang hilang
    },
    { 
        name: "Chesta Ardiona Wahyudi", 
        role: "Historian / Content", 
        image: "https://via.placeholder.com/150/D69E2E/FFFFFF?text=AR", 
        linkedin: "#" 
    },
    { 
        name: "Alya Farhanna", 
        role: "UX/UI Designer", 
        image: "https://via.placeholder.com/150/3182CE/FFFFFF?text=MS", 
        linkedin: "#" 
    },
    { 
        name: "Aulia Alzahra", 
        role: "Data Architect", 
        image: "https://via.placeholder.com/150/805AD5/FFFFFF?text=JS", 
        linkedin: "#" 
    },
    { 
        name: "Safira Ramadhani", 
        role: "Documentation", 
        image: "https://via.placeholder.com/150/F6AD55/FFFFFF?text=RW", 
        linkedin: "#" 
    },
    { 
        name: "Mini Sucita Apriliany", 
        role: "QA Engineer", 
        image: "https://via.placeholder.com/150/4A5568/FFFFFF?text=DP", 
        linkedin: "#" 
    },
    { 
        name: "Naya Refa Muhaemin", 
        role: "Infrastructure", 
        image: "https://via.placeholder.com/150/718096/FFFFFF?text=GR", 
        linkedin: "#" 
    },
    { 
        name: "Satria Adhy Kurniawan", 
        role: "Marketing/Outreach", 
        image: "https://via.placeholder.com/150/C05746/FFFFFF?text=TA", // Ganti warna placeholder
        linkedin: "#" 
    },
];


// --- KOMPONEN ANAK BARU ---

/**
 * 3.1. Hero Quote Card: Menampilkan kutipan dalam card.
 * Menggunakan 3 path gambar berbeda untuk 3 'kertas' di dalam Folder.
 */
const HeroQuoteCard = ({ hero, index }) => {
    const { isDark } = useTheme();

    // Fungsi untuk membuat konten gambar yang akan dimasukkan ke dalam setiap 'kertas'
    const createHeroImageContent = (imagePath, opacity = 1) => (
        <div className={`absolute inset-0 flex items-center justify-center p-1`}>
            <img 
                src={imagePath} 
                alt={hero.name} 
                className={`w-full h-full object-cover rounded-[8px]`} 
                style={{ opacity: opacity }} 
            />
             {/* Overlay agar gambar tidak terlalu terang, terutama yang di belakang */}
            <div className="absolute inset-0 bg-black/10 rounded-[8px]"></div>
        </div>
    );
    
    // Items diisi dengan 3 instance gambar dengan path berbeda
    // paper 1 (belakang): images[0]
    // paper 2 (tengah): images[1]
    // paper 3 (depan): images[2]
    const folderItems = [
        // Kertas paling belakang (paper 1)
        createHeroImageContent(hero.images[0], 0.6), 
        // Kertas tengah (paper 2)
        createHeroImageContent(hero.images[1], 0.8), 
        // Kertas paling depan (paper 3)
        createHeroImageContent(hero.images[2], 1.0) 
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`p-5 rounded-xl shadow-lg h-full flex flex-col md:flex-row-reverse items-start transition-all duration-300 ${
                isDark ? 'bg-stone-800 ring-1 ring-amber-700 hover:shadow-amber-900/50' : 'bg-white ring-1 ring-amber-200 hover:shadow-amber-200/50'
            }`}
        >
            {/* Folder Foto Pahlawan (Kanan) */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end mb-4 md:mb-0 md:ml-4">
                <div style={{ height: '80px', width: '100px', position: 'relative', transform: 'scale(1.2)' }}>
                    <Folder 
                        size={1} 
                        color={hero.color} // Warna unik per pahlawan
                        items={folderItems} // Tiga gambar pahlawan berbeda
                        className="custom-folder" 
                    />
                </div>
            </div>
            
            {/* Teks Kutipan (Kiri, Mengambil sisa ruang) */}
            <div className="flex flex-col flex-grow">
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                    {hero.name}
                </h3>
                <p className={`text-md italic leading-relaxed flex-grow ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    <Quote className="inline-block w-4 h-4 mr-1 mb-1 text-amber-500" />
                    {hero.quote}
                </p>
            </div>
            
        </motion.div>
    );
};

/**
 * 3. Heroes Folder Grid: Menggantikan Chrono-Flow Marquee.
 * Menggunakan grid responsif untuk menampilkan HeroQuoteCard.
 */
const HeroesFolderGrid = () => {
    const { isDark } = useTheme();

    return (
        <div className={`py-12 sm:py-16 border-b-4 border-t-4 ${isDark ? 'bg-stone-950/80 border-amber-700/50' : 'bg-stone-100 border-amber-300/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10">
                    <History className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 ${isDark ? 'text-amber-500' : 'text-amber-800'}`} />
                    <h2 className={`text-3xl sm:text-4xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                        Pena Emas Para Pendiri Bangsa
                    </h2>
                    <p className={`mt-2 text-lg ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        Kutipan abadi yang menjadi semangat kebangsaan.
                    </p>
                </div>

                {/* Grid Konten: 1 kolom di mobile, 3 kolom di desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {heroesData.map((hero, index) => (
                        <HeroQuoteCard key={hero.name} hero={hero} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}


// --- KOMPONEN BARU UNTUK TIM ---

/**
 * 5.1. Team Card: Menampilkan detail anggota tim.
 * Direvisi: Hanya menampilkan nama dengan border colorful.
 */
const TeamCard = ({ member, index }) => {
    const { isDark } = useTheme();
    
    // Pilihan warna acak dari skema Pahlawan untuk variasi
    const colors = ["#F6AD55"];
    const accentColor = colors[index % colors.length];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            // Modifikasi styling card: Border tebal dan warna dinamis, fixed height untuk grid rapi
            className={`p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.03] border-4 flex items-center justify-center h-28`}
            style={{ 
                // Gunakan inline style untuk warna border dinamis
                borderColor: accentColor, 
                // Sesuaikan warna latar belakang dengan tema
                backgroundColor: isDark ? 'rgb(41, 37, 36)' : '#FFFFFF', // stone-800 atau white
                // Tambahkan shadow/glow berwarna
                boxShadow: isDark 
                    ? `0 0 20px -5px ${accentColor}B0, 0 4px 6px -1px rgba(0,0,0,0.1)` 
                    : `0 0 15px -3px ${accentColor}A0, 0 4px 6px -1px rgba(0,0,0,0.1)`, 
            }}
        >
            {/* Hanya Tampilkan Nama */}
            <h4 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                {member.name}
            </h4>
            {/* Semua elemen lain (gambar, role, linkedin) telah dihapus */}
        </motion.div>
    );
};

/**
 * 5. Team Grid: Container untuk kartu tim.
 */
const TeamGrid = () => {
    const { isDark } = useTheme();

    return (
        <div className={`py-16 sm:py-20 ${isDark ? 'bg-stone-950/50' : 'bg-amber-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Users className={`w-10 h-10 mx-auto mb-4 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
                    <h2 className={`text-3xl md:text-4xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                        Tim Pengembang Arsip
                    </h2>
                    <p className={`mt-2 text-lg ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        Inisiator dan kontributor yang membuat proyek ini terwujud.
                    </p>
                </div>

                {/* Grid Konten: Mobile 2 kolom, Tablet 3 kolom, Desktop/Large 3 kolom */}
                {/* Desktop/Large: 3x3 | Mobile: 2x4 (8 card) + 1 (9 card) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
                    {teamData.map((member, index) => (
                        <TeamCard key={member.name} member={member} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN ANAK ASLI (Dipertahankan) ---

/**
 * 1. Hero Section: Realtime Content & Responsive Layout (Stacking on Mobile)
 */
const CalendarCentricHero = ({ events, onExploreClick }) => {
    const { isDark } = useTheme();

    const currentMonthEvents = useMemo(() => {
        const currentMonthIndex = new Date().getMonth(); 

        return events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === currentMonthIndex;
            })
            .slice(0, 3) 
            .map(event => {
                const day = new Date(event.date).getDate();
                const monthShort = getCurrentMonthName('id-ID', 'short');
                return {
                    id: event.slug,
                    display: `${day} ${monthShort}: ${event.title}`
                };
            });
    }, [events]);

    return (
        <div className="relative h-[80vh] flex items-end overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${isDark ? 'https://asset.kompas.com/crops/88maFGK8mltJhvEc7rknws_7lEk=/0x54:900x504/1200x800/data/photo/2017/04/20/2245406037.jpg' : 'https://st4.depositphotos.com/5542528/38510/i/450/depositphotos_385109216-stock-photo-indonesia-area-satellite-map-stereographic.jpg'})` }}>
                <div className={`absolute inset-0 ${isDark ? 'bg-black/85' : 'bg-stone-900/65'}`} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16 w-full 
                        flex flex-col lg:flex-row justify-between lg:items-end items-start"> 
                
                {/* Judul Kiri / Atas */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="pt-20 lg:pt-0 mb-8 lg:mb-0 w-full lg:w-auto"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white drop-shadow-lg">
                        Arsip Digital Nusantara
                    </h1>
                    <p className="text-lg md:text-2xl font-light text-amber-300 mt-2 max-w-xl">
                        Gerbang digital untuk menelusuri sejarah Indonesia per bulan.
                    </p>
                    <RealtimeClock className="mt-4 text-base font-mono text-white/80 p-2 rounded bg-black/30" />
                </motion.div>

                {/* Kalender Bulanan di Kanan / Bawah */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={`p-4 sm:p-6 rounded-xl shadow-2xl w-full lg:w-96 ${isDark ? 'bg-stone-800/90' : 'bg-white/95'} backdrop-blur-sm`}
                >
                    <div className="flex items-center gap-3 mb-3 border-b pb-2">
                        <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                        <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                            Event Bulan <b>{currentMonthLong}</b>
                        </h2>
                    </div>
                    {currentMonthEvents.length > 0 ? (
                        <ul className="space-y-2 text-sm sm:text-md">
                            {currentMonthEvents.map((event) => (
                                <li key={event.id} className={`flex items-start gap-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                                    <BookOpen className="w-4 h-4 flex-shrink-0 text-amber-500 mt-1" />
                                    <span className="leading-snug">
                                        <span className="font-semibold">{event.display.split(':')[0]}:</span> {event.display.split(':')[1]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={`italic text-center py-4 text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            Tidak ada peristiwa yang tercatat di arsip untuk bulan ini.
                        </p>
                    )}
                    
                    <button 
                        onClick={() => onExploreClick(currentMonthLong)}
                        className={`mt-4 flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-900'}`}
                    >
                        Jelajahi Arsip Bulan {currentMonthLong} <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

/**
 * 2. About Section: Tujuan Web.
 */
const SimplifiedAbout = () => {
    const { isDark } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className={`py-16 ${isDark ? 'bg-stone-900' : 'bg-white'}`}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Info className={`w-10 h-10 mx-auto mb-4 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
                <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                    Tentang Proyek Sejarah Digital
                </h2>
                <p className={`text-xl leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-700'}`}>
                    Proyek ini adalah tujuan digital utama yang diakses melalui <b>QR Code</b>. Kami menyajikan informasi historis Indonesia secara kronologis dan mendalam, diorganisir per bulan, memastikan data yang akurat dan mudah diakses kapan saja.
                </p>
            </div>
        </motion.div>
    );
};


/**
 * 4. Komponen Kontrol Filter.
 */
const FilterControls = ({ searchQuery, setSearchQuery, selectedMonth, setSelectedMonth, selectedTag, setSelectedTag, allTags }) => {
    const { isDark } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap md:flex-nowrap gap-4 mb-12"
        >
            {/* Search Bar */}
            <div className="relative flex-grow w-full md:w-auto"> 
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
                <input
                    type="text"
                    placeholder="Cari peristiwa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-3 pl-10 pr-4 rounded-lg border-2 text-base shadow-inner transition-colors focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        isDark 
                            ? 'bg-stone-800 text-stone-100 border-stone-700 placeholder-stone-400'
                            : 'bg-white text-stone-800 border-stone-300 placeholder-stone-500'
                    }`}
                />
            </div>

            {/* Filter Bulan */}
            <div className="relative w-full sm:w-[calc(50%-8px)] md:w-48"> 
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`appearance-none w-full py-3 px-4 pr-10 rounded-lg border-2 text-base cursor-pointer shadow-inner transition-colors ${
                        isDark 
                            ? 'bg-stone-800 text-stone-100 border-stone-700'
                            : 'bg-white text-stone-800 border-stone-300'
                    }`}
                >
                    <option value="">Semua Bulan</option>
                    {monthNames.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
            </div>
            
            {/* Filter Tag */}
            <div className="relative w-full sm:w-[calc(50%-8px)] md:w-48"> 
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className={`appearance-none w-full py-3 px-4 pr-10 rounded-lg border-2 text-base cursor-pointer shadow-inner transition-colors ${
                        isDark 
                            ? 'bg-stone-800 text-stone-100 border-stone-700'
                            : 'bg-white text-stone-800 border-stone-300'
                    }`}
                >
                    <option value="">Semua Tag</option>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
            </div>
        </motion.div>
    );
}

// ---------------------------------------------
// --- KOMPONEN UTAMA: HOMEPAGE ---
// ---------------------------------------------

export const HomePage = () => {
    const contentRef = useRef<HTMLDivElement>(null); 
    
    const [events, setEvents] = useState<HistoricalEvent[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    
    const { isDark } = useTheme();

    // 1. Fetch Data
    useEffect(() => {
      fetch('/data/events.json')
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch events data');
          return response.json();
        })
        .then((data: HistoricalEvent[]) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error loading events:', error);
          setLoading(false);
        });
    }, []);

    // 2. Handler untuk Tombol Jelajahi di Hero (Scroll & Filter)
    const handleHeroExplore = (monthName: string) => {
      setSelectedMonth(monthName); 
      setSearchQuery(''); 
      setSelectedTag(''); 

      if (contentRef.current) {
          contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // 3. Mendapatkan daftar semua tag unik (Memoized)
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        events.forEach(event => {
            if (event.tags) {
                event.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort(); 
    }, [events]);

    // 4. Logika Filtering Events gabungan (Memoized)
    const filteredEvents = useMemo(() => {
      let filtered = events;
      const lowerCaseQuery = searchQuery.toLowerCase();

      // 1. Filter Search (Title & Description)
      if (searchQuery) {
          filtered = filtered.filter(event => 
              event.title.toLowerCase().includes(lowerCaseQuery) ||
              event.description.toLowerCase().includes(lowerCaseQuery)
          );
      }

      // 2. Filter Bulan
      if (selectedMonth && selectedMonth !== 'Semua Bulan') {
          const monthIndex = monthNames.indexOf(selectedMonth); 
          
          filtered = filtered.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getMonth() === monthIndex; 
          });
      }

      // 3. Filter Tag
      if (selectedTag && selectedTag !== 'Semua Tag') {
          filtered = filtered.filter(event => 
              event.tags && event.tags.includes(selectedTag)
          );
      }

      return filtered;
    }, [events, searchQuery, selectedMonth, selectedTag]);

    if (loading) {
      return (
          <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-stone-950' : 'bg-stone-50'}`}>
              <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${isDark ? 'border-amber-400' : 'border-amber-700'}`}></div>
              <p className={`ml-4 text-xl ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>Memuat Arsip Sejarah...</p>
          </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950'
            : 'bg-gradient-to-br from-stone-50 via-amber-50/50 to-stone-100'
        }`}
      >
        {/* Tombol Tema */}
        <div className="absolute top-6 right-6 z-50">
            <ThemeToggle />
        </div>

        {/* 1. Hero Section */}
        <CalendarCentricHero events={events} onExploreClick={handleHeroExplore} />
        
        {/* 2. About Section */}
        <SimplifiedAbout />

        {/* 3. Heroes Folder Grid (Pengganti Chrono-Flow Marquee) */}
        <HeroesFolderGrid />
        
        {/* 4. Daftar Peristiwa Bersejarah (Content) */}
        <div ref={contentRef} className={`py-20 ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7 }}
                  className="text-center mb-12"
              >
                  <History className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
                  <h2 className={`text-3xl sm:text-4xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                      Peristiwa Kunci: Arsip Terkini
                  </h2>
                  <p className={`mt-3 text-lg ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {selectedMonth ? `Menampilkan arsip untuk bulan ${selectedMonth}.` : 'Telusuri setiap babak penting yang membentuk Republik Indonesia.'}
                  </p>
              </motion.div>

              {/* Filter Controls */}
              <FilterControls 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  allTags={allTags}
              />

              {/* Tampilkan Hasil Filter */}
              {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {filteredEvents.map((event, index) => (
                          <EventCard key={event.slug} event={event} index={index} />
                      ))}
                  </div>
              ) : (
                  <div className={`p-10 rounded-xl text-center ${isDark ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-600'}`}>
                      <Filter className="w-10 h-10 mx-auto mb-4 text-amber-500" />
                      <p className="text-xl font-semibold">Tidak ada peristiwa yang cocok dengan kriteria filter saat ini.</p>
                      <button 
                          onClick={() => { setSearchQuery(''); setSelectedMonth(''); setSelectedTag(''); }}
                          className={`mt-4 text-sm font-medium ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-900'} underline`}
                      >
                          Reset Semua Filter
                      </button>
                  </div>
              )}
          </div>
        </div>
        
        {/* 5. Team Grid (BARU) */}
        <TeamGrid />

        {/* Footer */}
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.8 }}
            className={`py-12 text-center text-sm ${
                isDark ? 'text-stone-500 bg-stone-950' : 'text-stone-500 bg-stone-100'
            }`}
        >
          <div className="max-w-7xl mx-auto px-4">
              <div className={`border-t pt-8 ${isDark ? 'border-stone-700' : 'border-stone-300'}`}>
                  <p className="font-serif text-lg font-semibold">
                      Proyek Sejarah Digital By Team 2 © {new Date().getFullYear()}
                  </p>
                  <p className="mt-2 text-base">
                      Dedikasi untuk melestarikan memori kolektif bangsa.
                  </p>
              </div>
          </div>
        </motion.footer>
      </motion.div>
    );
};