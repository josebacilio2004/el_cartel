import { PrismaClient, BarberStatus, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Limpiando base de datos ---');
  await prisma.ticket.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.barber.deleteMany({});
  await prisma.shopSetting.deleteMany({});

  console.log('--- Creando Barberos de Frank Barbería ---');
  const barberFrank = await prisma.barber.create({
    data: {
      name: 'Frank',
      chairNumber: 1,
      specialty: 'Master Barber & Founder',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    }
  });

  const barberDiego = await prisma.barber.create({
    data: {
      name: 'Diego',
      chairNumber: 2,
      specialty: 'Barber Senior - Fades & Degradados',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    }
  });

  const barberMiguel = await prisma.barber.create({
    data: {
      name: 'Miguel',
      chairNumber: 3,
      specialty: 'Barber - Barba & Diseños',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    }
  });

  const barberAlex = await prisma.barber.create({
    data: {
      name: 'Alex',
      chairNumber: 4,
      specialty: 'Barber - Cortes Clásicos',
      status: BarberStatus.ACTIVE,
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
    }
  });

  console.log('--- Creando Servicios Oficiales ---');
  const serviceClassic = await prisma.service.create({
    data: {
      name: 'Corte Clásico',
      description: 'Corte tradicional con tijera y peinado.',
      durationMinutes: 30,
      price: 35.00,
      category: 'HAIRCUT'
    }
  });

  const serviceFade = await prisma.service.create({
    data: {
      name: 'Fade / Degradado',
      description: 'Degradados altos, medios o bajos.',
      durationMinutes: 40,
      price: 45.00,
      category: 'HAIRCUT'
    }
  });

  const serviceCombo = await prisma.service.create({
    data: {
      name: 'Corte + Barba',
      description: 'Corte completo más perfilado de barba.',
      durationMinutes: 50,
      price: 65.00,
      category: 'COMBO'
    }
  });

  const serviceBeard = await prisma.service.create({
    data: {
      name: 'Perfilado de Barba',
      description: 'Perfilado con navaja, toalla caliente y productos premium.',
      durationMinutes: 25,
      price: 35.00,
      category: 'BEARD'
    }
  });

  console.log('--- Creando Configuración General ---');
  await prisma.shopSetting.create({
    data: {
      shopName: 'El Cartel Barbershop',
      isWeekendMode: true,
      maxQueueCapacity: 30,
      bufferMinutesBetweenCuts: 5,
      autoPauseQueue: false
    }
  });

  console.log('--- Creando Tickets Iniciales de Demostración ---');
  // Ticket activo en sillón #1 (Frank)
  await prisma.ticket.create({
    data: {
      ticketCode: 'B-01',
      clientName: 'Lucas Morales',
      clientPhone: '+51987112233',
      serviceId: serviceFade.id,
      barberId: barberFrank.id,
      status: TicketStatus.IN_CHAIR,
      positionInQueue: 0,
      estimatedWaitMinutes: 0,
      startedAt: new Date(Date.now() - 15 * 60 * 1000)
    }
  });

  // Ticket en espera #1
  await prisma.ticket.create({
    data: {
      ticketCode: 'B-02',
      clientName: 'Marcos R.',
      clientPhone: '+51987223344',
      serviceId: serviceCombo.id,
      barberId: barberDiego.id,
      status: TicketStatus.WAITING,
      positionInQueue: 1,
      estimatedWaitMinutes: 18
    }
  });

  // Ticket en espera #2
  await prisma.ticket.create({
    data: {
      ticketCode: 'B-03',
      clientName: 'Andrés P.',
      clientPhone: '+51987334455',
      serviceId: serviceClassic.id,
      barberId: null,
      status: TicketStatus.WAITING,
      positionInQueue: 2,
      estimatedWaitMinutes: 35
    }
  });

  console.log(' Seed de Frank Barbería completado con éxito!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
