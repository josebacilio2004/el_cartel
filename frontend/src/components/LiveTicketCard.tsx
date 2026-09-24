import React, { useState } from 'react';
import { Ticket, QueueStatus } from '../types';
import { Clock, Users, Bell, Coffee, MoreHorizontal, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { delayTicket } from '../services/api';

interface LiveTicketCardProps {
  userTicket: Ticket | null;
  queueStatus: QueueStatus | null;
  onRefresh: () => void;
}

export const LiveTicketCard: React.FC<LiveTicketCardProps> = ({
  userTicket,
  queueStatus,
  onRefresh
}) => {
  const [isDelaying, setIsDelaying] = useState(false);
  const [delaySuccess, setDelaySuccess] = useState('');

  // Fallback demo ticket if user hasn't created one yet
  const displayTicket = userTicket || (queueStatus?.waiting && queueStatus.waiting[0]) || {
    id: 'demo-b14',
    ticketCode: 'B-14',
    clientName: 'Marcos R. (Demo)',
    clientPhone: '+34 611 223 344',
    service: {
      id: 'srv-1',
      name: 'The Sovereign Combo VIP',
      durationMinutes: 45,
      price: 32,
      category: 'COMBO',
      isActive: true
    },
    positionInQueue: 1,
    estimatedWaitMinutes: 18,
    status: 'WAITING' as const,
    createdAt: new Date().toISOString()
  };

  const handleDelay = async () => {
    if (!displayTicket.id || displayTicket.id.startsWith('demo')) {
      setDelaySuccess('Pospuesto +10 min (Modo Simulación)');
      setTimeout(() => setDelaySuccess(''), 3000);
      return;
    }
    try {
      setIsDelaying(true);
      await delayTicket(displayTicket.id, 10);
      setDelaySuccess('¡Turno pospuesto 10 minutos con éxito!');
      setTimeout(() => setDelaySuccess(''), 3500);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error al posponer turno');
    } finally {
      setIsDelaying(false);
    }
  };

  const isNextInLine = displayTicket.positionInQueue <= 1;

  return (
    <div className="bg-[#181C24]/95 backdrop-blur-xl border border-[#2B313E] rounded-3xl p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between">
      {/* Glow highlight */}
      <div className="absolute -right-16 -top-16 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2B313E]/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-secondary">
              En Tiempo Real
            </span>
          </div>
          <span className="text-xs font-bold text-[#94A3B8] bg-[#111319] px-2.5 py-1 rounded-md border border-[#2B313E]">
            The Sovereign Atelier
          </span>
        </div>

        {/* Big Ticket Header */}
        <div className="bg-[#0B0E13]/90 border border-[#2B313E] rounded-2xl p-5 mb-5 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Tu Turno de Corte
            </span>
            {isNextInLine ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary bg-primary/15 border border-primary/30 px-2.5 py-0.5 rounded-full animate-pulse-subtle">
                <Bell className="w-3 h-3" /> Eres el siguiente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#94A3B8] bg-[#222733] px-2 py-0.5 rounded-full">
                En Cola de Espera
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight font-sans drop-shadow-[0_0_12px_rgba(217,155,38,0.25)]">
              #{displayTicket.ticketCode}
            </span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ~{displayTicket.estimatedWaitMinutes} min
              </span>
              <p className="text-[11px] text-[#94A3B8] font-medium">Espera estimada</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#2B313E]/50 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Cliente: <strong className="text-white">{displayTicket.clientName}</strong></span>
            <span>Servicio: <strong className="text-primary">{displayTicket.service?.name || 'Corte Premium'}</strong></span>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-semibold text-[#94A3B8]">
            <span>
              Posición en fila:{' '}
              <strong className="text-white">
                {displayTicket.positionInQueue === 0 ? 'En Sillón' : `${displayTicket.positionInQueue}º en espera`}
              </strong>
            </span>
            <span className="text-primary font-bold">
              {displayTicket.positionInQueue <= 1 ? '85% Completado' : '50% Completado'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#222733] overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-primary via-warning to-secondary rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(217,155,38,0.4)]"
              style={{
                width: displayTicket.positionInQueue === 0 ? '100%' : displayTicket.positionInQueue === 1 ? '85%' : '45%'
              }}
            />
          </div>
        </div>

        {/* Proximity & WhatsApp Notice */}
        <div className="bg-[#111319] border border-[#2B313E] p-4 rounded-2xl space-y-1.5 mb-5">
          <div className="flex items-center gap-2 text-secondary text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>Alerta WhatsApp Activa: Notificación al turno #{displayTicket.ticketCode}</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Disfruta de café espresso de cortesía, prensa o nuestro bourbon selecto en el lounge mientras avanza tu posición.
          </p>
        </div>

        {delaySuccess && (
          <div className="mb-4 p-3 bg-secondary/10 border border-secondary/30 rounded-xl text-secondary text-xs font-bold text-center">
            {delaySuccess}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 pt-1">
        <button
          onClick={handleDelay}
          disabled={isDelaying}
          className="flex-1 h-12 rounded-xl bg-[#222733] hover:bg-[#2B313E] border border-[#2B313E] hover:border-primary/40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <Clock className="w-4 h-4 text-primary" />
          <span>{isDelaying ? 'Pospone...' : '+10 min (Cortesía)'}</span>
        </button>

        <a
          href="#lounge"
          className="flex-1 h-12 rounded-xl bg-[#222733] hover:bg-[#2B313E] border border-[#2B313E] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <Coffee className="w-4 h-4 text-warning" />
          <span>Lounge & Bar</span>
        </a>
      </div>
    </div>
  );
};
