import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StylesGallerySectionProps {
  onSelectStyle?: (styleName: string) => void;
}

export const StylesGallerySection: React.FC<StylesGallerySectionProps> = ({ onSelectStyle }) => {
  const styles = [
    {
      name: 'FADE',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'QUIFF',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'CROP',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'POMPADOUR',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'UNDERCUT',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'CLÁSICO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section id="cortes" className="w-full py-24 bg-[#0D0E11] border-t border-[#1C1F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-frank-gold block mb-2 font-sans">
              GALERÍA
            </span>
            <h2 className="font-display text-5xl sm:text-6xl text-white tracking-wide leading-none">
              ESTILOS & CORTES
            </h2>
          </div>
          <a
            href="#contacto"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A8F9E] hover:text-frank-orange transition-colors"
          >
            <span>VER TODOS</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 6 Grayscale Cut Cards Grid matching landing.png */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {styles.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectStyle?.(item.name)}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Photo Frame in moody grayscale */}
              <div className="relative w-full aspect-[4/5] bg-[#161922] border border-[#232733] overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top filter grayscale contrast-125 brightness-95 group-hover:scale-105 group-hover:filter-none transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>

              {/* Style Label */}
              <span className="font-display text-lg tracking-wider text-[#D1D5DB] group-hover:text-frank-orange transition-colors text-center uppercase">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
