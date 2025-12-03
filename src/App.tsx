// App.jsx

// PASTIKAN import useLocation dan useEffect
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; 
import { useEffect } from 'react'; // useEffect seharusnya sudah ada jika React > 16.8

import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';

// Fungsi/Komponen yang menangani logika scroll
const ScrollHandler = ({ children }) => {
    // useLocation harus dipanggil di dalam BrowserRouter
    const { pathname } = useLocation(); 

    useEffect(() => {
        // Logika utama: Menggulirkan ke titik koordinat (horizontal 0, vertikal 0)
        window.scrollTo(0, 0); 
        // console.log(`Navigasi ke: ${pathname}, Menggulir ke atas.`); // Opsional untuk debugging
    }, [pathname]); // <-- Kunci: Efek berjalan setiap kali 'pathname' berubah
    
    return children;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* ScrollHandler harus membungkus Routes */}
        <ScrollHandler>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pages/:slug" element={<EventDetailPage />} />
          </Routes>
        </ScrollHandler>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;