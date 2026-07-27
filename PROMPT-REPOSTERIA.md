# Proyecto: Sitio web de repostería artesanal con catálogo y panel admin

## Contexto del proyecto

Sitio web para un emprendimiento de repostería artesanal en Uruguay. La clienta vende postres, alfajores y tortas personalizadas. Tiene ~15 productos. Algunos tienen precio fijo (alfajores, postres) y otros requieren cotización (tortas personalizadas donde varían rellenos, tamaños, decoración). Los pedidos se gestionan por WhatsApp. Ella necesita poder agregar, editar y eliminar productos sin saber código.

## Stack técnico

- **Framework:** Next.js 14 (App Router)
- **Base de datos y auth:** Supabase (free tier)
- **Storage de imágenes:** Supabase Storage
- **Hosting:** Vercel (free tier)
- **Estilos:** Tailwind CSS
- **Ubicación del proyecto:** C:\Proyectos\Reposteria

## Instrucción principal

Construí el proyecto completo de principio a fin. No pares hasta que todo funcione: la web pública, el panel admin con login, la base de datos, el storage de imágenes, y el deploy configurado. Trabajá en loop: construí → verificá que funcione → seguí con lo siguiente. Si algo falla, arreglalo antes de avanzar.

---

## 1. Setup inicial

- Crear proyecto Next.js 14 con App Router, TypeScript, Tailwind CSS
- Instalar dependencias: `@supabase/supabase-js`, `@supabase/ssr`
- Configurar variables de entorno en `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  NEXT_PUBLIC_WHATSAPP_NUMBER=59899999999
  ```
- Crear cliente de Supabase para server y client components
- Crear middleware de autenticación para proteger `/admin/*`

## 2. Base de datos (Supabase)

Crear un archivo `supabase/schema.sql` con todas las tablas y ejecutarlo. Incluir las políticas RLS.

### Tabla `products`
```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2),
  price_type text not null check (price_type in ('fixed', 'quote')),
  category text not null check (category in ('postres', 'alfajores', 'tortas', 'otros')),
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Tabla `site_config`
```sql
create table site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
```

Insertar config inicial:
```sql
insert into site_config (key, value) values
  ('hero', '{"title": "Dulces artesanales hechos con amor", "subtitle": "Postres, alfajores y tortas personalizadas en Montevideo"}'::jsonb),
  ('about', '{"text": "Soy Romina. Hace tres años empecé a hacer postres para mi familia y amigos, y lo que empezó como un hobby se convirtió en mi pasión. Cada pedido lo preparo con ingredientes frescos y mucha dedicación, porque creo que lo casero se nota en el sabor.", "image_url": ""}'::jsonb),
  ('contact', '{"whatsapp": "59899999999", "instagram": "@reposteria", "email": "", "delivery_zone": "Montevideo y zona metropolitana", "hours": "Lunes a sábado de 9 a 19hs"}'::jsonb),
  ('quote_form', '{"sizes": ["Individual","6 porciones","10 porciones","15 porciones","20 porciones","25+ porciones"], "fillings": ["Dulce de leche","Chocolate","Frutas","Crema","Mousse","Otro"], "coatings": ["Buttercream","Fondant","Ganache","Crema","Sin cobertura"]}'::jsonb);
