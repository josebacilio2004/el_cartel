import { QueueStatus, Barber, Service, Ticket, ClientRecord, AppointmentRecord } from '../types';
import { generateUniqueTicketCode } from '../utils/ticketHelper';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchQueueStatus(): Promise<QueueStatus> {
  const res = await fetch(`${API_BASE}/api/queue/status`);
  if (!res.ok) throw new Error('Error al obtener estado de cola');
  return res.json();
}

export async function fetchBarbers(): Promise<Barber[]> {
  const res = await fetch(`${API_BASE}/api/barbers`);
  if (!res.ok) throw new Error('Error al obtener barberos');
  return res.json();
}

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/api/barbers/services`);
  if (!res.ok) throw new Error('Error al obtener servicios');
  return res.json();
}

export async function fetchClients(): Promise<ClientRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/api/queue/clients`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Backend clients endpoint no disponible, usando caché local demo');
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
      currentStatus: 'IN_CHAIR',
      currentTicketCode: 'C-01',
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
      currentStatus: 'WAITING',
      currentTicketCode: 'C-02',
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
      currentStatus: 'WAITING',
      currentTicketCode: 'C-03',
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
      currentStatus: 'COMPLETED',
      currentTicketCode: 'C-98',
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
      currentStatus: 'COMPLETED',
      currentTicketCode: 'C-82',
      isVIP: false,
      notes: 'Prefiere corte rápido sin lavado posterior.',
      email: 'svidal@gmail.com'
    },
    {
      id: 'cli-06',
      name: 'Gabriel Quintana',
      phone: '+51 941 556 789',
      totalVisits: 6,
      lastService: 'Alisado & Keratina Masculina',
      lastBarber: 'Frank Master',
      lastDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      currentStatus: 'COMPLETED',
      currentTicketCode: 'C-71',
      isVIP: true,
      notes: 'Tratamiento capilar cada 2 semanas. Muy puntual.',
      email: 'gabriel.q@gmail.com'
    }
  ];
}

export async function updateClientInBackend(name: string, phone: string, notes?: string) {
  try {
    const res = await fetch(`${API_BASE}/api/queue/clients`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, notes })
    });
    if (!res.ok) throw new Error('Error al actualizar cliente');
    return await res.json();
  } catch (err) {
    console.warn('Backend update client offline fallback:', err);
  }
}

export async function createTicket(data: {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberId?: string | null;
  scheduledTime?: string;
  scheduledDate?: string;
}): Promise<Ticket> {
  try {
    const res = await fetch(`${API_BASE}/api/queue/ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        clientPhone: data.clientPhone ? data.clientPhone.trim() : ''
      })
    });
    if (res.ok) {
      const ticketResult: Ticket = await res.json();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartel_ticket_created', { detail: ticketResult }));
      }
      return ticketResult;
    }
    const errData = await res.json().catch(() => ({}));
    if (errData && errData.error && errData.error !== 'Datos inválidos') {
      throw new Error(errData.error);
    }
  } catch (err: any) {
    console.warn('Backend sincronizando o modo demo:', err);
  }

  // Fallback demo ticket garantizando código único sin duplicados
  let existingList: any[] = [];
  try {
    const raw = localStorage.getItem('el_cartel_unified_queue');
    if (raw) existingList = JSON.parse(raw);
  } catch (e) {}

  const uniqueCode = generateUniqueTicketCode(existingList);
  const fallbackTicket: Ticket = {
    id: `ticket-local-${Date.now()}`,
    ticketCode: uniqueCode,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    serviceId: data.serviceId,
    barberId: data.barberId || null,
    status: 'WAITING',
    positionInQueue: existingList.length + 1,
    estimatedWaitMinutes: (existingList.length + 1) * 20,
    scheduledTime: data.scheduledTime || null,
    ticketType: data.scheduledTime ? 'CITA' : 'LLEGADA',
    createdAt: new Date().toISOString()
  };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cartel_ticket_created', { detail: fallbackTicket }));
  }
  return fallbackTicket;
}

export async function callNextTicket(barberId: string, currentTicketId?: string | null) {
  const res = await fetch(`${API_BASE}/api/queue/call-next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barberId, currentTicketId })
  });
  if (!res.ok) throw new Error('Error al llamar al siguiente cliente');
  return res.json();
}

