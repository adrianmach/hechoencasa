# Rediseño completo: Estilo Ladurée (laduree.com)

## Instrucción

Rediseñá visualmente toda la web de "Hecho en Casa" inspirándote en laduree.com. No cambies funcionalidad ni datos — solo diseño, tipografía, layout, animaciones y efectos. Pensá como un diseñador web senior. Cada sección tiene que sentirse pensada a medida, no generada. Trabajá en loop hasta que toda la web tenga el nivel visual de una patisserie de autor.

---

## 1. Paleta de colores — USAR EXACTAMENTE ESTOS

```css
:root {
  --color-cream: #FFF8F2;         /* fondo principal */
  --color-pink: #F7D6E6;          /* secciones rosadas */
  --color-lavender: #E9E2FF;      /* secciones lavanda */
  --color-sage: #DCE9DF;          /* secciones verde salvia */
  --color-sand: #F3E7D3;          /* secciones arena/beige */
  --color-gold: #C8A96A;          /* acentos dorados: bordes, líneas, botones hover */
  --color-text: #444444;          /* texto principal */
  --color-bg-alt: #F8F5F1;        /* fondo alternativo */
  --color-rose: #EBCFCF;          /* acentos rosados suaves */
  --color-moss: #B7C5B0;          /* acentos verdes apagados */
  --color-taupe: #D8C5B2;         /* acentos tierra */
  --color-gold-accent: #C8A96A;   /* dorado para detalles finos */
}
```

