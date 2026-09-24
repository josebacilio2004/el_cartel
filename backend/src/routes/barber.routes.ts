import { Router } from 'express';
import { barberController } from '../controllers/barber.controller';

export const barberRouter = Router();

barberRouter.get('/', (req, res) => barberController.getBarbers(req, res));
barberRouter.get('/services', (req, res) => barberController.getServices(req, res));
