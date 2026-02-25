// Mock data with hierarchical sales aggregation and event segmentation
// Sales from subordinates accumulate to superiors in the org hierarchy

export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
}

export interface EmptySeatsAlert {
  isActive: boolean;
  discountPercent: number;
  bonusCommission: number;
  message: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  status: 'active' | 'upcoming' | 'closed';
  ticketPrice: number;
  ticketTypes: TicketType[];
  commissionsByLevel: Record<number, number>;
  totalCapacity: number;
  soldTickets: number;
  emptySeatsAlert?: EmptySeatsAlert;
}

export interface Sale {
  id: string;
  eventId: string;
  eventName: string;
  sellerId: string;
  sellerName: string;
  ticketType: 'general' | 'vip' | 'palco';
  price: number;
  commission: number;
  date: string;
  status: 'confirmed' | 'pending';
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  parentId: string | null;
  commissionPerTicket: number;
  // Own sales (direct sales by this person)
  ownSales: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  // Team sales (aggregated from subordinates)
  teamSales: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  // By event
  salesByEvent: Record<string, {
    ownSales: number;
    teamSales: number;
    ownCommission: number;
    teamCommission: number;
  }>;
  teamSize?: number;
  children?: TeamMember[];
}

// Events data
export const events: Event[] = [
  {
    id: 'evt-1',
    name: 'Neon Festival 2026',
    date: '2026-02-15',
    venue: 'Parque Simón Bolívar',
    status: 'active',
    ticketPrice: 40000,
    ticketTypes: [
      { id: 'tt-1a', name: 'General', price: 40000, available: 8000, color: 'hsl(var(--primary))' },
      { id: 'tt-1b', name: 'VIP', price: 80000, available: 4000, color: 'hsl(var(--warning))' },
      { id: 'tt-1c', name: 'Palco', price: 150000, available: 3000, color: 'hsl(var(--accent))' },
    ],
    commissionsByLevel: { 1: 7500, 2: 10000, 3: 15000, 4: 17500 },
    totalCapacity: 15000,
    soldTickets: 8456,
    emptySeatsAlert: { isActive: false, discountPercent: 0, bonusCommission: 0, message: '' },
  },
  {
    id: 'evt-2',
    name: 'Rock Night',
    date: '2026-02-28',
    venue: 'Movistar Arena',
    status: 'active',
    ticketPrice: 45000,
    ticketTypes: [
      { id: 'tt-2a', name: 'General', price: 45000, available: 5000, color: 'hsl(var(--primary))' },
      { id: 'tt-2b', name: 'VIP', price: 90000, available: 2000, color: 'hsl(var(--warning))' },
      { id: 'tt-2c', name: 'Palco', price: 160000, available: 1000, color: 'hsl(var(--accent))' },
    ],
    commissionsByLevel: { 1: 8000, 2: 11000, 3: 16000, 4: 18000 },
    totalCapacity: 8000,
    soldTickets: 3245,
    emptySeatsAlert: { isActive: false, discountPercent: 0, bonusCommission: 0, message: '' },
  },
  {
    id: 'evt-3',
    name: 'Electro Waves',
    date: '2026-03-10',
    venue: 'La 33',
    status: 'upcoming',
    ticketPrice: 35000,
    ticketTypes: [
      { id: 'tt-3a', name: 'General', price: 35000, available: 3000, color: 'hsl(var(--primary))' },
      { id: 'tt-3b', name: 'VIP', price: 70000, available: 1500, color: 'hsl(var(--warning))' },
      { id: 'tt-3c', name: 'Palco', price: 120000, available: 500, color: 'hsl(var(--accent))' },
    ],
    commissionsByLevel: { 1: 6500, 2: 9000, 3: 13000, 4: 15000 },
    totalCapacity: 5000,
    soldTickets: 757,
    emptySeatsAlert: { isActive: false, discountPercent: 0, bonusCommission: 0, message: '' },
  }
];

