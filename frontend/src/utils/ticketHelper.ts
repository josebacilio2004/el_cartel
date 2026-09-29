/**
 * Utilidades para manejo estricto de horarios, códigos únicos y ordenamiento cronológico
 */

export function parseSlotToIso(timeSlotStr?: string | null, dateOption: 'today' | 'tomorrow' | 'dayAfter' = 'today'): string {
  const targetDate = new Date();
  if (dateOption === 'tomorrow') {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (dateOption === 'dayAfter') {
    targetDate.setDate(targetDate.getDate() + 2);
  }

  if (!timeSlotStr) return targetDate.toISOString();

  // Buscar formato "06:30 PM" o "18:30"
  const match = timeSlotStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const meridian = (match[3] || '').toUpperCase();

    if (meridian === 'PM' && h < 12) h += 12;
    if (meridian === 'AM' && h === 12) h = 0;

    targetDate.setHours(h, m, 0, 0);
    return targetDate.toISOString();
  }

  return targetDate.toISOString();
}

/**
 * Obtener minutos desde la medianoche para ordenamiento cronológico perfecto
 */
export function getSlotMinutes(timeStr?: string | null): number {
  if (!timeStr) return 9999;

  // 1. Probar formato "06:30 PM"
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const meridian = (match[3] || '').toUpperCase();
    if (meridian === 'PM' && h < 12) h += 12;
    if (meridian === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }

  // 2. Probar fecha ISO
  try {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.getHours() * 60 + d.getMinutes();
    }
  } catch (e) {}

  return 9999;
}

/**
 * Formatear horario para vista elegante
 */
export function formatSlotDisplay(isoOrSlot?: string | null, explicitSlot?: string | null): string {
  if (explicitSlot && explicitSlot.trim()) {
    return explicitSlot.trim().toUpperCase();
  }

  if (!isoOrSlot) return '--:--';

  const match = isoOrSlot.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    return isoOrSlot.trim().toUpperCase();
  }

  try {
    const d = new Date(isoOrSlot);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    }
  } catch (e) {}

  return isoOrSlot;
}

/**
 * Generador garantizado de código de ticket único secuencial (sin duplicados)
 */
export function generateUniqueTicketCode(existingList: Array<{ ticketCode?: string }>): string {
  const usedNumbers = new Set<number>();

  for (const item of existingList) {
    if (item && item.ticketCode) {
      const match = item.ticketCode.match(/\d+/);
      if (match) {
        usedNumbers.add(parseInt(match[0], 10));
      }
    }
  }

  // Buscar el número más alto existente y sumar 1
  let maxNum = 0;
  usedNumbers.forEach(n => {
    if (n > maxNum) maxNum = n;
  });

  const nextNum = maxNum + 1;
  return `C-${nextNum < 10 ? '0' + nextNum : nextNum}`;
}
