import { prisma } from '../config/prisma';
import { TicketStatus, BarberStatus } from '@prisma/client';
import { realtimeService } from './realtime.service';

export class QueueService {
  /**
   * Obtiene el estado general de la cola en vivo:
   * - Clientes en silla
   * - Lista de espera ordenada por prioridad/posición
   * - Estadísticas del día
   */
  public async getQueueStatus() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [inChairTickets, waitingTickets, servedCount, barbers, settings] = await Promise.all([
      // Clientes siendo atendidos actualmente
      prisma.ticket.findMany({
        where: {
          status: TicketStatus.IN_CHAIR,
          createdAt: { gte: todayStart }
        },
        include: {
          service: true,
          barber: true
        }
      }),

      // Clientes en espera ordenados
      prisma.ticket.findMany({
        where: {
          status: TicketStatus.WAITING,
          createdAt: { gte: todayStart }
        },
        include: {
          service: true,
          barber: true
        },
        orderBy: [
          { positionInQueue: 'asc' },
          { createdAt: 'asc' }
        ]
      }),

      // Clientes completados hoy
      prisma.ticket.count({
        where: {
          status: TicketStatus.COMPLETED,
          createdAt: { gte: todayStart }
        }
      }),

      // Barberos activos
      prisma.barber.findMany({
        where: { status: { not: BarberStatus.OFFLINE } },
        orderBy: { chairNumber: 'asc' }
      }),

      // Configuración de la barbería
      prisma.shopSetting.findFirst()
    ]);

    // Calcular tiempo de espera promedio estimado
    const nextEstimatedMinutes = waitingTickets.length > 0 
      ? waitingTickets[0].estimatedWaitMinutes 
      : 0;

