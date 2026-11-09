import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TicketType } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  if (amount === 0) return 'Free';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'ETB' ? 'ETB' : currency,
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount).replace('ETB', 'ETB ');
  } catch (e) {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (!hours) return timeString;
  
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes || '00'} ${ampm}`;
}

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'EVT-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function generateTicketNumber(index: number = 1): string {
  const chars = '0123456789ABCDEF';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TKT-${code}-${String(index).padStart(2, '0')}`;
}

export function generateQrToken(): string {
  const chars = 'abcdef0123456789';
  let token = 'qr_';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function getPriceRange(ticketTypes?: TicketType[]): { min: number; max: number; text: string } {
  if (!ticketTypes || ticketTypes.length === 0) {
    return { min: 0, max: 0, text: 'Free' };
  }
  
  const prices = ticketTypes.map(t => t.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const currency = ticketTypes[0]?.currency || 'ETB';

  if (min === 0 && max === 0) {
    return { min: 0, max: 0, text: 'Free' };
  } else if (min === max) {
    return { min, max, text: formatCurrency(min, currency) };
  } else {
    return { 
      min, 
      max, 
      text: `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}` 
    };
  }
}