// Helper to calculate aggregated sales up the hierarchy
function calculateAggregatedSales(member: TeamMember): TeamMember {
  if (!member.children || member.children.length === 0) {
    return {
      ...member,
      teamSales: { today: 0, week: 0, month: 0, total: 0 }
    };
  }

  const processedChildren = member.children.map(child => calculateAggregatedSales(child));
  
  const teamSales = processedChildren.reduce((acc, child) => ({
    today: acc.today + child.ownSales.today + child.teamSales.today,
    week: acc.week + child.ownSales.week + child.teamSales.week,
    month: acc.month + child.ownSales.month + child.teamSales.month,
    total: acc.total + child.ownSales.total + child.teamSales.total
  }), { today: 0, week: 0, month: 0, total: 0 });

  // Aggregate sales by event from children
  const aggregatedEventSales: Record<string, { ownSales: number; teamSales: number; ownCommission: number; teamCommission: number }> = { ...member.salesByEvent };
  
  processedChildren.forEach(child => {
    Object.entries(child.salesByEvent).forEach(([eventId, sales]) => {
      if (!aggregatedEventSales[eventId]) {
        aggregatedEventSales[eventId] = { ownSales: 0, teamSales: 0, ownCommission: 0, teamCommission: 0 };
      }
      aggregatedEventSales[eventId].teamSales += sales.ownSales + sales.teamSales;
      aggregatedEventSales[eventId].teamCommission += sales.ownCommission + sales.teamCommission;
    });
  });

  return {
    ...member,
    teamSales,
    salesByEvent: aggregatedEventSales,
    children: processedChildren
  };
}

