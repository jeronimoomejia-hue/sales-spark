// ============================================
// CREWS — Multi-Promotora Seller Model
// ============================================

export type SellerLevel = 1 | 2 | 3 | 4;

export interface Badge {
  id: string;
  name: string;
  icon: string; // emoji
  color: string; // tailwind color token
  earnedAt: string; // ISO date
  description: string;
}

// --------------------------------------------------------
// PERFIL GLOBAL — portátil, visible para todas las promotoras
// Solo métricas anónimas — NUNCA revela con qué promotoras trabajó
// --------------------------------------------------------
export interface SellerGlobalProfile {
  id: string;
  name: string;
  avatar: string; // initials
  phone: string;
  email: string;
  joinedAt: string; // ISO date
  globalStats: {
    totalTicketsSold: number;   // acumulado de todos los eventos
    successRate: number;        // % de eventos con meta cumplida
    eventsParticipated: number; // cantidad de eventos totales
    avgTicketsPerEvent: number;
    topLevelAchieved: SellerLevel; // nivel más alto alcanzado (sin decir en qué promotora)
  };
  badges: Badge[];
  completedMilestones: number; // hitos completados en toda su historia
}

// --------------------------------------------------------
// RELACIÓN POR PROMOTORA — específica, no visible entre promotoras
// --------------------------------------------------------
export interface SellerPromoterRelationship {
  sellerId: string;
  promoterId: string;
  level: SellerLevel;
  levelName: string;
  commissionPerTicket: number;
  parentId?: string;       // supervisor dentro de esta promotora
  status: 'active' | 'inactive' | 'invited' | 'declined';
  invitedAt: string;       // ISO date
  acceptedAt?: string;
  salesByEvent: Record<string, {
    ownSales: number;
    teamSales: number;
    ownCommission: number;
    teamCommission: number;
  }>;
  isFreelance?: boolean; // true si fue invitado por evento puntual (no relación permanente)
}

// --------------------------------------------------------
// INVITATION — Invitación de promotora a vendedor para un evento
// --------------------------------------------------------
export interface SellerInvitation {
  id: string;
  sellerId: string;
  promoterId: string;
  promoterName: string;
  promoterLogo: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  offeredCommission: number;
  offeredLevel: SellerLevel;
  offeredLevelName: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
  respondedAt?: string;
}

// --------------------------------------------------------
// ACTIVE PROMOTORA — Promotora activa donde el vendedor ya aceptó
// --------------------------------------------------------
export interface ActivePromotera {
  promoterId: string;
  promoterName: string;
  promoterLogo: string;
  color: string; // gradient class
  activeEvents: ActiveEventContext[];
  relationship: SellerPromoterRelationship;
}

export interface ActiveEventContext {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  salesThisEvent: number;
  commissionEarned: number;
}

// --------------------------------------------------------
// TEAM MEMBER — composición de perfil global + relación con promotora
// --------------------------------------------------------
export interface TeamMemberExtended extends SellerGlobalProfile {
  // Datos de relación en contexto de la promotora actual
  level: SellerLevel;
  levelName: string;
  commissionPerTicket: number;
  parentId: string | null;
  relationship: SellerPromoterRelationship;
  // Ventas
  ownSales: { today: number; week: number; month: number; total: number };
  teamSales: { today: number; week: number; month: number; total: number };
  salesByEvent: Record<string, {
    ownSales: number;
    teamSales: number;
    ownCommission: number;
    teamCommission: number;
  }>;
  teamSize?: number;
  children?: TeamMemberExtended[];
}

// --------------------------------------------------------
// SELLER ROSTER — Vendedor en el pool o en la alineación de un evento
// --------------------------------------------------------
export interface SellerRosterExtended {
  id: string;
  sellerId: string;
  // Datos del perfil global (visibles al armar alineación)
  name: string;
  avatar: string;
  globalStats: SellerGlobalProfile['globalStats'];
  badges: Badge[];
  // Datos de la relación con esta promotora
  level: SellerLevel;
  levelName: string;
  position: 'subsocio' | 'cabeza' | 'promotor';
  commissionRate: number;
  assignedTo?: string;
  maxSubordinates?: number;
  // Estado de la invitación para este evento
  status: 'active' | 'inactive' | 'invited' | 'confirmed' | 'declined';
  invitationStatus?: 'pending' | 'accepted' | 'rejected';
  isFreelance?: boolean; // vendedor externo confirmado
  stats: {
    totalSales: number;
    avgPerEvent: number;
    eventsParticipated: number;
    successRate: number;
  };
}

// --------------------------------------------------------
// GLOBAL SELLER POOL — Vendedores disponibles en la plataforma CREWS
// Solo datos globales anónimos para admins al armar alineaciones
// --------------------------------------------------------
export interface GlobalSellerEntry {
  id: string;
  name: string;
  avatar: string;
  globalStats: SellerGlobalProfile['globalStats'];
  badges: Badge[];
  // Estado con ESTA promotora (si existe relación)
  relationshipStatus?: 'none' | 'active' | 'invited' | 'declined' | 'inactive';
  isFreelance?: boolean;
}
