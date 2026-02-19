// Extended interfaces for CREWS platform

export interface VendorClosure {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  vendorLevel: number;
  vendorLevelName: string;
  commissionPerTicket: number;
  ticketsSold: number;
  totalCommission: number;
  closureExecutedAt: string;
  status: 'pending' | 'payment_declared' | 'confirmed';
  paymentProofUrl?: string;
  paymentProofBase64?: string;
  paymentDeclaredAt?: string;
  paymentDeclaredAmount?: number;
  confirmedAt?: string;
}

export interface EventClosure {
  eventId: string;
  eventName: string;
  closureScheduledAt: string | null;
  closureExecutedAt: string | null;
  status: 'scheduled' | 'executed';
  vendorClosures: VendorClosure[];
}

export interface TermsAcceptance {
  termsAcceptedAt: string;
  termsVersion: string;
  ipAddress: string;
  documents: {
    name: string;
    acceptedAt: string;
    version: string;
  }[];
}

export interface WhatsAppNotification {
  to: string;
  templateName: string;
  variables: Record<string, string>;
}
