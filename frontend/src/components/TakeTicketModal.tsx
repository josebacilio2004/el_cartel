import React, { useState } from 'react';
import {
  X,
  Scissors,
  User,
  Phone,
  CheckCircle,
  Clock,
  Calendar,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Barber, Service } from '../types';
import { createTicket } from '../services/api';
import { parseSlotToIso } from '../utils/ticketHelper';

interface TakeTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  services: Service[];
  initialServiceName?: string;
  initialBarberId?: string;
  onTicketCreated: (ticket: any) => void;
}

export const TakeTicketModal: React.FC<TakeTicketModalProps> = ({
  isOpen,
  onClose,
  barbers: initialBarbers,
  services,
  initialServiceName,
  initialBarberId,
  onTicketCreated
}) => {
  const [bookingMode, setBookingMode] = useState<'queue' | 'appointment'>('queue');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+51 ');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(''); // '' = Cualquiera
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'dayAfter'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('04:15 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sincronizar barbero inicial cuando se pasa por prop o QR
  React.useEffect(() => {
    if (initialBarberId) {
      setSelectedBarberId(initialBarberId);
    }
  }, [initialBarberId, isOpen]);

  // Lista enriquecida de barberos con fotos oficiales
  const barbersList: Barber[] = (initialBarbers && initialBarbers.length > 0) ? initialBarbers : [
    {
      id: 'b1',
      name: 'Frank Master',
      chairNumber: 1,
      specialty: 'Fades & Ritual de Barba',
      status: 'ACTIVE',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'b2',
      name: 'Mateo Fade',
      chairNumber: 2,
      specialty: 'Diseños & Taper Fade',
      status: 'ACTIVE',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'b3',
      name: 'Santi Style',
      chairNumber: 3,
      specialty: 'Clásicos & Texturizados',
      status: 'ACTIVE',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    }
  ];

  // Horarios disponibles para citas
  const availableSlots = [
    { time: '10:00 AM', available: true },
    { time: '10:45 AM', available: true },
    { time: '11:30 AM', available: false }, // Ocupado
    { time: '12:15 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '02:45 PM', available: true },
    { time: '03:30 PM', available: false }, // Ocupado
    { time: '04:15 PM', available: true },
    { time: '05:00 PM', available: true },
    { time: '05:45 PM', available: true },
    { time: '06:30 PM', available: true },
    { time: '07:15 PM', available: false }, // Ocupado
    { time: '08:00 PM', available: true }
  ];

  // Sincronizar servicio inicial
  React.useEffect(() => {
    if (services.length > 0) {
      if (initialServiceName) {
        const found = services.find(s => s.name.toLowerCase().includes(initialServiceName.toLowerCase()));
        if (found) {
          setSelectedServiceId(found.id);
          return;
        }
      }
      if (!selectedServiceId) {
        setSelectedServiceId(services[0].id);
      }
    }
  }, [services, initialServiceName, selectedServiceId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim() === '+51') {
      setErrorMessage('Por favor ingresa tu número telefónico / WhatsApp');
      return;
    }
    if (!selectedServiceId) {
      setErrorMessage('Por favor selecciona un servicio');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Sanitizar teléfono para enviar
      const cleanPhone = clientPhone.trim();

      const newTicket = await createTicket({
        clientName: clientName.trim(),
        clientPhone: cleanPhone,
        serviceId: selectedServiceId,
        barberId: selectedBarberId ? selectedBarberId : null,
        scheduledTime: bookingMode === 'appointment' ? selectedTimeSlot : undefined,
        scheduledDate: bookingMode === 'appointment' ? selectedDate : undefined
      });

      // Persistir ticket del usuario
      localStorage.setItem('el_cartel_user_ticket', JSON.stringify(newTicket));

      // Sincronizar en cola unificada local y appointments
      try {
        const storedQueue = localStorage.getItem('el_cartel_unified_queue');
        let currentQueue = storedQueue ? JSON.parse(storedQueue) : [];
        const barberObj = barbersList.find(b => b.id === (newTicket.barberId || selectedBarberId));
        const serviceObj = services.find(s => s.id === (newTicket.serviceId || selectedServiceId));
        
        const queueEntry = {
          id: newTicket.id,
          ticketCode: newTicket.ticketCode,
          clientName: newTicket.clientName,
          clientPhone: newTicket.clientPhone,
          serviceName: serviceObj?.name || 'Corte Cartel',
          servicePrice: Number(serviceObj?.price) || 35,
          barberName: barberObj?.name || 'Cualquier Barbero',
          barberId: barberObj?.id || selectedBarberId || null,
          scheduledTime: bookingMode === 'appointment' ? selectedTimeSlot : undefined,
          position: currentQueue.length + 1,
          type: bookingMode === 'appointment' ? 'CITA' : 'LLEGADA',
          estimatedWaitMin: (currentQueue.length + 1) * 20
        };

        currentQueue = [...currentQueue.filter((q: any) => q.id !== queueEntry.id), queueEntry];
        localStorage.setItem('el_cartel_unified_queue', JSON.stringify(currentQueue));

        if (bookingMode === 'appointment') {
          const storedApts = localStorage.getItem('el_cartel_appointments_list');
          let currentApts = storedApts ? JSON.parse(storedApts) : [];
          const exactIsoStartTime = parseSlotToIso(selectedTimeSlot, selectedDate);
          const durationMins = serviceObj?.durationMinutes || 35;
          const endIsoTime = new Date(new Date(exactIsoStartTime).getTime() + durationMins * 60000).toISOString();

          const newApt = {
            id: `apt-cli-${Date.now()}`,
            clientName: newTicket.clientName,
            clientPhone: newTicket.clientPhone,
            barberId: barberObj?.id || 'b1',
            serviceId: serviceObj?.id || 's1',
            startTime: exactIsoStartTime,
            endTime: endIsoTime,
            scheduledTime: selectedTimeSlot,
            ticketCode: newTicket.ticketCode,
            status: 'CONFIRMED' as const,
            notes: `Cita reservada desde la Web para las ${selectedTimeSlot}`,
            barber: barberObj,
            service: serviceObj
          };
          currentApts = [newApt, ...currentApts];
          localStorage.setItem('el_cartel_appointments_list', JSON.stringify(currentApts));
        }

        // Notificar en tiempo real a cualquier vista montada
        window.dispatchEvent(new CustomEvent('cartel_ticket_created', { detail: newTicket }));
      } catch (e) {
        console.warn('Error al actualizar cola compartida:', e);
      }

      onTicketCreated(newTicket);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al solicitar el turno');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBarber = barbersList.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-[#12141C] border border-[#232733] p-5 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-frank-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-frank-gold block mb-1">
              EL CARTEL BARBERSHOP · SAN MIGUEL
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide leading-none">
              RESERVAR CITA / TURNO VIRTUAL
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-[#1C1F2A] text-[#8A8F9E] hover:text-white flex items-center justify-center transition-colors border border-[#232733] rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Modalidad: Turno en Fila vs Cita Agendada */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0D0E12] rounded-2xl border border-[#232733] mt-4">
          <button
            type="button"
            onClick={() => setBookingMode('queue')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              bookingMode === 'queue'
                ? 'bg-gradient-to-r from-frank-orange to-[#A84F22] text-white shadow-lg shadow-frank-orange/20'
                : 'text-[#8C93A4] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Turno Inmediato (Hoy)</span>
          </button>

          <button
            type="button"
            onClick={() => setBookingMode('appointment')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              bookingMode === 'appointment'
                ? 'bg-gradient-to-r from-frank-orange to-[#A84F22] text-white shadow-lg shadow-frank-orange/20'
                : 'text-[#8C93A4] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Cita (Horarios)</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <X className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left">
          {/* 1. Nombre Completo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F9E]" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: José Anthony Bacilio"
                className="w-full h-11 pl-10 pr-4 bg-[#0D0E12] border border-[#232733] rounded-xl text-white text-xs focus:outline-none focus:border-frank-orange transition-all placeholder:text-[#525866]"
              />
            </div>
          </div>

          {/* 2. Teléfono Celular (WhatsApp de aviso) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-1.5">
              Teléfono Celular (WhatsApp de aviso) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F9E]" />
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+51 906 623 068"
                className="w-full h-11 pl-10 pr-4 bg-[#0D0E12] border border-[#232733] rounded-xl text-white text-xs focus:outline-none focus:border-frank-orange transition-all placeholder:text-[#525866]"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#71788A]">
              Te enviaremos la confirmación del turno y avisos en vivo por WhatsApp.
            </p>
          </div>

          {/* 3. SELECCIÓN DE BARBERO CON PREVISUALIZACIÓN DE FOTOGRAFÍAS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-2 flex items-center justify-between">
              <span>Elige a tu Barbero</span>
              <span className="text-[10px] text-frank-gold font-semibold">Fotografías reales del Staff</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Opción 1: Cualquier Barbero Disponible */}
              <div
                onClick={() => setSelectedBarberId('')}
                className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center relative ${
                  selectedBarberId === ''
                    ? 'bg-frank-orange/15 border-frank-orange shadow-md shadow-frank-orange/20 ring-1 ring-frank-orange'
                    : 'bg-[#0D0E12] border-[#232733] hover:border-[#383F54]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E222D] to-[#141720] border border-[#2D3344] flex items-center justify-center mb-2 text-frank-orange">
                  <Scissors className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-xs">Cualquiera</div>
                <div className="text-[10px] text-secondary font-semibold mt-0.5">Más Rápido</div>
                {selectedBarberId === '' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-frank-orange rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Barbero 1: Frank Master */}
              {barbersList.map((barber) => {
                const isSelected = selectedBarberId === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'bg-frank-orange/15 border-frank-orange shadow-md shadow-frank-orange/20 ring-1 ring-frank-orange'
                        : 'bg-[#0D0E12] border-[#232733] hover:border-[#383F54]'
                    }`}
                  >
                    <div className="relative mb-2">
                      <img
                        src={barber.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                        alt={barber.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#2D3344]"
                      />
                      <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-[#141720] text-frank-gold border border-[#2B3140] px-1 rounded-full">
                        #{barber.chairNumber}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs truncate max-w-[100px]">{barber.name}</div>
                    <div className="text-[10px] text-[#71788A] truncate max-w-[100px] mt-0.5">{barber.specialty?.split('·')[0] || 'Master'}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-frank-orange rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. MODO AGENDAR: SELECTOR DE FECHA Y HORARIOS DISPONIBLES */}
          {bookingMode === 'appointment' && (
            <div className="p-3.5 bg-[#0D0E12] rounded-2xl border border-[#232733] space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#8A8F9E] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-frank-orange" />
                  <span>Día de Atención</span>
                </span>
                <div className="flex items-center gap-1 bg-[#151821] p-1 rounded-xl border border-[#232733]">
                  {(['today', 'tomorrow', 'dayAfter'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        selectedDate === d
                          ? 'bg-frank-orange text-white'
                          : 'text-[#8C93A4] hover:text-white'
                      }`}
                    >
                      {d === 'today' ? 'Hoy' : d === 'tomorrow' ? 'Mañana' : 'Pasado'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#71788A] mb-2">
                  Horarios Disponibles para Reserva:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center border ${
                          !slot.available
                            ? 'bg-[#14161F]/40 border-[#232733] text-[#4F5568] cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-gradient-to-r from-frank-orange to-[#A84F22] border-frank-orange text-white shadow-md shadow-frank-orange/20'
                            : 'bg-[#151821] border-[#282E3E] text-[#C1C6D4] hover:border-frank-orange hover:text-white'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className={`text-[9px] mt-0.5 ${!slot.available ? 'text-[#4F5568]' : isSelected ? 'text-white/80' : 'text-secondary'}`}>
                          {slot.available ? 'Disponible' : 'Ocupado'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. Selector de Servicio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-2">
              Servicio Requerido *
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {services.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-frank-orange/15 border-frank-orange shadow-md shadow-frank-orange/20 ring-1 ring-frank-orange'
                        : 'bg-[#0D0E12] border-[#232733] hover:border-[#383F54]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        {srv.name}
                      </p>
                      <p className="text-[11px] text-[#8A8F9E] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-frank-gold" /> {srv.durationMinutes} min
                        </span>
                        <span>•</span>
                        <span className="text-secondary font-bold">
                          S/. {typeof srv.price === 'number' ? srv.price.toFixed(2) : Number(String(srv.price).replace(/[^0-9.]/g, '')).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-frank-orange" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-3 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white font-extrabold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-frank-orange/25 rounded-2xl"
          >
            {isSubmitting ? (
              <span>Confirmando Reserva...</span>
            ) : bookingMode === 'queue' ? (
              <>
                <Scissors className="w-4 h-4" />
                <span>CONFIRMAR MI TURNO EN FILA (HOY)</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>CONFIRMAR CITA PARA LAS {selectedTimeSlot}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
