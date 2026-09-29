import { Router } from 'express';
import { barberController } from '../controllers/barber.controller';

export const barberRouter = Router();

// Barberos CRUD
barberRouter.get('/', (req, res) => barberController.getBarbers(req, res));
barberRouter.post('/', (req, res) => barberController.createBarber(req, res));
barberRouter.put('/:id', (req, res) => barberController.updateBarber(req, res));
barberRouter.delete('/:id', (req, res) => barberController.deleteBarber(req, res));

// Servicios CRUD
barberRouter.get('/services', (req, res) => barberController.getServices(req, res));
barberRouter.post('/services', (req, res) => barberController.createService(req, res));
barberRouter.put('/services/:id', (req, res) => barberController.updateService(req, res));
barberRouter.delete('/services/:id', (req, res) => barberController.deleteService(req, res));
