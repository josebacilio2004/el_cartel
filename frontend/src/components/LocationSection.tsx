import React from 'react';
import { MapPin, Phone, Clock, ArrowRight, Instagram, Facebook } from 'lucide-react';

interface LocationSectionProps {
  onOpenTakeTicket: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenTakeTicket }) => {
  return (
    <section id="contacto" className="w-full py-24 bg-[#0D0E11] border-t border-[#1C1F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Dark Stylized Map matching landing.png */}
          <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[440px] bg-[#14161E] border border-[#232733] overflow-hidden select-none">
            {/* Dark Map Vector Simulation (Grayscale blueprint map) */}
            <svg
              className="w-full h-full object-cover filter brightness-75 contrast-125"
              viewBox="0 0 500 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="500" height="400" fill="#111319" />
              {/* Streets network pattern */}
              <g stroke="#232733" strokeWidth="2.5" opacity="0.8">
                <line x1="0" y1="80" x2="500" y2="120" />
                <line x1="0" y1="160" x2="500" y2="190" />
                <line x1="0" y1="280" x2="500" y2="270" />
                <line x1="0" y1="340" x2="500" y2="360" />
                <line x1="80" y1="0" x2="120" y2="400" strokeWidth="3.5" />
                <line x1="180" y1="0" x2="220" y2="400" />
                <line x1="260" y1="0" x2="240" y2="400" strokeWidth="4.5" stroke="#2B313E" />
                <line x1="340" y1="0" x2="380" y2="400" />
                <line x1="420" y1="0" x2="450" y2="400" />
              </g>
              <g stroke="#1A1C23" strokeWidth="1" opacity="0.6">
                <line x1="0" y1="40" x2="500" y2="40" />
                <line x1="0" y1="220" x2="500" y2="220" />
                <line x1="140" y1="0" x2="140" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
              </g>
              {/* City blocks */}
              <rect x="90" y="90" width="80" height="60" fill="#161822" rx="4" />
              <rect x="190" y="95" width="60" height="65" fill="#161822" rx="4" />
              <rect x="270" y="130" width="60" height="50" fill="#181B26" rx="4" />
              <rect x="190" y="200" width="60" height="65" fill="#161822" rx="4" />
              <rect x="90" y="200" width="80" height="70" fill="#181B26" rx="4" />
              <rect x="270" y="200" width="60" height="60" fill="#161822" rx="4" />
            </svg>

            {/* Glowing Map Pin in Orange matching landing.png */}
            <div className="absolute top-[48%] left-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-frank-orange/20 animate-ping absolute inset-0" />
                <div className="w-10 h-10 rounded-full bg-frank-orange flex items-center justify-center text-white shadow-[0_0_24px_rgba(196,98,45,0.8)] relative z-10 border-2 border-white">
                  <MapPin className="w-5 h-5 fill-white text-frank-orange" />
                </div>
              </div>
              <div className="mt-2 bg-[#0D0E11]/90 border border-[#232733] px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-lg">
                El Cartel Barbershop · San Miguel
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Passion info matching landing.png */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-frank-gold block mb-2 font-sans">
                VISÍTANOS
              </span>
              <h2 className="font-display text-5xl sm:text-6xl text-white tracking-wide leading-none mb-8">
                TU ESTILO, NUESTRA PASIÓN
              </h2>

              {/* Info Items List */}
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-frank-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold leading-tight">Av. Los Héroes 1234, San Miguel</p>
                    <p className="text-[#8A8F9E] text-xs mt-0.5">Lima, Perú</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-frank-orange shrink-0" />
                  <p className="text-white font-bold leading-tight">+51 987 654 321</p>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-frank-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold leading-tight">Lun - Sáb: 10:00 AM - 9:00 PM</p>
                    <p className="text-[#8A8F9E] text-xs mt-0.5">Dom: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserva tu Cita Box */}
            <div className="pt-6 border-t border-[#232733]">
              <h3 className="font-sans text-sm font-extrabold uppercase tracking-wider text-white mb-1">
                RESERVA TU CITA
              </h3>
              <p className="text-xs text-[#8A8F9E] mb-4">
                Evita esperas y asegura tu horario.
              </p>
              <button
                onClick={onOpenTakeTicket}
                className="w-full sm:w-auto h-12 px-8 rounded bg-frank-orange hover:bg-frank-orange-hover text-white font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(196,98,45,0.35)]"
              >
                <span>RESERVAR CITA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* SÍGUENOS Socials */}
            <div>
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#8A8F9E] block mb-3">
                SÍGUENOS
              </span>
              <div className="flex items-center gap-4 text-[#8A8F9E]">
                <a href="#instagram" className="hover:text-frank-orange transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#facebook" className="hover:text-frank-orange transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#tiktok" className="hover:text-frank-orange transition-colors" title="TikTok">
                  {/* TikTok custom icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.86-4.51v-6.6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86-.48z"/>
                  </svg>
                </a>
                <a href="https://wa.me/51987654321" target="_blank" rel="noreferrer" className="hover:text-frank-orange transition-colors" title="WhatsApp">
                  {/* WhatsApp custom icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
