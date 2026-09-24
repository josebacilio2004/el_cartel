import React from 'react';
import { ArrowRight, Ticket as TicketIcon } from 'lucide-react';
import { Ticket, QueueStatus } from '../types';

interface HeroSectionProps {
  userTicket: Ticket | null;
  queueStatus: QueueStatus | null;
  onOpenTakeTicket: () => void;
  onOpenLiveTicket: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userTicket,
  queueStatus,
  onOpenTakeTicket,
  onOpenLiveTicket
}) => {
  return (
    <section id="inicio" className="relative min-h-[95vh] sm:min-h-screen w-full flex items-center overflow-hidden">
      {/* 
        CINEMATIC BACKGROUND VIDEO WITH VIVID VISIBILITY & ARTFUL LIGHTING
        Showing the master barber, scissors/clippers, and atelier ambiance clearly on the right.
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[center_right] sm:object-center filter brightness-[0.88] contrast-[1.14] saturate-[1.08] transition-all duration-700"
          poster="./el_cartel.png"
        >
          <source src="./fondo_barberia.mp4" type="video/mp4" />
        </video>

        {/* 
          Asymmetric Left Vignette: 
          Keeps text 100% legible on the left while leaving the barber & salon completely visible on the right.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0E11] via-[#0D0E11]/85 via-45% to-transparent sm:via-[#0D0E11]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E11] via-transparent via-25% to-[#0D0E11]/40" />

        {/* Warm Amber Rim Spotlight in Atelier Background */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C4622D]/15 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Subtle cinematic vignette around extreme borders */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/40 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] pointer-events-none" />
      </div>

      {/* Main Hero Content with EL CARTEL identity */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full pt-32 sm:pt-40 pb-20">
        <div className="max-w-3xl text-left">
          {/* Top Tagline */}
          <div className="mb-4 select-none flex items-center gap-3">
            <span className="text-xs sm:text-sm uppercase font-extrabold tracking-[0.3em] text-frank-gold font-sans drop-shadow-md">
              ESTILO. ACTITUD. CONFIANZA.
            </span>
          </div>

          {/* Monumental Headline: EL CARTEL BARBERSHOP */}
          <h1 className="font-bebas text-7xl sm:text-8xl md:text-[9.5rem] lg:text-[11.2rem] tracking-[0.055em] text-[#F4ECE1] uppercase leading-[0.88] mb-6 select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
            EL CARTEL<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4622D] via-frank-gold to-[#F4ECE1]">
              BARBERSHOP
            </span>
          </h1>

          {/* Subtitle: CORTES CON ACTITUD. */}
          <p className="font-sans text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-[0.08em] text-white mb-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            CORTES CON ACTITUD.
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <button
              onClick={onOpenTakeTicket}
              className="h-14 sm:h-16 px-10 rounded-sm bg-gradient-to-r from-[#B85324] to-[#99421A] hover:from-[#C85D28] hover:to-[#A84A1E] text-white font-extrabold uppercase text-sm sm:text-base tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(184,83,36,0.45)] border border-[#D66B33]/30"
            >
              <span>RESERVAR CITA</span>
              <ArrowRight className="w-5 h-5 text-white/90" />
            </button>

            {/* Turno en Vivo / Fila virtual (Floating Pill) */}
            {userTicket ? (
              <button
                onClick={onOpenLiveTicket}
                className="h-14 sm:h-16 px-7 rounded-sm bg-black/60 hover:bg-black/80 border border-[#B85324] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 backdrop-blur-md transition-all shadow-xl animate-pulse"
              >
                <TicketIcon className="w-4 h-4 text-frank-orange" />
                <span>Tu Turno #{userTicket.ticketCode} (Ver En Vivo)</span>
              </button>
            ) : (
              <button
                onClick={onOpenTakeTicket}
                className="h-14 sm:h-16 px-7 rounded-sm bg-black/40 hover:bg-black/60 border border-white/20 text-[#D1D5DB] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 backdrop-blur-md transition-all hover:border-white/40"
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <span>
                  {queueStatus && queueStatus.totalWaiting > 0
                    ? `${queueStatus.totalWaiting} Clientes en Espera Hoy`
                    : 'Atención por Turno & Cita Previa'}
                </span>
              </button>
            )}
          </div>

          {/* Bottom Divider Tagline */}
          <div className="flex items-center gap-5 select-none opacity-80">
            <span className="h-[1px] w-12 sm:w-16 bg-[#8A8F9E]/60"></span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#A5ABB8]">
              EXPERIENCIA PREMIUM PARA HOMBRES
            </span>
            <span className="h-[1px] w-12 sm:w-16 bg-[#8A8F9E]/60"></span>
          </div>
        </div>
      </div>
    </section>
  );
};