```

### Tabla `gallery`
```sql
create table gallery (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);
```

### RLS policies
- `products`: lectura pública (solo `is_active = true`), escritura solo autenticado
- `site_config`: lectura pública, escritura solo autenticado
- `gallery`: lectura pública, escritura solo autenticado

### Storage bucket
- Crear bucket `images` público para las fotos de productos y galería

## 3. Datos placeholder

Insertar 15 productos de ejemplo con datos realistas en español rioplatense:

**Categoría: Alfajores**
1. Alfajores de maicena (x6) — $350 — precio fijo
2. Alfajores de chocolate (x6) — $380 — precio fijo
3. Alfajores triples (x6) — $420 — precio fijo

**Categoría: Postres**
4. Chocotorta individual — $280 — precio fijo
5. Flan casero con dulce de leche — $250 — precio fijo
6. Brownie con nuez (porción) — $220 — precio fijo
7. Cheesecake de frutos rojos (porción) — $300 — precio fijo
8. Tiramisú individual — $320 — precio fijo
9. Mousse de chocolate — $290 — precio fijo
10. Lemon pie (porción) — $270 — precio fijo

**Categoría: Tortas**
11. Torta de chocolate personalizada — cotización
12. Torta de cumpleaños temática — cotización
13. Torta de bodas / eventos — cotización
14. Torta de frutas — cotización
15. Torta naked cake — cotización

Para las imágenes placeholder: usar URLs de Unsplash con fotos de repostería real. Ejemplos:
- `https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600` (alfajores/cookies)
- `https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600` (torta)
- `https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600` (postres)

Buscar URLs reales de Unsplash que funcionen. Usar fotos variadas, no repetir.

## 4. Diseño visual — CRÍTICO

### Dirección de diseño

Esto NO es una web genérica de pastelería rosa con tipografía script. Esta web tiene que sentirse como la cuenta de Instagram de alguien real que cocina bien y le puso onda a su marca.

### Paleta de colores

Definir 5-6 colores con CSS custom properties. Dirección: tonos cálidos naturales que remitan a ingredientes reales, no a una tienda de decoración para fiestas. Pensar en: harina, caramelo, chocolate, vainilla. Nada de rosa chicle ni violeta.

Propuesta base (ajustar según criterio):
- `--color-cream`: fondo principal, un crema cálido pero no el típico #F4F1EA
- `--color-brown`: texto principal, un marrón oscuro que no sea negro puro
- `--color-caramel`: acento principal, un dorado/caramelo
- `--color-chocolate`: acento secundario, marrón medio
- `--color-warm-white`: fondos de cards
- `--color-soft`: bordes y separadores sutiles

### Tipografía

Usar Google Fonts. NO usar: Playfair Display, Cormorant, Lora, ni ninguna serif que aparezca en el 90% de las webs de comida generadas por IA. Buscar combinaciones menos predecibles.

Sugerencia: una sans-serif con personalidad para títulos (DM Sans, General Sans, Outfit, Satoshi, o similar) y una serif con carácter para acentos puntuales (Fraunces, Lora podría ir para body si los títulos son sans). La clave es que la combinación no sea la primera que devuelve una búsqueda de "elegant food font pairing".

### Layout y componentes

- **NO usar:** gradientes, glassmorphism, bordes redondeados excesivos (border-radius máximo 8px para cards), sombras exageradas, animaciones de scroll, parallax, iconos de línea genéricos, patrones de puntos/ondas decorativos.
- **SÍ usar:** espacios generosos, fotos grandes que respiren, tipografía como elemento visual, una grilla asimétrica o con variación (no todo centrado), micro-interacciones sutiles solo en hover, transiciones de 200-300ms en enlaces y botones.
- Las fotos son las protagonistas. El diseño es el marco, no compite con ellas.
- El móvil es la prioridad. La mayoría del tráfico va a venir de Instagram → WhatsApp → web. Mobile first real.

### Elementos a evitar (señales de "web hecha con IA")

- Hero con texto gigante centrado + botón centrado + imagen de fondo con overlay oscuro
- Secciones numeradas "01 / 02 / 03"
- Cards todas iguales en grilla perfecta de 3 columnas
- Footer con 4 columnas de links
- Sección de "testimonios" con avatares circulares
- Cualquier icono decorativo que no aporte información
- Copy genérico motivacional ("Descubrí el sabor de lo artesanal", "Cada bocado cuenta una historia")

## 5. Estructura del sitio público

### Rutas:
- `/` — Home
- `/catalogo` — Catálogo completo con filtro por categoría
- `/catalogo/[slug]` — Detalle del producto
- `/galeria` — Galería de trabajos
- `/cotizar` — Formulario de cotización para tortas
- `/sobre-mi` — Sobre el emprendimiento

### Home (`/`)
- Hero: foto de producto en alta, nombre del emprendimiento, una línea de qué hace y dónde. Botón a catálogo y botón a WhatsApp. No centrado, layout asimétrico.
- Sección de productos destacados: 4-6 productos en una disposición no-uniforme (mezclar tamaños de card, no una grilla rígida).
- Sección de tortas personalizadas: foto + texto corto + botón "Pedí tu presupuesto" que lleva a `/cotizar`.
- Sección "Sobre mí": foto + texto corto. Sin layout de dos columnas simétricas, buscar algo con más carácter.
- Banner de contacto: WhatsApp + Instagram + horarios. Nada de formulario de contacto genérico.

### Catálogo (`/catalogo`)
- Filtro por categoría (tabs o pills, no un dropdown)
- Cards de producto con: foto, nombre, categoría, precio (o "Consultar precio" para tortas)
- Click lleva al detalle
- Los productos con `is_active = false` no se muestran

### Detalle del producto (`/catalogo/[slug]`)
- Foto grande
- Nombre, descripción, categoría
- Si `price_type === 'fixed'`: precio + botón "Pedir por WhatsApp" (arma el mensaje automáticamente: "Hola! Quiero pedir [nombre del producto]")
- Si `price_type === 'quote'`: botón "Pedir presupuesto" que lleva a `/cotizar` con el producto pre-seleccionado

### Formulario de cotización (`/cotizar`)
- NO es un formulario de contacto genérico. Es específico para tortas.
- Campos:
  - Nombre del cliente
  - Teléfono
  - Tipo de evento (cumpleaños, boda, reunión, otro)
  - Tamaño (opciones desde site_config)
  - Relleno (opciones desde site_config, permitir seleccionar varios)
  - Cobertura (opciones desde site_config)
  - Fecha del evento
  - Comentarios adicionales (textarea)
- Al enviar: armar un mensaje formateado y abrir WhatsApp Web con ese mensaje pre-cargado usando `https://wa.me/NUMERO?text=MENSAJE`
- Feedback visual de que se armó el mensaje

