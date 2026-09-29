import React, { useState } from 'react';
import {
  X,
  Play,
  Clock,
  Calendar,
  Zap,
  User,
  Scissors,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Barber } from '../types';

export interface QueuedCustomer {
  id: string;
  ticketCode: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  servicePrice: number;
  barberName: string;
  barberId?: string | null;
  scheduledTime?: string;
  position?: number;
  type: 'LLEGADA' | 'CITA';
  estimatedWaitMin?: number;
}

interface AssignChairModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBarber: Barber;
  scheduledClients: QueuedCustomer[];
  walkInClients: QueuedCustomer[];
  onSelectClient: (client: QueuedCustomer) => void;
}

export const AssignChairModal: React.FC<AssignChairModalProps> = ({
  isOpen,
  onClose,
  activeBarber,
  scheduledClients,
  walkInClients,
  onSelectClient
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'walkin'>('all');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#12141C] border border-[#272C3B] rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-[#1C202C] text-[#8C93A4] hover:text-white flex items-center justify-center border border-[#2A3040]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            SILLÓN #{activeBarber.chairNumber} DISPONIBLE · {activeBarber.name}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          ASIGNAR PRÓXIMO CLIENTE AL SILLÓN
        </h3>
        <p className="text-xs text-[#8A8F9E] mb-6">
          Selecciona al cliente que deseas hacer pasar a tu sillón según el horario programado o por orden de llegada a tu criterio profesional:
        </p>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#171A24] border border-[#262B3A] rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-frank-orange text-white shadow-md shadow-frank-orange/20'
                : 'text-[#8C93A4] hover:text-white'
            }`}
          >
            <span>Todos en Espera ({scheduledClients.length + walkInClients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-[#8C93A4] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Citas Programadas ({scheduledClients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('walkin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'walkin'
                ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                : 'text-[#8C93A4] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Orden de Llegada ({walkInClients.length})</span>
          </button>
        </div>

        {/* Client Lists */}
        <div className="space-y-3">
          {/* Citas Programadas Section */}
          {(activeTab === 'all' || activeTab === 'appointments') && scheduledClients.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-[11px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-2 px-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Citas Programadas para Hoy (Orden Cronológico)</span>
              </div>
              {scheduledClients.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#181B26] hover:bg-[#1E2230] border border-[#2A3040] hover:border-blue-500/50 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex flex-col items-center justify-center text-center">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono text-[10px] font-bold text-white leading-tight mt-0.5">
                        {client.scheduledTime || 'CITA'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{client.clientName}</span>
                        <span className="font-mono text-xs text-frank-orange bg-frank-orange/15 px-2 py-0.5 rounded font-bold">
                          {client.ticketCode}
                        </span>
                      </div>
                      <div className="text-xs text-[#8C93A4] mt-0.5">
                        {client.serviceName} · <span className="text-secondary font-bold">S/ {client.servicePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectClient(client)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Sentar en Sillón</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Clientes por Orden de Llegada Section */}
          {(activeTab === 'all' || activeTab === 'walkin') && walkInClients.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2 px-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Clientes en Sala (Por Orden de Llegada)</span>
              </div>
              {walkInClients.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#181B26] hover:bg-[#1E2230] border border-[#2A3040] hover:border-emerald-500/50 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] uppercase font-bold text-emerald-400">Turno</span>
                      <span className="font-mono text-xs font-bold text-white leading-tight">
                        #{client.position || 1}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{client.clientName}</span>
                        <span className="font-mono text-xs text-frank-orange bg-frank-orange/15 px-2 py-0.5 rounded font-bold">
                          {client.ticketCode}
                        </span>
                      </div>
                      <div className="text-xs text-[#8C93A4] mt-0.5">
                        {client.serviceName} · <span className="text-secondary font-bold">S/ {client.servicePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectClient(client)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Sentar en Sillón</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {scheduledClients.length === 0 && walkInClients.length === 0 && (
            <div className="py-12 text-center text-[#8C93A4] bg-[#161822] rounded-2xl border border-[#242836]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">¡No hay clientes en espera para este sillón!</p>
              <p className="text-xs text-[#7F8698] mt-1">Todos tus turnos y citas están al día.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#232733] mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1C202C] hover:bg-[#252A38] text-xs font-bold text-[#8C93A4] hover:text-white rounded-xl border border-[#2B313E] transition-all"
          >
            Mantener Sillón Disponible
          </button>
        </div>
      </div>
    </div>
  );
};
