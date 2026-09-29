import { PrismaClient, BarberStatus, TicketStatus, AppointmentStatus } from '@prisma/client';

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

  console.log('--- Creando Servicios Oficiales EL CARTEL por Barbero ---');
  // Servicios de Frank Master (Sillón #1)
  const serviceFade = await prisma.service.create({
    data: {
      name: 'Fade Urbano Cartel',
      description: 'Degradados altos, medios o bajos con navaja y texturizado.',
      durationMinutes: 35,
      price: 35.00,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
      barberId: barberFrank.id
    }
  });

  const serviceBeard = await prisma.service.create({
    data: {
      name: 'Ritual Barba & Toalla Caliente',
      description: 'Perfilado con navaja, toalla caliente y aceites esenciales.',
      durationMinutes: 25,
      price: 25.00,
      category: 'BARBA',
      imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
      barberId: barberFrank.id
    }
  });

  const serviceCombo = await prisma.service.create({
    data: {
      name: 'Combo El Cartel (Corte + Barba)',
      description: 'Corte completo más ritual de barba premium con vapor de ozono.',
      durationMinutes: 50,
      price: 50.00,
      category: 'COMBOS',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      barberId: barberFrank.id
    }
  });

  // Servicios de Mateo Fade (Sillón #2)
  const serviceBuzz = await prisma.service.create({
    data: {
      name: 'Buzz Cut + Diseños Tribales',
      description: 'Corte al ras con grecas urbanas y líneas precisas.',
      durationMinutes: 35,
      price: 35.00,
      category: 'ARTE',
      imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
      barberId: barberMateo.id
    }
  });

  const serviceTaper = await prisma.service.create({
    data: {
      name: 'Taper Fade Texturizado',
      description: 'Degradado en patillas y nuca con caída texturizada en cúspide.',
      durationMinutes: 35,
      price: 35.00,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1517832606589-7629c3397143?w=600&auto=format&fit=crop&q=80',
      barberId: barberMateo.id
    }
  });

  const serviceFreestyle = await prisma.service.create({
    data: {
      name: 'Freestyle Urbano + Cejas',
      description: 'Diseño libre personalizado en laterales y perfilado de cejas.',
      durationMinutes: 30,
      price: 40.00,
      category: 'ARTE',
      imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
      barberId: barberMateo.id
    }
  });

  // Servicios de Santi Style (Sillón #3)
  const serviceClassic = await prisma.service.create({
    data: {
      name: 'Corte Clásico Ejecutivo',
      description: 'Tijera pura y peinado tradicional elegante.',
      durationMinutes: 30,
      price: 30.00,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      barberId: barberSanti.id
    }
  });

  const servicePompadour = await prisma.service.create({
    data: {
      name: 'Pompadour Clásico & Peinado',
      description: 'Estilo pompadour con brillo formal o mate de fijación fuerte.',
      durationMinutes: 35,
      price: 35.00,
      category: 'CORTES',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      barberId: barberSanti.id
    }
  });

  const serviceKeratina = await prisma.service.create({
    data: {
      name: 'Alisado & Keratina Masculina',
      description: 'Tratamiento alisador termoactivo y nutrición capilar profunda.',
      durationMinutes: 60,
      price: 60.00,
      category: 'TRATAMIENTOS',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      barberId: barberSanti.id
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

  console.log('--- Creando Citas Agendadas Independientes por Barbero ---');
  const today = new Date();
  const createDate = (hours: number, minutes: number) => {
    const d = new Date(today);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // 1. Citas de Frank Master (Sillón #1)
  await prisma.appointment.createMany({
    data: [
      {
        clientName: 'Alonso Vera',
        clientPhone: '+51 987 111 222',
        barberId: barberFrank.id,
        serviceId: serviceFade.id,
        startTime: createDate(11, 0),
        endTime: createDate(11, 45),
        status: AppointmentStatus.COMPLETED,
        notes: 'Cliente fijo. Fade alto y navaja.'
      },
      {
        clientName: 'Rodrigo Santillán',
        clientPhone: '+51 922 431 880',
        barberId: barberFrank.id,
        serviceId: serviceBeard.id,
        startTime: createDate(16, 30),
        endTime: createDate(17, 0),
        status: AppointmentStatus.CONFIRMED,
        notes: 'Socio VIP. Toalla caliente y aceites.'
      },
      {
        clientName: 'Gianfranco Rossi',
        clientPhone: '+51 998 776 554',
        barberId: barberFrank.id,
        serviceId: serviceCombo.id,
        startTime: createDate(18, 30),
        endTime: createDate(19, 20),
        status: AppointmentStatus.CONFIRMED,
        notes: 'Corte completo y barba perfilada.'
      }
    ]
  });

  // 2. Citas de Mateo Fade (Sillón #2)
  await prisma.appointment.createMany({
    data: [
      {
        clientName: 'Kevin Salcedo',
        clientPhone: '+51 992 334 455',
        barberId: barberMateo.id,
        serviceId: serviceFade.id,
        startTime: createDate(13, 30),
        endTime: createDate(14, 15),
        status: AppointmentStatus.IN_PROGRESS,
        notes: 'Buzz Cut con diseños tribales en lateral.'
      },
      {
        clientName: 'Christian Benavides',
        clientPhone: '+51 983 445 566',
        barberId: barberMateo.id,
        serviceId: serviceFade.id,
        startTime: createDate(15, 45),
        endTime: createDate(16, 30),
        status: AppointmentStatus.CONFIRMED,
        notes: 'Taper Fade texturizado.'
      },
      {
        clientName: 'Bryan Palacios',
        clientPhone: '+51 974 556 677',
        barberId: barberMateo.id,
        serviceId: serviceCombo.id,
        startTime: createDate(17, 15),
        endTime: createDate(18, 5),
        status: AppointmentStatus.CONFIRMED,
        notes: 'Freestyle urbano + cejas.'
      }
    ]
  });

  // 3. Citas de Santi Style (Sillón #3)
  await prisma.appointment.createMany({
    data: [
      {
        clientName: 'Renato Silva',
        clientPhone: '+51 933 222 111',
        barberId: barberSanti.id,
        serviceId: serviceClassic.id,
        startTime: createDate(12, 0),
        endTime: createDate(12, 30),
        status: AppointmentStatus.COMPLETED,
        notes: 'Corte clásico ejecutivo a tijera.'
      },
      {
        clientName: 'Mauricio Alarcón',
        clientPhone: '+51 965 667 788',
        barberId: barberSanti.id,
        serviceId: serviceClassic.id,
        startTime: createDate(14, 30),
        endTime: createDate(15, 0),
        status: AppointmentStatus.CONFIRMED,
        notes: 'Pompadour clásico y peinado formal.'
      },
      {
        clientName: 'Gabriel Quintana',
        clientPhone: '+51 941 556 789',
        barberId: barberSanti.id,
        serviceId: serviceBeard.id,
        startTime: createDate(19, 0),
        endTime: createDate(19, 30),
        status: AppointmentStatus.CONFIRMED,
        notes: 'Ritual barba y toalla caliente.'
      }
    ]
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
