import { PrismaClient, BarberStatus, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Limpiando base de datos ---');
  await prisma.ticket.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.barber.deleteMany({});
  await prisma.shopSetting.deleteMany({});

  console.log('--- Creando Barberos de EL CARTEL BARBERSHOP ---');
  const barberFrank = await prisma.barber.create({
    data: {
      name: 'Frank Master',
      chairNumber: 1,
      specialty: 'Master Barber & Founder · Fades & Barba',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    }
  });

  const barberMateo = await prisma.barber.create({
    data: {
      name: 'Mateo Fade',
      chairNumber: 2,
      specialty: 'Barber Senior · Diseños Urbanos & Taper',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    }
  });

  const barberSanti = await prisma.barber.create({
    data: {
      name: 'Santi Style',
      chairNumber: 3,
      specialty: 'Barber Senior · Cortes Clásicos & Texturizados',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    }
  });

  console.log('--- Creando Servicios Oficiales EL CARTEL ---');
  const serviceFade = await prisma.service.create({
    data: {
      name: 'Fade Urbano Cartel',
      description: 'Degradados altos, medios o bajos con navaja.',
      durationMinutes: 35,
      price: 35.00,
      category: 'CORTES'
    }
  });

  const serviceClassic = await prisma.service.create({
    data: {
      name: 'Corte Clásico Ejecutivo',
      description: 'Corte tradicional con tijera y peinado.',
      durationMinutes: 30,
      price: 30.00,
      category: 'CORTES'
    }
  });

  const serviceBeard = await prisma.service.create({
    data: {
      name: 'Ritual Barba & Toalla Caliente',
      description: 'Perfilado con navaja, toalla caliente y aceites.',
      durationMinutes: 25,
      price: 25.00,
      category: 'BARBA'
    }
  });

  const serviceCombo = await prisma.service.create({
    data: {
      name: 'Combo El Cartel (Corte + Barba)',
      description: 'Corte completo más ritual de barba.',
      durationMinutes: 50,
      price: 50.00,
      category: 'COMBOS'
    }
  });

  console.log('--- Creando Configuración General ---');
  await prisma.shopSetting.create({
    data: {
      shopName: 'EL CARTEL BARBERSHOP',
      isWeekendMode: true,
      maxQueueCapacity: 35,
      bufferMinutesBetweenCuts: 5,
      autoPauseQueue: false
    }
  });

  console.log('--- Creando Tickets Iniciales de Demostración EL CARTEL ---');
  // Ticket activo en sillón #1 (Frank Master)
  await prisma.ticket.create({
    data: {
      ticketCode: 'C-01',
      clientName: 'Carlos Mendoza',
      clientPhone: '+51987654321',
      serviceId: serviceFade.id,
      barberId: barberFrank.id,
      status: TicketStatus.IN_CHAIR,
      positionInQueue: 0,
      estimatedWaitMinutes: 0,
      startedAt: new Date(Date.now() - 20 * 60 * 1000)
    }
  });

  // Ticket en espera #1
  await prisma.ticket.create({
    data: {
      ticketCode: 'C-02',
      clientName: 'Diego Morales',
      clientPhone: '+51991234567',
      serviceId: serviceFade.id,
      barberId: barberMateo.id,
      status: TicketStatus.WAITING,
      positionInQueue: 1,
      estimatedWaitMinutes: 10
    }
  });

  // Ticket en espera #2
  await prisma.ticket.create({
    data: {
      ticketCode: 'C-03',
      clientName: 'Alejandro Torres',
      clientPhone: '+51954882119',
      serviceId: serviceClassic.id,
      barberId: null,
      status: TicketStatus.WAITING,
      positionInQueue: 2,
      estimatedWaitMinutes: 25
    }
  });

  // Ticket en espera #3
  await prisma.ticket.create({
    data: {
      ticketCode: 'C-04',
      clientName: 'Rodrigo Santillán',
      clientPhone: '+51922431880',
      serviceId: serviceBeard.id,
      barberId: barberFrank.id,
      status: TicketStatus.WAITING,
      positionInQueue: 3,
      estimatedWaitMinutes: 40
    }
  });

  console.log(' Seed de EL CARTEL BARBERSHOP completado con éxito!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