### Galería (`/galeria`)
- Masonry layout o grilla con variación de tamaños
- Lightbox al hacer click (implementar con dialog nativo, sin librería externa)
- Las fotos vienen de la tabla `gallery`

### Sobre mí (`/sobre-mi`)
- Texto sobre el emprendimiento (desde site_config)
- Foto
- Zona de entrega, horarios
- Links a redes

### Navegación
- Header fijo con: logo/nombre + links a las secciones + botón de WhatsApp
- En mobile: menú hamburguesa con animación limpia
- Footer simple: Instagram, WhatsApp, copyright. No overcomplicar.

## 6. Panel Admin (`/admin`)

### Acceso
- Ruta: `/admin`
- Login con email y contraseña usando Supabase Auth
- Crear un usuario admin inicial (documentar cómo hacerlo)
- Si no está autenticado, redirigir a `/admin/login`
- Middleware que proteja todas las rutas `/admin/*`

### Dashboard (`/admin`)
- Vista simple: cantidad de productos activos, último producto modificado
- Links rápidos a las secciones del admin

### Productos (`/admin/productos`)
- Lista de todos los productos (activos e inactivos)
- Cada fila: imagen miniatura, nombre, categoría, precio, estado (activo/inactivo), acciones
- Botón "Nuevo producto"
- Poder reordenar (drag & drop o flechas arriba/abajo)
- Filtro por categoría

### Crear/Editar producto (`/admin/productos/nuevo` y `/admin/productos/[id]`)
- Formulario:
  - Nombre (genera slug automáticamente)
  - Descripción (textarea)
  - Categoría (select: postres, alfajores, tortas, otros)
  - Tipo de precio (fixed/quote — si es quote, no mostrar campo de precio)
  - Precio (si es fixed)
  - Imagen (upload a Supabase Storage con preview)
  - Activo (toggle)
- Validación de campos requeridos
- Guardar y volver a la lista

### Galería (`/admin/galeria`)
- Subir imágenes (múltiples a la vez si es posible)
- Agregar caption
- Reordenar
- Eliminar

