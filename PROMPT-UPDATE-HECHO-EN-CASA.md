# Actualización: Datos reales de "Hecho en Casa"

## Instrucción

Actualizá toda la web con los datos reales de la clienta. Reemplazá todos los placeholders. Ajustá el diseño según las referencias que dio. Trabajá en loop hasta que todo esté actualizado y funcionando.

---

## 1. Datos del emprendimiento

- **Nombre:** Hecho en Casa
- **Descripción:** Pastelería artesanal
- **Desde:** Mediados de 2024
- **Propuesta de valor:** Productos de calidad, frescos

## 2. Contacto y redes

- **WhatsApp:** +598 92 452 415 (en el .env.local: `NEXT_PUBLIC_WHATSAPP_NUMBER=59892452415`)
- **Instagram:** @Hecho_en_casa_dulces
- **TikTok:** @Hecho_en_casa_dulces
- **Facebook:** (no tiene)
- **Email:** (no tiene)

## 3. Categorías de productos

Cambiar las categorías actuales por estas:
- `tortas` — Tortas de cumpleaños y eventos (se cotizan)
- `postres` — Postres en tamaños 14cm, 20cm, 26cm (se cotizan según tamaño)
- `alfajores` — Alfajores varios tipos (precio fijo)
- `temporada` — Panettones (temporada navideña) y budines (precio fijo cuando estén activos)

**IMPORTANTE:** Los postres ahora también se cotizan (antes eran precio fijo). Solo los alfajores, panettones y budines tienen precio fijo. Las tortas y postres van con `price_type: 'quote'`.

Actualizar la tabla `products` en el schema para reflejar esto. Actualizar también el formulario de cotización para que sirva tanto para tortas como para postres.

## 4. Formulario de cotización

Renombrar de "Cotizar torta" a "Pedí tu presupuesto" (aplica para tortas Y postres).

Campos actualizados:
- Nombre del cliente
- Teléfono
- **¿Qué necesitás?** (select: Torta de cumpleaños / Torta para evento / Postre personalizado / Otro)
- **Tamaño / porciones** (las opciones varían según el tipo elegido):
  - Si es torta: "10 porciones", "15 porciones", "20 porciones", "25+ porciones"
  - Si es postre: "14 cm", "20 cm", "26 cm"
- **Relleno** (texto libre o las opciones que ya estén en site_config)
- **Cobertura**
- **Temática / decoración** (texto libre)
- **Fecha de entrega**
- **Foto de referencia** (NO subir archivo — poner un texto que diga: "Si tenés una foto de referencia, enviala junto con este mensaje por WhatsApp")
- **Mensaje personalizado** (para escribir en la torta/postre)
- **Comentarios adicionales** (textarea)

Al enviar, armar mensaje de WhatsApp con todos los datos formateados.

## 5. Zona de entrega y pedidos

Actualizar en site_config y mostrarlo en la web:

- **Modalidad:** Retiro en domicilio + envío a domicilio
- **Zona de envío:** También aceptan que el cliente mande un cadete (PedidosYa, etc.), únicamente para retiro de alfajores
- **Tiempos de anticipación:**
  - Tortas personalizadas: 15 días
  - Postres: 5 días
  - Alfajores: 48 horas
  - (Consultar por urgencias)
- **Medios de pago:** Efectivo, transferencia bancaria, Mercado Pago

Mostrar esta info de forma clara en la web, puede ser en el footer, en una sección de "Cómo pedir", o en una página de FAQ. No esconderla.

## 6. Texto "Sobre mí"

Reemplazar el placeholder con el texto real:

---

Hola, soy Romina.

Soy la persona que está detrás de este emprendimiento.

La pastelería llegó a mi vida como una forma de crear momentos felices. Descubrí que esta es mi manera de transmitir emociones, celebrar logros, acompañar encuentros y formar recuerdos que permanecen en el tiempo.

Cada postre está elaborado de manera artesanal, utilizando ingredientes de calidad y dedicando el tiempo necesario para cuidar cada textura, cada sabor y cada terminación. Creo que los pequeños detalles son los que convierten un buen postre en una experiencia inolvidable.

Mi objetivo es que cada cliente reciba mucho más que un producto: quiero que encuentre un motivo para sonreír, compartir y celebrar.

Gracias por estar aquí y por confiar en mi trabajo. Será un placer formar parte de tus momentos más especiales.

---

## 7. Secciones de la web