NO inventar otros colores. Toda la web sale de esta paleta. El dorado (#C8A96A) es el hilo conductor: líneas decorativas, bordes de botones en hover, separadores entre secciones.

## 2. Tipografía — Estilo Ladurée

Ladurée usa una Didone/Didot (serif de alto contraste, elegante, francesa). Equivalente gratuito:

**Títulos → Playfair Display** (la Didone más cercana en Google Fonts, alto contraste fino/grueso como Didot)
**Body → DM Sans** (sans-serif geométrica limpia, no compite con la serif)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
```

### Cómo aplicar:

- **"Hecho en Casa"** en el header: `Playfair Display` peso 500, tamaño moderado, letter-spacing: 0.08em, uppercase. Se lee como un logo tipográfico de maison francesa.
- **Títulos de sección**: `Playfair Display` peso 400 normal (no uppercase), tamaño grande (2.5-3.5rem desktop), con una palabra o frase en *italic* para dar movimiento como hace Ladurée ("L'art du luxe *à la française*"). Ejemplo: "Pastelería artesanal, *hecha con amor*" — "hecha con amor" va en Playfair italic.
- **Subtítulos/labels**: `DM Sans` peso 500, uppercase, letter-spacing: 0.15em, tamaño chico (0.75rem). Como los labels "Coffret sur mesure", "la maison ladurée" que van ENCIMA de los títulos en laduree.com.
- **Body text**: `DM Sans` peso 400, tamaño 1rem, line-height 1.7, color #444444.
- **Botones**: `DM Sans` peso 500, uppercase, letter-spacing: 0.12em, tamaño 0.8rem.
- **Navegación**: `DM Sans` peso 400, tamaño 0.9rem, letter-spacing: 0.05em.

## 3. Layout general — Estructura tipo Ladurée

### Header
- Fondo: `--color-cream` con borde inferior muy sutil (1px `--color-gold` con opacity 0.3)
- Logo "HECHO EN CASA" centrado, nav a los lados (desktop) o hamburguesa (mobile)
- Al hacer scroll: el header se achica sutilmente (padding reduce de 24px a 12px) con transición suave de 300ms
- Botón WhatsApp en la nav: borde dorado, fondo transparente, al hover fondo dorado y texto cream

### Hero
- Imagen full-width con aspect-ratio alto (60-70vh en desktop, 50vh mobile)
- La imagen tiene un overlay gradient sutil: de rgba(0,0,0,0.05) arriba a rgba(0,0,0,0.25) abajo
- Texto sobre la imagen, alineado abajo-izquierda (NO centrado como las webs genéricas)
- Label chico arriba del título: "PASTELERÍA ARTESANAL" en DM Sans uppercase con letter-spacing
- Título grande: "Hecho en Casa" en Playfair Display
- Subtítulo: frase descriptiva
- Botón con borde dorado
- **Animación de entrada**: el texto hace un fade-in + slide-up (translateY de 30px a 0) con 800ms ease-out, delay escalonado (label 200ms, título 400ms, subtítulo 600ms, botón 800ms)

### Secciones con color blocking
Cada sección de la home tiene un color de fondo distinto de la paleta, alternando:
1. Hero → imagen
2. Productos destacados → `--color-cream`
3. Tortas personalizadas → `--color-pink`
4. Cómo pedir → `--color-bg-alt`
5. Sobre mí → `--color-sage`
6. Testimonios → `--color-lavender`
7. Galería → `--color-cream`
8. FAQ → `--color-sand`
9. Contacto/Footer → `--color-text` con texto claro (inversión elegante)

### Estructura de cada sección
Seguir el patrón de Ladurée:
1. Un label chico uppercase con letter-spacing arriba de todo
2. Un título grande en Playfair con alguna palabra en italic
3. Un párrafo descriptivo corto en DM Sans
4. CTA o contenido
5. Separador: una línea fina dorada centrada (width 60px, 1px, color gold) entre secciones

## 4. Animaciones y efectos — CRÍTICO

### Scroll animations (Intersection Observer)
Implementar con `IntersectionObserver` nativo, NO librerías externas. Cada sección/elemento se anima al entrar en el viewport:

```typescript
// Hook reutilizable: useScrollReveal
// threshold: 0.15, rootMargin: "0px 0px -50px 0px"
// Aplica clase 'revealed' que activa la animación CSS
```

**Tipos de animación según el elemento:**
- **Títulos de sección**: fade-in + slide-up (translateY: 40px → 0, opacity: 0 → 1, duration: 700ms, ease-out)
- **Párrafos**: fade-in solo (opacity: 0 → 1, duration: 600ms, delay: 200ms después del título)
- **Cards de productos**: fade-in + slide-up escalonado (cada card tiene 100ms más de delay que la anterior: card1 0ms, card2 100ms, card3 200ms, card4 300ms)
- **Imágenes**: fade-in + scale sutil (scale: 1.03 → 1, opacity: 0 → 1, duration: 800ms)
- **Líneas doradas separadoras**: width crece de 0 a 60px (duration: 500ms, ease-out)
- **Botones**: fade-in (opacity: 0 → 1, duration: 400ms, delay: 400ms)

### Parallax suave en imágenes clave
En 2-3 secciones (hero, tortas personalizadas, sobre mí), la imagen de fondo tiene `background-attachment: fixed` en desktop (NO en mobile, ahí queda normal). Esto da el efecto de que el contenido "pasa por encima" de la imagen. Es sutil pero premium.

Alternativa si `background-attachment: fixed` no queda bien: usar transform con scroll en JS (translateY se mueve a 30% de la velocidad del scroll).

### Hover effects
- **Cards de producto**: al hover, la imagen hace scale(1.05) con transition 500ms ease, y aparece un borde inferior dorado (height: 2px, scaleX de 0 a 1, transition 300ms)
- **Botones**: al hover, el fondo llena de dorado con transition 300ms, el texto cambia a cream
- **Links de navegación**: underline animado desde el centro (scaleX: 0 → 1, origin: center, transition 300ms)
- **Imágenes de galería**: al hover, un overlay sutil con el caption que hace fade-in
- **Cards de testimonios**: lift sutil (translateY: -4px, box-shadow crece, transition 300ms)

### Transiciones de página
Si es posible con Next.js App Router: al navegar entre páginas, el contenido hace fade-out (200ms) y fade-in (300ms). Si no es viable sin librería, al menos que el contenido de cada página haga fade-in al cargar (opacity 0→1 en 400ms).

### Cursor personalizado (SOLO desktop, sutil)
NO implementar cursor custom. Es overrated y rompe la usabilidad. Dejarlo como está.

## 5. Componentes específicos

### Carrusel de productos
Como hace Ladurée: fila horizontal scrolleable (no un carrusel con flechas genérico).
- En desktop: 4 productos visibles, con peek del 5to (se ve un poquito para sugerir que hay más)
- En mobile: 1.2 productos visibles (el segundo se ve parcialmente)
- Scroll horizontal con snap (`scroll-snap-type: x mandatory`)
- Cada card tiene: imagen (aspect-ratio 4/5), nombre en Playfair, precio o "Consultar" en DM Sans, borde inferior dorado invisible que aparece en hover

### Sección "Sobre mí"
Layout asimétrico como Ladurée:
- Imagen a la izquierda (60% del ancho), con `background-attachment: fixed` (parallax)
- Texto a la derecha (40%), con label + título + párrafo
- En mobile: imagen full-width arriba, texto abajo
- La imagen tiene un borde fino dorado como marco (border: 1px solid var(--color-gold))

### Sección "Cómo pedir"
4 pasos visuales en horizontal (vertical en mobile):
1. Elegí → 2. Consultá → 3. Coordinamos → 4. Disfrutá
- Cada paso: número grande en Playfair (en color gold), título corto en DM Sans bold, descripción en DM Sans light
- Conectados por una línea fina dorada horizontal entre ellos
- Animación: los pasos se revelan uno por uno con delay escalonado al entrar en viewport

### Galería
Ladurée muestra fotos grandes. Hacer masonry con variación:
- Algunas fotos más grandes (span 2 columnas o 2 filas)
- Hover: overlay suave con caption
- Click: lightbox con fondo blur (backdrop-filter: blur(10px)) y la foto centrada
- Animación de apertura: la foto hace scale de 0.9 a 1 + fade-in en 300ms

### Footer
Inspirado en Ladurée: fondo oscuro (`--color-text` / #444444), texto en cream/gold.
- Logo "HECHO EN CASA" en Playfair, centrado, en dorado
- Links en DM Sans peso 300, color cream con hover dorado
- Línea dorada separadora arriba
- Iconos de redes (Instagram, TikTok, WhatsApp) con hover dorado
- Copyright abajo en DM Sans light, tamaño chico

### Botón flotante de WhatsApp
- Esquina inferior derecha, con sombra suave
- NO el ícono verde genérico. Hacer un botón circular con fondo dorado y el ícono de WhatsApp en blanco
- Al hover: scale(1.1) + sombra crece
- Animación de entrada: aparece con slide-up + fade-in después de 1.5s de carga

## 6. Detalles de diseño que marcan la diferencia

### Líneas y separadores
- Entre secciones: línea centrada de 60px, 1px de alto, color dorado, con animación de width 0→60px al entrar en viewport
- Dentro de secciones: líneas finas doradas con opacity 0.3 para separar elementos

### Espaciado
- Entre secciones: 120px desktop, 80px mobile (padding-y)
- Dentro de secciones: 60px desktop, 40px mobile entre título y contenido
- Cards de producto: gap de 24px desktop, 16px mobile

### Imágenes
- Todas con `object-fit: cover` y aspect-ratio definido (no dejar que se deformen)
- En cards de producto: aspect-ratio 4/5 (vertical, como fotos de comida)
- En hero y secciones grandes: aspect-ratio 16/9 o auto con max-height
- Bordes redondeados: 4px máximo (Ladurée casi no redondea, es más elegante recto)
- Algunas imágenes clave con borde fino dorado (1px solid var(--color-gold))

### Botones
Dos estilos:
1. **Primario**: fondo transparente, borde 1px dorado, texto dorado, uppercase, letter-spacing. Hover: fondo se llena dorado, texto cream.
2. **Secundario**: sin borde, texto dorado con underline que aparece en hover (scaleX 0→1)

### Formulario de cotización
- Fondo `--color-sand` o `--color-bg-alt`
- Inputs con borde inferior solamente (no caja completa), estilo minimal
- Labels en DM Sans uppercase letter-spacing
- Focus: el borde inferior cambia a dorado con transition 300ms
- Select y textarea con el mismo estilo minimal
- Botón enviar: estilo primario dorado

### Admin panel
- NO tocar el diseño del admin. Dejarlo funcional como está. El rediseño es solo para el sitio público.

## 7. Responsive — Mobile first

- **Mobile (< 768px)**: todo en una columna, fotos full-width, menú hamburguesa con animación de slide-down, tamaños de título reducidos (2rem max), padding lateral 20px, NO parallax (background-attachment: scroll)
- **Tablet (768-1024px)**: grillas de 2 columnas donde aplique, header ya puede mostrar nav
- **Desktop (> 1024px)**: layout completo, parallax activo, hover effects activos, max-width de contenido 1200px centrado

El menú hamburguesa: al abrir, el fondo hace un fade a cream con el menú centrado vertical, links en Playfair tamaño grande, con animación de entrada escalonada (cada link aparece con 80ms de delay).

## 8. Performance

- Usar `next/image` para todas las imágenes con lazy loading
- Fonts con `next/font/google` (NO @import en CSS, usar el módulo de Next.js)
- Scroll animations con IntersectionObserver nativo (NO instalar AOS, Framer Motion ni librerías de animación)
- CSS transitions y @keyframes para todo, NO JavaScript animations salvo el parallax
- `will-change: transform` solo en elementos que se animan frecuentemente

## 9. Checklist

- [x] Paleta de colores aplicada exacta (los 12 colores del punto 1) — `app/globals.css`, valores hex idénticos a los del prompt
- [x] Playfair Display en todos los títulos, con palabras en italic — `font-accent`, `next/font/google`, italic en hero/secciones/faq/sobre-mí/catálogo/404
- [x] DM Sans en body, nav, botones, labels — `font-body` en todo el sitio público
- [x] Labels uppercase con letter-spacing encima de cada título de sección — util `sectionLabel` reutilizado en todas las páginas/secciones
- [x] Hero con imagen full-width, texto abajo-izquierda, animación de entrada escalonada — delays 200/400/600/800ms
- [x] Color blocking: cada sección de la home con un fondo pastel distinto — cream/pink/bg-alt/sage/lavender/cream/sand/text
- [x] Separadores dorados animados entre secciones — `GoldDivider` (width 0→60px) entre cada sección del home y antes de testimonios
- [x] Scroll reveal en todos los elementos — componente `Reveal` (IntersectionObserver, threshold 0.15) usado en títulos, párrafos, cards, imágenes y la grilla completa de `/galeria`
- [x] Parallax en imágenes clave (solo desktop) — hero, tortas personalizadas, sobre mí (home y página dedicada), `.parallax-bg` con `background-attachment: fixed`
- [x] Hover en cards: imagen scale + borde dorado aparece — `ProductCard`
- [x] Hover en botones: fill dorado animado — `goldButtonPrimary`
- [x] Hover en nav links: underline desde el centro — util `navLink`
- [x] Carrusel de productos horizontal con scroll-snap — `ProductCarousel` (4 + peek desktop, 1.2 mobile)
- [x] Sección "Sobre mí" con layout asimétrico (60/40) — `/sobre-mi` rediseñada, imagen 60% con parallax + marco dorado
- [x] Sección "Cómo pedir" con 4 pasos conectados por línea dorada — home, línea horizontal detrás de los números
- [x] Footer oscuro con texto cream/gold — `bg-text`, logo centrado, redes, línea dorada superior
- [x] Botón WhatsApp circular dorado (no verde) — `WhatsAppFloat`, entrada animada a los 1.5s
- [x] Menú mobile con animación de entrada — overlay fullscreen, links con delay escalonado de 80ms
- [x] Header que se achica al scroll — padding 24px→12px, transición 300ms
- [x] Formulario con inputs estilo minimal (solo borde inferior) — clase `.field-underline`, foco dorado
- [x] Border-radius máximo 4px — verificado sin `rounded-lg/xl/2xl` en el sitio público (excepto el botón circular de WhatsApp, que es intencional)
- [x] NO parallax en mobile — `@media (max-width: 1023px)` fuerza `background-attachment: scroll`
- [~] Todo responsive — clases `md:`/`lg:` revisadas en cada componente; no se probó clickeando en un navegador real (sin esa herramienta en este entorno)
- [x] `npm run build` sin errores
- [x] Sin librerías de animación externas — solo CSS (transitions/@keyframes) + `IntersectionObserver` nativo en `Reveal.tsx`; no se instaló ningún paquete nuevo

**Admin**: no se tocó ningún archivo de `app/admin/` ni `components/admin/`. Verificado por build + grep (sin referencias a los tokens viejos) + curl (login y branding intactos).