// Raw organization data (before aggregation)
const rawOrganizationData: TeamMember = {
  id: "admin-1",
  name: "NeonEvents Admin",
  avatar: "NA",
  level: 4,
  levelName: "Socio",
  parentId: null,
  commissionPerTicket: 17500,
  ownSales: { today: 0, week: 0, month: 0, total: 0 },
  teamSales: { today: 0, week: 0, month: 0, total: 0 },
  salesByEvent: {
    'evt-1': { ownSales: 0, teamSales: 0, ownCommission: 0, teamCommission: 0 },
    'evt-2': { ownSales: 0, teamSales: 0, ownCommission: 0, teamCommission: 0 },
    'evt-3': { ownSales: 0, teamSales: 0, ownCommission: 0, teamCommission: 0 }
  },
  teamSize: 89,
  children: [
    {
      id: "sub-1",
      name: "Laura Martínez",
      avatar: "LM",
      level: 3,
      levelName: "Sub Socio",
      parentId: "admin-1",
      commissionPerTicket: 15000,
      ownSales: { today: 5, week: 28, month: 120, total: 458 },
      teamSales: { today: 0, week: 0, month: 0, total: 0 },
      salesByEvent: {
        'evt-1': { ownSales: 80, teamSales: 0, ownCommission: 1200000, teamCommission: 0 },
        'evt-2': { ownSales: 30, teamSales: 0, ownCommission: 450000, teamCommission: 0 },
        'evt-3': { ownSales: 10, teamSales: 0, ownCommission: 150000, teamCommission: 0 }
      },
      teamSize: 35,
      children: [
        {
          id: "head-1",
          name: "Juan Pérez",
          avatar: "JP",
          level: 2,
          levelName: "Cabeza",
          parentId: "sub-1",
          commissionPerTicket: 10000,
          ownSales: { today: 8, week: 45, month: 127, total: 1245 },
          teamSales: { today: 0, week: 0, month: 0, total: 0 },
          salesByEvent: {
            'evt-1': { ownSales: 85, teamSales: 0, ownCommission: 850000, teamCommission: 0 },
            'evt-2': { ownSales: 32, teamSales: 0, ownCommission: 320000, teamCommission: 0 },
            'evt-3': { ownSales: 10, teamSales: 0, ownCommission: 100000, teamCommission: 0 }
          },
          teamSize: 15,
          children: [
            { 
              id: "promo-1", 
              name: "Carlos Ruiz", 
              avatar: "CR", 
              level: 1, 
              levelName: "Común", 
              parentId: "head-1",
              commissionPerTicket: 7500,
              ownSales: { today: 4, week: 22, month: 85, total: 285 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 55, teamSales: 0, ownCommission: 412500, teamCommission: 0 },
                'evt-2': { ownSales: 22, teamSales: 0, ownCommission: 165000, teamCommission: 0 },
                'evt-3': { ownSales: 8, teamSales: 0, ownCommission: 60000, teamCommission: 0 }
              }
            },
            { 
              id: "promo-2", 
              name: "Ana Torres", 
              avatar: "AT", 
              level: 1, 
              levelName: "Común",
              parentId: "head-1",
              commissionPerTicket: 7500,
              ownSales: { today: 3, week: 18, month: 72, total: 248 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 48, teamSales: 0, ownCommission: 360000, teamCommission: 0 },
                'evt-2': { ownSales: 18, teamSales: 0, ownCommission: 135000, teamCommission: 0 },
                'evt-3': { ownSales: 6, teamSales: 0, ownCommission: 45000, teamCommission: 0 }
              }
            },
            { 
              id: "promo-3", 
              name: "Luis Gómez", 
              avatar: "LG", 
              level: 1, 
              levelName: "Común",
              parentId: "head-1",
              commissionPerTicket: 7500,
              ownSales: { today: 2, week: 15, month: 68, total: 198 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 45, teamSales: 0, ownCommission: 337500, teamCommission: 0 },
                'evt-2': { ownSales: 17, teamSales: 0, ownCommission: 127500, teamCommission: 0 },
                'evt-3': { ownSales: 6, teamSales: 0, ownCommission: 45000, teamCommission: 0 }
              }
            },
            { 
              id: "promo-4", 
              name: "María López", 
              avatar: "ML", 
              level: 1, 
              levelName: "Común",
              parentId: "head-1",
              commissionPerTicket: 7500,
              ownSales: { today: 3, week: 14, month: 58, total: 186 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 38, teamSales: 0, ownCommission: 285000, teamCommission: 0 },
                'evt-2': { ownSales: 15, teamSales: 0, ownCommission: 112500, teamCommission: 0 },
                'evt-3': { ownSales: 5, teamSales: 0, ownCommission: 37500, teamCommission: 0 }
              }
            },
            { 
              id: "promo-5", 
              name: "Pedro Díaz", 
              avatar: "PD", 
              level: 1, 
              levelName: "Común",
              parentId: "head-1",
              commissionPerTicket: 7500,
              ownSales: { today: 2, week: 12, month: 52, total: 175 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 35, teamSales: 0, ownCommission: 262500, teamCommission: 0 },
                'evt-2': { ownSales: 12, teamSales: 0, ownCommission: 90000, teamCommission: 0 },
                'evt-3': { ownSales: 5, teamSales: 0, ownCommission: 37500, teamCommission: 0 }
              }
            },
          ],
        },
        {
          id: "head-2",
          name: "Sandra García",
          avatar: "SG",
          level: 2,
          levelName: "Cabeza",
          parentId: "sub-1",
          commissionPerTicket: 10000,
          ownSales: { today: 5, week: 32, month: 98, total: 987 },
          teamSales: { today: 0, week: 0, month: 0, total: 0 },
          salesByEvent: {
            'evt-1': { ownSales: 65, teamSales: 0, ownCommission: 650000, teamCommission: 0 },
            'evt-2': { ownSales: 25, teamSales: 0, ownCommission: 250000, teamCommission: 0 },
            'evt-3': { ownSales: 8, teamSales: 0, ownCommission: 80000, teamCommission: 0 }
          },
          teamSize: 12,
          children: [
            { 
              id: "promo-6", 
              name: "Roberto Méndez", 
              avatar: "RM", 
              level: 1, 
              levelName: "Común",
              parentId: "head-2",
              commissionPerTicket: 7500,
              ownSales: { today: 2, week: 12, month: 45, total: 156 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 30, teamSales: 0, ownCommission: 225000, teamCommission: 0 },
                'evt-2': { ownSales: 11, teamSales: 0, ownCommission: 82500, teamCommission: 0 },
                'evt-3': { ownSales: 4, teamSales: 0, ownCommission: 30000, teamCommission: 0 }
              }
            },
            { 
              id: "promo-7", 
              name: "Carolina Vega", 
              avatar: "CV", 
              level: 1, 
              levelName: "Común",
              parentId: "head-2",
              commissionPerTicket: 7500,
              ownSales: { today: 2, week: 10, month: 42, total: 143 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 28, teamSales: 0, ownCommission: 210000, teamCommission: 0 },
                'evt-2': { ownSales: 10, teamSales: 0, ownCommission: 75000, teamCommission: 0 },
                'evt-3': { ownSales: 4, teamSales: 0, ownCommission: 30000, teamCommission: 0 }
              }
            },
            { 
              id: "promo-8", 
              name: "Andrés Castro", 
              avatar: "AC", 
              level: 1, 
              levelName: "Común",
              parentId: "head-2",
              commissionPerTicket: 7500,
              ownSales: { today: 1, week: 9, month: 38, total: 132 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 25, teamSales: 0, ownCommission: 187500, teamCommission: 0 },
                'evt-2': { ownSales: 9, teamSales: 0, ownCommission: 67500, teamCommission: 0 },
                'evt-3': { ownSales: 4, teamSales: 0, ownCommission: 30000, teamCommission: 0 }
              }
            },
          ],
        },
      ],
    },
    {
      id: "sub-2",
      name: "Miguel Ángel Rojas",
      avatar: "MA",
      level: 3,
      levelName: "Sub Socio",
      parentId: "admin-1",
      commissionPerTicket: 15000,
      ownSales: { today: 4, week: 22, month: 95, total: 390 },
      teamSales: { today: 0, week: 0, month: 0, total: 0 },
      salesByEvent: {
        'evt-1': { ownSales: 60, teamSales: 0, ownCommission: 900000, teamCommission: 0 },
        'evt-2': { ownSales: 25, teamSales: 0, ownCommission: 375000, teamCommission: 0 },
        'evt-3': { ownSales: 10, teamSales: 0, ownCommission: 150000, teamCommission: 0 }
      },
      teamSize: 28,
      children: [
        {
          id: "head-3",
          name: "Roberto Silva",
          avatar: "RS",
          level: 2,
          levelName: "Cabeza",
          parentId: "sub-2",
          commissionPerTicket: 10000,
          ownSales: { today: 4, week: 25, month: 78, total: 782 },
          teamSales: { today: 0, week: 0, month: 0, total: 0 },
          salesByEvent: {
            'evt-1': { ownSales: 52, teamSales: 0, ownCommission: 520000, teamCommission: 0 },
            'evt-2': { ownSales: 18, teamSales: 0, ownCommission: 180000, teamCommission: 0 },
            'evt-3': { ownSales: 8, teamSales: 0, ownCommission: 80000, teamCommission: 0 }
          },
          teamSize: 10,
          children: [
            { 
              id: "promo-9", 
              name: "Diana Ospina", 
              avatar: "DO", 
              level: 1, 
              levelName: "Común",
              parentId: "head-3",
              commissionPerTicket: 7500,
              ownSales: { today: 2, week: 10, month: 38, total: 134 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 25, teamSales: 0, ownCommission: 187500, teamCommission: 0 },
                'evt-2': { ownSales: 9, teamSales: 0, ownCommission: 67500, teamCommission: 0 },
                'evt-3': { ownSales: 4, teamSales: 0, ownCommission: 30000, teamCommission: 0 }
              }
            },
            { 
              id: "promo-10", 
              name: "Felipe Arango", 
              avatar: "FA", 
              level: 1, 
              levelName: "Común",
              parentId: "head-3",
              commissionPerTicket: 7500,
              ownSales: { today: 1, week: 9, month: 35, total: 128 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 23, teamSales: 0, ownCommission: 172500, teamCommission: 0 },
                'evt-2': { ownSales: 8, teamSales: 0, ownCommission: 60000, teamCommission: 0 },
                'evt-3': { ownSales: 4, teamSales: 0, ownCommission: 30000, teamCommission: 0 }
              }
            },
          ],
        },
        {
          id: "head-4",
          name: "Diana Castro",
          avatar: "DC",
          level: 2,
          levelName: "Cabeza",
          parentId: "sub-2",
          commissionPerTicket: 10000,
          ownSales: { today: 3, week: 18, month: 58, total: 588 },
          teamSales: { today: 0, week: 0, month: 0, total: 0 },
          salesByEvent: {
            'evt-1': { ownSales: 38, teamSales: 0, ownCommission: 380000, teamCommission: 0 },
            'evt-2': { ownSales: 14, teamSales: 0, ownCommission: 140000, teamCommission: 0 },
            'evt-3': { ownSales: 6, teamSales: 0, ownCommission: 60000, teamCommission: 0 }
          },
          teamSize: 8,
          children: [
            { 
              id: "promo-11", 
              name: "Jorge Molina", 
              avatar: "JM", 
              level: 1, 
              levelName: "Común",
              parentId: "head-4",
              commissionPerTicket: 7500,
              ownSales: { today: 1, week: 8, month: 32, total: 112 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 21, teamSales: 0, ownCommission: 157500, teamCommission: 0 },
                'evt-2': { ownSales: 8, teamSales: 0, ownCommission: 60000, teamCommission: 0 },
                'evt-3': { ownSales: 3, teamSales: 0, ownCommission: 22500, teamCommission: 0 }
              }
            },
            { 
              id: "promo-12", 
              name: "Valentina Ríos", 
              avatar: "VR", 
              level: 1, 
              levelName: "Común",
              parentId: "head-4",
              commissionPerTicket: 7500,
              ownSales: { today: 1, week: 7, month: 28, total: 98 },
              teamSales: { today: 0, week: 0, month: 0, total: 0 },
              salesByEvent: {
                'evt-1': { ownSales: 18, teamSales: 0, ownCommission: 135000, teamCommission: 0 },
                'evt-2': { ownSales: 7, teamSales: 0, ownCommission: 52500, teamCommission: 0 },
                'evt-3': { ownSales: 3, teamSales: 0, ownCommission: 22500, teamCommission: 0 }
              }
            },
          ],
        },
      ],
    },
  ],
};

