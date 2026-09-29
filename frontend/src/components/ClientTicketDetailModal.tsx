import React from 'react';
import {
  X,
  User,
  Phone,
  Clock,
  Scissors,
  Calendar,
  MessageSquare,
  Play,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';
import { Barber, Service } from '../types';

export interface DetailItem {
  id: string;
  ticketCode: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  servicePrice: number;
  barberName: string;
  barberId?: string | null;
  chairNumber?: number;
  scheduledTime?: string;
  position?: number;
  type?: 'LLEGADA' | 'CITA';
  status?: string;
  notes?: string;
  estimatedWaitMin?: number;
  createdAt?: string;
  email?: string;
  isVIP?: boolean;
}

interface ClientTicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DetailItem | null;
  activeBarber: Barber;
  onCallToChair?: (item: DetailItem) => void;
  onSendWhatsApp?: (item: DetailItem) => void;
  onDelay?: (id: string) => void;
}

export const ClientTicketDetailModal: React.FC<ClientTicketDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  activeBarber,
  onCallToChair,
  onSendWhatsApp,
  onDelay
}) => {
  if (!isOpen || !item) return null;

  const isAppointment = item.type === 'CITA' || Boolean(item.scheduledTime);
  const cleanPhone = item.clientPhone ? item.clientPhone.replace(/[^0-9]/g, '') : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#12141C] border border-[#272C3B] rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-frank-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733] mb-6">
          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.25em] text-frank-gold block mb-1">
              EL CARTEL BARBERSHOP · DETALLE COMPLETO DEL CLIENTE
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-black text-frank-orange">
                #{item.ticketCode}
              </span>
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                  isAppointment
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {isAppointment ? `Cita Programada · ${item.scheduledTime || 'Horario Reservado'}` : 'Turno Inmediato (Orden de Llegada)'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#1C1F2A] text-[#8A8F9E] hover:text-white flex items-center justify-center transition-colors border border-[#2A3040] rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="space-y-6">
          {/* 1. Datos del Cliente */}
          <div className="bg-[#181B26] border border-[#252A38] rounded-2xl p-4 sm:p-5">
            <span className="text-[10px] uppercase font-bold text-[#7F8698] tracking-widest block mb-2">
              INFORMACIÓN DEL CLIENTE
            </span>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-frank-orange/20 text-frank-orange flex items-center justify-center font-display text-xl font-bold border border-frank-orange/30">
                  {item.clientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {item.clientName}
                    </h3>
                    {item.isVIP && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-frank-gold/20 text-frank-gold border border-frank-gold/30">
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8C93A4] mt-0.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-white font-medium">{item.clientPhone}</span>
                  </div>
                </div>
              </div>

              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* 2. Servicio & Barbero Asignado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Servicio */}
            <div className="bg-[#181B26] border border-[#252A38] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#7F8698] tracking-widest block mb-2 flex items-center gap-1.5">
                <Scissors className="w-3 h-3 text-frank-orange" />
                <span>Servicio Registrado</span>
              </span>
              <div className="text-sm font-bold text-white mb-1">
                {item.serviceName}
              </div>
              <div className="flex items-baseline gap-1.5 text-secondary font-display text-2xl font-black">
                <span className="text-xs text-frank-orange font-bold">S/</span>
                <span>{item.servicePrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Barbero */}
            <div className="bg-[#181B26] border border-[#252A38] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#7F8698] tracking-widest block mb-2 flex items-center gap-1.5">
                <User className="w-3 h-3 text-frank-gold" />
                <span>Barbero Asignado</span>
              </span>
              <div className="text-sm font-bold text-white mb-1">
                {item.barberName}
              </div>
              <div className="text-xs text-frank-gold font-medium">
                {item.chairNumber ? `Sillón #${item.chairNumber}` : 'Estación Designada'}
              </div>
            </div>
          </div>

          {/* 3. Horarios y Turno */}
          <div className="bg-[#181B26] border border-[#252A38] rounded-2xl p-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-[#7F8698] tracking-widest block">
              DETALLES DE AGENDA & ESPERA
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-[#7F8698] block">Modalidad:</span>
                <span className="font-bold text-white">
                  {isAppointment ? 'Cita Agendada' : 'Orden de Llegada'}
                </span>
              </div>

              {item.scheduledTime && (
                <div>
                  <span className="text-[#7F8698] block">Hora Programada:</span>
                  <span className="font-mono font-bold text-frank-gold">
                    {item.scheduledTime}
                  </span>
                </div>
              )}

              {item.position !== undefined && (
                <div>
                  <span className="text-[#7F8698] block">Posición en Fila:</span>
                  <span className="font-mono font-bold text-frank-orange">
                    #{item.position}
                  </span>
                </div>
              )}

              {item.estimatedWaitMin !== undefined && (
                <div>
                  <span className="text-[#7F8698] block">Tiempo Aprox. Espera:</span>
                  <span className="font-bold text-white">
                    {item.estimatedWaitMin} minutos
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Notas del Registro */}
          {item.notes && (
            <div className="bg-[#181B26] border border-[#252A38] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#7F8698] tracking-widest block mb-1">
                NOTAS / PREFERENCIAS DEL CLIENTE
              </span>
              <p className="text-xs text-[#E1E2E9] italic bg-[#12141C] p-3 rounded-xl border border-[#232733]">
                "{item.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-6 border-t border-[#232733] mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onDelay && (
              <button
                type="button"
                onClick={() => {
                  onDelay(item.id);
                  onClose();
                }}
                className="px-3.5 py-2.5 bg-[#1C1F2A] hover:bg-[#252A38] border border-[#2A3040] rounded-xl text-xs font-bold text-[#8C93A4] hover:text-white transition-all"
              >
                +15m Posponer
              </button>
            )}

            {onSendWhatsApp && (
              <button
                type="button"
                onClick={() => {
                  onSendWhatsApp(item);
                }}
                className="px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Avisar WhatsApp</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onCallToChair && (
              <button
                type="button"
                onClick={() => {
                  onCallToChair(item);
                  onClose();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-frank-orange/25 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Llamar a Sillón #{activeBarber.chairNumber}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#1A1D27] text-xs font-bold text-[#8C93A4] hover:text-white rounded-xl border border-[#2A3040]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