export async function delayTicket(ticketId: string, delayMinutes: number = 15) {
  const res = await fetch(`${API_BASE}/api/queue/delay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId, delayMinutes })
  });
  if (!res.ok) throw new Error('Error al posponer turno');
  return res.json();
}

export async function markTicketNoShow(ticketId: string) {
  const res = await fetch(`${API_BASE}/api/queue/no-show`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId })
  });
  if (!res.ok) throw new Error('Error al marcar cliente como no-show');
  return res.json();
}

/**
 * Conexión en tiempo real vía Server-Sent Events (SSE)
 */
export function subscribeToQueueUpdates(onUpdate: (data: QueueStatus) => void): () => void {
  const eventSource = new EventSource(`${API_BASE}/api/queue/stream`);

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (parsed.event === 'QUEUE_UPDATED' && parsed.payload) {
        onUpdate(parsed.payload);
      }
    } catch (err) {
      console.warn('Error al procesar SSE event:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.warn('Conexión SSE perdida, intentando reconectar...', err);
  };

  return () => {
    eventSource.close();
  };
}

/**
 * Obtener citas agendadas independientes por barbero (sincronizado con Seeder de BD)
 */
export async function fetchAppointments(barberId?: string): Promise<AppointmentRecord[]> {
  try {
    const url = barberId ? `${API_BASE}/api/queue/appointments?barberId=${barberId}` : `${API_BASE}/api/queue/appointments`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend appointments offline/demo fallback:', err);
  }

  // Fallback idéntico al Seeder oficial de Prisma
  const today = new Date();
  const formatTime = (hours: number, minutes: number) => {
    const d = new Date(today);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const seedAppointments: AppointmentRecord[] = [
    // 1. Frank Master (b1 / Sillon 1)
    {
      id: 'apt-frank-1',
      clientName: 'Alonso Vera',
      clientPhone: '+51 987 111 222',
      barberId: 'b1',
      serviceId: 's1',
      startTime: formatTime(11, 0),
      endTime: formatTime(11, 45),
      status: 'COMPLETED',
      notes: 'Cliente fijo. Fade alto y navaja.',
      barber: { id: 'b1', name: 'Frank Master', chairNumber: 1, specialty: 'Fades & Ritual de Barba', status: 'ACTIVE' },
      service: { id: 's1', name: 'Fade Urbano + Barba Perfilada', price: 45, durationMinutes: 45, category: 'CORTES', isActive: true }
    },
    {
      id: 'apt-frank-2',
      clientName: 'Rodrigo Santillán',
      clientPhone: '+51 922 431 880',
      barberId: 'b1',
      serviceId: 's3',
      startTime: formatTime(16, 30),
      endTime: formatTime(17, 0),
      status: 'CONFIRMED',
      notes: 'Socio VIP. Toalla caliente y aceites.',
      barber: { id: 'b1', name: 'Frank Master', chairNumber: 1, specialty: 'Fades & Ritual de Barba', status: 'ACTIVE' },
      service: { id: 's3', name: 'Ritual Barba & Toalla Caliente', price: 25, durationMinutes: 25, category: 'BARBA', isActive: true }
    },
    {
      id: 'apt-frank-3',
      clientName: 'Gianfranco Rossi',
      clientPhone: '+51 998 776 554',
      barberId: 'b1',
      serviceId: 's4',
      startTime: formatTime(18, 30),
      endTime: formatTime(19, 20),
      status: 'CONFIRMED',
      notes: 'Corte completo y barba perfilada.',
      barber: { id: 'b1', name: 'Frank Master', chairNumber: 1, specialty: 'Fades & Ritual de Barba', status: 'ACTIVE' },
      service: { id: 's4', name: 'Combo El Cartel (Corte + Barba)', price: 50, durationMinutes: 50, category: 'COMBOS', isActive: true }
    },

    // 2. Mateo Fade (b2 / Sillon 2)
    {
      id: 'apt-mateo-1',
      clientName: 'Kevin Salcedo',
      clientPhone: '+51 992 334 455',
      barberId: 'b2',
      serviceId: 's5',
      startTime: formatTime(13, 30),
      endTime: formatTime(14, 15),
      status: 'IN_PROGRESS',
      notes: 'Buzz Cut con diseños tribales en lateral.',
      barber: { id: 'b2', name: 'Mateo Fade', chairNumber: 2, specialty: 'Diseños Urbanos & Taper', status: 'ACTIVE' },
      service: { id: 's5', name: 'Buzz Cut + Diseños Tribales', price: 35, durationMinutes: 35, category: 'ARTE', isActive: true }
    },
    {
      id: 'apt-mateo-2',
      clientName: 'Christian Benavides',
      clientPhone: '+51 983 445 566',
      barberId: 'b2',
      serviceId: 's1',
      startTime: formatTime(15, 45),
      endTime: formatTime(16, 30),
      status: 'CONFIRMED',
      notes: 'Taper Fade texturizado.',
      barber: { id: 'b2', name: 'Mateo Fade', chairNumber: 2, specialty: 'Diseños Urbanos & Taper', status: 'ACTIVE' },
      service: { id: 's1', name: 'Fade Urbano Cartel', price: 35, durationMinutes: 35, category: 'CORTES', isActive: true }
    },
    {
      id: 'apt-mateo-3',
      clientName: 'Bryan Palacios',
      clientPhone: '+51 974 556 677',
      barberId: 'b2',
      serviceId: 's4',
      startTime: formatTime(17, 15),
      endTime: formatTime(18, 5),
      status: 'CONFIRMED',
      notes: 'Freestyle urbano + cejas.',
      barber: { id: 'b2', name: 'Mateo Fade', chairNumber: 2, specialty: 'Diseños Urbanos & Taper', status: 'ACTIVE' },
      service: { id: 's4', name: 'Combo El Cartel (Corte + Barba)', price: 50, durationMinutes: 50, category: 'COMBOS', isActive: true }
    },

    // 3. Santi Style (b3 / Sillon 3)
    {
      id: 'apt-santi-1',
      clientName: 'Renato Silva',
      clientPhone: '+51 933 222 111',
      barberId: 'b3',
      serviceId: 's2',
      startTime: formatTime(12, 0),
      endTime: formatTime(12, 30),
      status: 'COMPLETED',
      notes: 'Corte clásico ejecutivo a tijera.',
      barber: { id: 'b3', name: 'Santi Style', chairNumber: 3, specialty: 'Cortes Clásicos & Texturizados', status: 'ACTIVE' },
      service: { id: 's2', name: 'Corte Clásico Ejecutivo', price: 30, durationMinutes: 30, category: 'CORTES', isActive: true }
    },
    {
      id: 'apt-santi-2',
      clientName: 'Mauricio Alarcón',
      clientPhone: '+51 965 667 788',
      barberId: 'b3',
      serviceId: 's2',
      startTime: formatTime(14, 30),
      endTime: formatTime(15, 0),
      status: 'CONFIRMED',
      notes: 'Pompadour clásico y peinado formal.',
      barber: { id: 'b3', name: 'Santi Style', chairNumber: 3, specialty: 'Cortes Clásicos & Texturizados', status: 'ACTIVE' },
      service: { id: 's2', name: 'Corte Clásico Ejecutivo', price: 30, durationMinutes: 30, category: 'CORTES', isActive: true }
    },
    {
      id: 'apt-santi-3',
      clientName: 'Gabriel Quintana',
      clientPhone: '+51 941 556 789',
      barberId: 'b3',
      serviceId: 's3',
      startTime: formatTime(19, 0),
      endTime: formatTime(19, 30),
      status: 'CONFIRMED',
      notes: 'Ritual barba y toalla caliente.',
      barber: { id: 'b3', name: 'Santi Style', chairNumber: 3, specialty: 'Cortes Clásicos & Texturizados', status: 'ACTIVE' },
      service: { id: 's3', name: 'Ritual Barba & Toalla Caliente', price: 25, durationMinutes: 25, category: 'BARBA', isActive: true }
    }
  ];

  if (barberId) {
    return seedAppointments.filter(a => a.barberId === barberId);
  }
  return seedAppointments;
}

// -------------------------------------------------------------
// CRUD BARBEROS
// -------------------------------------------------------------
export async function createBarberApi(data: Partial<Barber>): Promise<Barber> {
  const res = await fetch(`${API_BASE}/api/barbers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al registrar barbero en el servidor');
  return res.json();
}

export async function updateBarberApi(id: string, data: Partial<Barber>): Promise<Barber> {
  const res = await fetch(`${API_BASE}/api/barbers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar barbero en el servidor');
  return res.json();
}

export async function deleteBarberApi(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/barbers/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar barbero en el servidor');
  return res.json();
}

// -------------------------------------------------------------
// CRUD SERVICIOS
// -------------------------------------------------------------
export async function createServiceApi(data: Partial<Service>): Promise<Service> {
  const res = await fetch(`${API_BASE}/api/barbers/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear servicio en el servidor');
  return res.json();
}

export async function updateServiceApi(id: string, data: Partial<Service>): Promise<Service> {
  const res = await fetch(`${API_BASE}/api/barbers/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar servicio en el servidor');
  return res.json();
}

export async function deleteServiceApi(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/barbers/services/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar servicio en el servidor');
  return res.json();
}

// -------------------------------------------------------------
// CRUD CITAS
// -------------------------------------------------------------
export async function createAppointmentApi(data: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
  const res = await fetch(`${API_BASE}/api/queue/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear cita en el servidor');
  return res.json();
}

export async function updateAppointmentApi(id: string, data: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
  const res = await fetch(`${API_BASE}/api/queue/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar cita en el servidor');
  return res.json();
}

export async function deleteAppointmentApi(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/queue/appointments/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar cita en el servidor');
  return res.json();
}

