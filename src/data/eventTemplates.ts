// Event Templates and Seller Roster System
// Similar to Ultimate Team - reusable formations of sellers per event

import { TeamMember, organizationData, events } from './mockData';

export interface SellerRoster {
  id: string;
  sellerId: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  position: 'cabeza' | 'promotor';
  assignedTo?: string; // parent seller ID if promotor
  commissionRate: number;
  status: 'active' | 'inactive' | 'pending';
  stats: {
    totalSales: number;
    avgPerEvent: number;
    eventsParticipated: number;
    successRate: number;
  };
}

export interface EventTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  isDefault: boolean;
  roster: SellerRoster[];
  formation: {
    cabezas: number;
    promotores: number;
  };
}

export interface EventAssignment {
  eventId: string;
  templateId?: string;
  roster: SellerRoster[];
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  activatedAt?: string;
}

export interface SellerRegistration {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerEmail: string;
  sellerPhone: string;
  requestedLevel: 1 | 2;
  eventId?: string; // if registering for specific event
  promotorId?: string; // if registering globally
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// All registered sellers (pool of available sellers)
export const registeredSellers: SellerRoster[] = [
  {
    id: "seller-1",
    sellerId: "promo-1",
    name: "Carlos Ruiz",
    avatar: "CR",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 285, avgPerEvent: 57, eventsParticipated: 5, successRate: 92 }
  },
  {
    id: "seller-2",
    sellerId: "promo-2",
    name: "Ana Torres",
    avatar: "AT",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 248, avgPerEvent: 49, eventsParticipated: 5, successRate: 88 }
  },
  {
    id: "seller-3",
    sellerId: "promo-3",
    name: "Luis Gómez",
    avatar: "LG",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 198, avgPerEvent: 40, eventsParticipated: 5, successRate: 85 }
  },
  {
    id: "seller-4",
    sellerId: "promo-4",
    name: "María López",
    avatar: "ML",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 186, avgPerEvent: 37, eventsParticipated: 5, successRate: 82 }
  },
  {
    id: "seller-5",
    sellerId: "promo-5",
    name: "Pedro Díaz",
    avatar: "PD",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 175, avgPerEvent: 35, eventsParticipated: 5, successRate: 80 }
  },
  {
    id: "seller-6",
    sellerId: "head-1",
    name: "Juan Pérez",
    avatar: "JP",
    level: 2,
    levelName: "Cabeza",
    position: 'cabeza',
    commissionRate: 10000,
    status: 'active',
    stats: { totalSales: 1245, avgPerEvent: 249, eventsParticipated: 5, successRate: 95 }
  },
  {
    id: "seller-7",
    sellerId: "head-2",
    name: "Sandra García",
    avatar: "SG",
    level: 2,
    levelName: "Cabeza",
    position: 'cabeza',
    commissionRate: 10000,
    status: 'active',
    stats: { totalSales: 987, avgPerEvent: 197, eventsParticipated: 5, successRate: 91 }
  },
  {
    id: "seller-8",
    sellerId: "promo-6",
    name: "Roberto Méndez",
    avatar: "RM",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 156, avgPerEvent: 31, eventsParticipated: 5, successRate: 78 }
  },
  {
    id: "seller-9",
    sellerId: "promo-7",
    name: "Carolina Vega",
    avatar: "CV",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 143, avgPerEvent: 29, eventsParticipated: 5, successRate: 76 }
  },
  {
    id: "seller-10",
    sellerId: "promo-8",
    name: "Andrés Castro",
    avatar: "AC",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'active',
    stats: { totalSales: 132, avgPerEvent: 26, eventsParticipated: 5, successRate: 74 }
  },
  {
    id: "seller-11",
    sellerId: "head-3",
    name: "Roberto Silva",
    avatar: "RS",
    level: 2,
    levelName: "Cabeza",
    position: 'cabeza',
    commissionRate: 10000,
    status: 'active',
    stats: { totalSales: 782, avgPerEvent: 156, eventsParticipated: 5, successRate: 89 }
  },
  {
    id: "seller-12",
    sellerId: "head-4",
    name: "Diana Castro",
    avatar: "DC",
    level: 2,
    levelName: "Cabeza",
    position: 'cabeza',
    commissionRate: 10000,
    status: 'active',
    stats: { totalSales: 588, avgPerEvent: 118, eventsParticipated: 5, successRate: 86 }
  },
  {
    id: "seller-13",
    sellerId: "promo-new-1",
    name: "Valentina Ríos",
    avatar: "VR",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'pending',
    stats: { totalSales: 0, avgPerEvent: 0, eventsParticipated: 0, successRate: 0 }
  },
  {
    id: "seller-14",
    sellerId: "promo-new-2",
    name: "Felipe Arango",
    avatar: "FA",
    level: 1,
    levelName: "Promotor",
    position: 'promotor',
    commissionRate: 7500,
    status: 'pending',
    stats: { totalSales: 0, avgPerEvent: 0, eventsParticipated: 0, successRate: 0 }
  },
];

