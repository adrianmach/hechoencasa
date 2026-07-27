import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // El optimizador de Next.js (/_next/image) intenta buscar la imagen original
    // antes de servirla. En este entorno, las peticiones a images.unsplash.com
    // (usadas por todas las fotos placeholder) se cuelgan y tardan 7-9s antes de
    // fallar con 500 — eso es lo que hacía sentir lento al admin (tablas con
    // muchas miniaturas a la vez). unoptimized:true sirve la imagen original tal
    // cual, sin ese paso. Al reemplazar los placeholders por fotos propias
    // (Supabase Storage) conviene reevaluar si se puede volver a activar la
    // optimización en producción (Vercel no debería tener este problema).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
