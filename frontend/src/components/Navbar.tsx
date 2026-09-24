import React from 'react';
import { LayoutDashboard, Lock, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenTakeTicket: () => void;
  currentMode: 'client' | 'terminal';
  onToggleMode: (mode: 'client' | 'terminal') => void;
  isStaffLoggedIn: boolean;
  onStaffLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTakeTicket,
  currentMode,
  onToggleMode,
  isStaffLoggedIn,
  onStaffLogout
}) => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent border-none py-4 sm:py-6 px-4 sm:px-12 lg:px-16 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo with Official El Cartel Image */}
        <a href="#inicio" className="flex items-center gap-3 select-none group cursor-pointer">
          <img 
            src="./el_cartel_.png" 
            alt="EL CARTEL Barbershop" 
            className="h-12 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]" 
          />
        </a>

        {/* Navigation items (100% invisible background) */}
        <nav className="hidden md:flex items-center gap-12 text-[13px] font-bold uppercase tracking-widest">
          <a
            href="#inicio"
            className="text-frank-gold relative py-2 flex flex-col items-center group"
          >
            <span>INICIO</span>
            <span className="w-8 h-[2.5px] bg-[#C4622D] rounded-full mt-1"></span>
          </a>
          <a
            href="#servicios"
            className="text-[#D1D5DB] hover:text-white transition-colors py-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            SERVICIOS
          </a>
          <a
            href="#cortes"
            className="text-[#D1D5DB] hover:text-white transition-colors py-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            CORTES
          </a>
          <a
            href="#contacto"
            className="text-[#D1D5DB] hover:text-white transition-colors py-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            CONTACTO
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Staff Login / Terminal Button */}
          {currentMode === 'terminal' ? (
            <button
              onClick={onStaffLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-red-500/50 bg-red-950/40 text-[11px] font-bold text-red-200 hover:bg-red-900/60 transition-all"
              title="Cerrar sesión de personal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleMode('terminal')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-white/20 bg-black/40 backdrop-blur-sm text-[11px] font-bold text-[#D1D5DB] hover:text-white hover:border-frank-orange transition-all"
              title={isStaffLoggedIn ? "Abrir Terminal Barbero" : "Login Barbero / Staff"}
            >
              {isStaffLoggedIn ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-secondary" />
                  <span>Terminal</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-frank-gold" />
                  <span>Staff Login</span>
                </>
              )}
            </button>
          )}

          {/* RESERVAR CITA Button */}
          <button
            onClick={onOpenTakeTicket}
            className="px-4 sm:px-6 py-2.5 rounded-sm border border-[#B85324] bg-black/30 hover:bg-[#B85324] backdrop-blur-sm text-white text-xs font-black uppercase tracking-widest hover:shadow-[0_0_24px_rgba(184,83,36,0.6)] transition-all duration-300 active:scale-[0.98]"
          >
            RESERVAR CITA
          </button>
        </div>
      </div>
    </header>
  );
};