Romi pidió estas secciones. Asegurarte de que todas existan:

- ✅ Catálogo (ya existe)
- ✅ Sobre mí / Mi historia (ya existe — actualizar texto)
- ✅ Galería de trabajos (ya existe)
- ✅ Formulario de cotización (ya existe — actualizar campos)
- 🆕 **Preguntas frecuentes** — Crear página `/faq` o sección en la home con preguntas como:
  - ¿Con cuánta anticipación tengo que hacer el pedido? (respuesta con los tiempos de arriba)
  - ¿Hacen envíos? (respuesta con la info de envío)
  - ¿Qué medios de pago aceptan? (respuesta con medios de pago)
  - ¿Puedo enviar una foto de referencia para mi torta? (sí, por WhatsApp)
  - ¿Los precios incluyen envío? (no, el envío se coordina aparte)
- 🆕 **Sección "Cómo pedir"** — Puede ser parte de FAQ o una sección visual en la home que explique el flujo: elegí tu producto → pedí presupuesto → coordinamos por WhatsApp → te lo entregamos
- 🆕 **Testimonios de clientes** — Crear sección con 3-4 testimonios placeholder editables desde el admin. Agregar tabla en Supabase:
  ```sql
  create table testimonials (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    text text not null,
    rating integer default 5 check (rating between 1 and 5),
    is_active boolean default true,
    sort_order integer default 0,
    created_at timestamptz default now()
  );
  ```
  Y agregar CRUD en el admin.
- 🆕 **Ubicación / Barrio** — NO poner dirección exacta. Poner solo el barrio. Agregar campo `neighborhood` en site_config con valor placeholder "Montevideo" (Romi lo completa después). Mostrar en la sección de contacto/footer.

## 8. Rediseño visual — Estilo Magnolia Bakery (magnoliabakery.com)

La referencia PRINCIPAL es **Magnolia Bakery** (magnoliabakery.com). Adaptar ese estilo visual a "Hecho en Casa". Capturar la misma energía: pasteles elegantes, playful pero sofisticado, color blocking, fotos grandes.

### Paleta de colores — Estilo Magnolia Bakery

Magnolia Bakery usa color blocking con pasteles vibrantes inspirados en frosting y sprinkles. Replicar este approach:

```css
:root {
  /* Fondo principal — crema magnolia cálido */
  --color-bg: #FFF8F0;
  /* Verde menta — signature de Magnolia, inspirado en las paredes del local */
  --color-mint: #B8E2C8;
  /* Rosa pastel — inspirado en el frosting de cupcakes */
  --color-pink: #F8C8D4;
  /* Amarillo pastel — como sprinkles y banana pudding */
  --color-yellow: #FDE8A0;
  /* Lavanda suave — para variedad en el color blocking */
  --color-lavender: #E0D4F0;
  /* Texto principal — marrón oscuro cálido, NO negro */
  --color-text: #2D2420;
  /* Texto secundario */
  --color-text-light: #6B5E57;
  /* Blanco para cards y contraste */
  --color-white: #FFFFFF;
}
```

**Cómo usar los colores (color blocking como Magnolia):**
- Secciones alternas con fondos de distintos pasteles (una en mint, otra en pink, otra en yellow)
- Cards de productos sobre fondo blanco con borde sutil del color de la categoría
- Botones en el color de acento de la sección actual
- Header y footer en crema base con texto marrón
- NO usar todos los colores juntos — un pastel por sección

### Tipografía — Equivalentes gratuitos de Magnolia Bakery

Magnolia usa tres fuentes premium (GT Alpina, Ambit, Gatefold por Jones Knowles Ritchie). Usar estos equivalentes gratuitos:

