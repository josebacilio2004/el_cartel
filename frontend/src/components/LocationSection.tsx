import React from 'react';
import { MapPin, Phone, Clock, ArrowRight, Instagram, Facebook, ExternalLink, Navigation } from 'lucide-react';

interface LocationSectionProps {
  onOpenTakeTicket: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenTakeTicket }) => {
  const mapsUrl = 'https://maps.app.goo.gl/UtaL5dQXf8jh2FEE8';
  const coords = { lat: -12.064542, lng: -75.2128856 };

  return (
    <section id="contacto" className="w-full py-24 bg-[#0D0E11] border-t border-[#1C1F2A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Map with Custom Pin Logo */}
          <div className="lg:col-span-6 relative w-full h-[400px] sm:h-[460px] bg-[#14161E] border border-[#232733] rounded-3xl overflow-hidden shadow-2xl group">
            {/* Embedded Google Maps */}
            <iframe
              title="Ubicación El Cartel Barbershop"
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&hl=es&z=18&output=embed`}
              className="w-full h-full border-0 filter contrast-125 brightness-90 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
              allowFullScreen
            />

            {/* Custom Overlay Pin with El Cartel Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="relative">
                {/* Glowing pulsating rings */}
                <div className="w-16 h-16 rounded-full bg-frank-orange/30 animate-ping absolute inset-0" />
                <div className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-md border-2 border-frank-orange flex items-center justify-center p-2 shadow-[0_0_30px_rgba(196,98,45,0.8)] relative z-10">
                  <img
                    src="./el_cartel_.png"
                    alt="El Cartel Logo Pin"
                    className="w-full h-full object-contain filter drop-shadow"
                    onError={(e) => {
                      // Fallback to text icon if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Pin Tag */}
              <div className="mt-2.5 bg-[#0D0E11]/95 border border-frank-orange/60 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-frank-orange animate-pulse" />
                <span className="text-[11px] font-black text-white uppercase tracking-wider">
                  EL CARTEL BARBERSHOP
                </span>
              </div>
            </div>

            {/* Floating button to open Google Maps */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-[#0F1118]/90 hover:bg-frank-orange text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#2B313E] hover:border-frank-orange flex items-center gap-2 backdrop-blur-md transition-all shadow-xl group/btn"
            >
              <Navigation className="w-4 h-4 text-frank-orange group-hover/btn:text-white" />
              <span>Cómo Llegar en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Right Column: Contact & Passion info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-frank-gold block mb-2 font-sans">
                VISÍTANOS EN NUESTRO LOCAL
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide leading-none mb-8">
                TU ESTILO, NUESTRA PASIÓN
              </h2>

              {/* Info Items List */}
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-frank-orange/15 border border-frank-orange/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-frank-orange" />
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight text-base">Barber Studio Zona VIP · EL CARTEL</p>
                    <p className="text-[#8A8F9E] text-xs mt-1">
                      Punto exacto GPS: -12.064542, -75.2128856 · Junín / Perú
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-frank-orange hover:underline text-xs font-bold inline-flex items-center gap-1 mt-1.5"
                    >
                      <span>Ver enlace directo en Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-frank-orange/15 border border-frank-orange/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-frank-orange" />
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight text-base">+51 987 654 321</p>
                    <p className="text-[#8A8F9E] text-xs mt-0.5">Atención WhatsApp y consultas directas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-frank-orange/15 border border-frank-orange/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-frank-orange" />
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight text-base">Lunes a Sábado: 10:00 AM - 9:00 PM</p>
                    <p className="text-[#8A8F9E] text-xs mt-0.5">Domingos: 11:00 AM - 6:00 PM (Turnos y Citas)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserva tu Cita Box */}
            <div className="pt-6 border-t border-[#232733] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-sans text-sm font-extrabold uppercase tracking-wider text-white mb-1">
                  RESERVA TU CITA O TURNO VIRTUAL
                </h3>
                <p className="text-xs text-[#8A8F9E]">
                  Evita esperas en sillón y asegura tu horario de atención con tu barbero favorito.
                </p>
              </div>

              <button
                onClick={onOpenTakeTicket}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-frank-orange/30 shrink-0"
              >
                <span>RESERVAR AHORA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* SÍGUENOS Socials */}
            <div>
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#8A8F9E] block mb-3">
                SÍGUENOS EN REDES OFICIALES
              </span>
              <div className="flex items-center gap-4 text-[#8A8F9E]">
                <a href="#instagram" className="hover:text-frank-orange transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#facebook" className="hover:text-frank-orange transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://wa.me/51987654321" target="_blank" rel="noreferrer" className="hover:text-frank-orange transition-colors" title="WhatsApp">
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
