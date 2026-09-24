import React, { useState } from 'react';
import { X, Clock, ShieldCheck, Coffee, Bell } from 'lucide-react';
import { Ticket, QueueStatus } from '../types';
import { delayTicket } from '../services/api';

interface LiveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  queueStatus: QueueStatus | null;
  onRefresh: () => void;
}

export const LiveTicketModal: React.FC<LiveTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  queueStatus,
  onRefresh
}) => {
  const [isDelaying, setIsDelaying] = useState(false);
  const [delaySuccess, setDelaySuccess] = useState('');

  if (!isOpen || !ticket) return null;

  const handleDelay = async () => {
    try {
      setIsDelaying(true);
      await delayTicket(ticket.id, 10);
      setDelaySuccess('Turno pospuesto 10 minutos con éxito');
      setTimeout(() => setDelaySuccess(''), 3500);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error al posponer turno');
    } finally {
      setIsDelaying(false);
    }
  };

  const isNextInLine = ticket.positionInQueue <= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#13151B] border border-[#232733] rounded-none p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow highlight */}
        <div className="absolute -right-16 -top-16 w-44 h-44 bg-frank-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#232733]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">
              TICKET EN TIEMPO REAL
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-[#1C1F2A] text-[#8A8F9E] hover:text-white flex items-center justify-center border border-[#232733]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Ticket Header */}
        <div className="bg-[#0D0E11] border border-[#232733] p-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E]">
              Tu Turno de Atención
            </span>
            {isNextInLine ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-frank-orange bg-frank-orange/15 border border-frank-orange/30 px-2.5 py-0.5 animate-pulse">
                <Bell className="w-3 h-3" /> Eres el siguiente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8A8F9E] bg-[#1C1F2A] px-2 py-0.5">
                En Cola de Espera
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-display text-5xl font-extrabold text-frank-orange tracking-wide">
              #{ticket.ticketCode}
            </span>
            <div className="text-right">
              <span className="text-2xl font-bold text-white tracking-tight">
                ~{ticket.estimatedWaitMinutes} min
              </span>
              <p className="text-[10px] text-[#8A8F9E]">Espera estimada</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#232733] flex items-center justify-between text-xs text-[#8A8F9E]">
            <span>Cliente: <strong className="text-white">{ticket.clientName}</strong></span>
            <span>Servicio: <strong className="text-frank-gold">{ticket.service?.name || 'Corte'}</strong></span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-semibold text-[#8A8F9E]">
            <span>
              Posición:{' '}
              <strong className="text-white">
                {ticket.positionInQueue === 0 ? 'En Sillón' : `${ticket.positionInQueue}º en espera`}
              </strong>
            </span>
            <span className="text-frank-orange font-bold">
              {ticket.positionInQueue <= 1 ? '85% Completado' : '45%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#232733] overflow-hidden">
            <div 
              className="h-full bg-frank-orange transition-all duration-700 shadow-[0_0_12px_rgba(196,98,45,0.6)]"
              style={{
                width: ticket.positionInQueue === 0 ? '100%' : ticket.positionInQueue === 1 ? '85%' : '45%'
              }}
            />
          </div>
        </div>

        {/* WhatsApp Notice */}
        <div className="bg-[#0D0E11] border border-[#232733] p-4 space-y-1.5 mb-5 text-xs text-[#8A8F9E]">
          <div className="flex items-center gap-2 text-secondary font-bold">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>Alerta de Turno Activa</span>
          </div>
          <p className="leading-relaxed">
            Puedes esperar cómodamente en cafeterías o comercios cercanos de Av. Los Héroes. Te avisaremos cuando falten 2 turnos.
          </p>
        </div>

        {delaySuccess && (
          <div className="mb-4 p-2.5 bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold text-center">
            {delaySuccess}
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={handleDelay}
            disabled={isDelaying}
            className="flex-1 h-12 bg-[#1C1F2A] hover:bg-[#232733] border border-[#232733] hover:border-frank-orange/50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Clock className="w-4 h-4 text-frank-orange" />
            <span>{isDelaying ? 'Pospone...' : '+10 min (Pospone Turno)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
