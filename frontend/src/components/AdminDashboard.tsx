import React, { useState, useEffect } from 'react';
import {
  Users,
  Scissors,
  Calendar,
  Tag,
  UserCheck,
  BarChart3,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  RefreshCw,
  ExternalLink,
  Flame,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { QueueStatus, Barber, Service, Ticket, ClientRecord } from '../types';
import { BarberTerminalView } from './BarberTerminalView';
import { fetchClients, createTicket } from '../services/api';

interface AdminDashboardProps {
  queueStatus: QueueStatus | null;
  barbers: Barber[];
  services: Service[];
  onRefresh: () => void;
  onExitToClient: () => void;
  onLogout: () => void;
}

type TabType = 'clients' | 'terminal' | 'appointments' | 'services' | 'staff' | 'metrics';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  queueStatus,
  barbers,
  services,
  onRefresh,
  onExitToClient,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('clients');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState<'all' | 'vip' | 'waiting'>('all');
  const [selectedClientForNotes, setSelectedClientForNotes] = useState<ClientRecord | null>(null);

  // Modal para registrar nuevo cliente en cola
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickServiceId, setQuickServiceId] = useState(services[0]?.id || '');
  const [quickBarberId, setQuickBarberId] = useState<string>('');
  const [quickNotes, setQuickNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Cargar clientes
  const loadClientsData = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      console.warn('Error cargando clientes:', err);
    }
  };

  useEffect(() => {
    loadClientsData();
  }, [queueStatus]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtrado de clientes
  const filteredClients = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.lastService && c.lastService.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    if (clientFilter === 'vip') return c.isVIP || c.totalVisits >= 2;
    if (clientFilter === 'waiting') {
      return (
        queueStatus?.waiting.some((t) => t.clientPhone === c.phone || t.clientName.toLowerCase() === c.name.toLowerCase()) ||
        queueStatus?.inChair.some((t) => t.clientPhone === c.phone || t.clientName.toLowerCase() === c.name.toLowerCase())
      );
    }
    return true;
  });

  // Envío de nuevo cliente rápido
  const handleQuickAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      alert('Por favor ingresa nombre y teléfono del cliente');
      return;
    }

    try {
      setIsSubmitting(true);
      const targetServiceId = quickServiceId || services[0]?.id || 'serv-fade';
      await createTicket({
        clientName: quickName.trim(),
        clientPhone: quickPhone.trim(),
        serviceId: targetServiceId,
        barberId: quickBarberId || undefined
      });

      showNotification(`¡Cliente ${quickName} ingresado con éxito a la fila!`);
      setQuickName('');
      setQuickPhone('');
      setQuickNotes('');
      setIsQuickAddOpen(false);
      onRefresh();
      loadClientsData();
    } catch (err: any) {
      alert(err.message || 'Error al registrar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Añadir cliente existente directo a la fila
  const handleAddExistingClientToQueue = async (client: ClientRecord) => {
    try {
      const targetServiceId = services[0]?.id || 'serv-fade';
      await createTicket({
        clientName: client.name,
        clientPhone: client.phone,
        serviceId: targetServiceId
      });
      showNotification(`¡${client.name} fue añadido a la fila de espera!`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error al encolar');
    }
  };

  const navItems = [
    {
      id: 'clients' as TabType,
      label: 'Gestión de Clientes',
      sublabel: 'Directorio, VIPs y Registro',
      icon: Users,
      badge: clients.length
    },
    {
      id: 'terminal' as TabType,
      label: 'Sillones & Turnos en Vivo',
      sublabel: 'Llamador táctil y tiempos',
      icon: Scissors,
      badge: (queueStatus?.totalWaiting || 0) > 0 ? queueStatus?.totalWaiting : undefined,
      badgeColor: 'bg-frank-orange text-white'
    },
    {
      id: 'appointments' as TabType,
      label: 'Citas & Agenda',
      sublabel: 'Reservas del día y programadas',
      icon: Calendar,
      badge: 4
    },
    {
      id: 'services' as TabType,
      label: 'Servicios & Tarifas',
      sublabel: 'Catálogo, cortes y precios',
      icon: Tag,
      badge: services.length || 6
    },
    {
      id: 'staff' as TabType,
      label: 'Staff de Barberos',
      sublabel: 'Sillones, estados y turnos',
      icon: UserCheck,
      badge: barbers.length || 3
    },
    {
      id: 'metrics' as TabType,
      label: 'Métricas & Fin de Semana',
      sublabel: 'Tiempos, volumen e ingresos',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E1E2E9] flex flex-col lg:flex-row relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-frank-orange to-[#A84F22] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-orange-400/40 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="font-semibold text-sm">{notification}</span>
        </div>
      )}

      {/* Mobile Top Header Bar */}
      <div className="lg:hidden bg-[#12141A] border-b border-[#232733] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-[#1A1D26] border border-[#2B313E] rounded-lg text-white hover:border-frank-orange"
            aria-label="Abrir Menú"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <img src="./assets/el_cartel_.png" alt="Logo" className="w-7 h-7 object-contain" />
            <span className="font-display tracking-widest text-lg font-bold text-white">EL CARTEL · STAFF</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 bg-[#1A1D26] border border-[#2B313E] rounded-lg text-[#8A8F9E] hover:text-white"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="p-2 bg-red-950/40 border border-red-500/40 rounded-lg text-red-300 hover:bg-red-900/60"
            title="Salir"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* MENÚ LATERAL (SIDEBAR NAVIGATION) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#111319] border-r border-[#222632] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo y Branding Superior */}
          <div className="p-5 border-b border-[#222632] bg-[#0E1015]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C1F28] to-[#12141A] border border-frank-orange/40 flex items-center justify-center p-1.5 shadow-lg shadow-frank-orange/10">
                <img
                  src="./assets/el_cartel_.png"
                  alt="El Cartel Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-display tracking-wider text-xl font-bold text-white leading-none">
                  EL CARTEL
                </h1>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-frank-orange mt-1">
                  Panel de Control Staff
                </p>
              </div>
            </div>

            {/* Barber Status Badge */}
            <div className="mt-4 flex items-center justify-between bg-[#171A22] border border-[#252A38] rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-bold text-white">Frank Master</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                Sillón #1
              </span>
            </div>
          </div>

          {/* Lista de Módulos */}
          <div className="px-3 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] px-3 mb-2">
              Módulos del Sistema
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-frank-orange to-[#9C4518] text-white shadow-lg shadow-frank-orange/25 font-bold'
                        : 'text-[#8C93A4] hover:text-white hover:bg-[#181B24]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-[#8C93A4] group-hover:text-frank-orange'
                        }`}
                      />
                      <div>
                        <div className="leading-tight">{item.label}</div>
                        <div
                          className={`text-[10px] ${
                            isActive ? 'text-white/80' : 'text-[#5B6275]'
                          }`}
                        >
                          {item.sublabel}
                        </div>
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor
                            ? item.badgeColor
                            : isActive
                            ? 'bg-black/30 text-white'
                            : 'bg-[#1F232E] text-[#9AA0B2]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer del Menú Lateral */}
        <div className="p-4 border-t border-[#222632] bg-[#0E1015] space-y-2">
          <button
            onClick={onExitToClient}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#8C93A4] hover:text-white bg-[#171A22] hover:bg-[#1F232E] border border-[#252A38] py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-frank-orange" />
            <span>Volver a la Web Principal</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-300 hover:text-red-100 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 py-2.5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión Staff</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTENIDO */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0A0B0E]">
        {/* Barra superior de herramientas y contexto */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[#1E222D]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-frank-orange tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EL CARTEL BARBERSHOP · SISTEMA INTEGRAL</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h2>
            <p className="text-xs sm:text-sm text-[#7F8698]">
              {navItems.find((i) => i.id === activeTab)?.sublabel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onRefresh();
                loadClientsData();
                showNotification('Datos sincronizados con éxito');
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-[#141720] border border-[#252A38] text-[#8C93A4] hover:text-white hover:border-[#383F52] rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Sincronizar"
            >
              <RefreshCw className="w-4 h-4 text-frank-orange" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            {activeTab === 'clients' && (
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-frank-orange/20"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Cliente en Fila</span>
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 1. MÓDULO: GESTIÓN DE CLIENTES                       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Tarjetas KPI de Clientes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase tracking-wider">
                  Total Directorio
                </div>
                <div className="font-display text-3xl font-bold text-white mt-1">
                  {clients.length}
                </div>
                <div className="text-[10px] text-secondary font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Clientes fidelizados
                </div>
                <div className="absolute top-3 right-3 p-2 bg-[#1C202C] rounded-xl text-frank-orange">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase tracking-wider">
                  Clientes VIP
                </div>
                <div className="font-display text-3xl font-bold text-[#F59E0B] mt-1">
                  {clients.filter((c) => c.isVIP || c.totalVisits >= 2).length}
                </div>
                <div className="text-[10px] text-[#F59E0B] font-semibold mt-1 flex items-center gap-1">
                  <Award className="w-3 h-3" /> 2+ visitas recurrentes
                </div>
                <div className="absolute top-3 right-3 p-2 bg-[#1C202C] rounded-xl text-[#F59E0B]">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase tracking-wider">
                  En Espera Hoy
                </div>
                <div className="font-display text-3xl font-bold text-frank-orange mt-1">
                  {queueStatus?.totalWaiting || 0}
                </div>
                <div className="text-[10px] text-frank-orange font-semibold mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> En fila activa
                </div>
                <div className="absolute top-3 right-3 p-2 bg-[#1C202C] rounded-xl text-frank-orange">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase tracking-wider">
                  Atendidos Hoy
                </div>
                <div className="font-display text-3xl font-bold text-secondary mt-1">
                  {queueStatus?.servedToday || 14}
                </div>
                <div className="text-[10px] text-secondary font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Cortes completados
                </div>
                <div className="absolute top-3 right-3 p-2 bg-[#1C202C] rounded-xl text-secondary">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, celular o servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#181B24] border border-[#262B3A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#181B24] p-1 rounded-xl border border-[#262B3A]">
                <button
                  onClick={() => setClientFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    clientFilter === 'all'
                      ? 'bg-frank-orange text-white shadow-sm'
                      : 'text-[#8C93A4] hover:text-white'
                  }`}
                >
                  Todos ({clients.length})
                </button>
                <button
                  onClick={() => setClientFilter('vip')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    clientFilter === 'vip'
                      ? 'bg-[#F59E0B] text-black shadow-sm'
                      : 'text-[#8C93A4] hover:text-white'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  VIP ({clients.filter((c) => c.isVIP || c.totalVisits >= 2).length})
                </button>
                <button
                  onClick={() => setClientFilter('waiting')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    clientFilter === 'waiting'
                      ? 'bg-secondary text-white shadow-sm'
                      : 'text-[#8C93A4] hover:text-white'
                  }`}
                >
                  En Espera Hoy ({queueStatus?.totalWaiting || 0})
                </button>
              </div>
            </div>

            {/* Directorio de Clientes (Tabla / Cards) */}
            <div className="bg-[#12141C] border border-[#222634] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181B25] text-[#7F8698] uppercase tracking-wider font-semibold border-b border-[#222634]">
                    <tr>
                      <th className="py-3.5 px-4">Cliente</th>
                      <th className="py-3.5 px-4">Contacto Directo</th>
                      <th className="py-3.5 px-4 text-center">Frecuencia</th>
                      <th className="py-3.5 px-4">Último Servicio & Barbero</th>
                      <th className="py-3.5 px-4">Estado Hoy</th>
                      <th className="py-3.5 px-4 text-right">Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D212D]">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                          <Users className="w-8 h-8 mx-auto mb-2 text-[#43495C]" />
                          No se encontraron clientes que coincidan con el criterio.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => {
                        const isInChair = queueStatus?.inChair.some(
                          (t) => t.clientPhone === client.phone || t.clientName === client.name
                        );
                        const isWaiting = queueStatus?.waiting.some(
                          (t) => t.clientPhone === client.phone || t.clientName === client.name
                        );

                        return (
                          <tr
                            key={client.id}
                            className="hover:bg-[#161922] transition-colors group"
                          >
                            {/* Nombre & VIP Badge */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#202430] border border-[#2E3445] flex items-center justify-center font-display font-bold text-white text-base">
                                  {client.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-sm">
                                      {client.name}
                                    </span>
                                    {(client.isVIP || client.totalVisits >= 2) && (
                                      <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Award className="w-3 h-3" /> VIP
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#71788A] truncate max-w-[200px]">
                                    {client.email || 'Cliente Frecuente'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Contacto & WhatsApp */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-white text-xs">{client.phone}</span>
                                <a
                                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(client.name)},%20te%20escribimos%20de%20EL%20CARTEL%20BARBERSHOP.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors"
                                  title="Enviar WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>

                            {/* Frecuencia / Visitas */}
                            <td className="py-4 px-4 text-center">
                              <span className="inline-block bg-[#1B1E29] border border-[#2B3142] px-2.5 py-1 rounded-lg font-bold text-white font-mono">
                                {client.totalVisits} {client.totalVisits === 1 ? 'visita' : 'visitas'}
                              </span>
                            </td>

                            {/* Último Servicio */}
                            <td className="py-4 px-4">
                              <div className="font-semibold text-white">
                                {client.lastService || 'Corte Clásico'}
                              </div>
                              <div className="text-[11px] text-[#71788A]">
                                Con {client.lastBarber || 'Frank Master'}
                              </div>
                            </td>

                            {/* Estado Hoy */}
                            <td className="py-4 px-4">
                              {isInChair ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                  En Sillón Ahora
                                </span>
                              ) : isWaiting ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-frank-orange/15 text-frank-orange border border-frank-orange/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-frank-orange" />
                                  Esperando Turno
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#6B7280]">
                                  Sin turno activo
                                </span>
                              )}
                            </td>

                            {/* Acciones */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedClientForNotes(client)}
                                  className="px-2.5 py-1.5 bg-[#1C202C] hover:bg-[#252A3A] border border-[#2B3142] text-xs font-semibold text-[#8C93A4] hover:text-white rounded-lg transition-colors"
                                  title="Ver ficha y notas"
                                >
                                  Ficha
                                </button>
                                {!isInChair && !isWaiting && (
                                  <button
                                    onClick={() => handleAddExistingClientToQueue(client)}
                                    className="px-3 py-1.5 bg-frank-orange/20 hover:bg-frank-orange text-frank-orange hover:text-white border border-frank-orange/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                    title="Poner en fila para hoy"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Poner en Fila</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. MÓDULO: SILLONES & TURNOS EN VIVO (TERMINAL)      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'terminal' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-frank-orange" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  Llamador Rápido de Clientes · Vista Operativa de Barberos
                </span>
              </div>
              <span className="text-xs text-[#7F8698]">
                Sincronización en vivo activa
              </span>
            </div>

            <BarberTerminalView queueStatus={queueStatus} onRefresh={onRefresh} />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. MÓDULO: CITAS & AGENDA                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Citas para Hoy</div>
                <div className="font-display text-3xl font-bold text-white mt-1">4 Agendadas</div>
                <div className="text-xs text-secondary font-semibold mt-1">2 confirmadas vía WhatsApp</div>
              </div>
              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Modo Operativo</div>
                <div className="font-display text-3xl font-bold text-frank-orange mt-1">Híbrido</div>
                <div className="text-xs text-[#7F8698] mt-1">Orden de Llegada + Citas fijas</div>
              </div>
              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Próxima Reserva</div>
                <div className="font-display text-3xl font-bold text-[#F59E0B] mt-1">04:30 PM</div>
                <div className="text-xs text-[#7F8698] mt-1">Carlos M. · Frank Master</div>
              </div>
            </div>

            <div className="bg-[#12141C] border border-[#222634] rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-white mb-4">Agenda del Día</h3>
              <div className="space-y-3">
                {[
                  { time: '11:00 AM', name: 'Alonso Vera', service: 'Fade Urbano + Barba', barber: 'Frank Master', status: 'COMPLETADA' },
                  { time: '01:30 PM', name: 'Diego Morales', service: 'Buzz Cut + Diseños', barber: 'Mateo Fade', status: 'EN ATENCIÓN' },
                  { time: '04:30 PM', name: 'Carlos Mendoza', service: 'Fade Urbano Cartel', barber: 'Frank Master', status: 'CONFIRMADA' },
                  { time: '06:00 PM', name: 'Renato Silva', service: 'Corte Clásico Ejecutivo', barber: 'Santi Style', status: 'PENDIENTE' }
                ].map((apt, idx) => (
                  <div key={idx} className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#181B25] border border-[#262B3A] rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-frank-orange bg-frank-orange/10 px-2.5 py-1 rounded border border-frank-orange/20">
                        {apt.time}
                      </span>
                      <div>
                        <div className="font-bold text-white text-sm">{apt.name}</div>
                        <div className="text-xs text-[#7F8698]">{apt.service} · {apt.barber}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${
                      apt.status === 'COMPLETADA' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                      apt.status === 'EN ATENCIÓN' ? 'bg-frank-orange/10 text-frank-orange border-frank-orange/30' :
                      apt.status === 'CONFIRMADA' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. MÓDULO: SERVICIOS & TARIFAS                      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(services.length > 0 ? services : [
                { id: '1', name: 'Fade Urbano Cartel', price: 'S/. 35.00', durationMinutes: 35, category: 'CORTES', isActive: true },
                { id: '2', name: 'Corte Clásico Ejecutivo', price: 'S/. 30.00', durationMinutes: 30, category: 'CORTES', isActive: true },
                { id: '3', name: 'Ritual Barba & Toalla Caliente', price: 'S/. 25.00', durationMinutes: 25, category: 'BARBA', isActive: true },
                { id: '4', name: 'Combo El Cartel (Corte + Barba)', price: 'S/. 50.00', durationMinutes: 50, category: 'COMBOS', isActive: true },
                { id: '5', name: 'Diseños & Freestyle', price: 'S/. 20.00', durationMinutes: 20, category: 'ARTE', isActive: true },
                { id: '6', name: 'Alisado & Keratina Masculina', price: 'S/. 60.00', durationMinutes: 60, category: 'TRATAMIENTOS', isActive: true }
              ]).map((svc) => (
                <div key={svc.id} className="bg-[#12141C] border border-[#222634] p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-frank-orange uppercase tracking-wider bg-frank-orange/10 px-2 py-0.5 rounded border border-frank-orange/20">
                        {svc.category}
                      </span>
                      <span className="text-xs text-secondary font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-1">{svc.name}</h4>
                    <div className="text-xs text-[#7F8698] flex items-center gap-1 mb-4">
                      <Clock className="w-3.5 h-3.5" /> {svc.durationMinutes} minutos aproximados
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1F232F] flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-white">
                      {typeof svc.price === 'number' ? `S/. ${svc.price.toFixed(2)}` : svc.price}
                    </span>
                    <button
                      onClick={() => showNotification(`Tarifa de "${svc.name}" confirmada`)}
                      className="px-3 py-1.5 bg-[#1B1E29] hover:bg-[#252A38] border border-[#2A3040] text-xs font-bold text-white rounded-lg transition-colors"
                    >
                      Editar Precio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 5. MÓDULO: STAFF DE BARBEROS                        */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(barbers.length > 0 ? barbers : [
                { id: 'b1', name: 'Frank Master', chairNumber: 1, specialty: 'Fades & Ritual de Barba', status: 'ACTIVE' as const },
                { id: 'b2', name: 'Mateo Fade', chairNumber: 2, specialty: 'Diseños Urbanos & Taper Fade', status: 'ACTIVE' as const },
                { id: 'b3', name: 'Santi Style', chairNumber: 3, specialty: 'Cortes Clásicos & Texturizados', status: 'BREAK' as const }
              ]).map((barber) => (
                <div key={barber.id} className="bg-[#12141C] border border-[#222634] p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E222D] to-[#141720] border border-frank-orange/40 flex items-center justify-center font-display text-xl font-bold text-white">
                        #{barber.chairNumber}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        barber.status === 'ACTIVE'
                          ? 'bg-secondary/10 text-secondary border-secondary/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {barber.status === 'ACTIVE' ? 'En Servicio' : 'En Descanso'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-lg">{barber.name}</h4>
                    <p className="text-xs text-frank-orange font-semibold mb-2">Sillón #{barber.chairNumber}</p>
                    <p className="text-xs text-[#7F8698]">{barber.specialty || 'Master Barber Senior'}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1F232F] flex items-center justify-between">
                    <span className="text-xs text-[#7F8698]">Cortes hoy: <strong className="text-white">6</strong></span>
                    <button
                      onClick={() => showNotification(`Estado de ${barber.name} actualizado`)}
                      className="px-3 py-1.5 bg-[#1B1E29] hover:bg-[#252A38] border border-[#2A3040] text-xs font-bold text-white rounded-lg transition-colors"
                    >
                      Cambiar Estado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 6. MÓDULO: MÉTRICAS & MODO FIN DE SEMANA            */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#171A24] to-[#12141C] border border-[#252A38] p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-frank-orange font-bold text-xs uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4 text-frank-orange" />
                  <span>MODO FIN DE SEMANA (ALTO FLUJO)</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Gestión Inteligente de Demanda Satural
                </h3>
                <p className="text-xs text-[#7F8698] max-w-xl mt-1">
                  Activa la rotación rápida de turnos por orden de llegada estricto, reduciendo los intervalos de espera a 18 minutos por sillón para maximizar la capacidad de atención.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/30">
                  Activado Automático (Vie - Dom)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#12141C] border border-[#222634] p-5 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Tiempo Promedio en Espera</div>
                <div className="font-display text-3xl font-bold text-white mt-1">18 min</div>
                <div className="text-xs text-secondary font-semibold mt-1">Óptimo para 3 barberos activos</div>
              </div>
              <div className="bg-[#12141C] border border-[#222634] p-5 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Tasa de Asistencia</div>
                <div className="font-display text-3xl font-bold text-secondary mt-1">94.8%</div>
                <div className="text-xs text-[#7F8698] mt-1">Solo 1 cliente marcado como No-Show</div>
              </div>
              <div className="bg-[#12141C] border border-[#222634] p-5 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Recaudación Estimada Hoy</div>
                <div className="font-display text-3xl font-bold text-[#F59E0B] mt-1">S/. 580.00</div>
                <div className="text-xs text-[#7F8698] mt-1">16 servicios ejecutados</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: REGISTRAR CLIENTE RÁPIDO EN FILA */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsQuickAddOpen(false)}
              className="absolute top-5 right-5 text-[#7F8698] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-frank-orange/15 rounded-xl border border-frank-orange/30 text-frank-orange">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Registrar Cliente en Fila</h3>
                <p className="text-xs text-[#7F8698]">Ingreso directo de cliente walk-in en recepción</p>
              </div>
            </div>

            <form onSubmit={handleQuickAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mario Vargas"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +51 987 654 321"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Servicio Solicitado</label>
                <select
                  value={quickServiceId}
                  onChange={(e) => setQuickServiceId(e.target.value)}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-frank-orange"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {typeof s.price === 'number' ? `S/. ${s.price}` : s.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Barbero de Preferencia</label>
                <select
                  value={quickBarberId}
                  onChange={(e) => setQuickBarberId(e.target.value)}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-frank-orange"
                >
                  <option value="">Cualquier Barbero Disponible (Más Rápido)</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Sillón #{b.chairNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Notas de Estilo / Preferencias (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Solo tijera arriba, degradado 0.5"
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 bg-[#1C202C] hover:bg-[#252A38] text-xs font-bold text-[#8C93A4] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-frank-orange/20"
                >
                  {isSubmitting ? 'Registrando...' : 'Asignar Turno Inmediato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER FICHA & NOTAS DEL CLIENTE */}
      {selectedClientForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedClientForNotes(null)}
              className="absolute top-5 right-5 text-[#7F8698] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-frank-orange/15 border border-frank-orange/30 flex items-center justify-center font-display text-2xl font-bold text-frank-orange">
                {selectedClientForNotes.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-white">
                    {selectedClientForNotes.name}
                  </h3>
                  {selectedClientForNotes.isVIP && (
                    <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7F8698] font-mono">{selectedClientForNotes.phone}</p>
              </div>
            </div>

            <div className="space-y-3 bg-[#1C202C] p-4 rounded-2xl border border-[#262B3A] text-xs">
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Total de Visitas:</span>
                <span className="font-bold text-white">{selectedClientForNotes.totalVisits} visitas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Último Servicio:</span>
                <span className="font-bold text-white">{selectedClientForNotes.lastService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Barbero Frecuente:</span>
                <span className="font-bold text-white">{selectedClientForNotes.lastBarber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Correo Registrado:</span>
                <span className="text-white">{selectedClientForNotes.email || 'No registrado'}</span>
              </div>
              <div className="pt-2 border-t border-[#262B3A]">
                <span className="text-[#7F8698] block mb-1">Notas de Estilo y Preferencias:</span>
                <p className="text-white bg-[#14161F] p-2.5 rounded-xl border border-[#232733] italic">
                  "{selectedClientForNotes.notes || 'Sin especificaciones registradas'}"
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/${selectedClientForNotes.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(selectedClientForNotes.name)},%20te%20saludamos%20de%20EL%20CARTEL%20BARBERSHOP.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  handleAddExistingClientToQueue(selectedClientForNotes);
                  setSelectedClientForNotes(null);
                }}
                className="flex-1 py-2.5 bg-frank-orange hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all text-center"
              >
                Asignar a Fila Hoy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
