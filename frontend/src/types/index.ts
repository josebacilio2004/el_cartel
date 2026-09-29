export interface Barber {
  id: string;
  name: string;
  chairNumber: number;
  photoUrl?: string;
  specialty?: string;
  status: 'ACTIVE' | 'BREAK' | 'OFFLINE';
  pin?: string;
  todayCutsCount?: number;
  todayEarnings?: number;
}

export interface SaleTicket {
  id: string;
  ticketCode: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  barberName: string;
  chairNumber: number;
  amount: number;
  durationMinutes: number;
  paymentMethod: 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: string | number;
  category: string;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  service?: Service;
  barberId?: string | null;
  barber?: Barber | null;
  status: 'WAITING' | 'CALLING' | 'IN_CHAIR' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  positionInQueue: number;
  estimatedWaitMinutes: number;
  calledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface ShopSetting {
  id?: string;
  shopName: string;
  isWeekendMode: boolean;
  maxQueueCapacity: number;
  bufferMinutesBetweenCuts: number;
  autoPauseQueue: boolean;
}

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  totalVisits: number;
  lastService: string;
  lastBarber: string;
  lastDate: string;
  currentStatus?: string;
  currentTicketCode?: string;
  isVIP?: boolean;
  notes?: string;
  email?: string;
}

export interface QueueStatus {
  inChair: Ticket[];
  waiting: Ticket[];
  totalWaiting: number;
  servedToday: number;
  estimatedNextWaitMinutes: number;
  barbers: Barber[];
  settings: ShopSetting;
}

export interface AppointmentRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isRegularClient?: boolean;
  notes?: string;
  barber?: Barber;
  service?: Service;
}