**Títulos → Fraunces** (equivalente de GT Alpina: serif variable, suave, con carácter)
**Body → Plus Jakarta Sans** (equivalente de Ambit: geométrica, limpia, moderna)

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
```

Aplicación:
- `Fraunces` peso 300-400 para: "Hecho en Casa" en header, títulos de sección, nombre de producto en detalle. Puede ir en mayúsculas con `letter-spacing: 0.05em` para títulos.
- `Plus Jakarta Sans` peso 400-600 para: navegación, botones, descripciones, precios, body, formularios.
- El nombre "Hecho en Casa" en el header: `Fraunces` peso 400, como logo tipográfico.

### Layout — Estilo Magnolia Bakery

- **Hero grande** con foto + texto, fondo de color pastel
- **Color blocking por secciones** — cada sección su propio pastel de fondo
- **Cards limpias** con foto, nombre, CTA
- **Bordes redondeados** (border-radius 12-16px cards, 8px botones)
- **Fotos grandes y profesionales** — full-width en mobile
- **Spacing generoso** — padding 80-120px entre secciones desktop, 48-64px mobile
- **Hover sutil** en cards (lift con sombra suave), transiciones 200ms en botones

### Lo que NO hacer

- NO gradientes, NO glassmorphism, NO blur
- NO sombras exageradas (max `0 2px 8px rgba(0,0,0,0.08)`)
- NO animaciones de scroll complejas ni parallax
- NO iconos genéricos Lucide/Heroicons decorativos
- NO secciones numeradas "01 / 02 / 03"
- NO hero oscuro con texto blanco
- NO todo centrado — Magnolia usa layouts variados

## 9. Actualizar navegación

El menú principal debe tener:
- Inicio
- Catálogo
- Pedí tu presupuesto (link a /cotizar)
- Galería
- Sobre mí
- FAQ (o "Preguntas frecuentes")
- Botón de WhatsApp destacado

## 10. Actualizar el admin

Agregar al panel de admin:
- **CRUD de Testimonios** (`/admin/testimonios`) — crear, editar, activar/desactivar, eliminar
- **Editar FAQ** en configuración (o crear tabla separada si es más limpio)
- **Campo "Barrio"** en la configuración de contacto

## 11. SEO

Actualizar toda la metadata con datos reales:
- Title: "Hecho en Casa — Pastelería artesanal en Montevideo"
- Description: "Tortas personalizadas, postres y alfajores artesanales. Pedidos por WhatsApp."
- og:image: la foto del hero (placeholder de Unsplash por ahora, se cambia cuando tenga sus fotos)

## 12. Checklist

Antes de terminar, verificar:
- [x] Nombre "Hecho en Casa" aparece en toda la web (header, footer, SEO, admin)
- [x] WhatsApp abre con el número correcto (+598 92 452 415) — `.env.local` y `site_config.contact` actualizados y verificados en el sitio corriendo
- [x] Instagram y TikTok linkeados correctamente (@Hecho_en_casa_dulces)
- [x] Texto "Sobre mí" actualizado con el texto real de Romina — verificado renderizado en `/sobre-mi`
- [~] Categorías de productos actualizadas (tortas, postres, alfajores, temporada) — código y `schema.sql` listos; **falta un paso manual**: correr `supabase/schema.sql` en el SQL Editor de Supabase para aplicar el nuevo constraint de categoría y crear los productos de temporada (panettone/budín). Es un cambio de esquema (DDL) que no se puede aplicar por API con la service role key, igual que ya documentaba el README para el setup inicial. Lo demás (site_config, precio de postres a cotizar) ya se aplicó en la base real.
- [x] Formulario de cotización tiene todos los campos nuevos — verificado renderizado en `/cotizar`
- [x] El formulario cambia opciones de tamaño según el tipo (torta vs postre) — lógica en `QuoteForm.tsx`, revisada y probada con producto postre preseleccionado
- [x] FAQ existe con las preguntas y respuestas — página `/faq` verificada con contenido real
- [~] Sección de testimonios existe y es editable desde el admin — componente, página `/admin/testimonios` y acciones CRUD completas; no se muestra en la home todavía porque la tabla `testimonials` no existe hasta correr el `schema.sql` (mismo paso manual de arriba)
- [x] Info de entrega, tiempos y medios de pago visible en la web — en `/faq` y en el footer
- [x] Paleta de colores actualizada según la dirección nueva — estilo Magnolia Bakery: color blocking por sección con mint/pink/yellow/lavender, cards blancas con borde pastel por categoría, sin gradientes/blur/sombras exageradas
- [x] Tipografía actualizada — Fraunces (títulos) + Plus Jakarta Sans (body), swap hecho en `layout.tsx` de ambos árboles (sitio y admin)
- [x] Layout con fotos grandes y espacio en blanco — hero claro con foto+texto (sin overlay oscuro), secciones alternadas con color blocking, "Cómo pedir" sin numeración 01/02/03
- [~] Todo responsive — clases `md:` revisadas y consistentes con el resto del sitio; no se probó clickeando en un navegador real (sin esa herramienta en este entorno)
- [x] `npm run build` sin errores
