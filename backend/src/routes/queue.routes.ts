import { Router } from 'express';
import { queueController } from '../controllers/queue.controller';

export const queueRouter = Router();

queueRouter.get('/status', (req, res) => queueController.getStatus(req, res));
queueRouter.post('/ticket', (req, res) => queueController.createTicket(req, res));
queueRouter.post('/call-next', (req, res) => queueController.callNext(req, res));
queueRouter.post('/no-show', (req, res) => queueController.markNoShow(req, res));
queueRouter.post('/delay', (req, res) => queueController.delayTicket(req, res));
queueRouter.get('/clients', (req, res) => queueController.getClients(req, res));
queueRouter.put('/clients', (req, res) => queueController.updateClient(req, res));
queueRouter.get('/appointments', (req, res) => queueController.getAppointments(req, res));
queueRouter.post('/appointments', (req, res) => queueController.createAppointment(req, res));
queueRouter.put('/appointments/:id', (req, res) => queueController.updateAppointment(req, res));
queueRouter.delete('/appointments/:id', (req, res) => queueController.deleteAppointment(req, res));
queueRouter.get('/stream', (req, res) => queueController.streamEvents(req, res));

