# Dulces de Romina — sitio + panel admin

Sitio web para un emprendimiento de repostería artesanal (Next.js 16 + Supabase + Tailwind).

## 1. Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com) (plan gratuito).
2. En **Project Settings → API** copiá:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (no se usa en runtime, pero se documenta por si hace falta un script administrativo)
3. Copiá `.env.local.example` a `.env.local` y completá esos valores, más tu número de WhatsApp en `NEXT_PUBLIC_WHATSAPP_NUMBER` (con código de país, sin `+`, ej `59899999999`).

## 2. Ejecutar el schema SQL

1. Abrí tu proyecto en el dashboard de Supabase → **SQL Editor → New query**.
2. Pegá todo el contenido de `supabase/schema.sql` y ejecutalo.

Esto crea las tablas (`products`, `site_config`, `gallery`), las políticas RLS, el bucket de Storage `images` (público, con escritura solo para usuarios autenticados) y carga los datos de ejemplo: configuración inicial del sitio y 15 productos con fotos de Unsplash.

## 3. Crear el usuario admin

1. En el dashboard de Supabase andá a **Authentication → Users → Add user**.
2. Cargá el email y contraseña con los que la clienta va a entrar a `/admin`.
3. No hace falta nada más: cualquier usuario autenticado en Supabase Auth puede loguearse en el panel y tiene permiso de escritura (así lo definen las políticas RLS).

## 4. Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio público y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel (te va a pedir el login del paso 3).

## 5. Deploy en Vercel

1. Subí el repo a GitHub.
2. Importá el proyecto en [vercel.com/new](https://vercel.com/new).
3. Cargá las mismas variables de entorno de `.env.local` en **Project Settings → Environment Variables**.
4. Deploy. Vercel detecta Next.js automáticamente.

## Estructura

- `app/(site)/...` — sitio público (home, catálogo, galería, cotizar, sobre mí).
- `app/admin/...` — panel admin protegido (login + dashboard + CRUD de productos, galería y configuración).
- `proxy.ts` — protege las rutas `/admin/*` (en Next 16 el archivo `middleware.ts` se renombró a `proxy.ts`).
- `lib/actions/*` — Server Actions para todas las escrituras del admin.
- `supabase/schema.sql` — schema completo + seed de datos placeholder.

## Notas

- Las imágenes de producto/galería se redimensionan en el navegador (máx. 1200px, calidad 80%) antes de subirse a Supabase Storage.
- Los 15 productos y las fotos de galería iniciales usan URLs reales de Unsplash como placeholder; reemplazalas por fotos propias desde el panel admin.
