import React, { useState } from 'react';
import { X, Scissors, User, Phone, CheckCircle, Clock } from 'lucide-react';
import { Barber, Service } from '../types';
import { createTicket } from '../services/api';

interface TakeTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  services: Service[];
  initialServiceName?: string;
  onTicketCreated: (ticket: any) => void;
}

export const TakeTicketModal: React.FC<TakeTicketModalProps> = ({
  isOpen,
  onClose,
  barbers,
  services,
  initialServiceName,
  onTicketCreated
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (!selectedServiceId) {
      setErrorMessage('Por favor selecciona un servicio');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const newTicket = await createTicket({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        serviceId: selectedServiceId,
        barberId: selectedBarberId ? selectedBarberId : null
      });

      onTicketCreated(newTicket);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al solicitar el turno');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#13151B] border border-[#232733] rounded-none p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-frank-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-frank-gold block mb-1">
              EL CARTEL BARBERSHOP · LIMA
            </span>
            <h3 className="font-display text-3xl font-bold text-white tracking-wide leading-none">
              RESERVAR CITA / TURNO VIRTUAL
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-[#1C1F2A] text-[#8A8F9E] hover:text-white flex items-center justify-center transition-colors border border-[#232733]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-2 font-sans">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8F9E]" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Lucas Morales"
                className="w-full h-12 pl-11 pr-4 bg-[#0D0E11] border border-[#232733] text-white text-sm focus:outline-none focus:border-frank-orange transition-all placeholder:text-[#475569]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-2 font-sans">
              Teléfono Celular (WhatsApp de aviso)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8F9E]" />
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+51 987 654 321"
                className="w-full h-12 pl-11 pr-4 bg-[#0D0E11] border border-[#232733] text-white text-sm focus:outline-none focus:border-frank-orange transition-all placeholder:text-[#475569]"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#8A8F9E]">
              Te notificaremos en tiempo real cuando tu corte esté a 2 turnos de distancia.
            </p>
          </div>

          {/* Service Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-2 font-sans">
              Servicio Requerido *
            </label>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-3 border cursor-pointer transition-all flex items-center justify-between ${
                    selectedServiceId === srv.id
                      ? 'bg-frank-orange/10 border-frank-orange shadow-[0_0_16px_rgba(196,98,45,0.25)]'
                      : 'bg-[#0D0E11] border-[#232733] hover:border-[#475569]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      {srv.name}
                    </p>
                    <p className="text-xs text-[#8A8F9E] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-frank-gold" /> {srv.durationMinutes} min
                      </span>
                      <span>•</span>
                      <span className="text-frank-orange font-bold">S/ {Number(srv.price).toFixed(2)}</span>
                    </p>
                  </div>
                  {selectedServiceId === srv.id && (
                    <CheckCircle className="w-5 h-5 text-frank-orange" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 mt-4 bg-frank-orange hover:bg-frank-orange-hover text-white font-extrabold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_4px_24px_rgba(196,98,45,0.4)]"
          >
            {isSubmitting ? (
              <span>Generando Turno...</span>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>CONFIRMAR MI TURNO VIRTUAL</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
