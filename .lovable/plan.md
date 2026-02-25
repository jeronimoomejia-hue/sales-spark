

# Configuracion de Precios y Comisiones por Evento

## Resumen

La promotora podra editar en tiempo real los precios de boleta (por tipo: general, VIP, palco) y las comisiones por nivel de vendedor para cada evento. Los cambios se reflejan automaticamente en el dashboard del vendedor y en los links de pago que comparten.

---

## Que se construye

### 1. Modelo de datos -- Precios por tipo de boleta y comisiones por nivel

Se extiende la interfaz `Event` en `src/data/mockData.ts` para incluir:

- `ticketTypes`: array con tipos de boleta (general, VIP, palco), cada uno con nombre, precio y cantidad disponible
- `commissionsByLevel`: objeto con la comision por ticket para cada nivel de vendedor (1, 2, 3, 4)
- Se elimina el campo plano `ticketPrice` que solo soporta un precio unico

```text
Event
  ticketTypes: [
    { id, name, price, available, color }
  ]
  commissionsByLevel: {
    1: number,  // Nivel 1
    2: number,  // Nivel 2
    3: number,  // Nivel 3
    4: number   // Nivel 4
  }
```

### 2. Modal de configuracion de precios -- `EventPricingModal.tsx`

Nuevo componente en `src/components/admin/EventPricingModal.tsx`:

- Se abre desde cada card de evento en `/admin/events` con un boton "Precios y Comisiones"
- Seccion superior: tabla editable de tipos de boleta (nombre, precio en COP, cantidad)
- Seccion inferior: comision por nivel con inputs numericos, mostrando el nombre del nivel y un preview del calculo (ej: "Si vende 10 tickets = $75,000 COP")
- Preview en vivo del link de pago con los precios actualizados
- Boton "Guardar y Notificar" que muestra toast de confirmacion y simula notificacion a vendedores

### 3. Boton de acceso en AdminEvents

En `src/pages/admin/AdminEvents.tsx`, se agrega un tercer boton en la grilla de acciones de cada evento:

- Icono de DollarSign + texto "Precios"
- Abre el `EventPricingModal` con los datos del evento seleccionado
- Se reorganiza la grilla de acciones a 3 columnas para acomodar el nuevo boton

### 4. Dashboard del vendedor -- Reflejo de precios actualizados

En `src/pages/Dashboard.tsx` y componentes hijos:

- El KPI de "Comision por ticket" usa `commissionsByLevel[userLevel]` del evento seleccionado en vez del valor fijo en `commissionPerTicket` del `TeamMember`
- Se agrega una mini-tabla en la vista de evento (tab "Mis Eventos") mostrando los tipos de boleta con sus precios actuales
- Cuando un precio cambia (simulado con estado local), se muestra un badge "Actualizado" con animacion de pulso

### 5. Link de pago simulado

Nuevo componente `PaymentLinkPreview.tsx` en `src/components/dashboard/`:

- Muestra el link de pago del vendedor con los precios actuales de boleta
- Formato: `crews.app/pay/{eventId}/{sellerId}`
- Detalle: lista de tipos de boleta disponibles con precio actual
- Boton "Copiar Link" que copia al clipboard

---

## Archivos a crear

| Archivo | Descripcion |
|---|---|
| `src/components/admin/EventPricingModal.tsx` | Modal con formulario de precios de boleta y comisiones por nivel |
| `src/components/dashboard/PaymentLinkPreview.tsx` | Card con preview del link de pago y precios actuales |

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/data/mockData.ts` | Extender interfaz `Event` con `ticketTypes` y `commissionsByLevel`, actualizar datos mock de los 3 eventos |
| `src/pages/admin/AdminEvents.tsx` | Agregar boton "Precios" en cada card, integrar `EventPricingModal` |
| `src/pages/Dashboard.tsx` | Usar comisiones dinamicas del evento en vez de valor fijo del TeamMember |
| `src/components/dashboard/EventSegmentedView.tsx` | Mostrar tipos de boleta y precios en las cards de eventos del vendedor |

---

## Detalles tecnicos

- El `EventPricingModal` usa el Dialog de Radix existente con estetica glass/neon
- Los inputs de precio usan el componente `Input` existente con `type="number"`
- Los estados se manejan con `useState` local (mock, sin backend)
- El toast de "Precios actualizados" usa Sonner con icono de check verde
- La grilla de acciones en las cards de evento pasa de `grid-cols-2` a `grid-cols-3`
- El `PaymentLinkPreview` aparece dentro del tab "Mis Eventos" del vendedor, debajo de cada card de evento