### Configuración del sitio (`/admin/configuracion`)
- Editar textos del hero
- Editar texto "Sobre mí"
- Editar datos de contacto (WhatsApp, Instagram, email, zona de entrega, horarios)
- Editar opciones del formulario de cotización (tamaños, rellenos, coberturas)

### Diseño del admin
- Limpio, funcional, sin pretensiones. Fondo blanco, sidebar con navegación, contenido principal a la derecha.
- No necesita ser bonito, necesita ser claro y fácil de usar para alguien no técnico.
- Labels claros en español, botones con texto descriptivo ("Guardar cambios", "Agregar producto", "Subir imagen")
- Feedback visual: toasts o notificaciones para acciones exitosas y errores.

## 7. Funcionalidades técnicas

### Imágenes
- Upload a Supabase Storage bucket `images`
- Comprimir/redimensionar en el cliente antes de subir (max 1200px de ancho, calidad 80%)
- Mostrar preview antes de subir
- Generar URL pública para mostrar en el sitio

### WhatsApp
- Botón flotante de WhatsApp en todas las páginas (esquina inferior derecha)
- Los mensajes se pre-formatean según el contexto:
  - Producto fijo: "Hola! Me interesa pedir: [nombre] ($[precio])"
  - Cotización: mensaje con todos los datos del formulario formateado

### SEO
- Metadata para cada página (title, description, og:image)
- Sitemap.xml generado
- robots.txt
- Structured data para productos (JSON-LD)

### Performance
- Imágenes con `next/image` y lazy loading
- Fonts con `next/font/google`
- Componentes del catálogo con Server Components donde sea posible

## 8. Archivos de configuración

### `.env.local.example`
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=59899999999
```

### `README.md`
Documentar:
- Cómo configurar Supabase (crear proyecto, copiar keys)
- Cómo ejecutar el schema SQL
- Cómo crear el usuario admin
- Cómo correr en local
- Cómo deployar en Vercel

## 9. Checklist final

Antes de terminar, verificar que TODO esto funcione:

- [x] `npm run dev` levanta sin errores
- [x] La home carga productos desde Supabase
- [x] El catálogo muestra productos filtrados por categoría
- [x] El detalle del producto muestra info correcta
- [x] El botón de WhatsApp arma el mensaje correcto para productos fijos (verificado por código: `href` usa `whatsappLink(productMessage(...))`, no probado el click real)
- [ ] El formulario de cotización arma el mensaje y abre WhatsApp (form renderiza y la lógica de `quoteMessage` es correcta; falta click real en navegador)
- [ ] La galería muestra imágenes con lightbox (grid/carrusel renderizan con datos reales; falta abrir el `<dialog>` en navegador)
- [ ] `/admin/login` permite loguearse (la página carga, pero no se probó login real — faltan credenciales)
- [x] El admin redirige a login si no está autenticado (`/admin` → 307)
- [ ] CRUD completo de productos funciona (crear, editar, eliminar, activar/desactivar) — no probado, requiere sesión admin
- [ ] Upload de imágenes funciona y se ven en el sitio público — no probado, requiere sesión admin
- [ ] La galería del admin permite subir y eliminar — no probado, requiere sesión admin
- [ ] La configuración del sitio se guarda y se refleja en el sitio público — no probado, requiere sesión admin
- [ ] Todo es responsive (mobile, tablet, desktop) (clases `md:hidden`/`md:flex`/`md:grid` revisadas en Header, Lightbox, CategoryFilter; falta inspección visual real en viewport mobile)
- [ ] No hay errores en consola (sin errores en el log del servidor; no se inspeccionó la consola del navegador)
- [x] `npm run build` compila sin errores

## 10. Instrucciones de ejecución

Trabajar en orden: setup → base de datos → admin (porque sin admin no podés verificar el CRUD) → sitio público → pulido. En cada paso, verificar que funciona antes de seguir. Si algo falla, arreglarlo ahí mismo. No dejar cosas rotas para después.
