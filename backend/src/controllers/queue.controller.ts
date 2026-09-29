import { Request, Response } from 'express';
import { queueService } from '../services/queue.service';
import { realtimeService } from '../services/realtime.service';
import { CreateTicketSchema, CallNextSchema, DelayTicketSchema } from '../schemas/queue.schema';

export class QueueController {
  public async getStatus(req: Request, res: Response) {
    try {
      const status = await queueService.getQueueStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createTicket(req: Request, res: Response) {
    try {
      const parsed = CreateTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.format() });
      }

      const ticket = await queueService.createTicket(parsed.data);
      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async callNext(req: Request, res: Response) {
    try {
      const parsed = CallNextSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.format() });
      }

      const result = await queueService.callNext(parsed.data.barberId, parsed.data.currentTicketId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async markNoShow(req: Request, res: Response) {
    try {
      const { ticketId } = req.body;
      if (!ticketId) {
        return res.status(400).json({ error: 'ticketId es requerido' });
      }

      const result = await queueService.markNoShow(ticketId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async delayTicket(req: Request, res: Response) {
    try {
      const parsed = DelayTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.format() });
      }

      const result = await queueService.delayTicket(parsed.data.ticketId, parsed.data.delayMinutes);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public streamEvents(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const clientId = Math.random().toString(36).substring(2, 9);
    realtimeService.addClient(clientId, res);
  }

  public async getClients(req: Request, res: Response) {
    try {
      const clients = await queueService.getAllClients();
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateClient(req: Request, res: Response) {
    try {
      const { name, phone, notes } = req.body;
      if (!name || !phone) {
        return res.status(400).json({ error: 'name y phone son requeridos' });
      }
      const result = await queueService.updateClient(name, phone, notes);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getAppointments(req: Request, res: Response) {
    try {
      const barberId = req.query.barberId as string | undefined;
      const appointments = await queueService.getAppointments(barberId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const queueController = new QueueController();
