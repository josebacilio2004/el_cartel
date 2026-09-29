import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { realtimeService } from '../services/realtime.service';

export class BarberController {
  public async getBarbers(req: Request, res: Response) {
    try {
      const barbers = await prisma.barber.findMany({
        include: {
          services: true
        },
        orderBy: { chairNumber: 'asc' }
      });
      res.json(barbers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createBarber(req: Request, res: Response) {
    try {
      const { name, chairNumber, photoUrl, specialty, status } = req.body;
      const barber = await prisma.barber.create({
        data: {
          name,
          chairNumber: Number(chairNumber) || 1,
          photoUrl: photoUrl || null,
          specialty: specialty || 'Barber Senior',
          status: status || 'ACTIVE'
        }
      });
      realtimeService.broadcast('BARBER_UPDATED', barber);
      res.status(201).json(barber);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateBarber(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, chairNumber, photoUrl, specialty, status } = req.body;
      const barber = await prisma.barber.update({
        where: { id },
        data: {
          name,
          chairNumber: chairNumber !== undefined ? Number(chairNumber) : undefined,
          photoUrl,
          specialty,
          status
        }
      });
      realtimeService.broadcast('BARBER_UPDATED', barber);
      res.json(barber);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteBarber(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await prisma.barber.delete({ where: { id } });
      realtimeService.broadcast('BARBER_DELETED', { id });
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getServices(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        include: { barber: true },
        orderBy: { price: 'asc' }
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async createService(req: Request, res: Response) {
    try {
      const { name, description, durationMinutes, price, category, imageUrl, barberId, isActive } = req.body;
      const service = await prisma.service.create({
        data: {
          name,
          description: description || null,
          durationMinutes: Number(durationMinutes) || 30,
          price: Number(price) || 35.0,
          category: category || 'CORTES',
          imageUrl: imageUrl || null,
          barberId: barberId || null,
          isActive: isActive !== undefined ? Boolean(isActive) : true
        },
        include: { barber: true }
      });
      realtimeService.broadcast('SERVICE_UPDATED', service);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateService(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, description, durationMinutes, price, category, imageUrl, barberId, isActive } = req.body;
      const service = await prisma.service.update({
        where: { id },
        data: {
          name,
          description,
          durationMinutes: durationMinutes !== undefined ? Number(durationMinutes) : undefined,
          price: price !== undefined ? Number(price) : undefined,
          category,
          imageUrl,
          barberId,
          isActive
        },
        include: { barber: true }
      });
      realtimeService.broadcast('SERVICE_UPDATED', service);
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteService(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await prisma.service.delete({ where: { id } });
      realtimeService.broadcast('SERVICE_DELETED', { id });
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const barberController = new BarberController();
