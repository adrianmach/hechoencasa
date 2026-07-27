# Fix Mobile: Centrado de textos y flechas en carruseles

## Instrucción

Revisá toda la web en viewport mobile (375px de ancho). Cada página, cada sección. Arreglá todo lo que no esté centrado y agregá flechas de navegación a todos los carruseles. Verificá con el servidor corriendo que todo se vea bien. No pares hasta que la checklist esté completa.

---

## 1. Centrar todos los textos en mobile

En pantallas menores a 768px, TODO el texto debe estar centrado:

- Labels uppercase (los chiquitos que van arriba de los títulos): `text-align: center`
- Títulos de sección (Playfair Display): `text-align: center`
- Subtítulos y párrafos descriptivos: `text-align: center`
- Botones / CTAs: centrados horizontalmente (`mx-auto` o `flex justify-center`)
- Texto del hero: centrado, no a la izquierda como en desktop
- Texto de "Sobre mí": centrado (en desktop sigue siendo izquierda al lado de la foto)
- Texto de "Cómo pedir" / pasos: centrado
- Texto de FAQ preguntas y respuestas: centrado o left-aligned según quede mejor (probá)
- Footer: todo centrado, links en columna centrada
- Separadores dorados: centrados (`mx-auto`)

Hacerlo con clases responsive de Tailwind: `text-center md:text-left` donde corresponda mantener izquierda en desktop.

## 2. Flechas en todos los carruseles (mobile Y desktop)

Buscar TODOS los componentes que tengan scroll horizontal, carrusel o slider de productos/imágenes. Agregarle flechas de navegación:

### Diseño de las flechas
- Posición: una flecha a la izquierda y otra a la derecha del carrusel, centradas verticalmente
- Forma: círculo de 40px, fondo blanco con opacity 0.9, sombra sutil (`0 2px 8px rgba(0,0,0,0.1)`)
- Ícono: chevron simple hecho con CSS (borde de 2px rotado 45°), color `--color-text` (#444444)
- Hover (desktop): fondo dorado (`--color-gold`), ícono blanco, transition 200ms
- En mobile: las flechas siempre visibles. En desktop: visibles siempre también (no solo en hover, porque el usuario no sabe que hay más contenido si no las ve)

### Comportamiento
- Click en flecha derecha: scroll suave al siguiente item (usar `scrollBy` con `behavior: 'smooth'`)
- Click en flecha izquierda: scroll suave al item anterior
- Si está en el primer item: flecha izquierda con opacity 0.3 (deshabilitada visualmente)
- Si está en el último item: flecha derecha con opacity 0.3
- Actualizar el estado de las flechas al scrollear manualmente también

### Posicionamiento
- Las flechas van SOBRE el carrusel, no debajo ni al costado
- Flecha izquierda: `left: 8px` en mobile, `left: -20px` en desktop (que sobresalga del contenedor)
- Flecha derecha: `right: 8px` en mobile, `right: -20px` en desktop
- `position: absolute` dentro de un contenedor `position: relative`
- `z-index: 10` para que queden por encima de las cards

### Indicadores de posición (dots)
- Debajo del carrusel, agregar dots/puntos que indiquen en qué slide estás
- Dot activo: dorado (`--color-gold`), 8px de diámetro
- Dots inactivos: gris claro, 6px de diámetro
- Se actualizan al scrollear o al clickear las flechas
- Centrados horizontalmente debajo del carrusel
- Spacing: 8px entre dots, margin-top 16px

## 3. Revisión general mobile

Además del centrado y las flechas, verificar:

- [x] El menú hamburguesa abre y cierra correctamente — overlay fullscreen; subí su z-index a `z-[60]` porque estaba empatado con el botón de WhatsApp (`z-50`) y este último quedaba visible por encima del menú abierto
- [x] Las imágenes no se desbordan del viewport (no scroll horizontal en la página) — revisado: sin anchos fijos peligrosos, el truco `-mx-5 px-5` de los carruseles está contenido dentro de su propio scroll
- [x] Los formularios (cotización, login admin) son usables en mobile, inputs no se salen — inputs `w-full`, revisado en código
- [x] El botón flotante de WhatsApp no tapa contenido importante — posición estándar bottom-5 right-5, sin overlaps detectados
- [x] El lightbox de la galería funciona bien en mobile — cierra con backdrop click o botón (subido a 40px para mejor tap target); ahora también tiene flechas de navegación
- [x] Los precios y textos de productos no se cortan — sin `truncate`/overflow-hidden con altura fija en `ProductCard`
- [x] El header no tapa contenido al hacer scroll — es sticky por diseño (comportamiento esperado), no se detectaron secciones tapadas
- [x] No hay padding lateral menor a 16px en ninguna sección — todas usan `px-5` (20px); verificado por grep que no queda ningún `px-1/2/3` a nivel de página
- [x] Las cards de producto se ven completas (foto + nombre + precio) sin cortar nada

## 4. Checklist final mobile

- [x] Todos los textos centrados en mobile (< 768px) — hero, todas las secciones del home, testimonios, sobre mí, cotizar, FAQ, catálogo, detalle de producto, galería
- [x] Textos alineados según diseño en desktop (> 768px) — patrón `text-center md:text-left` (o `md:items-start`) en cada sección de dos columnas; footer y CTAs finales quedan centrados en ambos porque así estaba diseñado
- [x] Flechas izquierda/derecha en todos los carruseles — componente `Carousel` compartido, usado en el carrusel de productos del home y en el carrusel mobile de la galería (el grid masonry de galería en desktop no es un carrusel, no lleva flechas)
- [x] Flechas con estado disabled visual en los extremos — `disabled` + opacity 0.3 en el primer/último ítem
- [x] Dots indicadores debajo de cada carrusel — dorado activo (8px) / gris inactivo (6px), centrados, 8px de separación
- [x] Scroll suave al clickear flechas — `scrollIntoView({ behavior: 'smooth' })`
- [x] Sin scroll horizontal en la página (solo dentro de carruseles) — verificado por código, sin anchos fijos que se salgan del viewport
- [~] Todo probado en 375px de ancho — verificado por estructura de clases Tailwind (`md:`) y por contenido renderizado vía curl; no se probó clickeando en un navegador real con viewport de 375px (sin esa herramienta en este entorno)
- [x] `npm run build` sin errores — nota: el build de Next NO detectó un bug real (pasar funciones desde un Server Component a un Client Component); apareció recién al correr el servidor. Se arregló marcando `ProductCarousel` como `'use client'`.
