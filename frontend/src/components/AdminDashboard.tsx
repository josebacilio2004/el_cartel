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
  DollarSign,
  Edit2,
  Trash2,
  Receipt,
  Printer,
  Share2,
  Play,
  Pause,
  SlidersHorizontal,
  CreditCard,
  Wallet,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { QueueStatus, Barber, Service, Ticket, ClientRecord, SaleTicket } from '../types';
import { fetchClients, createTicket, updateClientInBackend } from '../services/api';

interface AdminDashboardProps {
  queueStatus: QueueStatus | null;
  barbers: Barber[];
  services: Service[];
  onRefresh: () => void;
  onExitToClient: () => void;
  onLogout: () => void;
}

type TabType = 'terminal' | 'clients' | 'appointments' | 'services' | 'staff' | 'metrics';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  queueStatus,
  barbers: initialBarbers,
  services: initialServices,
  onRefresh,
  onExitToClient,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // ----------------------------------------------------
  // BARBERO EN SESIÓN ACTIVA (LOGIN INDIVIDUAL)
  // ----------------------------------------------------
  const [barbersList, setBarbersList] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('el_cartel_barbers_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'b1', name: 'Frank Master', chairNumber: 1, specialty: 'Fades & Ritual de Barba', status: 'ACTIVE', pin: '1234', todayCutsCount: 8, todayEarnings: 320 },
      { id: 'b2', name: 'Mateo Fade', chairNumber: 2, specialty: 'Diseños Urbanos & Taper', status: 'ACTIVE', pin: '2222', todayCutsCount: 6, todayEarnings: 240 },
      { id: 'b3', name: 'Santi Style', chairNumber: 3, specialty: 'Cortes Clásicos & Texturizados', status: 'ACTIVE', pin: '3333', todayCutsCount: 5, todayEarnings: 190 }
    ];
  });

  const [activeBarberId, setActiveBarberId] = useState<string>(() => {
    const savedId = localStorage.getItem('el_cartel_active_barber');
    return savedId || 'b1';
  });

  const activeBarber = barbersList.find(b => b.id === activeBarberId) || barbersList[0];

  useEffect(() => {
    localStorage.setItem('el_cartel_barbers_list', JSON.stringify(barbersList));
  }, [barbersList]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // ----------------------------------------------------
  // GESTIÓN DE SERVICIOS (CRUD COMPLETO)
  // ----------------------------------------------------
  const [servicesList, setServicesList] = useState<Service[]>(() => {
    const saved = localStorage.getItem('el_cartel_services_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 's1', name: 'Fade Urbano Cartel', price: 35, durationMinutes: 35, category: 'CORTES', isActive: true, description: 'Degradado limpio con navaja y texturizado' },
      { id: 's2', name: 'Corte Clásico Ejecutivo', price: 30, durationMinutes: 30, category: 'CORTES', isActive: true, description: 'Tijera pura y acabado sobrio' },
      { id: 's3', name: 'Ritual Barba & Toalla Caliente', price: 25, durationMinutes: 25, category: 'BARBA', isActive: true, description: 'Perfilado con vapor de ozono y aceites' },
      { id: 's4', name: 'Combo El Cartel (Corte + Barba)', price: 50, durationMinutes: 50, category: 'COMBOS', isActive: true, description: 'Servicio premium completo' },
      { id: 's5', name: 'Diseños & Freestyle', price: 20, durationMinutes: 20, category: 'ARTE', isActive: true, description: 'Líneas y patrones personalizados' },
      { id: 's6', name: 'Alisado & Keratina Masculina', price: 60, durationMinutes: 60, category: 'TRATAMIENTOS', isActive: true, description: 'Sellado térmico y brillo' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('el_cartel_services_list', JSON.stringify(servicesList));
  }, [servicesList]);

  // Modal Service CRUD
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    price: 35,
    durationMinutes: 30,
    category: 'CORTES',
    description: '',
    isActive: true
  });

  const handleOpenNewService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      price: 35,
      durationMinutes: 30,
      category: 'CORTES',
      description: '',
      isActive: true
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (s: Service) => {
    setEditingService(s);
    setServiceForm({
      name: s.name,
      price: typeof s.price === 'number' ? s.price : parseFloat(String(s.price).replace(/[^0-9.]/g, '')) || 35,
      durationMinutes: s.durationMinutes,
      category: s.category,
      description: s.description || '',
      isActive: s.isActive
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    if (editingService) {
      setServicesList(prev => prev.map(s => s.id === editingService.id ? {
        ...s,
        name: serviceForm.name,
        price: Number(serviceForm.price),
        durationMinutes: Number(serviceForm.durationMinutes),
        category: serviceForm.category,
        description: serviceForm.description,
        isActive: serviceForm.isActive
      } : s));
      showNotification(`Servicio "${serviceForm.name}" actualizado`);
    } else {
      const newService: Service = {
        id: `s-${Date.now()}`,
        name: serviceForm.name,
        price: Number(serviceForm.price),
        durationMinutes: Number(serviceForm.durationMinutes),
        category: serviceForm.category,
        description: serviceForm.description,
        isActive: serviceForm.isActive
      };
      setServicesList(prev => [...prev, newService]);
      showNotification(`Servicio "${serviceForm.name}" creado con éxito`);
    }
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el servicio "${name}"?`)) {
      setServicesList(prev => prev.filter(s => s.id !== id));
      showNotification(`Servicio "${name}" eliminado`);
    }
  };

  // ----------------------------------------------------
  // GESTIÓN DE BARBEROS (CRUD COMPLETO)
  // ----------------------------------------------------
  const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [barberForm, setBarberForm] = useState({
    name: '',
    chairNumber: 1,
    specialty: '',
    pin: '1234',
    photoUrl: '',
    status: 'ACTIVE' as 'ACTIVE' | 'BREAK' | 'OFFLINE'
  });

  const handleOpenNewBarber = () => {
    setEditingBarber(null);
    setBarberForm({
      name: '',
      chairNumber: barbersList.length + 1,
      specialty: 'Master Barber',
      pin: '1234',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      status: 'ACTIVE'
    });
    setIsBarberModalOpen(true);
  };

  const handleOpenEditBarber = (b: Barber) => {
    setEditingBarber(b);
    setBarberForm({
      name: b.name,
      chairNumber: b.chairNumber,
      specialty: b.specialty || '',
      pin: b.pin || '1234',
      photoUrl: b.photoUrl || '',
      status: b.status
    });
    setIsBarberModalOpen(true);
  };

  const handleSaveBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberForm.name.trim()) return;

    if (editingBarber) {
      setBarbersList(prev => prev.map(b => b.id === editingBarber.id ? {
        ...b,
        name: barberForm.name,
        chairNumber: Number(barberForm.chairNumber),
        specialty: barberForm.specialty,
        pin: barberForm.pin,
        photoUrl: barberForm.photoUrl,
        status: barberForm.status
      } : b));
      showNotification(`Barbero "${barberForm.name}" actualizado`);
    } else {
      const newB: Barber = {
        id: `b-${Date.now()}`,
        name: barberForm.name,
        chairNumber: Number(barberForm.chairNumber),
        specialty: barberForm.specialty,
        pin: barberForm.pin,
        photoUrl: barberForm.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
        status: barberForm.status,
        todayCutsCount: 0,
        todayEarnings: 0
      };
      setBarbersList(prev => [...prev, newB]);
      showNotification(`Barbero "${barberForm.name}" incorporado`);
    }
    setIsBarberModalOpen(false);
  };

  const handleDeleteBarber = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de desvincular a "${name}" del staff?`)) {
      setBarbersList(prev => prev.filter(b => b.id !== id));
      showNotification(`Barbero "${name}" removido`);
    }
  };

  // ----------------------------------------------------
  // GESTIÓN DE CLIENTES (CRUD COMPLETO)
  // ----------------------------------------------------
  const [clients, setClients] = useState<ClientRecord[]>(() => {
    const saved = localStorage.getItem('el_cartel_clients_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'cli-01',
        name: 'Carlos Mendoza',
        phone: '+51 987 654 321',
        totalVisits: 8,
        lastService: 'Fade Urbano + Barba Perfilada',
        lastBarber: 'Frank Master',
        lastDate: new Date().toISOString(),
        isVIP: true,
        notes: 'Cliente fijo de los viernes. Prefiere navaja caliente y cera mate.',
        email: 'carlos.mendoza@gmail.com'
      },
      {
        id: 'cli-02',
        name: 'Diego Morales',
        phone: '+51 991 234 567',
        totalVisits: 4,
        lastService: 'Buzz Cut + Diseños Tribales',
        lastBarber: 'Mateo Fade',
        lastDate: new Date(Date.now() - 3600000).toISOString(),
        isVIP: true,
        notes: 'Degradado alto en cero (skin fade) con diseño lateral.',
        email: 'diego.morales@hotmail.com'
      },
      {
        id: 'cli-03',
        name: 'Alejandro Torres',
        phone: '+51 954 882 119',
        totalVisits: 1,
        lastService: 'Corte Clásico Ejecutivo',
        lastBarber: 'Cualquiera',
        lastDate: new Date(Date.now() - 7200000).toISOString(),
        isVIP: false,
        notes: 'Primera visita recomendada. Peinado hacia un lado tradicional.',
        email: 'atorres@outlook.com'
      },
      {
        id: 'cli-04',
        name: 'Rodrigo Santillán',
        phone: '+51 922 431 880',
        totalVisits: 12,
        lastService: 'Ritual Barba & Toalla Caliente',
        lastBarber: 'Frank Master',
        lastDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        isVIP: true,
        notes: 'Socio VIP El Cartel Gold. Aceite de cedro y bálsamo esencial.',
        email: 'rodrigo.s@empresa.pe'
      },
      {
        id: 'cli-05',
        name: 'Sebastián Vidal',
        phone: '+51 960 712 344',
        totalVisits: 3,
        lastService: 'Fade Urbano Cartel',
        lastBarber: 'Santi Style',
        lastDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        isVIP: false,
        notes: 'Prefiere corte rápido sin lavado posterior.',
        email: 'svidal@gmail.com'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('el_cartel_clients_list', JSON.stringify(clients));
  }, [clients]);

  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState<'all' | 'vip' | 'waiting'>('all');
  const [selectedClientForNotes, setSelectedClientForNotes] = useState<ClientRecord | null>(null);

  // Modal Client CRUD
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    isVIP: false,
    addToQueueNow: false,
    selectedServiceId: ''
  });

  const handleOpenNewClient = () => {
    setEditingClient(null);
    setClientForm({
      name: '',
      phone: '+51 ',
      email: '',
      notes: '',
      isVIP: false,
      addToQueueNow: false,
      selectedServiceId: servicesList[0]?.id || ''
    });
    setIsClientModalOpen(true);
  };

  const handleOpenEditClient = (c: ClientRecord) => {
    setEditingClient(c);
    setClientForm({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      notes: c.notes || '',
      isVIP: !!c.isVIP,
      addToQueueNow: false,
      selectedServiceId: servicesList[0]?.id || ''
    });
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name.trim() || !clientForm.phone.trim()) return;

    if (editingClient) {
      const trimmedName = clientForm.name.trim();
      const trimmedPhone = clientForm.phone.trim();
      const trimmedNotes = clientForm.notes.trim();

      const updatedClients = clients.map(c => c.id === editingClient.id ? {
        ...c,
        name: trimmedName,
        phone: trimmedPhone,
        email: clientForm.email.trim(),
        notes: trimmedNotes,
        isVIP: clientForm.isVIP
      } : c);
      setClients(updatedClients);
      localStorage.setItem('el_cartel_clients_list', JSON.stringify(updatedClients));

      // 1. Sincronizar inmediatamente con el cliente en sillón si es la misma persona
      if (
        chairClient && (
          chairClient.clientName.trim().toLowerCase() === editingClient.name.trim().toLowerCase() ||
          chairClient.clientName.trim().toLowerCase() === trimmedName.toLowerCase()
        )
      ) {
        setChairClient(prev => prev ? {
          ...prev,
          clientName: trimmedName,
          clientPhone: trimmedPhone
        } : null);
      }

      // 2. Sincronizar inmediatamente con todos los turnos en la cola unificada
      setUnifiedQueue(prev => prev.map(item => {
        if (
          item.clientName.trim().toLowerCase() === editingClient.name.trim().toLowerCase() ||
          item.clientName.trim().toLowerCase() === trimmedName.toLowerCase()
        ) {
          return {
            ...item,
            clientName: trimmedName,
            clientPhone: trimmedPhone
          };
        }
        return item;
      }));

      // 3. Sincronizar con el backend / base de datos PostgreSQL
      updateClientInBackend(trimmedName, trimmedPhone, trimmedNotes);

      showNotification(`Cliente "${trimmedName}" actualizado (Celular: ${trimmedPhone})`);
    } else {
      const newClient: ClientRecord = {
        id: `cli-${Date.now()}`,
        name: clientForm.name,
        phone: clientForm.phone,
        email: clientForm.email,
        totalVisits: 1,
        lastService: servicesList.find(s => s.id === clientForm.selectedServiceId)?.name || 'Corte Clásico',
        lastBarber: activeBarber.name,
        lastDate: new Date().toISOString(),
        isVIP: clientForm.isVIP,
        notes: clientForm.notes || 'Preferencia por definir'
      };
      setClients(prev => [newClient, ...prev]);

      if (clientForm.addToQueueNow) {
        try {
          await createTicket({
            clientName: newClient.name,
            clientPhone: newClient.phone,
            serviceId: clientForm.selectedServiceId || servicesList[0]?.id || 's1',
            barberId: activeBarber.id
          });
          onRefresh();
          showNotification(`¡${newClient.name} registrado e ingresado a la cola!`);
        } catch (e) {
          showNotification(`¡${newClient.name} registrado en directorio!`);
        }
      } else {
        showNotification(`Cliente "${newClient.name}" guardado en el directorio`);
      }
    }
    setIsClientModalOpen(false);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar a "${name}" del directorio de clientes?`)) {
      setClients(prev => prev.filter(c => c.id !== id));
      showNotification(`Cliente "${name}" eliminado`);
    }
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

  // ----------------------------------------------------
  // SILLONES & TURNOS EN VIVO (UNIFICADO) Y TICKET DE VENTA
  // ----------------------------------------------------
  // Obtiene el teléfono más actualizado del directorio de clientes en tiempo real
  const getClientCurrentPhone = (clientName: string, fallbackPhone: string = '') => {
    if (!clientName) return fallbackPhone;
    const found = clients.find(c => c.name.trim().toLowerCase() === clientName.trim().toLowerCase());
    return (found && found.phone && found.phone.trim()) ? found.phone.trim() : fallbackPhone;
  };

  // Cliente actualmente en el sillón del barbero activo
  const [chairClient, setChairClient] = useState<{
    ticketCode: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    servicePrice: number;
    startedAt: number;
  } | null>(() => {
    const saved = localStorage.getItem('el_cartel_chair_client');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      ticketCode: 'C-01',
      clientName: 'Carlos Mendoza',
      clientPhone: '+51 987 654 321',
      serviceName: 'Fade Urbano Cartel',
      servicePrice: 35,
      startedAt: Date.now() - 22 * 60 * 1000 // 22 minutos transcurridos
    };
  });

  useEffect(() => {
    if (chairClient) {
      localStorage.setItem('el_cartel_chair_client', JSON.stringify(chairClient));
    }
  }, [chairClient]);

  // Cronómetro del sillón activo
  const [timerSeconds, setTimerSeconds] = useState(1320); // 22 min demo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cola unificada en vivo (tickets de llegada + citas programadas)
  const [unifiedQueue, setUnifiedQueue] = useState<Array<{
    id: string;
    ticketCode: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    servicePrice: number;
    barberName: string;
    scheduledTime?: string;
    position: number;
    type: 'LLEGADA' | 'CITA';
    estimatedWaitMin: number;
  }>>([
    {
      id: 'q-1',
      ticketCode: 'C-02',
      clientName: 'Diego Morales',
      clientPhone: '+51 991 234 567',
      serviceName: 'Buzz Cut + Diseños Tribales',
      servicePrice: 35,
      barberName: 'Mateo Fade',
      position: 1,
      type: 'LLEGADA',
      estimatedWaitMin: 10
    },
    {
      id: 'q-2',
      ticketCode: 'C-03',
      clientName: 'Alejandro Torres',
      clientPhone: '+51 954 882 119',
      serviceName: 'Corte Clásico Ejecutivo',
      servicePrice: 30,
      barberName: 'Cualquier Barbero',
      position: 2,
      type: 'LLEGADA',
      estimatedWaitMin: 25
    },
    {
      id: 'q-3',
      ticketCode: 'CITA-4',
      clientName: 'Rodrigo Santillán',
      clientPhone: '+51 922 431 880',
      serviceName: 'Ritual Barba & Toalla Caliente',
      servicePrice: 25,
      barberName: 'Frank Master',
      scheduledTime: '04:30 PM',
      position: 3,
      type: 'CITA',
      estimatedWaitMin: 40
    },
    {
      id: 'q-4',
      ticketCode: 'C-05',
      clientName: 'Sebastián Vidal',
      clientPhone: '+51 960 712 344',
      serviceName: 'Fade Urbano Cartel',
      servicePrice: 35,
      barberName: 'Santi Style',
      position: 4,
      type: 'LLEGADA',
      estimatedWaitMin: 55
    }
  ]);

  // ----------------------------------------------------
  // TICKET DE VENTA / COBRO Y MÉTRICAS FINANCIERAS
  // ----------------------------------------------------
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<SaleTicket | null>(null);

  // Historial de ventas del día
  const [salesHistory, setSalesHistory] = useState<SaleTicket[]>(() => {
    const saved = localStorage.getItem('el_cartel_sales_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'tx-1', ticketCode: 'C-95', clientName: 'Martín Paredes', clientPhone: '+51 988 112 334', serviceName: 'Fade Urbano Cartel', barberName: 'Frank Master', chairNumber: 1, amount: 35, durationMinutes: 28, paymentMethod: 'YAPE', createdAt: '10:45 AM' },
      { id: 'tx-2', ticketCode: 'C-96', clientName: 'Gonzalo Silva', clientPhone: '+51 977 443 221', serviceName: 'Combo El Cartel', barberName: 'Frank Master', chairNumber: 1, amount: 50, durationMinutes: 44, paymentMethod: 'PLIN', createdAt: '11:30 AM' },
      { id: 'tx-3', ticketCode: 'C-97', clientName: 'Javier Ramos', clientPhone: '+51 966 554 112', serviceName: 'Corte Clásico', barberName: 'Mateo Fade', chairNumber: 2, amount: 30, durationMinutes: 24, paymentMethod: 'EFECTIVO', createdAt: '12:15 PM' },
      { id: 'tx-4', ticketCode: 'C-98', clientName: 'Luciano Prado', clientPhone: '+51 955 889 001', serviceName: 'Ritual Barba', barberName: 'Santi Style', chairNumber: 3, amount: 25, durationMinutes: 22, paymentMethod: 'TARJETA', createdAt: '01:00 PM' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('el_cartel_sales_history', JSON.stringify(salesHistory));
  }, [salesHistory]);

  // Totales calculados
  const totalRevenueToday = salesHistory.reduce((sum, item) => sum + item.amount, 0);
  const totalCutsToday = salesHistory.length;
  const avgCutDuration = totalCutsToday > 0 ? Math.round(salesHistory.reduce((sum, item) => sum + item.durationMinutes, 0) / totalCutsToday) : 28;

  // Acción: Terminar turno actual y preparar cobro
  const handleFinishCurrentCut = () => {
    if (!chairClient) return;

    const durationMins = Math.max(1, Math.round(timerSeconds / 60));
    const newReceipt: SaleTicket = {
      id: `tx-${Date.now()}`,
      ticketCode: chairClient.ticketCode,
      clientName: chairClient.clientName,
      clientPhone: getClientCurrentPhone(chairClient.clientName, chairClient.clientPhone),
      serviceName: chairClient.serviceName,
      barberName: activeBarber.name,
      chairNumber: activeBarber.chairNumber,
      amount: chairClient.servicePrice,
      durationMinutes: durationMins,
      paymentMethod: 'YAPE',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveReceipt(newReceipt);
    setIsReceiptModalOpen(true);
  };

  // Confirmar cobro y llamar al siguiente
  const handleConfirmPaymentAndCallNext = () => {
    if (!activeReceipt) return;

    // 1. Guardar en historial de ventas
    setSalesHistory(prev => [activeReceipt, ...prev]);

    // 2. Actualizar conteo del barbero
    setBarbersList(prev => prev.map(b => b.id === activeBarber.id ? {
      ...b,
      todayCutsCount: (b.todayCutsCount || 0) + 1,
      todayEarnings: (b.todayEarnings || 0) + activeReceipt.amount
    } : b));

    // 3. Pasar al siguiente de la cola unificada
    if (unifiedQueue.length > 0) {
      const nextClient = unifiedQueue[0];
      setChairClient({
        ticketCode: nextClient.ticketCode,
        clientName: nextClient.clientName,
        clientPhone: nextClient.clientPhone,
        serviceName: nextClient.serviceName,
        servicePrice: nextClient.servicePrice,
        startedAt: Date.now()
      });
      setUnifiedQueue(prev => prev.slice(1).map((item, idx) => ({ ...item, position: idx + 1 })));
      setTimerSeconds(0);
      showNotification(`¡Turno ${activeReceipt.ticketCode} cobrado (S/. ${activeReceipt.amount.toFixed(2)})! Llamado ${nextClient.clientName}`);
    } else {
      setChairClient(null);
      setTimerSeconds(0);
      showNotification(`¡Turno ${activeReceipt.ticketCode} cobrado con éxito! Sillón libre.`);
    }

    setIsReceiptModalOpen(false);
    onRefresh();
  };

  // Llamar cliente específico de la cola al sillón
  const handleCallClientDirectly = (queueItem: typeof unifiedQueue[0]) => {
    if (chairClient && !confirm(`Actualmente estás atendiendo a ${chairClient.clientName}. ¿Deseas reemplazarlo con ${queueItem.clientName}?`)) {
      return;
    }

    setChairClient({
      ticketCode: queueItem.ticketCode,
      clientName: queueItem.clientName,
      clientPhone: queueItem.clientPhone,
      serviceName: queueItem.serviceName,
      servicePrice: queueItem.servicePrice,
      startedAt: Date.now()
    });
    setUnifiedQueue(prev => prev.filter(q => q.id !== queueItem.id).map((item, idx) => ({ ...item, position: idx + 1 })));
    setTimerSeconds(0);
    showNotification(`¡${queueItem.clientName} (#${queueItem.ticketCode}) llamado a tu sillón #${activeBarber.chairNumber}!`);
  };

  // Posponer turno +15m
  const handleDelayQueueItem = (id: string) => {
    setUnifiedQueue(prev => {
      const index = prev.findIndex(q => q.id === id);
      if (index < 0 || index === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy.map((it, idx) => ({ ...it, position: idx + 1 }));
    });
    showNotification('Turno pospuesto 1 posición en cola');
  };

  // Marcar No-Show
  const handleNoShowQueueItem = (id: string, name: string) => {
    if (confirm(`¿Marcar a ${name} como no presentado (No-Show)?`)) {
      setUnifiedQueue(prev => prev.filter(q => q.id !== id).map((it, idx) => ({ ...it, position: idx + 1 })));
      showNotification(`${name} marcado como No-Show`);
    }
  };

  // ----------------------------------------------------
  // PLANTILLAS DE WHATSAPP AUTOMATIZADAS
  // ----------------------------------------------------
  const sendWhatsAppTicket = (clientName: string, phone: string, ticketCode: string, position: number, waitMin: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `💈 ¡Hola ${clientName}! Tu turno en *EL CARTEL BARBERSHOP* ha sido generado con éxito.\n\n` +
      `🎫 *Ticket:* #${ticketCode}\n` +
      `📍 *Posición en cola:* #${position}\n` +
      `⏳ *Tiempo aprox de espera:* ${waitMin} minutos\n` +
      `💺 *Sede:* Av. Elmer Faucett 450, San Miguel, Lima\n\n` +
      `Te avisaremos por este medio cuando tu sillón esté listo. ¡Gracias por tu preferencia!`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`, '_blank');
  };

  const sendWhatsAppChairReady = (clientName: string, phone: string, barberName: string, chairNum: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `🔥 ¡Hola ${clientName}! Tu sillón en *EL CARTEL BARBERSHOP* ya está listo.\n\n` +
      `💈 *Barbero:* ${barberName}\n` +
      `💺 *Sillón:* #${chairNum}\n\n` +
      `Por favor acércate a la estación para iniciar tu corte. ¡Te esperamos!`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`, '_blank');
  };

  const sendWhatsAppReceipt = (receipt: SaleTicket) => {
    const cleanPhone = receipt.clientPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `🧾 *EL CARTEL BARBERSHOP · COMPROBANTE DIGITAL*\n\n` +
      `👤 *Cliente:* ${receipt.clientName}\n` +
      `✂️ *Servicio:* ${receipt.serviceName}\n` +
      `💈 *Barbero:* ${receipt.barberName} (Sillón #${receipt.chairNumber})\n` +
      `⏱️ *Tiempo de Atención:* ${receipt.durationMinutes} minutos\n` +
      `💳 *Método de Pago:* ${receipt.paymentMethod}\n` +
      `💰 *Total Pagado:* S/. ${receipt.amount.toFixed(2)}\n\n` +
      `¡Gracias por tu visita! Mantén el estilo Cartel.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`, '_blank');
  };

  // ----------------------------------------------------
  // DATOS PARA GRÁFICOS RECHARTS
  // ----------------------------------------------------
  // Gráfico 1: Curva de demanda horaria (Viernes/Sábado pico)
  const hourlyData = [
    { hour: '10:00 AM', semana: 4, finDeSemana: 8 },
    { hour: '11:00 AM', semana: 6, finDeSemana: 12 },
    { hour: '12:00 PM', semana: 8, finDeSemana: 16 },
    { hour: '01:00 PM', semana: 7, finDeSemana: 14 },
    { hour: '02:00 PM', semana: 5, finDeSemana: 11 },
    { hour: '03:00 PM', semana: 9, finDeSemana: 18 },
    { hour: '04:00 PM', semana: 12, finDeSemana: 24 },
    { hour: '05:00 PM', semana: 14, finDeSemana: 28 },
    { hour: '06:00 PM', semana: 16, finDeSemana: 32 },
    { hour: '07:00 PM', semana: 15, finDeSemana: 30 },
    { hour: '08:00 PM', semana: 10, finDeSemana: 20 },
    { hour: '09:00 PM', semana: 6, finDeSemana: 12 }
  ];

  // Gráfico 2: Recaudación y cortes por barbero
  const barberPerformanceData = barbersList.map(b => ({
    name: b.name.split(' ')[0],
    cortes: b.todayCutsCount || 0,
    ingresos: b.todayEarnings || 0
  }));

  // Gráfico 3: Distribución de Servicios
  const serviceDistributionData = [
    { name: 'Fades Urbanos', value: 45, color: '#C4622D' },
    { name: 'Corte Clásico', value: 25, color: '#D4AF37' },
    { name: 'Barba Ritual', value: 18, color: '#10B981' },
    { name: 'Combos & Arte', value: 12, color: '#3B82F6' }
  ];

  // Modo Fin de Semana Toggle
  const [weekendMode, setWeekendMode] = useState(true);

  // Módulos de Navegación Lateral
  const navItems = [
    { id: 'terminal' as TabType, label: 'Sillones & Turnos en Vivo', sublabel: 'Llamador, tiempo y cobro', icon: Scissors, badge: unifiedQueue.length, badgeColor: 'bg-frank-orange text-white' },
    { id: 'clients' as TabType, label: 'Gestión de Clientes', sublabel: 'Directorio, VIPs y Registro', icon: Users, badge: clients.length },
    { id: 'services' as TabType, label: 'Servicios & Tarifas', sublabel: 'Catálogo CRUD y precios', icon: Tag, badge: servicesList.length },
    { id: 'staff' as TabType, label: 'Staff de Barberos', sublabel: 'Sillones, PINs y CRUD', icon: UserCheck, badge: barbersList.length },
    { id: 'appointments' as TabType, label: 'Citas & Agenda', sublabel: 'Reservas del día', icon: Calendar, badge: 4 },
    { id: 'metrics' as TabType, label: 'Métricas & Fin de Semana', sublabel: 'Gráficos Recharts e ingresos', icon: BarChart3 }
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
            <img
              src="./el_cartel_.png"
              alt="Logo El Cartel"
              className="w-8 h-8 object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
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
                  src="./el_cartel_.png"
                  alt="El Cartel Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = './el_cartel.png';
                  }}
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

            {/* Barber Activo en Turno con Selector Rápido */}
            <div className="mt-4 bg-[#171A22] border border-[#252A38] rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-[#7F8698] tracking-wider">
                  Barbero en Sesión
                </span>
                <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                  Sillón #{activeBarber.chairNumber}
                </span>
              </div>
              <select
                value={activeBarberId}
                onChange={(e) => {
                  setActiveBarberId(e.target.value);
                  localStorage.setItem('el_cartel_active_barber', e.target.value);
                  const b = barbersList.find(x => x.id === e.target.value);
                  if (b) showNotification(`Sesión cambiada a: ${b.name}`);
                }}
                className="w-full bg-[#0D0E11] border border-[#2A3040] rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-frank-orange cursor-pointer"
              >
                {barbersList.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Sillón #{b.chairNumber})
                  </option>
                ))}
              </select>
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
        {/* Barra superior de herramientas */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[#1E222D]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-frank-orange tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EL CARTEL BARBERSHOP · CONTROL OPERATIVO</span>
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
                onClick={handleOpenNewClient}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-frank-orange/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nuevo Cliente</span>
              </button>
            )}

            {activeTab === 'services' && (
              <button
                onClick={handleOpenNewService}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-frank-orange/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nuevo Servicio</span>
              </button>
            )}

            {activeTab === 'staff' && (
              <button
                onClick={handleOpenNewBarber}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-frank-orange to-[#A84F22] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-frank-orange/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nuevo Barbero</span>
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 1. MÓDULO: SILLONES & TURNOS EN VIVO (UNIFICADO)     */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'terminal' && (
          <div className="space-y-6 animate-fadeIn">
            {/* SILLÓN ACTUAL EN ATENCIÓN */}
            <div className="bg-gradient-to-br from-[#181C26] via-[#141720] to-[#0E1017] border border-[#2B313E] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-frank-orange/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#252A38] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-frank-orange/15 border border-frank-orange/30 flex items-center justify-center font-display text-2xl font-bold text-frank-orange">
                    #{activeBarber.chairNumber}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-secondary flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      Sillón Activo · {activeBarber.name}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">
                      {chairClient ? 'ATENDIENDO SERVICIO EN SILLÓN' : 'SILLÓN DISPONIBLE'}
                    </h3>
                  </div>
                </div>

                {chairClient && (
                  <div className="flex items-center gap-4 bg-[#0F1118] border border-[#282E3E] px-5 py-3 rounded-2xl">
                    <Clock className="w-5 h-5 text-frank-orange" />
                    <div>
                      <div className="text-[10px] font-bold text-[#7F8698] uppercase">Tiempo en Corte</div>
                      <div className="font-mono text-2xl font-black text-white tracking-wider">
                        {formatTimer(timerSeconds)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {chairClient ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-frank-orange bg-frank-orange/15 border border-frank-orange/30 px-3 py-1 rounded-lg">
                        Ticket #{chairClient.ticketCode}
                      </span>
                      <h4 className="font-display text-3xl font-bold text-white">
                        {chairClient.clientName}
                      </h4>
                    </div>
                    <div className="text-sm text-[#A0A6B8] flex items-center gap-4">
                      <span>✂️ {chairClient.serviceName}</span>
                      <span className="text-secondary font-bold font-mono">S/. {chairClient.servicePrice.toFixed(2)}</span>
                      <span>📞 {getClientCurrentPhone(chairClient.clientName, chairClient.clientPhone)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          const livePhone = getClientCurrentPhone(chairClient.clientName, chairClient.clientPhone);
                          sendWhatsAppChairReady(chairClient.clientName, livePhone, activeBarber.name, activeBarber.chairNumber);
                        }}
                        className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Avisar por WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Botón de Terminar Turno y Cobrar */}
                  <div className="flex flex-col gap-3 justify-center">
                    <button
                      onClick={handleFinishCurrentCut}
                      className="w-full py-4 px-6 bg-gradient-to-r from-secondary to-emerald-600 hover:brightness-110 text-white font-extrabold uppercase text-sm tracking-wider rounded-2xl shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Receipt className="w-5 h-5" />
                      <span>Terminar Turno y Cobrar</span>
                    </button>
                    <p className="text-[11px] text-center text-[#7F8698]">
                      Genera ticket de venta, suma ganancias y pasa al siguiente cliente.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Scissors className="w-12 h-12 text-[#3A4050] mx-auto mb-3" />
                  <p className="text-sm text-[#8C93A4]">No hay cliente en este sillón en este momento.</p>
                  <p className="text-xs text-[#5C6375] mt-1">Selecciona al siguiente cliente de la cola unificada inferior para llamarlo al sillón.</p>
                </div>
              )}
            </div>

            {/* COLA UNIFICADA (LLEGADA + CITAS PROGRAMADAS) */}
            <div className="bg-[#12141C] border border-[#222634] p-6 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                    COLA UNIFICADA EN VIVO
                  </h3>
                  <p className="text-xs text-[#7F8698]">
                    Clientes en orden de llegada y citas programadas del día listos para atención
                  </p>
                </div>
                <span className="text-xs font-bold text-frank-orange bg-frank-orange/10 border border-frank-orange/30 px-3 py-1.5 rounded-xl">
                  {unifiedQueue.length} personas en espera
                </span>
              </div>

              {unifiedQueue.length === 0 ? (
                <div className="text-center py-10 text-[#6B7280]">
                  <CheckCircle2 className="w-8 h-8 text-secondary mx-auto mb-2" />
                  ¡No hay clientes en espera en este momento! Todos los sillones están al día.
                </div>
              ) : (
                <div className="space-y-3">
                  {unifiedQueue.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#181B25] hover:bg-[#1D212E] border border-[#262B3A] rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#222735] border border-[#2D3344] flex items-center justify-center font-display font-bold text-white text-base">
                          #{item.position}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{item.clientName}</span>
                            <span className="font-mono text-xs text-frank-orange bg-frank-orange/15 px-2 py-0.5 rounded">
                              {item.ticketCode}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              item.type === 'CITA' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {item.type === 'CITA' ? `Cita ${item.scheduledTime}` : 'Orden Llegada'}
                            </span>
                          </div>
                          <div className="text-xs text-[#7F8698] mt-0.5">
                            {item.serviceName} · <span className="text-secondary font-semibold">S/. {item.servicePrice.toFixed(2)}</span> · 📞 {getClientCurrentPhone(item.clientName, item.clientPhone)} · Barbero: {item.barberName}
                          </div>
                        </div>
                      </div>

                      {/* Acciones de Cola */}
                      <div className="flex items-center gap-2">
                        {/* WhatsApp con Ticket */}
                        <button
                          onClick={() => {
                            const livePhone = getClientCurrentPhone(item.clientName, item.clientPhone);
                            sendWhatsAppTicket(item.clientName, livePhone, item.ticketCode, item.position, item.estimatedWaitMin);
                          }}
                          className="p-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                          title="Enviar Ticket y Posición por WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* Posponer +15m */}
                        <button
                          onClick={() => handleDelayQueueItem(item.id)}
                          className="px-2.5 py-2 bg-[#222735] hover:bg-[#2B3142] border border-[#2D3344] text-[#8C93A4] hover:text-white rounded-xl text-xs font-semibold transition-all"
                          title="Posponer turno"
                        >
                          +15m
                        </button>

                        {/* No-Show */}
                        <button
                          onClick={() => handleNoShowQueueItem(item.id, item.clientName)}
                          className="p-2 bg-red-950/30 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-xl text-xs transition-all"
                          title="Marcar No-Show"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Llamar a mi Sillón */}
                        <button
                          onClick={() => handleCallClientDirectly(item)}
                          className="px-4 py-2 bg-frank-orange hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-frank-orange/20 flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Llamar a mi Sillón</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. MÓDULO: GESTIÓN DE CLIENTES (CRUD COMPLETO)       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Buscador y Filtros */}
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
                    clientFilter === 'all' ? 'bg-frank-orange text-white' : 'text-[#8C93A4] hover:text-white'
                  }`}
                >
                  Todos ({clients.length})
                </button>
                <button
                  onClick={() => setClientFilter('vip')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    clientFilter === 'vip' ? 'bg-[#F59E0B] text-black' : 'text-[#8C93A4] hover:text-white'
                  }`}
                >
                  <Award className="w-3 h-3" /> VIP ({clients.filter(c => c.isVIP || c.totalVisits >= 2).length})
                </button>
                <button
                  onClick={() => setClientFilter('waiting')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    clientFilter === 'waiting' ? 'bg-secondary text-white' : 'text-[#8C93A4] hover:text-white'
                  }`}
                >
                  En Espera Hoy ({unifiedQueue.length})
                </button>
              </div>
            </div>

            {/* Tabla de Clientes con Acciones CRUD */}
            <div className="bg-[#12141C] border border-[#222634] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181B25] text-[#7F8698] uppercase tracking-wider font-semibold border-b border-[#222634]">
                    <tr>
                      <th className="py-3.5 px-4">Cliente</th>
                      <th className="py-3.5 px-4">Celular / WhatsApp</th>
                      <th className="py-3.5 px-4 text-center">Visitas</th>
                      <th className="py-3.5 px-4">Último Servicio</th>
                      <th className="py-3.5 px-4 text-right">Acciones CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D212D]">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-[#161922] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#202430] border border-[#2E3445] flex items-center justify-center font-display font-bold text-white text-base">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{client.name}</span>
                                {(client.isVIP || client.totalVisits >= 2) && (
                                  <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#71788A] truncate max-w-[200px]">
                                {client.email || 'Cliente Frecuente'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white text-xs">{client.phone}</span>
                            <a
                              href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(client.name)},%20te%20escribimos%20de%20EL%20CARTEL%20BARBERSHOP.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="inline-block bg-[#1B1E29] border border-[#2B3142] px-2.5 py-1 rounded-lg font-bold text-white font-mono">
                            {client.totalVisits} visitas
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{client.lastService}</div>
                          <div className="text-[11px] text-[#71788A]">Barbero: {client.lastBarber}</div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedClientForNotes(client)}
                              className="p-2 bg-[#1C202C] hover:bg-[#252A3A] border border-[#2B3142] text-[#8C93A4] hover:text-white rounded-lg"
                              title="Ver ficha"
                            >
                              <Users className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditClient(client)}
                              className="p-2 bg-[#1C202C] hover:bg-[#252A3A] border border-[#2B3142] text-frank-gold hover:text-white rounded-lg"
                              title="Editar cliente"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id, client.name)}
                              className="p-2 bg-red-950/30 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg"
                              title="Eliminar cliente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. MÓDULO: SERVICIOS & TARIFAS (CRUD COMPLETO)       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {servicesList.map((svc) => (
                <div key={svc.id} className="bg-[#12141C] border border-[#222634] p-5 rounded-2xl flex flex-col justify-between group hover:border-[#333A4E] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-frank-orange uppercase tracking-wider bg-frank-orange/10 px-2 py-0.5 rounded border border-frank-orange/20">
                        {svc.category}
                      </span>
                      <span className={`text-xs font-bold flex items-center gap-1 ${svc.isActive ? 'text-secondary' : 'text-[#6B7280]'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {svc.isActive ? 'Activo' : 'Pausado'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base mb-1">{svc.name}</h4>
                    <p className="text-xs text-[#7F8698] mb-3 line-clamp-2">{svc.description || 'Servicio clásico de barbería'}</p>
                    <div className="text-xs text-[#A0A6B8] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-frank-orange" /> {svc.durationMinutes} minutos aprox.
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1F232F] flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-white">
                      S/. {Number(svc.price).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditService(svc)}
                        className="p-2 bg-[#1B1E29] hover:bg-[#252A38] border border-[#2A3040] text-frank-gold hover:text-white rounded-lg transition-colors"
                        title="Editar servicio"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id, svc.name)}
                        className="p-2 bg-red-950/30 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg transition-colors"
                        title="Eliminar servicio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. MÓDULO: STAFF DE BARBEROS (CRUD COMPLETO & PIN)   */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {barbersList.map((barber) => (
                <div key={barber.id} className="bg-[#12141C] border border-[#222634] p-6 rounded-3xl flex flex-col justify-between group hover:border-[#383F54] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E222D] to-[#141720] border border-frank-orange/40 flex items-center justify-center font-display text-2xl font-bold text-white">
                        #{barber.chairNumber}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        barber.status === 'ACTIVE' ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {barber.status === 'ACTIVE' ? 'En Servicio' : 'En Descanso'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-lg">{barber.name}</h4>
                    <p className="text-xs text-frank-orange font-semibold mb-1">Sillón #{barber.chairNumber}</p>
                    <p className="text-xs text-[#7F8698] mb-3">{barber.specialty || 'Master Barber'}</p>

                    <div className="bg-[#181B25] p-3 rounded-xl border border-[#232733] space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#7F8698]">PIN Personal:</span>
                        <span className="font-mono font-bold text-frank-gold">{barber.pin || '1234'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7F8698]">Cortes Hoy:</span>
                        <span className="font-bold text-white">{barber.todayCutsCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7F8698]">Recaudado:</span>
                        <span className="font-mono font-bold text-secondary">S/. {(barber.todayEarnings || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#1F232F] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveBarberId(barber.id);
                        localStorage.setItem('el_cartel_active_barber', barber.id);
                        showNotification(`Sesión cambiada a: ${barber.name}`);
                      }}
                      className="px-3 py-1.5 bg-frank-orange/15 hover:bg-frank-orange text-frank-orange hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Operar Este Sillón
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditBarber(barber)}
                        className="p-2 bg-[#1B1E29] hover:bg-[#252A38] border border-[#2A3040] text-frank-gold hover:text-white rounded-lg"
                        title="Editar barbero"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBarber(barber.id, barber.name)}
                        className="p-2 bg-red-950/30 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg"
                        title="Eliminar barbero"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 5. MÓDULO: CITAS & AGENDA                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#12141C] border border-[#222634] rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-white mb-4">Agenda del Día (Citas Fijas)</h3>
              <div className="space-y-3">
                {[
                  { time: '11:00 AM', name: 'Alonso Vera', phone: '+51 987 111 222', service: 'Fade Urbano + Barba', barber: 'Frank Master', status: 'COMPLETADA' },
                  { time: '01:30 PM', name: 'Diego Morales', phone: '+51 991 234 567', service: 'Buzz Cut + Diseños', barber: 'Mateo Fade', status: 'EN ATENCIÓN' },
                  { time: '04:30 PM', name: 'Carlos Mendoza', phone: '+51 987 654 321', service: 'Fade Urbano Cartel', barber: 'Frank Master', status: 'CONFIRMADA' },
                  { time: '06:00 PM', name: 'Renato Silva', phone: '+51 933 222 111', service: 'Corte Clásico Ejecutivo', barber: 'Santi Style', status: 'PENDIENTE' }
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
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(apt.name)},%20te%20recordamos%20tu%20cita%20hoy%20a%20las%20${apt.time}%20en%20EL%20CARTEL.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Confirmar WhatsApp</span>
                      </a>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${
                        apt.status === 'COMPLETADA' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                        apt.status === 'EN ATENCIÓN' ? 'bg-frank-orange/10 text-frank-orange border-frank-orange/30' :
                        apt.status === 'CONFIRMADA' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 6. MÓDULO: MÉTRICAS & FIN DE SEMANA (RECHARTS)       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Banner de Modo Fin de Semana */}
            <div className="bg-gradient-to-r from-[#171A24] via-[#141620] to-[#12141C] border border-[#252A38] p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-frank-orange font-bold text-xs uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4 text-frank-orange" />
                  <span>MODO FIN DE SEMANA (ALTO FLUJO & SATURACIÓN)</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Optimización de Capacidad y Tiempos de Espera
                </h3>
                <p className="text-xs text-[#7F8698] max-w-xl mt-1">
                  Prioriza el flujo por orden de llegada, reduce el buffer entre cortes a 15 minutos y envía notificaciones automáticas por WhatsApp para que los clientes esperen en la zona lounge.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setWeekendMode(!weekendMode);
                    showNotification(weekendMode ? 'Modo Fin de Semana Pausado' : '¡Modo Fin de Semana Activado!');
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                    weekendMode
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                      : 'bg-[#222735] text-[#8C93A4] hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{weekendMode ? 'Modo Fin de Semana: ACTIVO' : 'Modo Estándar'}</span>
                </button>
              </div>
            </div>

            {/* KPI Cards de Finanzas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Ganancias del Día</div>
                <div className="font-display text-3xl font-bold text-secondary mt-1">
                  S/. {totalRevenueToday.toFixed(2)}
                </div>
                <div className="text-[10px] text-secondary font-semibold mt-1">
                  {totalCutsToday} servicios cobrados
                </div>
              </div>

              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Ticket Promedio</div>
                <div className="font-display text-3xl font-bold text-frank-gold mt-1">
                  S/. {totalCutsToday > 0 ? (totalRevenueToday / totalCutsToday).toFixed(2) : '35.00'}
                </div>
                <div className="text-[10px] text-frank-gold font-semibold mt-1">Por cliente atendido</div>
              </div>

              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Tiempo Prom. de Corte</div>
                <div className="font-display text-3xl font-bold text-white mt-1">
                  {avgCutDuration} min
                </div>
                <div className="text-[10px] text-secondary font-semibold mt-1">Ritmo ágil y pulido</div>
              </div>

              <div className="bg-[#12141C] border border-[#222634] p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-[#7F8698] uppercase">Clientes en Espera</div>
                <div className="font-display text-3xl font-bold text-frank-orange mt-1">
                  {unifiedQueue.length}
                </div>
                <div className="text-[10px] text-frank-orange font-semibold mt-1">
                  {unifiedQueue.length * 18} min cola total aprox.
                </div>
              </div>
            </div>

            {/* GRÁFICOS RECHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 1: Demanda Horaria (Curva de Saturación Fin de Semana vs Semana) */}
              <div className="bg-[#12141C] border border-[#222634] p-6 rounded-3xl">
                <h4 className="font-display text-xl font-bold text-white mb-1">
                  Flujo de Clientes por Hora (Saturación)
                </h4>
                <p className="text-xs text-[#7F8698] mb-4">
                  Comparativa de afluencia: Día de semana vs. Fin de Semana de alto flujo
                </p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFinde" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C4622D" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#C4622D" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorSemana" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" />
                      <XAxis dataKey="hour" stroke="#6B7280" fontSize={10} tickLine={false} />
                      <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#13151B', borderColor: '#262B3A', borderRadius: '12px', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="finDeSemana" name="Fin de Semana (Pico)" stroke="#C4622D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFinde)" />
                      <Area type="monotone" dataKey="semana" name="Lunes a Jueves" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSemana)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Recaudación y Rendimiento por Barbero */}
              <div className="bg-[#12141C] border border-[#222634] p-6 rounded-3xl">
                <h4 className="font-display text-xl font-bold text-white mb-1">
                  Recaudación por Barbero (S/.)
                </h4>
                <p className="text-xs text-[#7F8698] mb-4">
                  Ingresos acumulados en el día por sillón de trabajo
                </p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barberPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#13151B', borderColor: '#262B3A', borderRadius: '12px', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="ingresos" name="Ingresos (S/.)" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="cortes" name="Cantidad Cortes" fill="#C4622D" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* HISTORIAL DE TICKETS DE VENTA EMITIDOS */}
            <div className="bg-[#12141C] border border-[#222634] rounded-3xl p-6">
              <h4 className="font-display text-xl font-bold text-white mb-4">
                Comprobantes & Ventas Registradas Hoy
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181B25] text-[#7F8698] uppercase tracking-wider font-semibold border-b border-[#222634]">
                    <tr>
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Servicio & Barbero</th>
                      <th className="py-3 px-4 text-center">Duración</th>
                      <th className="py-3 px-4">Pago</th>
                      <th className="py-3 px-4 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D212D]">
                    {salesHistory.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#161922] transition-colors">
                        <td className="py-3 px-4 font-mono text-[#8C93A4]">{tx.createdAt}</td>
                        <td className="py-3 px-4 font-mono font-bold text-frank-orange">{tx.ticketCode}</td>
                        <td className="py-3 px-4 font-bold text-white">{tx.clientName}</td>
                        <td className="py-3 px-4 text-[#A0A6B8]">
                          {tx.serviceName} · <span className="text-xs text-frank-gold font-semibold">{tx.barberName}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono">{tx.durationMinutes} min</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B1E29] border border-[#2C3142] text-[#8C93A4]">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-secondary">
                          S/. {tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* MODAL: TICKET DE VENTA / COBRO DE SERVICIO          */}
      {/* ---------------------------------------------------- */}
      {isReceiptModalOpen && activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute top-5 right-5 text-[#7F8698] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-[#252A38] mb-5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto mb-2 text-secondary">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                TICKET DE VENTA & COBRO
              </h3>
              <p className="text-xs text-[#7F8698]">EL CARTEL BARBERSHOP · Comprobante Digital</p>
            </div>

            <div className="space-y-3 bg-[#1C202C] p-4 rounded-2xl border border-[#262B3A] text-xs">
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Ticket / Turno:</span>
                <span className="font-mono font-bold text-frank-orange">#{activeReceipt.ticketCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Cliente:</span>
                <span className="font-bold text-white">{activeReceipt.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Servicio:</span>
                <span className="font-semibold text-white">{activeReceipt.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Barbero:</span>
                <span className="font-semibold text-frank-gold">{activeReceipt.barberName} (Sillón #{activeReceipt.chairNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7F8698]">Tiempo Real en Sillón:</span>
                <span className="font-mono font-bold text-white">{activeReceipt.durationMinutes} minutos</span>
              </div>

              {/* Selector de Método de Pago */}
              <div className="pt-2 border-t border-[#262B3A]">
                <label className="text-[#7F8698] block mb-1.5 font-semibold">Método de Pago:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['YAPE', 'PLIN', 'EFECTIVO', 'TARJETA'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setActiveReceipt({ ...activeReceipt, paymentMethod: method })}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[10px] transition-all border ${
                        activeReceipt.paymentMethod === method
                          ? 'bg-frank-orange text-white border-frank-orange'
                          : 'bg-[#14161F] text-[#8C93A4] border-[#2A3040] hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monto Total */}
              <div className="pt-3 border-t border-[#262B3A] flex justify-between items-center">
                <span className="text-sm font-bold text-white uppercase">Total a Cobrar:</span>
                <span className="font-display text-3xl font-bold text-secondary">
                  S/. {activeReceipt.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleConfirmPaymentAndCallNext}
                className="w-full py-3.5 bg-gradient-to-r from-secondary to-emerald-600 hover:brightness-110 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Cobro y Llamar Siguiente</span>
              </button>

              <button
                onClick={() => sendWhatsAppReceipt(activeReceipt)}
                className="w-full py-2.5 bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Comprobante por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: CRUD DE SERVICIO (CREAR / EDITAR)            */}
      {/* ---------------------------------------------------- */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setIsServiceModalOpen(false)} className="absolute top-5 right-5 text-[#7F8698] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Nombre del Servicio</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Ej: Fade Urbano Especial"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Precio (S/.)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Duración (Minutos)</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={serviceForm.durationMinutes}
                    onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Categoría</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                >
                  <option value="CORTES">CORTES</option>
                  <option value="BARBA">BARBA</option>
                  <option value="COMBOS">COMBOS</option>
                  <option value="ARTE">ARTE / FREESTYLE</option>
                  <option value="TRATAMIENTOS">TRATAMIENTOS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Descripción</label>
                <input
                  type="text"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Detalle o acabado especial"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="serviceActiveCheck"
                  checked={serviceForm.isActive}
                  onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                  className="rounded text-frank-orange"
                />
                <label htmlFor="serviceActiveCheck" className="text-xs text-white font-semibold">
                  Servicio activo en catálogo
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 bg-[#1C202C] text-xs text-[#8C93A4] rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-frank-orange text-white text-xs font-bold rounded-xl shadow-lg shadow-frank-orange/20">Guardar Servicio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: CRUD DE BARBERO (CREAR / EDITAR)             */}
      {/* ---------------------------------------------------- */}
      {isBarberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setIsBarberModalOpen(false)} className="absolute top-5 right-5 text-[#7F8698] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              {editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}
            </h3>
            <form onSubmit={handleSaveBarber} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={barberForm.name}
                  onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                  placeholder="Ej: Frank Master"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Número de Sillón</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={barberForm.chairNumber}
                    onChange={(e) => setBarberForm({ ...barberForm, chairNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8C93A4] mb-1">PIN Personal de Login</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={barberForm.pin}
                    onChange={(e) => setBarberForm({ ...barberForm, pin: e.target.value })}
                    className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-frank-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Especialidad</label>
                <input
                  type="text"
                  value={barberForm.specialty}
                  onChange={(e) => setBarberForm({ ...barberForm, specialty: e.target.value })}
                  placeholder="Ej: Fades, Navaja y Barba"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Estado</label>
                <select
                  value={barberForm.status}
                  onChange={(e) => setBarberForm({ ...barberForm, status: e.target.value as any })}
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                >
                  <option value="ACTIVE">En Servicio (Activo)</option>
                  <option value="BREAK">En Descanso</option>
                  <option value="OFFLINE">Fuera de Línea</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button type="button" onClick={() => setIsBarberModalOpen(false)} className="px-4 py-2 bg-[#1C202C] text-xs text-[#8C93A4] rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-frank-orange text-white text-xs font-bold rounded-xl shadow-lg shadow-frank-orange/20">Guardar Barbero</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: CRUD DE CLIENTE (CREAR / EDITAR)             */}
      {/* ---------------------------------------------------- */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setIsClientModalOpen(false)} className="absolute top-5 right-5 text-[#7F8698] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              {editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
            </h3>
            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  placeholder="Ej: Mario Vargas"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  placeholder="Ej: +51 987 654 321"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  placeholder="cliente@correo.com"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C93A4] mb-1">Notas de Estilo y Preferencias</label>
                <input
                  type="text"
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  placeholder="Ej: Degradado en 0, navaja caliente, cera mate"
                  className="w-full bg-[#1C202C] border border-[#2A3040] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-frank-orange"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="clientVIPCheck"
                  checked={clientForm.isVIP}
                  onChange={(e) => setClientForm({ ...clientForm, isVIP: e.target.checked })}
                  className="rounded text-frank-orange"
                />
                <label htmlFor="clientVIPCheck" className="text-xs text-white font-semibold">
                  Marcar como Cliente VIP / Frecuente
                </label>
              </div>

              {!editingClient && (
                <div className="p-3 bg-[#1C202C] rounded-xl border border-[#262B3A] space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addToQueueCheck"
                      checked={clientForm.addToQueueNow}
                      onChange={(e) => setClientForm({ ...clientForm, addToQueueNow: e.target.checked })}
                      className="rounded text-frank-orange"
                    />
                    <label htmlFor="addToQueueCheck" className="text-xs text-white font-bold">
                      Ingresar directamente a la cola de hoy
                    </label>
                  </div>
                  {clientForm.addToQueueNow && (
                    <select
                      value={clientForm.selectedServiceId}
                      onChange={(e) => setClientForm({ ...clientForm, selectedServiceId: e.target.value })}
                      className="w-full bg-[#14161F] border border-[#2A3040] rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      {servicesList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} - S/. {Number(s.price).toFixed(2)}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="pt-3 flex justify-end gap-3">
                <button type="button" onClick={() => setIsClientModalOpen(false)} className="px-4 py-2 bg-[#1C202C] text-xs text-[#8C93A4] rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-frank-orange text-white text-xs font-bold rounded-xl shadow-lg shadow-frank-orange/20">Guardar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: VER FICHA & HISTORIAL DEL CLIENTE            */}
      {/* ---------------------------------------------------- */}
      {selectedClientForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151821] border border-[#2A3040] w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setSelectedClientForNotes(null)} className="absolute top-5 right-5 text-[#7F8698] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-frank-orange/15 border border-frank-orange/30 flex items-center justify-center font-display text-2xl font-bold text-frank-orange">
                {selectedClientForNotes.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-white">{selectedClientForNotes.name}</h3>
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
              <div className="pt-2 border-t border-[#262B3A]">
                <span className="text-[#7F8698] block mb-1">Notas de Estilo y Preferencias:</span>
                <p className="text-white bg-[#14161F] p-2.5 rounded-xl border border-[#232733] italic">
                  "{selectedClientForNotes.notes || 'Sin especificaciones registradas'}"
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
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
                  setUnifiedQueue(prev => [
                    ...prev,
                    {
                      id: `q-${Date.now()}`,
                      ticketCode: `C-0${prev.length + 2}`,
                      clientName: selectedClientForNotes.name,
                      clientPhone: selectedClientForNotes.phone,
                      serviceName: selectedClientForNotes.lastService || 'Corte Clásico',
                      servicePrice: 35,
                      barberName: activeBarber.name,
                      position: prev.length + 1,
                      type: 'LLEGADA',
                      estimatedWaitMin: (prev.length + 1) * 18
                    }
                  ]);
                  setSelectedClientForNotes(null);
                  showNotification(`¡${selectedClientForNotes.name} agregado a la cola de hoy!`);
                }}
                className="flex-1 py-2.5 bg-frank-orange hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all text-center"
              >
                Poner en Fila Hoy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