    return {
      inChair: inChairTickets,
      waiting: waitingTickets,
      totalWaiting: waitingTickets.length,
      servedToday: servedCount,
      estimatedNextWaitMinutes: nextEstimatedMinutes,
      barbers,
      settings: settings || {
        isWeekendMode: true,
        maxQueueCapacity: 25,
        bufferMinutesBetweenCuts: 5
      }
    };
  }

  /**
   * Genera un nuevo Ticket atómico (Walk-in)
   */
  public async createTicket(data: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    barberId?: string | null;
  }) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Contar tickets de hoy para generar el código secuencial (B-01, B-02...)
    const countToday = await prisma.ticket.count({
      where: { createdAt: { gte: todayStart } }
    });

    const sequenceNum = countToday + 1;
    const ticketCode = `C-${sequenceNum < 10 ? '0' + sequenceNum : sequenceNum}`;

    // Obtener servicio para saber duración con fallback seguro
    let service = null;
    try {
      service = await prisma.service.findUnique({
        where: { id: data.serviceId }
      });
    } catch (e) {
      // Ignorar formato no-uuid
    }

    if (!service) {
      service = await prisma.service.findFirst({
        where: { isActive: true }
      });
    }

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    // Validar barbero con fallback seguro
    let validBarberId: string | null = null;
    if (data.barberId) {
      try {
        const barber = await prisma.barber.findUnique({
          where: { id: data.barberId }
        });
        if (barber) validBarberId = barber.id;
      } catch (e) {
        // Ignorar formato no-uuid
      }
    }

    // Calcular posición actual en la fila
    const currentWaitingCount = await prisma.ticket.count({
      where: {
        status: TicketStatus.WAITING,
        createdAt: { gte: todayStart }
      }
    });

    const position = currentWaitingCount + 1;
    // Estimación: 18 min base por persona delante
    const estimatedWait = Math.max(10, position * 18);

    const newTicket = await prisma.ticket.create({
      data: {
        ticketCode,
        clientName: data.clientName.trim(),
        clientPhone: data.clientPhone ? data.clientPhone.trim() : '',
        serviceId: service.id,
        barberId: validBarberId,
        status: TicketStatus.WAITING,
        positionInQueue: position,
        estimatedWaitMinutes: estimatedWait
      },
      include: {
        service: true,
        barber: true
      }
    });

    // Notificar a todos los clientes conectados vía SSE
    const queueStatus = await this.getQueueStatus();
    realtimeService.broadcast('QUEUE_UPDATED', queueStatus);

    return newTicket;
  }

  /**
   * El barbero completa su cliente actual y llama al siguiente de la fila
   */
  public async callNext(barberId: string, currentTicketId?: string | null) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1. Si tenía un ticket en silla, marcarlo como completado
    if (currentTicketId) {
      await prisma.ticket.update({
        where: { id: currentTicketId },
        data: {
          status: TicketStatus.COMPLETED,
          completedAt: new Date()
        }
      });
    } else {
      // Buscar si el barbero tenía algún ticket activo no cerrado
      const activeTicket = await prisma.ticket.findFirst({
        where: {
          barberId,
          status: TicketStatus.IN_CHAIR
        }
      });
      if (activeTicket) {
        await prisma.ticket.update({
          where: { id: activeTicket.id },
          data: {
            status: TicketStatus.COMPLETED,
            completedAt: new Date()
          }
        });
      }
    }

    // 2. Buscar el siguiente en espera (priorizando si eligió este barbero o 'cualquiera')
    const nextTicket = await prisma.ticket.findFirst({
      where: {
        status: TicketStatus.WAITING,
        createdAt: { gte: todayStart },
        OR: [
          { barberId: barberId },
          { barberId: null }
        ]
      },
      orderBy: [
        { positionInQueue: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    if (!nextTicket) {
      // No hay nadie en espera
      const queueStatus = await this.getQueueStatus();
      realtimeService.broadcast('QUEUE_UPDATED', queueStatus);
      return { message: 'No hay más clientes en espera para este sillón', nextTicket: null };
    }

    // 3. Asignar al sillón
    const updatedNextTicket = await prisma.ticket.update({
      where: { id: nextTicket.id },
      data: {
        barberId,
        status: TicketStatus.IN_CHAIR,
        positionInQueue: 0,
        estimatedWaitMinutes: 0,
        startedAt: new Date(),
        calledAt: new Date()
      },
      include: {
        service: true,
        barber: true
      }
    });

    // 4. Recalcular posiciones del resto de clientes en espera
    await this.recalculateQueuePositions();

    const queueStatus = await this.getQueueStatus();
    realtimeService.broadcast('QUEUE_UPDATED', queueStatus);

    return {
      message: `Cliente ${updatedNextTicket.ticketCode} (${updatedNextTicket.clientName}) llamado al sillón`,
      nextTicket: updatedNextTicket
    };
  }

  /**
   * Marcar cliente como No-Show (no se presentó) o saltar
   */
  public async markNoShow(ticketId: string) {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.NO_SHOW,
        completedAt: new Date()
      }
    });

    await this.recalculateQueuePositions();
    const queueStatus = await this.getQueueStatus();
    realtimeService.broadcast('QUEUE_UPDATED', queueStatus);

    return { message: 'Ticket marcado como No-Show' };
  }

  /**
   * Retrasar turno de cliente (+15m por cortesía / lounge bar)
   */
  public async delayTicket(ticketId: string, delayMinutes: number = 15) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket || ticket.status !== TicketStatus.WAITING) {
      throw new Error('Ticket no apto para retrasar');
    }

    // Aumentar su posición en 1 si hay alguien inmediatamente detrás
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        positionInQueue: ticket.positionInQueue + 1,
        estimatedWaitMinutes: ticket.estimatedWaitMinutes + delayMinutes
      }
    });

    const queueStatus = await this.getQueueStatus();
    realtimeService.broadcast('QUEUE_UPDATED', queueStatus);

    return { message: `Turno pospuesto +${delayMinutes} minutos` };
  }

  /**
   * Recalcula en cascada las posiciones 1..N y tiempos de los que siguen esperando
   */
  private async recalculateQueuePositions() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const remainingWaiting = await prisma.ticket.findMany({
      where: {
        status: TicketStatus.WAITING,
        createdAt: { gte: todayStart }
      },
      orderBy: { createdAt: 'asc' }
    });

    for (let i = 0; i < remainingWaiting.length; i++) {
      const position = i + 1;
      const estimatedWait = Math.max(8, position * 18);
      await prisma.ticket.update({
        where: { id: remainingWaiting[i].id },
        data: {
          positionInQueue: position,
          estimatedWaitMinutes: estimatedWait
        }
      });
    }
  }

  /**
   * Obtiene el directorio consolidado de clientes e historial de visitas
   */
  public async getAllClients() {
    const tickets = await prisma.ticket.findMany({
      include: { service: true, barber: true },
      orderBy: { createdAt: 'desc' }
    });

    const clientMap = new Map<string, any>();

    for (const t of tickets) {
      const key = t.clientPhone?.trim() || t.clientName.trim().toLowerCase();
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          id: t.id,
          name: t.clientName,
          phone: t.clientPhone || 'No registrado',
          totalVisits: 1,
          lastService: t.service?.name || 'Corte Clásico',
          lastBarber: t.barber ? t.barber.name : 'Cualquiera',
          lastDate: t.createdAt,
          currentStatus: t.status,
          currentTicketCode: t.ticketCode,
          isVIP: false,
          notes: 'Preferencia: Acabado limpio y navaja'
        });
      } else {
        const c = clientMap.get(key);
        c.totalVisits += 1;
        if (c.totalVisits >= 2) {
          c.isVIP = true;
        }
      }
    }

    return Array.from(clientMap.values());
  }

  /**
   * Actualiza el teléfono de un cliente en todos sus tickets (historial y activos)
   */
  public async updateClient(name: string, phone: string, notes?: string) {
    await prisma.ticket.updateMany({
      where: {
        clientName: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      },
      data: {
        clientPhone: phone.trim()
      }
    });

    const queueStatus = await this.getQueueStatus();
    realtimeService.broadcast('QUEUE_UPDATED', queueStatus);

    return { success: true, message: `Teléfono de ${name} actualizado a ${phone}` };
  }
}

export const queueService = new QueueService();
