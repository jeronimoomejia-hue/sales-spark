import { VendorClosure } from "@/types/crews";

// Mock closure data for demo purposes
export const mockVendorClosures: VendorClosure[] = [
  {
    id: "vc-1",
    eventId: "evt-1",
    eventName: "Neon Festival 2026",
    eventDate: "2026-02-15",
    vendorId: "promo-1",
    vendorName: "Carlos Ruiz",
    vendorAvatar: "CR",
    vendorLevel: 1,
    vendorLevelName: "Promotor Común",
    commissionPerTicket: 7500,
    ticketsSold: 55,
    totalCommission: 412500,
    closureExecutedAt: "2026-02-16T00:00:00",
    status: "confirmed",
    paymentProofUrl: "/comprobante-ejemplo.pdf",
    paymentProofBase64: "",
    paymentDeclaredAt: "2026-02-17T10:30:00",
    paymentDeclaredAmount: 412500,
    confirmedAt: "2026-02-17T14:00:00",
  },
  {
    id: "vc-2",
    eventId: "evt-2",
    eventName: "Rock Night",
    eventDate: "2026-02-28",
    vendorId: "promo-1",
    vendorName: "Carlos Ruiz",
    vendorAvatar: "CR",
    vendorLevel: 1,
    vendorLevelName: "Promotor Común",
    commissionPerTicket: 7500,
    ticketsSold: 22,
    totalCommission: 165000,
    closureExecutedAt: "2026-03-01T02:00:00",
    status: "payment_declared",
    paymentProofBase64: "",
    paymentDeclaredAt: "2026-03-02T09:00:00",
    paymentDeclaredAmount: 165000,
  },
  {
    id: "vc-3",
    eventId: "evt-3",
    eventName: "Electro Waves",
    eventDate: "2026-03-10",
    vendorId: "promo-1",
    vendorName: "Carlos Ruiz",
    vendorAvatar: "CR",
    vendorLevel: 1,
    vendorLevelName: "Promotor Común",
    commissionPerTicket: 7500,
    ticketsSold: 8,
    totalCommission: 60000,
    closureExecutedAt: "2026-03-11T01:00:00",
    status: "pending",
  },
];

// Admin-side mock closures (all vendors for an event)
export const mockAdminClosures: VendorClosure[] = [
  {
    id: "avc-1", eventId: "evt-1", eventName: "Neon Festival 2026", eventDate: "2026-02-15",
    vendorId: "promo-1", vendorName: "Carlos Ruiz", vendorAvatar: "CR",
    vendorLevel: 1, vendorLevelName: "Común", commissionPerTicket: 7500,
    ticketsSold: 55, totalCommission: 412500,
    closureExecutedAt: "2026-02-16T00:00:00", status: "confirmed",
    paymentDeclaredAt: "2026-02-17T10:30:00", paymentDeclaredAmount: 412500, confirmedAt: "2026-02-17T14:00:00",
  },
  {
    id: "avc-2", eventId: "evt-1", eventName: "Neon Festival 2026", eventDate: "2026-02-15",
    vendorId: "promo-2", vendorName: "Ana Torres", vendorAvatar: "AT",
    vendorLevel: 1, vendorLevelName: "Común", commissionPerTicket: 7500,
    ticketsSold: 48, totalCommission: 360000,
    closureExecutedAt: "2026-02-16T00:00:00", status: "payment_declared",
    paymentDeclaredAt: "2026-02-18T11:00:00", paymentDeclaredAmount: 360000,
  },
  {
    id: "avc-3", eventId: "evt-1", eventName: "Neon Festival 2026", eventDate: "2026-02-15",
    vendorId: "promo-3", vendorName: "Luis Gómez", vendorAvatar: "LG",
    vendorLevel: 1, vendorLevelName: "Común", commissionPerTicket: 7500,
    ticketsSold: 45, totalCommission: 337500,
    closureExecutedAt: "2026-02-16T00:00:00", status: "pending",
  },
  {
    id: "avc-4", eventId: "evt-1", eventName: "Neon Festival 2026", eventDate: "2026-02-15",
    vendorId: "promo-4", vendorName: "María López", vendorAvatar: "ML",
    vendorLevel: 1, vendorLevelName: "Común", commissionPerTicket: 7500,
    ticketsSold: 38, totalCommission: 285000,
    closureExecutedAt: "2026-02-16T00:00:00", status: "pending",
  },
  {
    id: "avc-5", eventId: "evt-1", eventName: "Neon Festival 2026", eventDate: "2026-02-15",
    vendorId: "promo-5", vendorName: "Pedro Díaz", vendorAvatar: "PD",
    vendorLevel: 1, vendorLevelName: "Común", commissionPerTicket: 7500,
    ticketsSold: 35, totalCommission: 262500,
    closureExecutedAt: "2026-02-16T00:00:00", status: "confirmed",
    paymentDeclaredAt: "2026-02-17T09:00:00", paymentDeclaredAmount: 262500, confirmedAt: "2026-02-17T15:30:00",
  },
  {
    id: "avc-6", eventId: "evt-1", eventName: "Neon Festival 2026", eventDate: "2026-02-15",
    vendorId: "head-1", vendorName: "Juan Pérez", vendorAvatar: "JP",
    vendorLevel: 2, vendorLevelName: "Cabeza", commissionPerTicket: 10000,
    ticketsSold: 85, totalCommission: 850000,
    closureExecutedAt: "2026-02-16T00:00:00", status: "payment_declared",
    paymentDeclaredAt: "2026-02-18T14:00:00", paymentDeclaredAmount: 850000,
  },
];

export const getVendorClosures = (vendorId?: string): VendorClosure[] => {
  if (vendorId) return mockVendorClosures.filter(c => c.vendorId === vendorId);
  return mockVendorClosures;
};

export const getAdminClosuresForEvent = (eventId: string): VendorClosure[] => {
  return mockAdminClosures.filter(c => c.eventId === eventId);
};
