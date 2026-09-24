import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B0C0E] border-t border-[#1C1F2A] py-10 text-[#8A8F9E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Logo matching EL CARTEL */}
        <div className="flex items-center gap-3 select-none">
          <img 
            src="./el_cartel_.png" 
            alt="EL CARTEL Barbershop" 
            className="h-10 sm:h-12 w-auto object-contain" 
          />
        </div>

        {/* Copyright notice matching EL CARTEL */}
        <p className="text-xs text-[#8A8F9E] font-medium text-center">
          © 2026 <strong className="text-white">EL CARTEL BARBERSHOP</strong>. Todos los derechos reservados.
        </p>

        {/* Legal links */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <a href="#privacidad" className="hover:text-white transition-colors">
            Política de Privacidad
          </a>
          <a href="#terminos" className="hover:text-white transition-colors">
            Términos y Condiciones
          </a>
        </div>
      </div>
    </footer>
  );
};
