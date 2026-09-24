import { QueueStatus, Barber, Service, Ticket } from '../types';

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

export async function createTicket(data: {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberId?: string | null;
}): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/api/queue/ticket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al generar ticket');
  }
  return res.json();
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
