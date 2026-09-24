import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { StylesGallerySection } from './components/StylesGallerySection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { TakeTicketModal } from './components/TakeTicketModal';
import { LiveTicketModal } from './components/LiveTicketModal';
import { BarberLoginModal } from './components/BarberLoginModal';
import { BarberTerminalView } from './components/BarberTerminalView';
import { fetchQueueStatus, fetchBarbers, fetchServices, subscribeToQueueUpdates } from './services/api';
import { QueueStatus, Barber, Service, Ticket } from './types';
import { ArrowLeft, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [userTicket, setUserTicket] = useState<Ticket | null>(null);
  const [isTakeTicketOpen, setIsTakeTicketOpen] = useState(false);
  const [isLiveTicketOpen, setIsLiveTicketOpen] = useState(false);
  const [isBarberLoginOpen, setIsBarberLoginOpen] = useState(false);
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('el_cartel_staff_auth') === 'true';
  });
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<'client' | 'terminal'>('client');

  const loadData = async () => {
    try {
      const [statusData, barbersData, servicesData] = await Promise.all([
        fetchQueueStatus().catch(() => null),
        fetchBarbers().catch(() => []),
        fetchServices().catch(() => [])
      ]);

      if (statusData) setQueueStatus(statusData);
      if (barbersData.length > 0) setBarbers(barbersData);
      if (servicesData.length > 0) setServices(servicesData);
    } catch (err) {
      console.warn('Backend en modo offline o sincronizando...');
    }
  };

  useEffect(() => {
    loadData();

    // Suscripción reactiva en tiempo real vía SSE
    const unsubscribe = subscribeToQueueUpdates((updatedStatus) => {
      setQueueStatus(updatedStatus);

      if (userTicket) {
        const foundWaiting = updatedStatus.waiting.find((t) => t.id === userTicket.id);
        const foundInChair = updatedStatus.inChair.find((t) => t.id === userTicket.id);
        if (foundWaiting) setUserTicket(foundWaiting);
        else if (foundInChair) setUserTicket(foundInChair);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userTicket]);

  const handleTicketCreated = (newTicket: Ticket) => {
    setUserTicket(newTicket);
    setIsLiveTicketOpen(true);
    loadData();
  };

  const handleSelectServiceFromCard = (serviceName: string) => {
    setSelectedServiceName(serviceName);
    setIsTakeTicketOpen(true);
  };

  // Manejo de cambio de modo con autenticación para el Terminal
  const handleToggleMode = (mode: 'client' | 'terminal') => {
    if (mode === 'terminal') {
      if (isStaffLoggedIn) {
        setCurrentMode('terminal');
      } else {
        setIsBarberLoginOpen(true);
      }
    } else {
      setCurrentMode('client');
    }
  };

  const handleLoginSuccess = () => {
    setIsStaffLoggedIn(true);
    setCurrentMode('terminal');
  };

  const handleStaffLogout = () => {
    localStorage.removeItem('el_cartel_staff_auth');
    localStorage.removeItem('el_cartel_active_barber');
    setIsStaffLoggedIn(false);
    setCurrentMode('client');
  };

  return (
    <div className="min-h-screen bg-[#0D0E11] text-[#E1E2E9] flex flex-col justify-between selection:bg-frank-orange selection:text-white">
      {/* Navbar oficial EL CARTEL */}
      <Navbar
        onOpenTakeTicket={() => {
          setSelectedServiceName('');
          setIsTakeTicketOpen(true);
        }}
        currentMode={currentMode}
        onToggleMode={handleToggleMode}
        isStaffLoggedIn={isStaffLoggedIn}
        onStaffLogout={handleStaffLogout}
      />

      <main className="flex-1 w-full">
        {currentMode === 'client' ? (
          <>
            {/* 1. Hero Section con video fondo_barberia.mp4 y marca EL CARTEL BARBERSHOP */}
            <HeroSection
              userTicket={userTicket}
              queueStatus={queueStatus}
              onOpenTakeTicket={() => {
                setSelectedServiceName('');
                setIsTakeTicketOpen(true);
              }}
              onOpenLiveTicket={() => setIsLiveTicketOpen(true)}
            />

            {/* 2. Nuestros Servicios */}
            <ServicesSection onSelectService={handleSelectServiceFromCard} />

            {/* 3. Estilos & Cortes (Galería Grayscale) */}
            <StylesGallerySection
              onSelectStyle={(style) => {
                setSelectedServiceName(`Corte ${style}`);
                setIsTakeTicketOpen(true);
              }}
            />

            {/* 4. Visítanos / Ubicación (San Miguel, Lima, Perú) */}
            <LocationSection
              onOpenTakeTicket={() => {
                setSelectedServiceName('');
                setIsTakeTicketOpen(true);
              }}
            />
          </>
        ) : (
          /* Terminal Táctil del Barbero Protegido por Login */
          <div className="pt-28 pb-16 px-4 sm:px-8 max-w-5xl mx-auto animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <button
                onClick={() => setCurrentMode('client')}
                className="flex items-center gap-2 text-xs font-bold text-[#8A8F9E] hover:text-white transition-colors bg-[#13151B] px-4 py-2 border border-[#232733]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la Web Principal</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 border border-secondary/30">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  Sesión Activa · Staff El Cartel
                </span>
                <button
                  onClick={loadData}
                  className="p-2 bg-[#13151B] border border-[#232733] text-[#8A8F9E] hover:text-white"
                  title="Recargar estado"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleStaffLogout}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-bold hover:bg-red-900/60 transition-all"
                  title="Cerrar Sesión del Staff"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="font-display text-4xl font-bold text-white tracking-wide">
                TERMINAL DE ATENCIÓN DE SILLONES · EL CARTEL
              </h2>
              <p className="text-xs text-[#8A8F9E]">
                Control táctil de clientes en espera, llamado a sillón y tiempos en vivo.
              </p>
            </div>

            <BarberTerminalView
              queueStatus={queueStatus}
              onRefresh={loadData}
            />
          </div>
        )}
      </main>

      {/* Footer oficial de EL CARTEL */}
      <Footer />

      {/* Modal para solicitar turno / cita */}
      <TakeTicketModal
        isOpen={isTakeTicketOpen}
        onClose={() => setIsTakeTicketOpen(false)}
        barbers={barbers}
        services={services}
        initialServiceName={selectedServiceName}
        onTicketCreated={handleTicketCreated}
      />

      {/* Modal para visualizar turno virtual en vivo */}
      <LiveTicketModal
        isOpen={isLiveTicketOpen}
        onClose={() => setIsLiveTicketOpen(false)}
        ticket={userTicket}
        queueStatus={queueStatus}
        onRefresh={loadData}
      />

      {/* Modal de Login Exclusivo para Barberos / Staff */}
      <BarberLoginModal
        isOpen={isBarberLoginOpen}
        onClose={() => setIsBarberLoginOpen(false)}
        barbers={barbers}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
