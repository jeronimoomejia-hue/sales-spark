// ============================================
// CREWS — Global Seller Pool (Multi-Promotora)
// Solo métricas globales anónimas. NUNCA revela promotoras específicas.
// ============================================

import { SellerGlobalProfile, SellerInvitation, GlobalSellerEntry, Badge } from "@/types/seller";

// Badges disponibles en la plataforma
export const availableBadges: Badge[] = [
  { id: "top-performer", name: "Top Performer", icon: "🏆", color: "text-yellow-400", earnedAt: "2025-12-01", description: "Vendió más de 500 tickets en un evento" },
  { id: "on-fire", name: "En Fuego", icon: "🔥", color: "text-neon-orange", earnedAt: "2026-01-15", description: "3 eventos consecutivos superando la meta" },
  { id: "reliable", name: "Confiable", icon: "✅", color: "text-success", earnedAt: "2025-11-10", description: "95%+ de tasa de éxito en eventos" },
  { id: "veteran", name: "Veterano", icon: "⚡", color: "text-neon-purple", earnedAt: "2025-09-01", description: "Más de 10 eventos participados" },
  { id: "rookie", name: "Promesa", icon: "⭐", color: "text-neon-blue", earnedAt: "2026-01-20", description: "Nuevo vendedor con gran potencial" },
  { id: "network", name: "Networker", icon: "🌐", color: "text-neon-pink", earnedAt: "2025-10-15", description: "Ha trabajado con múltiples equipos" },
  { id: "speed", name: "Velocista", icon: "💨", color: "text-neon-green", earnedAt: "2026-01-10", description: "Vendió 100 tickets en menos de 48h" },
  { id: "milestone", name: "Hito Master", icon: "🎯", color: "text-warning", earnedAt: "2025-12-20", description: "Completó 5 hitos en un mes" },
];

// Pool global de vendedores registrados en CREWS
// Vendedores independientes que pueden trabajar con cualquier promotora
export const globalSellerPool: SellerGlobalProfile[] = [
  {
    id: "gs-001",
    name: "Carlos Ruiz",
    avatar: "CR",
    phone: "+57 300 111 2222",
    email: "carlos.ruiz@crews.app",
    joinedAt: "2025-06-15",
    globalStats: {
      totalTicketsSold: 285,
      successRate: 92,
      eventsParticipated: 5,
      avgTicketsPerEvent: 57,
      topLevelAchieved: 1,
    },
    badges: [availableBadges[2], availableBadges[4]],
    completedMilestones: 3,
  },
  {
    id: "gs-002",
    name: "Ana Torres",
    avatar: "AT",
    phone: "+57 301 222 3333",
    email: "ana.torres@crews.app",
    joinedAt: "2025-07-20",
    globalStats: {
      totalTicketsSold: 248,
      successRate: 88,
      eventsParticipated: 5,
      avgTicketsPerEvent: 49,
      topLevelAchieved: 1,
    },
    badges: [availableBadges[2]],
    completedMilestones: 2,
  },
  {
    id: "gs-003",
    name: "Juan Pérez",
    avatar: "JP",
    phone: "+57 302 333 4444",
    email: "juan.perez@crews.app",
    joinedAt: "2025-05-01",
    globalStats: {
      totalTicketsSold: 1245,
      successRate: 95,
      eventsParticipated: 5,
      avgTicketsPerEvent: 249,
      topLevelAchieved: 2,
    },
    badges: [availableBadges[0], availableBadges[1], availableBadges[2], availableBadges[3]],
    completedMilestones: 12,
  },
  {
    id: "gs-004",
    name: "Sandra García",
    avatar: "SG",
    phone: "+57 303 444 5555",
    email: "sandra.garcia@crews.app",
    joinedAt: "2025-05-15",
    globalStats: {
      totalTicketsSold: 987,
      successRate: 91,
      eventsParticipated: 5,
      avgTicketsPerEvent: 197,
      topLevelAchieved: 2,
    },
    badges: [availableBadges[0], availableBadges[2], availableBadges[3]],
    completedMilestones: 8,
  },
  {
    id: "gs-005",
    name: "Laura Martínez",
    avatar: "LM",
    phone: "+57 304 555 6666",
    email: "laura.martinez@crews.app",
    joinedAt: "2025-04-10",
    globalStats: {
      totalTicketsSold: 1980,
      successRate: 93,
      eventsParticipated: 5,
      avgTicketsPerEvent: 396,
      topLevelAchieved: 3,
    },
    badges: [availableBadges[0], availableBadges[1], availableBadges[2], availableBadges[3], availableBadges[7]],
    completedMilestones: 18,
  },
  {
    id: "gs-006",
    name: "Miguel Ángel Rojas",
    avatar: "MA",
    phone: "+57 305 666 7777",
    email: "miguel.rojas@crews.app",
    joinedAt: "2025-04-15",
    globalStats: {
      totalTicketsSold: 1580,
      successRate: 89,
      eventsParticipated: 5,
      avgTicketsPerEvent: 316,
      topLevelAchieved: 3,
    },
    badges: [availableBadges[0], availableBadges[2], availableBadges[3]],
    completedMilestones: 14,
  },
  // Vendedores EXTERNOS (de otras promotoras — no están en NeonEvents)
  {
    id: "gs-ext-001",
    name: "Valeria Montoya",
    avatar: "VM",
    phone: "+57 310 777 8888",
    email: "valeria.montoya@crews.app",
    joinedAt: "2025-08-01",
    globalStats: {
      totalTicketsSold: 420,
      successRate: 87,
      eventsParticipated: 4,
      avgTicketsPerEvent: 105,
      topLevelAchieved: 2,
    },
    badges: [availableBadges[1], availableBadges[6]],
    completedMilestones: 5,
  },
  {
    id: "gs-ext-002",
    name: "Esteban Cardona",
    avatar: "EC",
    phone: "+57 311 888 9999",
    email: "esteban.cardona@crews.app",
    joinedAt: "2025-09-15",
    globalStats: {
      totalTicketsSold: 156,
      successRate: 78,
      eventsParticipated: 3,
      avgTicketsPerEvent: 52,
      topLevelAchieved: 1,
    },
    badges: [availableBadges[4]],
    completedMilestones: 1,
  },
  {
    id: "gs-ext-003",
    name: "Natalia Ospina",
    avatar: "NO",
    phone: "+57 312 999 0000",
    email: "natalia.ospina@crews.app",
    joinedAt: "2025-07-05",
    globalStats: {
      totalTicketsSold: 780,
      successRate: 94,
      eventsParticipated: 6,
      avgTicketsPerEvent: 130,
      topLevelAchieved: 2,
    },
    badges: [availableBadges[2], availableBadges[5], availableBadges[6]],
    completedMilestones: 9,
  },
  {
    id: "gs-ext-004",
    name: "Rodrigo Bermúdez",
    avatar: "RB",
    phone: "+57 313 000 1111",
    email: "rodrigo.bermudez@crews.app",
    joinedAt: "2025-10-20",
    globalStats: {
      totalTicketsSold: 95,
      successRate: 72,
      eventsParticipated: 2,
      avgTicketsPerEvent: 47,
      topLevelAchieved: 1,
    },
    badges: [availableBadges[4]],
    completedMilestones: 0,
  },
  {
    id: "gs-ext-005",
    name: "Camila Herrera",
    avatar: "CH",
    phone: "+57 314 111 2222",
    email: "camila.herrera@crews.app",
    joinedAt: "2025-06-01",
    globalStats: {
      totalTicketsSold: 1100,
      successRate: 96,
      eventsParticipated: 7,
      avgTicketsPerEvent: 157,
      topLevelAchieved: 2,
    },
    badges: [availableBadges[0], availableBadges[1], availableBadges[2], availableBadges[5]],
    completedMilestones: 11,
  },
];

