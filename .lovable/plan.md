## Fondo estilo "Glass Orb" para CREWS

Adaptar la estética del fondo de WWDC25 (grilla sutil + orbe de vidrio flotante con refracción) al universo visual de CREWS, cambiando el gris frío por la paleta neón/dark de la marca (naranja CREWS + morado/rosa neón sobre negro profundo).

### Dónde se aplica
- **Landing `/`** — sección hero (reemplaza el fondo actual del hero).
- **Login `/login`** y **Register `/register`** — fondo full-screen.
- Disponible como componente reutilizable `CrewsGlassBackground` para usarlo luego en otros hero sections si se quiere.

### Diseño visual (adaptación de la referencia)
- **Base**: gradiente diagonal de negro profundo `hsl(240 15% 4%)` → gris muy oscuro `hsl(240 10% 10%)` (reemplaza el gris claro del original).
- **Grilla**: líneas finas (`1px`, opacidad ~8%) formando una cuadrícula 4×3, en blanco muy sutil. Fade radial en los bordes para que no compita con el contenido.
- **Orbe de vidrio central**: dos formas orgánicas fusionadas (misma silueta "cacahuate" de la referencia), hechas con:
  - SVG con `<filter>` de `feGaussianBlur` + `feSpecularLighting` para el efecto glass.
  - Bordes con gradiente sutil naranja CREWS → morado neón → rosa neón (en vez del arcoíris blanco original).
  - Highlight superior blanco translúcido para dar la sensación de vidrio soplado.
  - Sombra interna con `backdrop-filter: blur(20px)` para el efecto refracción.
- **Refracción cromática** (el destello iridiscente inferior del original): línea delgada con gradiente `naranja → magenta → azul-neón` en la base del orbe.
- **Animación**: flotación muy lenta (8s ease-in-out) + rotación sutil (±2°) para dar vida sin distraer.

### Archivos a tocar

**Nuevo**
- `src/components/ui/CrewsGlassBackground.tsx` — componente autocontenido con el SVG del orbe, la grilla y las animaciones. Props: `variant?: 'hero' | 'full'` para controlar tamaño/posición del orbe.

**Modificados**
- `src/pages/Landing.tsx` — insertar `<CrewsGlassBackground variant="hero" />` como capa absoluta detrás del contenido del hero (dentro de la sección `crews-mode`).
- `src/pages/Login.tsx` — reemplazar fondo actual por `<CrewsGlassBackground variant="full" />`.
- `src/pages/Register.tsx` — mismo tratamiento que Login.
- `src/index.css` — agregar keyframes `glass-float` y `glass-rotate`, y utility `.bg-crews-grid` para la grilla base (SVG inline como `background-image`).

### Detalles técnicos
- El orbe se hace 100% con SVG + filtros (sin imágenes) para que sea crisp en cualquier resolución y respete los tokens de color del design system.
- Uso exclusivo de tokens HSL de `index.css`: `--primary` (naranja CREWS), `--neon-purple`, `--neon-pink`. Nada hardcoded.
- El componente respeta `prefers-reduced-motion` (desactiva animación).
- Z-index bajo (`-z-10`) para que el contenido siempre quede encima.
- Responsive: el orbe se escala con `viewBox` SVG, en mobile se reduce a ~60% del ancho.

### Fuera de alcance
- No se toca el dashboard admin ni el dashboard del vendedor (mantienen su estética actual con cards glass).
- No se agregan imágenes bitmap — todo vectorial + CSS.
