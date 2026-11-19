export type OccurrenceStatus =
  | 'sending'
  | 'sent'
  | 'waiting'
  | 'accepted'
  | 'in_progress'
  | 'finished'
  | 'cancelled';

export type AppRole = 'woman' | 'desk';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  avatar?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isEmergencyContact: boolean;
  relationship?: string;
}

export interface SafePlace {
  id: string;
  label: string;
  address: string;
}

export interface TimelineEvent {
  at: string;
  text: string;
}

export interface Occurrence {
  id: string;
  userId: string;
  status: OccurrenceStatus;
  createdAt: string;
  updatedAt: string;
  reason?: string;
  placeLabel?: string;
  events: TimelineEvent[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  acceptedBy?: {
    id: string;
    name: string;
    type: 'professional' | 'institution' | 'police' | 'hotel_security';
    phone?: string;
  };
  notes?: string;
}

export interface DeviceStatus {
  connected: boolean;
  battery?: number;
  lastSeen?: string;
  deviceId?: string;
  status: 'connected' | 'disconnected' | 'searching' | 'low_battery' | 'unknown';
}

export interface Institution {
  id: string;
  name: string;
  type: 'hotel' | 'police' | 'ong' | 'hospital' | 'security';
  region: string;
  address?: string;
  phone?: string;
  isAvailable: boolean;
}

export interface ResponderUnit {
  id: string;
  name: string;
  kind: string;
  area: string;
}

export interface AppSettings {
  discreetMode: boolean;
  shareLocation: boolean;
  notifyContacts: boolean;
  autoFallbackSeconds: number;
}

export const STATUS_LABELS: Record<OccurrenceStatus, string> = {
  sending: 'Enviando alerta',
  sent: 'Alerta enviado',
  waiting: 'Aguardando quem aceitar',
  accepted: 'Profissional identificado',
  in_progress: 'Atendimento em andamento',
  finished: 'Ocorrência finalizada',
  cancelled: 'Cancelada',
};
