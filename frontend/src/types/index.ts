export interface Barber {
  id: string;
  name: string;
  chairNumber: number;
  photoUrl?: string;
  specialty?: string;
  status: 'ACTIVE' | 'BREAK' | 'OFFLINE';
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
