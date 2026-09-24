import React from 'react';
import { Scissors, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'corte-clasico',
      name: 'CORTE CLÁSICO',
      description: 'Corte tradicional con tijera y peinado.',
      price: '35.00',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
      icon: (
        <svg className="w-5 h-5 text-frank-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <line x1="20" y1="4" x2="8.12" y2="15.88"/>
          <line x1="14.47" y1="14.48" x2="20" y2="20"/>
          <line x1="8.12" y1="8.12" x2="12" y2="12"/>
        </svg>
      )
    },
    {
      id: 'fade-degradado',
      name: 'FADE / DEGRADADO',
      description: 'Degradados altos, medios o bajos.',
      price: '45.00',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
      icon: (
        <svg className="w-5 h-5 text-frank-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="7" y="2" width="10" height="20" rx="3" />
          <line x1="10" y1="6" x2="14" y2="6" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
      )
    },
    {
      id: 'corte-barba',
      name: 'CORTE + BARBA',
      description: 'Corte completo más perfilado de barba.',
      price: '65.00',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      icon: (
        <svg className="w-5 h-5 text-frank-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <line x1="20" y1="4" x2="8.12" y2="15.88"/>
          <line x1="14.47" y1="14.48" x2="20" y2="20"/>
          <path d="M16 11c0 2.2-1.8 4-4 4s-4-1.8-4-4" />
        </svg>
      )
    },
    {
      id: 'perfilado-barba',
      name: 'PERFILADO DE BARBA',
      description: 'Perfilado con navaja, toalla caliente y productos premium.',
      price: '35.00',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
      icon: (
        <svg className="w-5 h-5 text-frank-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v2c0 5-4 9-9 9s-9-4-9-9V6c0-1.1.9-2 2-2z" />
          <path d="M12 17v4" />
          <path d="M8 21h8" />
        </svg>
      )
    }
  ];

  return (
    <section id="servicios" className="w-full py-24 bg-[#0D0E11] border-t border-[#1C1F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-frank-gold block mb-2 font-sans">
              SERVICIOS
            </span>
            <h2 className="font-display text-5xl sm:text-6xl text-white tracking-wide leading-none">
              NUESTROS SERVICIOS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8A8F9E] max-w-sm text-left md:text-right font-medium leading-relaxed">
            Cortes profesionales, acabados perfectos y una experiencia pensada para ti.
          </p>
        </div>

        {/* 4 Cards Grid matching landing.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectService(item.name)}
              className="group bg-[#13151B] border border-[#232733] hover:border-frank-orange/60 rounded-none overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Frame with dark vignette */}
              <div className="relative h-64 w-full overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13151B] via-transparent to-transparent opacity-90" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl text-white tracking-wide mb-2 group-hover:text-frank-orange transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#8A8F9E] leading-relaxed mb-6 font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Price in Soles S/ */}
                <div className="pt-4 border-t border-[#232733]/60 flex items-baseline gap-1.5">
                  <span className="text-xs font-black text-frank-orange">S/</span>
                  <span className="font-display text-3xl font-extrabold text-white tracking-wide group-hover:text-frank-orange transition-colors">
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ornamental Divider with Scissors matching landing.png */}
        <div className="flex items-center justify-center gap-6">
          <span className="h-[1px] w-32 bg-[#232733]"></span>
          <div className="text-frank-orange">
            <Scissors className="w-5 h-5 rotate-90 text-frank-orange opacity-80" />
          </div>
          <span className="h-[1px] w-32 bg-[#232733]"></span>
        </div>
      </div>
    </section>
  );
};
