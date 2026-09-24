import React, { useState, useEffect } from 'react';
import { QueueStatus, Barber, Ticket } from '../types';
import { callNextTicket, markTicketNoShow } from '../services/api';
import { CheckCircle2, UserX, Clock, Scissors, Users, Award, Play, AlertCircle } from 'lucide-react';

interface BarberTerminalViewProps {
  queueStatus: QueueStatus | null;
  onRefresh: () => void;
}

export const BarberTerminalView: React.FC<BarberTerminalViewProps> = ({
  queueStatus,
  onRefresh
}) => {
  const barbers = queueStatus?.barbers || [];
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [isCalling, setIsCalling] = useState(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(1305); // Demo starts at 21m 45s

  // Select first active barber once available
  useEffect(() => {
    if (barbers.length > 0 && !selectedBarberId) {
      setSelectedBarberId(barbers[1]?.id || barbers[0]?.id);
    }
  }, [barbers, selectedBarberId]);

  // Chronometer count up
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];

  // Find ticket currently in chair for this barber (or fallback to any in chair)
  const currentInChair = queueStatus?.inChair.find(
    (t) => t.barberId === selectedBarberId
  ) || queueStatus?.inChair[0];

  // Incoming waiting queue
  const waitingQueue = queueStatus?.waiting || [];
  const nextTicket = waitingQueue[0];

  const handleCallNext = async () => {
    if (!currentBarber) return;
    try {
      setIsCalling(true);
      setActionMessage('');
      const res = await callNextTicket(currentBarber.id, currentInChair?.id);
      setActionMessage(res.message);
      setTimerSeconds(0); // Reset chrono for new client
      setTimeout(() => setActionMessage(''), 4000);
      onRefresh();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsCalling(false);
    }
  };

  const handleNoShow = async () => {
    if (!nextTicket) return;
    if (!window.confirm(`¿Marcar a ${nextTicket.clientName} (#${nextTicket.ticketCode}) como No-Show?`)) return;

    try {
      await markTicketNoShow(nextTicket.id);
      setActionMessage(`Turno #${nextTicket.ticketCode} marcado como no presentado`);
      setTimeout(() => setActionMessage(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-[#181C24]/95 backdrop-blur-xl border border-[#2B313E] rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      <div>
        {/* Terminal Header & Barber Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 bg-[#222733]/60 border border-[#2B313E] p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentBarber?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                alt={currentBarber?.name || 'Barbero'}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-secondary border-2 border-[#181C24] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-white">
                  {currentBarber?.name || 'David K.'}
                </h4>
                <select
                  value={selectedBarberId}
                  onChange={(e) => setSelectedBarberId(e.target.value)}
                  className="bg-[#111319] border border-[#2B313E] text-primary text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      Sillón #{b.chairNumber} ({b.name})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-secondary font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Estación Activa · {currentBarber?.specialty || 'Master Barber'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                Atendidos Hoy
              </span>
              <p className="text-xl font-black text-white">
                {queueStatus?.servedToday ?? 14} <span className="text-xs font-normal text-[#94A3B8]">cortes</span>
              </p>
            </div>
            <div className="text-right border-l border-[#2B313E] pl-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                En Fila de Espera
              </span>
              <p className="text-xl font-black text-primary">
                {queueStatus?.totalWaiting ?? 6} <span className="text-xs font-normal text-[#94A3B8]">clientes</span>
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Chair Card */}
        <div className="bg-[#0B0E13]/90 border border-[#2B313E] rounded-2xl p-5 mb-5 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-secondary/15 text-secondary border border-secondary/30 px-2.5 py-0.5 rounded-md">
                En Sillón Ahora
              </span>
              <span className="text-base font-bold text-white">
                {currentInChair ? `Ticket #${currentInChair.ticketCode} · ${currentInChair.clientName}` : 'Sillón Disponible'}
              </span>
            </div>

            {/* Chrono Timer */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary font-mono text-sm font-bold">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>{currentInChair ? formatTimer(timerSeconds) : '00:00'}</span>
            </div>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {currentInChair ? (
              <>
                <strong className="text-white">Servicio:</strong> {currentInChair.service?.name || 'Skin Fade Premium con Ritual de Toalla'}.{' '}
                <span className="text-primary font-semibold">Tacto y precisión artesanal.</span>
              </>
            ) : (
              'No hay ningún cliente actualmente en este sillón. Presiona el botón verde para llamar al siguiente.'
            )}
          </p>
        </div>

        {/* Mini Upcoming Queue Strip */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-[#94A3B8]">
            <span className="uppercase tracking-wider">Próximos en la cola:</span>
            <span>{waitingQueue.length} personas esperando</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1st waiting */}
            <div className="bg-[#222733] border border-primary/30 p-3 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  1º SIGUIENTE
                </span>
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-xs font-bold text-white truncate">
                {waitingQueue[0] ? `#${waitingQueue[0].ticketCode} ${waitingQueue[0].clientName}` : '#B-14 Marcos (En espera)'}
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                {waitingQueue[0]?.service?.name || 'Combo VIP'}
              </p>
            </div>

            {/* 2nd waiting */}
            <div className="bg-[#222733]/70 border border-[#2B313E] p-3 rounded-xl opacity-80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block mb-1">
                2º TURNO
              </span>
              <p className="text-xs font-bold text-white truncate">
                {waitingQueue[1] ? `#${waitingQueue[1].ticketCode} ${waitingQueue[1].clientName}` : '#B-15 Andrés'}
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                {waitingQueue[1]?.service?.name || 'Corte Clásico'}
              </p>
            </div>

            {/* 3rd waiting */}
            <div className="bg-[#222733]/40 border border-[#2B313E] p-3 rounded-xl opacity-60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block mb-1">
                3º TURNO
              </span>
              <p className="text-xs font-bold text-white truncate">
                {waitingQueue[2] ? `#${waitingQueue[2].ticketCode} ${waitingQueue[2].clientName}` : '#B-16 Carlos'}
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                {waitingQueue[2]?.service?.name || 'Ritual Barba'}
              </p>
            </div>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/40 rounded-xl text-primary text-xs font-bold text-center">
            {actionMessage}
          </div>
        )}
      </div>

      {/* Touch Buttons XL for Wet / Busy Hands */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleCallNext}
          disabled={isCalling}
          className="flex-1 min-h-[58px] rounded-xl bg-secondary text-[#0E1116] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-[0_0_24px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5 text-[#0E1116]" />
          <span>
            {isCalling ? 'Actualizando Cola...' : `Completar & Llamar al Siguiente ${nextTicket ? `(#${nextTicket.ticketCode})` : ''}`}
          </span>
        </button>

        <button
          onClick={handleNoShow}
          disabled={!nextTicket}
          className="h-[58px] px-5 rounded-xl bg-[#222733] hover:bg-red-950/40 border border-[#2B313E] hover:border-red-500/50 text-[#94A3B8] hover:text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-30"
          title="Saltar turno si el cliente no se encuentra en el local"
        >
          <UserX className="w-4 h-4" />
          <span>No-Show / Saltar</span>
        </button>
      </div>
    </div>
  );
};