// IDs de vendedores que tienen relación activa con NeonEvents (promotora actual)
export const neonEventsSellerIds = ["gs-001", "gs-002", "gs-003", "gs-004", "gs-005", "gs-006"];

// Pool global enriquecido con el estado de relación respecto a NeonEvents
export function getGlobalPoolForAdmin(currentPromoterId: string = "neon-events"): GlobalSellerEntry[] {
  return globalSellerPool.map((seller) => {
    const isOwn = neonEventsSellerIds.includes(seller.id);
    return {
      id: seller.id,
      name: seller.name,
      avatar: seller.avatar,
      globalStats: seller.globalStats,
      badges: seller.badges,
      relationshipStatus: isOwn ? 'active' : 'none',
      isFreelance: !isOwn,
    };
  });
}

// Invitaciones pendientes para el vendedor demo (Carlos Ruiz)
export const pendingInvitations: SellerInvitation[] = [
  {
    id: "inv-001",
    sellerId: "gs-001",
    promoterId: "festival-colombia",
    promoterName: "Festival Colombia",
    promoterLogo: "🎪",
    eventId: "ext-evt-1",
    eventName: "Carnaval Fest 2026",
    eventDate: "2026-02-28",
    eventVenue: "Plaza Mayor Medellín",
    offeredCommission: 9000,
    offeredLevel: 1,
    offeredLevelName: "Nivel 1",
    message: "¡Hola Carlos! Te hemos visto en los rankings y queremos que formes parte de nuestro equipo para el Carnaval Fest 2026. Somos un equipo profesional con excelentes comisiones.",
    status: 'pending',
    sentAt: "2026-02-18T10:30:00",
  },
  {
    id: "inv-002",
    sellerId: "gs-001",
    promoterId: "rumba-nights",
    promoterName: "Rumba Nights",
    promoterLogo: "🌙",
    eventId: "ext-evt-2",
    eventName: "Noche Latina 2026",
    eventDate: "2026-03-08",
    eventVenue: "Estadio La Nubia, Manizales",
    offeredCommission: 11000,
    offeredLevel: 2,
    offeredLevelName: "Nivel 2",
    message: "Queremos que seas parte de nuestro equipo como Cabeza de grupo. Tu experiencia y tasa de éxito hablan por sí solos.",
    status: 'pending',
    sentAt: "2026-02-19T14:00:00",
  },
];

// Historial de invitaciones pasadas del vendedor demo
export const invitationHistory: SellerInvitation[] = [
  {
    id: "inv-hist-001",
    sellerId: "gs-001",
    promoterId: "techno-underground",
    promoterName: "Techno Underground",
    promoterLogo: "🔊",
    eventId: "ext-evt-hist-1",
    eventName: "Dark Warehouse",
    eventDate: "2026-01-14",
    eventVenue: "Bodega Industrial, Medellín",
    offeredCommission: 8000,
    offeredLevel: 1,
    offeredLevelName: "Nivel 1",
    status: 'declined',
    sentAt: "2026-01-05T09:00:00",
    respondedAt: "2026-01-06T11:30:00",
  },
  {
    id: "inv-hist-002",
    sellerId: "gs-001",
    promoterId: "urban-music",
    promoterName: "Urban Music Co",
    promoterLogo: "🎤",
    eventId: "ext-evt-hist-2",
    eventName: "Urban Kings Vol. 3",
    eventDate: "2026-01-05",
    eventVenue: "Movistar Arena",
    offeredCommission: 8500,
    offeredLevel: 1,
    offeredLevelName: "Nivel 1",
    status: 'accepted',
    sentAt: "2025-12-20T15:00:00",
    respondedAt: "2025-12-21T09:00:00",
  },
];
