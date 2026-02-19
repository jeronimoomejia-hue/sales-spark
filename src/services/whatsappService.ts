import { toast } from "sonner";

export interface WhatsAppNotification {
  to: string;
  templateName: string;
  variables: Record<string, string>;
}

const templateMessages: Record<string, (vars: Record<string, string>) => string> = {
  vendedor_aprobado: (v) =>
    `¡Bienvenido a CREWS! Tu registro fue aprobado. Ya puedes empezar a vender. Entra aquí: ${v.link || 'https://crews.app'}`,
  vendedor_asignado: (v) =>
    `¡Nuevo evento disponible! Ya tienes tu link de ventas para ${v.eventName}. Entra a CREWS para verlo.`,
  hito_completado: (v) =>
    `🏆 ¡Felicitaciones! Completaste el hito '${v.milestoneName}' y ganaste ${v.reward}. Entra a CREWS para reclamarlo.`,
  nivel_up: (v) =>
    `🚀 ¡Subiste de nivel! Ahora eres ${v.levelName} con comisión de $${v.commission} COP por ticket.`,
  pago_pendiente_confirmacion: (v) =>
    `💸 ${v.promoterName} declaró tu pago por $${v.amount} COP por el evento ${v.eventName}. Entra a CREWS para ver el comprobante y confirmar.`,
  cierre_proximo: (v) =>
    `⏰ El evento ${v.eventName} cierra en 1 hora. Aprovecha para vender más tickets con tu link.`,
  registro_nuevo: (v) =>
    `📋 ${v.sellerName} solicita unirse a tu red en CREWS. Revisa su solicitud aquí: ${v.link || 'https://crews.app/admin/registrations'}`,
  cierre_ejecutado: (v) =>
    `✅ El evento ${v.eventName} se cerró automáticamente. Tienes ${v.pendingCount} vendedores pendientes de pago. Entra a gestionar los pagos.`,
  pago_confirmado: (v) =>
    `✅ ${v.sellerName} confirmó haber recibido su pago de $${v.amount} COP por ${v.eventName}.`,
  vendedor_inactivo: (v) =>
    `⚠️ ${v.sellerName} lleva ${v.days} días sin ventas en ${v.eventName}. Puede necesitar apoyo.`,
  meta_alcanzada: (v) =>
    `🎉 ¡El evento ${v.eventName} alcanzó su meta de ${v.target} tickets vendidos!`,
};

export const sendWhatsAppNotification = async (notification: WhatsAppNotification): Promise<void> => {
  const messageBuilder = templateMessages[notification.templateName];
  const message = messageBuilder
    ? messageBuilder(notification.variables)
    : `[${notification.templateName}] ${JSON.stringify(notification.variables)}`;

  console.log('[WhatsApp Notification]', {
    to: notification.to,
    template: notification.templateName,
    message,
  });

  toast.success(`📱 WhatsApp enviado a ${notification.to}`, {
    description: message.substring(0, 80) + '...',
  });
};

// Convenience helpers
export const notifySellerApproved = (phone: string, link?: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'vendedor_aprobado', variables: { link: link || '' } });

export const notifySellerAssigned = (phone: string, eventName: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'vendedor_asignado', variables: { eventName } });

export const notifyMilestoneCompleted = (phone: string, milestoneName: string, reward: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'hito_completado', variables: { milestoneName, reward } });

export const notifyLevelUp = (phone: string, levelName: string, commission: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'nivel_up', variables: { levelName, commission } });

export const notifyPaymentPending = (phone: string, promoterName: string, amount: string, eventName: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'pago_pendiente_confirmacion', variables: { promoterName, amount, eventName } });

export const notifyClosureSoon = (phone: string, eventName: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'cierre_proximo', variables: { eventName } });

export const notifyNewRegistration = (phone: string, sellerName: string, link?: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'registro_nuevo', variables: { sellerName, link: link || '' } });

export const notifyClosureExecuted = (phone: string, eventName: string, pendingCount: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'cierre_ejecutado', variables: { eventName, pendingCount } });

export const notifyPaymentConfirmed = (phone: string, sellerName: string, amount: string, eventName: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'pago_confirmado', variables: { sellerName, amount, eventName } });

export const notifySellerInactive = (phone: string, sellerName: string, days: string, eventName: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'vendedor_inactivo', variables: { sellerName, days, eventName } });

export const notifyGoalReached = (phone: string, eventName: string, target: string) =>
  sendWhatsAppNotification({ to: phone, templateName: 'meta_alcanzada', variables: { eventName, target } });
