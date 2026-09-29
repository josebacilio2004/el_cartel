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
import { AdminDashboard } from './components/AdminDashboard';
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
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<'client' | 'terminal'>('client');

  // Detectar QR code o enlace directo (?barberId=b1 o #reservar)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bId = params.get('barberId');
      const hash = window.location.hash;
      if (bId) {
        setSelectedBarberId(bId);
        setIsTakeTicketOpen(true);
      } else if (hash === '#reservar') {
        setIsTakeTicketOpen(true);
      }
    } catch (e) {
      console.warn('Error al leer parámetros URL:', e);
    }
  }, []);

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

    // Escuchar eventos globales de tickets creados localmente
    const handleLocalTicket = (e: any) => {
      loadData();
    };
    window.addEventListener('cartel_ticket_created', handleLocalTicket);

    return () => {
      unsubscribe();
      window.removeEventListener('cartel_ticket_created', handleLocalTicket);
    };
  }, [userTicket]);

  const handleTicketCreated = (newTicket: Ticket) => {
    setUserTicket(newTicket);
    setIsLiveTicketOpen(true);
    loadData();
  };

  const handleSelectServiceFromCard = (serviceName: string, barberId?: string) => {
    setSelectedServiceName(serviceName);
    if (barberId) {
      setSelectedBarberId(barberId);
    }
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
      {currentMode === 'client' ? (
        <>
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

            {/* 2. Nuestros Servicios Agrupados por Barbero */}
            <ServicesSection
              barbers={barbers}
              services={services}
              onSelectService={handleSelectServiceFromCard}
            />

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
          </main>

          {/* Footer oficial de EL CARTEL */}
          <Footer />
        </>
      ) : (
        /* Panel Administrativo & Staff con Menú Lateral Modular */
        <main className="flex-1 w-full">
          <AdminDashboard
            queueStatus={queueStatus}
            barbers={barbers}
            services={services}
            onRefresh={loadData}
            onExitToClient={() => setCurrentMode('client')}
            onLogout={handleStaffLogout}
          />
        </main>
      )}

      {/* Modal para solicitar turno / cita */}
      <TakeTicketModal
        isOpen={isTakeTicketOpen}
        onClose={() => {
          setIsTakeTicketOpen(false);
          setSelectedBarberId('');
        }}
        barbers={barbers}
        services={services}
        initialServiceName={selectedServiceName}
        initialBarberId={selectedBarberId}
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
