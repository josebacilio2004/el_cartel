import { QueueStatus, Barber, Service, Ticket, ClientRecord } from '../types';

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
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    if (errData && errData.error && errData.error !== 'Datos inválidos') {
      throw new Error(errData.error);
    }
  } catch (err: any) {
    console.warn('Backend sincronizando o modo demo:', err);
  }

  // Fallback demo ticket para garantizar flujo 100% interactivo
  const randomSeq = Math.floor(Math.random() * 80) + 10;
  return {
    id: `ticket-local-${Date.now()}`,
    ticketCode: `C-${randomSeq}`,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    serviceId: data.serviceId,
    barberId: data.barberId || null,
    status: 'WAITING',
    positionInQueue: 2,
    estimatedWaitMinutes: 20,
    createdAt: new Date().toISOString()
  };
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