// Saved templates (like Ultimate Team squads)
export const savedTemplates: EventTemplate[] = [
  {
    id: "template-1",
    name: "Alineación Principal",
    description: "Equipo estrella con los mejores vendedores",
    createdAt: "2025-12-01",
    lastUsed: "2026-01-15",
    usageCount: 8,
    isDefault: true,
    formation: { cabezas: 2, promotores: 8 },
    roster: [
      { ...registeredSellers[5], assignedTo: undefined }, // Juan Pérez - Cabeza
      { ...registeredSellers[6], assignedTo: undefined }, // Sandra García - Cabeza
      { ...registeredSellers[0], assignedTo: "head-1" }, // Carlos Ruiz -> Juan
      { ...registeredSellers[1], assignedTo: "head-1" }, // Ana Torres -> Juan
      { ...registeredSellers[2], assignedTo: "head-1" }, // Luis Gómez -> Juan
      { ...registeredSellers[3], assignedTo: "head-2" }, // María López -> Sandra
      { ...registeredSellers[4], assignedTo: "head-2" }, // Pedro Díaz -> Sandra
      { ...registeredSellers[7], assignedTo: "head-2" }, // Roberto Méndez -> Sandra
      { ...registeredSellers[8], assignedTo: "head-1" }, // Carolina Vega -> Juan
      { ...registeredSellers[9], assignedTo: "head-2" }, // Andrés Castro -> Sandra
    ]
  },
  {
    id: "template-2",
    name: "Equipo B - Desarrollo",
    description: "Vendedores nuevos en entrenamiento",
    createdAt: "2025-11-15",
    lastUsed: "2026-01-10",
    usageCount: 3,
    isDefault: false,
    formation: { cabezas: 2, promotores: 4 },
    roster: [
      { ...registeredSellers[10], assignedTo: undefined }, // Roberto Silva - Cabeza
      { ...registeredSellers[11], assignedTo: undefined }, // Diana Castro - Cabeza
      { ...registeredSellers[7], assignedTo: "head-3" },
      { ...registeredSellers[8], assignedTo: "head-3" },
      { ...registeredSellers[9], assignedTo: "head-4" },
      { ...registeredSellers[4], assignedTo: "head-4" },
    ]
  },
  {
    id: "template-3",
    name: "Festival Grande",
    description: "Configuración para eventos masivos (+10k)",
    createdAt: "2025-10-20",
    lastUsed: "2025-12-20",
    usageCount: 2,
    isDefault: false,
    formation: { cabezas: 4, promotores: 10 },
    roster: [
      { ...registeredSellers[5], assignedTo: undefined },
      { ...registeredSellers[6], assignedTo: undefined },
      { ...registeredSellers[10], assignedTo: undefined },
      { ...registeredSellers[11], assignedTo: undefined },
      ...registeredSellers.filter(s => s.position === 'promotor').slice(0, 10).map((s, i) => ({
        ...s,
        assignedTo: i < 3 ? "head-1" : i < 5 ? "head-2" : i < 7 ? "head-3" : "head-4"
      }))
    ]
  }
];

// Event assignments (which template/roster is active for each event)
export const eventAssignments: EventAssignment[] = [
  {
    eventId: "evt-1",
    templateId: "template-1",
    roster: savedTemplates[0].roster,
    status: 'active',
    createdAt: "2026-01-20",
    activatedAt: "2026-01-21"
  },
  {
    eventId: "evt-2",
    templateId: "template-2",
    roster: savedTemplates[1].roster,
    status: 'active',
    createdAt: "2026-01-22",
    activatedAt: "2026-01-23"
  },
  {
    eventId: "evt-3",
    roster: [],
    status: 'draft',
    createdAt: "2026-01-25"
  }
];

// Pending seller registrations
export const pendingRegistrations: SellerRegistration[] = [
  {
    id: "reg-1",
    sellerId: "new-seller-1",
    sellerName: "Camilo Hernández",
    sellerAvatar: "CH",
    sellerEmail: "camilo@email.com",
    sellerPhone: "+57 300 123 4567",
    requestedLevel: 1,
    promotorId: "admin-1",
    status: 'pending',
    requestedAt: "2026-01-26T10:30:00",
    notes: "Referido por Carlos Ruiz"
  },
  {
    id: "reg-2",
    sellerId: "new-seller-2",
    sellerName: "Isabella Muñoz",
    sellerAvatar: "IM",
    sellerEmail: "isabella@email.com",
    sellerPhone: "+57 301 234 5678",
    requestedLevel: 1,
    eventId: "evt-1",
    status: 'pending',
    requestedAt: "2026-01-26T14:15:00"
  },
  {
    id: "reg-3",
    sellerId: "new-seller-3",
    sellerName: "Sebastián Vargas",
    sellerAvatar: "SV",
    sellerEmail: "sebastian@email.com",
    sellerPhone: "+57 302 345 6789",
    requestedLevel: 2,
    promotorId: "admin-1",
    status: 'pending',
    requestedAt: "2026-01-25T09:00:00",
    notes: "Experiencia previa como cabeza en otra promotora"
  },
  {
    id: "reg-4",
    sellerId: "new-seller-4",
    sellerName: "Juliana Ospina",
    sellerAvatar: "JO",
    sellerEmail: "juliana@email.com",
    sellerPhone: "+57 303 456 7890",
    requestedLevel: 1,
    eventId: "evt-3",
    status: 'pending',
    requestedAt: "2026-01-27T11:45:00"
  }
];

// Helper functions
export function getEventAssignment(eventId: string): EventAssignment | undefined {
  return eventAssignments.find(a => a.eventId === eventId);
}

export function getTemplateById(templateId: string): EventTemplate | undefined {
  return savedTemplates.find(t => t.id === templateId);
}

export function getAvailableSellers(): SellerRoster[] {
  return registeredSellers.filter(s => s.status === 'active');
}

export function getPendingSellers(): SellerRoster[] {
  return registeredSellers.filter(s => s.status === 'pending');
}

export function getEventRoster(eventId: string): SellerRoster[] {
  const assignment = getEventAssignment(eventId);
  return assignment?.roster || [];
}

export function getRegistrationsByEvent(eventId: string): SellerRegistration[] {
  return pendingRegistrations.filter(r => r.eventId === eventId);
}

export function getGlobalRegistrations(): SellerRegistration[] {
  return pendingRegistrations.filter(r => !r.eventId);
}
