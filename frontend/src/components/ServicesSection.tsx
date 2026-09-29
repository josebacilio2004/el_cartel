import React, { useState } from 'react';
import { Scissors, Sparkles, Clock, Check, User, ChevronRight } from 'lucide-react';
import { Barber, Service } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceName: string, barberId?: string) => void;
  barbers?: Barber[];
  services?: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  barbers: propBarbers,
  services: propServices
}) => {
  // Barberos predeterminados con fotos oficiales
  const defaultBarbers: Barber[] = [
    {
      id: 'b1',
      name: 'Frank Master',
      chairNumber: 1,
      specialty: 'Master Barber & Fundador · Fades & Barba',
      status: 'ACTIVE',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'b2',
      name: 'Mateo Fade',
      chairNumber: 2,
      specialty: 'Barber Senior · Diseños Urbanos & Taper',
      status: 'ACTIVE',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'b3',
      name: 'Santi Style',
      chairNumber: 3,
      specialty: 'Barber Senior · Cortes Clásicos & Texturizados',
      status: 'ACTIVE',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    }
  ];

  // Servicios predeterminados agrupados por barbero con fotos reales
  const defaultServices: Service[] = [
    // Frank Master (b1)
    {
      id: 's1',
      name: 'Fade Urbano Cartel',
      description: 'Degradados altos, medios o bajos con navaja y texturizado.',
      durationMinutes: 35,
      price: 35,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
      barberId: 'b1',
      isActive: true
    },
    {
      id: 's2',
      name: 'Ritual Barba & Toalla Caliente',
      description: 'Perfilado con navaja, toalla caliente y aceites esenciales.',
      durationMinutes: 25,
      price: 25,
      category: 'BARBA',
      imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
      barberId: 'b1',
      isActive: true
    },
    {
      id: 's3',
      name: 'Combo El Cartel (Corte + Barba)',
      description: 'Corte completo más ritual de barba premium con vapor de ozono.',
      durationMinutes: 50,
      price: 50,
      category: 'COMBOS',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      barberId: 'b1',
      isActive: true
    },

    // Mateo Fade (b2)
    {
      id: 's4',
      name: 'Buzz Cut + Diseños Tribales',
      description: 'Corte al ras con grecas urbanas y líneas precisas.',
      durationMinutes: 35,
      price: 35,
      category: 'ARTE',
      imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
      barberId: 'b2',
      isActive: true
    },
    {
      id: 's5',
      name: 'Taper Fade Texturizado',
      description: 'Degradado en patillas y nuca con caída texturizada en cúspide.',
      durationMinutes: 35,
      price: 35,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1517832606589-7629c3397143?w=600&auto=format&fit=crop&q=80',
      barberId: 'b2',
      isActive: true
    },
    {
      id: 's6',
      name: 'Freestyle Urbano + Cejas',
      description: 'Diseño libre personalizado en laterales y perfilado de cejas.',
      durationMinutes: 30,
      price: 40,
      category: 'ARTE',
      imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
      barberId: 'b2',
      isActive: true
    },

    // Santi Style (b3)
    {
      id: 's7',
      name: 'Corte Clásico Ejecutivo',
      description: 'Tijera pura y peinado tradicional elegante para caballeros.',
      durationMinutes: 30,
      price: 30,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      barberId: 'b3',
      isActive: true
    },
    {
      id: 's8',
      name: 'Pompadour Clásico & Peinado',
      description: 'Estilo pompadour con brillo formal o mate de fijación fuerte.',
      durationMinutes: 35,
      price: 35,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      barberId: 'b3',
      isActive: true
    },
    {
      id: 's9',
      name: 'Alisado & Keratina Masculina',
      description: 'Tratamiento alisador termoactivo y nutrición capilar profunda.',
      durationMinutes: 60,
      price: 60,
      category: 'TRATAMIENTOS',
      imageUrl: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=600&auto=format&fit=crop&q=80',
      barberId: 'b3',
      isActive: true
    }
  ];

  const barbers = (propBarbers && propBarbers.length > 0) ? propBarbers : defaultBarbers;
  const services = (propServices && propServices.length > 0) ? propServices : defaultServices;

  // Estado para la pestaña de barbero seleccionada ('all' o ID del barbero)
  const [selectedBarberTab, setSelectedBarberTab] = useState<string>('all');

  // Filtrado de servicios según la sección del barbero
  const getServicesForBarber = (barber: Barber) => {
    return services.filter(s => {
      if (!s.barberId) return true; // Si no tiene barbero asignado, visible
      return s.barberId === barber.id || 
             (s.barber && s.barber.name.toLowerCase() === barber.name.toLowerCase());
    });
  };

  const displayedBarbers = selectedBarberTab === 'all'
    ? barbers
    : barbers.filter(b => b.id === selectedBarberTab);

  return (
    <section id="servicios" className="w-full py-24 bg-[#0D0E11] border-t border-[#1C1F2A] relative">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-frank-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-frank-gold block mb-2 font-sans">
              CATÁLOGO DE SERVICIOS POR BARBERO
            </span>
            <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide leading-none">
              NUESTROS SERVICIOS & STAFF
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8A8F9E] max-w-md text-left md:text-right font-medium leading-relaxed">
            Cada barbero de <span className="text-frank-orange font-bold">EL CARTEL</span> cuenta con su propio catálogo especializado y técnicas exclusivas. Selecciona a tu barbero preferido para reservar.
          </p>
        </div>

        {/* Barber Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-14 p-1.5 bg-[#12151E] border border-[#232733] rounded-2xl max-w-fit">
          <button
            onClick={() => setSelectedBarberTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedBarberTab === 'all'
                ? 'bg-gradient-to-r from-frank-orange to-[#A84F22] text-white shadow-md shadow-frank-orange/20'
                : 'text-[#8A8F9E] hover:text-white hover:bg-[#1A1D28]'
            }`}
          >
            <span>Todos los Barberos ({barbers.length})</span>
          </button>

          {barbers.map(barber => (
            <button
              key={barber.id}
              onClick={() => setSelectedBarberTab(barber.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                selectedBarberTab === barber.id
                  ? 'bg-gradient-to-r from-frank-orange to-[#A84F22] text-white shadow-md shadow-frank-orange/20'
                  : 'text-[#8A8F9E] hover:text-white hover:bg-[#1A1D28]'
              }`}
            >
              {barber.photoUrl ? (
                <img
                  src={barber.photoUrl}
                  alt={barber.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/20"
                />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              <span>{barber.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                selectedBarberTab === barber.id ? 'bg-black/30 text-white' : 'bg-[#1D212E] text-[#8C93A4]'
              }`}>
                #{barber.chairNumber}
              </span>
            </button>
          ))}
        </div>

        {/* Sections Divided By Barber */}
        <div className="space-y-16">
          {displayedBarbers.map((barber) => {
            const barberServices = getServicesForBarber(barber);

            return (
              <div
                key={barber.id}
                className="bg-[#12141C]/80 border border-[#232733] rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden transition-all hover:border-[#343B4E]"
              >
                {/* Header per Barber Profile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232733] mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {barber.photoUrl ? (
                        <img
                          src={barber.photoUrl}
                          alt={barber.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-frank-orange/40 shadow-lg shadow-frank-orange/10"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#1C1F2A] border border-[#2B313E] flex items-center justify-center text-frank-orange font-bold text-2xl">
                          {barber.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 bg-frank-orange text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                        Sillón #{barber.chairNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-frank-gold/10 text-frank-gold border border-frank-gold/20">
                          {barber.specialty || 'Master Barber'}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Disponible" />
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
                        {barber.name}
                      </h3>
                      <p className="text-xs text-[#8A8F9E] mt-0.5">
                        Servicios y cortes exclusivos disponibles para reserva inmediata o programada.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(barberServices[0]?.name || 'Corte Cartel', barber.id)}
                    className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#1C1F2A] hover:bg-frank-orange hover:text-white border border-[#2B313E] text-xs font-bold text-frank-orange transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Reservar con {barber.name.split(' ')[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid of Services with images uploaded/assigned to this barber */}
                {barberServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barberServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => onSelectService(service.name, barber.id)}
                        className="group bg-[#161822] border border-[#242836] hover:border-frank-orange/70 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-frank-orange/5"
                      >
                        {/* Service Custom Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-black">
                          <img
                            src={service.imageUrl || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80'}
                            alt={service.name}
                            className="w-full h-full object-cover object-center filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161822] via-transparent to-transparent opacity-90" />
                          
                          {/* Duration Badge */}
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-[#2D3344] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-bold text-white">
                            <Clock className="w-3 h-3 text-frank-orange" />
                            <span>{service.durationMinutes} min</span>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-frank-orange/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white">
                            {service.category}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="font-display text-xl text-white tracking-wide mb-1.5 group-hover:text-frank-orange transition-colors">
                              {service.name}
                            </h4>
                            <p className="text-xs text-[#8A8F9E] leading-relaxed mb-4 line-clamp-2">
                              {service.description || 'Atención premium personalizada con toalla caliente y navaja de precisión.'}
                            </p>
                          </div>

                          {/* Price & Action */}
                          <div className="pt-4 border-t border-[#232733] flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs font-black text-frank-orange">S/</span>
                              <span className="font-display text-2xl font-extrabold text-white tracking-wide group-hover:text-frank-orange transition-colors">
                                {Number(service.price).toFixed(2)}
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-[#8C93A4] group-hover:text-white flex items-center gap-1 transition-colors">
                              <span>Elegir</span>
                              <ChevronRight className="w-3.5 h-3.5 text-frank-orange" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#8C93A4] text-xs">
                    No hay servicios registrados actualmente para este barbero.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ornamental Divider with Scissors matching landing */}
        <div className="flex items-center justify-center gap-6 mt-16">
          <span className="h-[1px] w-32 bg-[#232733]" />
          <div className="text-frank-orange">
            <Scissors className="w-5 h-5 rotate-90 text-frank-orange opacity-80" />
          </div>
          <span className="h-[1px] w-32 bg-[#232733]" />
        </div>
      </div>
    </section>
  );
};
