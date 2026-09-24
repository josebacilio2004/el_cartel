import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class BarberController {
  public async getBarbers(req: Request, res: Response) {
    try {
      const barbers = await prisma.barber.findMany({
        orderBy: { chairNumber: 'asc' }
      });
      res.json(barbers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getServices(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' }
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const barberController = new BarberController();
