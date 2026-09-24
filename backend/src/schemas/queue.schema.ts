import { z } from 'zod';

export const CreateTicketSchema = z.object({
  clientName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(60),
  clientPhone: z.string().trim().regex(/^(\+?[0-9]{7,15})?$/, 'Número telefónico inválido'),
  serviceId: z.string().uuid('ID de servicio inválido'),
  barberId: z.string().uuid('ID de barbero inválido').nullable().optional()
});

export const CallNextSchema = z.object({
  barberId: z.string().uuid('ID de barbero requerido'),
  currentTicketId: z.string().uuid().optional().nullable()
});

export const DelayTicketSchema = z.object({
  ticketId: z.string().uuid('ID de ticket requerido'),
  delayMinutes: z.number().int().min(5).max(30).default(15)
});