// Export the organization with aggregated sales
export const organizationData = calculateAggregatedSales(rawOrganizationData);

// Helper function to get a user by ID from the org tree
export function findUserById(id: string, tree: TeamMember = organizationData): TeamMember | null {
  if (tree.id === id) return tree;
  if (tree.children) {
    for (const child of tree.children) {
      const found = findUserById(id, child);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to get total sales (own + team)
export function getTotalSales(member: TeamMember, period: 'today' | 'week' | 'month' | 'total' = 'month'): number {
  return member.ownSales[period] + member.teamSales[period];
}

// Helper function to get sales for a specific event
export function getEventSales(member: TeamMember, eventId: string): { own: number; team: number; total: number; ownCommission: number; teamCommission: number } {
  const eventData = member.salesByEvent[eventId] || { ownSales: 0, teamSales: 0, ownCommission: 0, teamCommission: 0 };
  return {
    own: eventData.ownSales,
    team: eventData.teamSales,
    total: eventData.ownSales + eventData.teamSales,
    ownCommission: eventData.ownCommission,
    teamCommission: eventData.teamCommission
  };
}

// Sales data for tables
export const salesData: Sale[] = [
  { id: "TKT-001", eventId: "evt-1", eventName: "Neon Festival 2026", sellerId: "promo-1", sellerName: "Carlos Ruiz", ticketType: "vip", price: 80000, commission: 7500, date: "2026-01-27 18:45", status: "confirmed" },
  { id: "TKT-002", eventId: "evt-1", eventName: "Neon Festival 2026", sellerId: "promo-1", sellerName: "Carlos Ruiz", ticketType: "general", price: 40000, commission: 7500, date: "2026-01-27 16:20", status: "confirmed" },
  { id: "TKT-003", eventId: "evt-1", eventName: "Neon Festival 2026", sellerId: "promo-2", sellerName: "Ana Torres", ticketType: "general", price: 40000, commission: 7500, date: "2026-01-27 14:15", status: "confirmed" },
  { id: "TKT-004", eventId: "evt-2", eventName: "Rock Night", sellerId: "promo-1", sellerName: "Carlos Ruiz", ticketType: "palco", price: 120000, commission: 7500, date: "2026-01-26 22:30", status: "confirmed" },
  { id: "TKT-005", eventId: "evt-2", eventName: "Rock Night", sellerId: "promo-3", sellerName: "Luis Gómez", ticketType: "vip", price: 80000, commission: 7500, date: "2026-01-26 19:45", status: "confirmed" },
  { id: "TKT-006", eventId: "evt-1", eventName: "Neon Festival 2026", sellerId: "promo-4", sellerName: "María López", ticketType: "general", price: 40000, commission: 7500, date: "2026-01-26 17:00", status: "pending" },
  { id: "TKT-007", eventId: "evt-1", eventName: "Neon Festival 2026", sellerId: "promo-5", sellerName: "Pedro Díaz", ticketType: "general", price: 40000, commission: 7500, date: "2026-01-25 21:30", status: "confirmed" },
  { id: "TKT-008", eventId: "evt-2", eventName: "Rock Night", sellerId: "promo-2", sellerName: "Ana Torres", ticketType: "general", price: 40000, commission: 7500, date: "2026-01-25 18:15", status: "confirmed" },
  { id: "TKT-009", eventId: "evt-1", eventName: "Neon Festival 2026", sellerId: "promo-1", sellerName: "Carlos Ruiz", ticketType: "vip", price: 80000, commission: 7500, date: "2026-01-25 15:00", status: "confirmed" },
  { id: "TKT-010", eventId: "evt-3", eventName: "Electro Waves", sellerId: "promo-6", sellerName: "Roberto Méndez", ticketType: "general", price: 45000, commission: 7500, date: "2026-01-24 20:45", status: "confirmed" },
];

// Weekly chart data for 15-day sales cycles
export const weeklyChartData = [
  { week: "Sem 1", ownSales: 28, teamSales: 145, ownCommission: 210000, teamCommission: 1087500 },
  { week: "Sem 2", ownSales: 32, teamSales: 168, ownCommission: 240000, teamCommission: 1260000 },
  { week: "Sem 3", ownSales: 45, teamSales: 210, ownCommission: 337500, teamCommission: 1575000 },
  { week: "Sem 4", ownSales: 22, teamSales: 125, ownCommission: 165000, teamCommission: 937500 },
];

// Weekly data by event
export const weeklyChartDataByEvent: Record<string, typeof weeklyChartData> = {
  'evt-1': [
    { week: "Sem 1", ownSales: 18, teamSales: 95, ownCommission: 135000, teamCommission: 712500 },
    { week: "Sem 2", ownSales: 22, teamSales: 110, ownCommission: 165000, teamCommission: 825000 },
    { week: "Sem 3", ownSales: 30, teamSales: 140, ownCommission: 225000, teamCommission: 1050000 },
    { week: "Sem 4", ownSales: 15, teamSales: 80, ownCommission: 112500, teamCommission: 600000 },
  ],
  'evt-2': [
    { week: "Sem 1", ownSales: 8, teamSales: 35, ownCommission: 60000, teamCommission: 262500 },
    { week: "Sem 2", ownSales: 7, teamSales: 42, ownCommission: 52500, teamCommission: 315000 },
    { week: "Sem 3", ownSales: 10, teamSales: 50, ownCommission: 75000, teamCommission: 375000 },
    { week: "Sem 4", ownSales: 5, teamSales: 30, ownCommission: 37500, teamCommission: 225000 },
  ],
  'evt-3': [
    { week: "Sem 1", ownSales: 2, teamSales: 15, ownCommission: 15000, teamCommission: 112500 },
    { week: "Sem 2", ownSales: 3, teamSales: 16, ownCommission: 22500, teamCommission: 120000 },
    { week: "Sem 3", ownSales: 5, teamSales: 20, ownCommission: 37500, teamCommission: 150000 },
    { week: "Sem 4", ownSales: 2, teamSales: 15, ownCommission: 15000, teamCommission: 112500 },
  ],
};

// Current user context for demo
export const currentUsers = {
  promotorComun: findUserById("promo-1")!,
  promotorCabeza: findUserById("head-1")!,
  subSocio: findUserById("sub-1")!,
  socio: organizationData
};
