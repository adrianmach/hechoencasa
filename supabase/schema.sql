-- ============================================================
-- Schema para "Hecho en Casa" — pastelería artesanal
-- Ejecutar completo en el SQL Editor de Supabase (Dashboard > SQL Editor > New query)
-- Este script es idempotente: se puede volver a correr sin duplicar datos
-- ni romper lo que ya existe (usa CREATE IF NOT EXISTS / ALTER / UPSERT).
-- ============================================================

-- ------------------------------------------------------------
-- Extensiones
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabla products
-- ------------------------------------------------------------
create table if not exists products (
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

-- Categorías reales del emprendimiento: tortas, postres, alfajores, temporada, cookies
-- (reemplaza el set anterior que incluía "otros")
alter table products drop constraint if exists products_category_check;
alter table products add constraint products_category_check
  check (category in ('tortas', 'postres', 'alfajores', 'temporada', 'cookies'));

-- Los postres ahora se cotizan por tamaño (14cm / 20cm / 26cm), ya no tienen precio fijo
update products set price_type = 'quote', price = null where category = 'postres';

-- ------------------------------------------------------------
-- Tabla site_config
-- ------------------------------------------------------------
create table if not exists site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Tabla gallery
-- ------------------------------------------------------------
create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Tabla testimonials
-- ------------------------------------------------------------
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  text text not null,
  rating integer default 5 check (rating between 1 and 5),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Trigger para updated_at en products
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists site_config_set_updated_at on site_config;
create trigger site_config_set_updated_at
  before update on site_config
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table products enable row level security;
alter table site_config enable row level security;
alter table gallery enable row level security;
alter table testimonials enable row level security;

drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products
  for select using (is_active = true);

drop policy if exists "products_authenticated_read_all" on products;
create policy "products_authenticated_read_all" on products
  for select using (auth.role() = 'authenticated');

drop policy if exists "products_authenticated_write" on products;
create policy "products_authenticated_write" on products
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "products_authenticated_update" on products;
create policy "products_authenticated_update" on products
  for update using (auth.role() = 'authenticated');

drop policy if exists "products_authenticated_delete" on products;
create policy "products_authenticated_delete" on products
  for delete using (auth.role() = 'authenticated');

drop policy if exists "site_config_public_read" on site_config;
create policy "site_config_public_read" on site_config
  for select using (true);

drop policy if exists "site_config_authenticated_write" on site_config;
create policy "site_config_authenticated_write" on site_config
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "site_config_authenticated_update" on site_config;
create policy "site_config_authenticated_update" on site_config
  for update using (auth.role() = 'authenticated');

drop policy if exists "gallery_public_read" on gallery;
create policy "gallery_public_read" on gallery
  for select using (true);

drop policy if exists "gallery_authenticated_write" on gallery;
create policy "gallery_authenticated_write" on gallery
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "gallery_authenticated_update" on gallery;
create policy "gallery_authenticated_update" on gallery
  for update using (auth.role() = 'authenticated');

drop policy if exists "gallery_authenticated_delete" on gallery;
create policy "gallery_authenticated_delete" on gallery
  for delete using (auth.role() = 'authenticated');

drop policy if exists "testimonials_public_read" on testimonials;
create policy "testimonials_public_read" on testimonials
  for select using (is_active = true);

drop policy if exists "testimonials_authenticated_read_all" on testimonials;
create policy "testimonials_authenticated_read_all" on testimonials
  for select using (auth.role() = 'authenticated');

drop policy if exists "testimonials_authenticated_write" on testimonials;
create policy "testimonials_authenticated_write" on testimonials
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "testimonials_authenticated_update" on testimonials;
create policy "testimonials_authenticated_update" on testimonials
  for update using (auth.role() = 'authenticated');

drop policy if exists "testimonials_authenticated_delete" on testimonials;
create policy "testimonials_authenticated_delete" on testimonials
  for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- Storage bucket para imágenes
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "images_authenticated_insert" on storage.objects;
create policy "images_authenticated_insert" on storage.objects
  for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "images_authenticated_update" on storage.objects;
create policy "images_authenticated_update" on storage.objects
  for update using (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "images_authenticated_delete" on storage.objects;
create policy "images_authenticated_delete" on storage.objects
  for delete using (bucket_id = 'images' and auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- Config del sitio — datos reales de "Hecho en Casa"
-- (upsert: si la key ya existe, se sobrescribe con los datos reales)
-- ------------------------------------------------------------
insert into site_config (key, value) values
  ('hero', '{"title": "Pastelería artesanal, hecha con amor", "subtitle": "Tortas, postres y alfajores frescos y de calidad en Montevideo"}'::jsonb),
  ('about', '{"text": "Hola, soy Romina.\n\nSoy la persona que está detrás de este emprendimiento.\n\nLa pastelería llegó a mi vida como una forma de crear momentos felices. Descubrí que esta es mi manera de transmitir emociones, celebrar logros, acompañar encuentros y formar recuerdos que permanecen en el tiempo.\n\nCada postre está elaborado de manera artesanal, utilizando ingredientes de calidad y dedicando el tiempo necesario para cuidar cada textura, cada sabor y cada terminación. Creo que los pequeños detalles son los que convierten un buen postre en una experiencia inolvidable.\n\nMi objetivo es que cada cliente reciba mucho más que un producto: quiero que encuentre un motivo para sonreír, compartir y celebrar.\n\nGracias por estar aquí y por confiar en mi trabajo. Será un placer formar parte de tus momentos más especiales.", "image_url": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80"}'::jsonb),
  ('contact', '{"whatsapp": "59892452415", "instagram": "@Hecho_en_casa_dulces", "tiktok": "@Hecho_en_casa_dulces", "email": "", "delivery_zone": "Zona de retiro (Pick up): Parque Batlle. Zona de envío: Montevideo (sujeto a disponibilidad y cotización).", "hours": "Consultanos por WhatsApp", "neighborhood": "Montevideo"}'::jsonb),
  ('delivery', '{"modality": "Retiro en Parque Batlle. No hacemos envíos por medios propios: en caso de necesitarlo, se cotiza zona en base a disponibilidad.", "cadete_note": "Se pueden enviar únicamente alfajores mediante servicio de cadetería (PedidosYa, etc.), coordinado por el cliente.", "lead_time_tortas": "15 días de anticipación", "lead_time_postres": "5 días de anticipación", "lead_time_alfajores": "48 horas de anticipación", "urgencias_note": "¿Es urgente? Consultanos igual, a veces podemos hacer una excepción.", "payment_methods": ["Efectivo", "Transferencia bancaria"]}'::jsonb),
  ('faq', '[{"question": "¿Con cuánta anticipación tengo que hacer el pedido?", "answer": "Tortas personalizadas: 15 días. Postres: 5 días. Alfajores: 48 horas. Si tenés una urgencia, consultanos igual, a veces podemos hacer una excepción."}, {"question": "¿Hacen envíos?", "answer": "No hacemos envíos por medios propios. En caso de necesitarlo, se cotiza zona en base a disponibilidad. Se pueden enviar únicamente alfajores mediante servicio de cadetería (PedidosYa, etc.), coordinado por el cliente."}, {"question": "¿Qué medios de pago aceptan?", "answer": "Efectivo y transferencia bancaria."}, {"question": "¿Puedo enviar una foto de referencia para mi torta?", "answer": "Sí, podés enviarla por WhatsApp junto con tu pedido de presupuesto."}, {"question": "¿Necesito dejar una seña?", "answer": "Sí, para tortas y postres personalizados se solicita una seña del 50% para confirmar el pedido."}]'::jsonb),
  ('quote_form', '{"tortaSizes": ["10 porciones", "15 porciones", "20 porciones", "25+ porciones"], "postreSizes": ["14 cm", "20 cm", "26 cm"], "fillings": ["Dulce de leche", "Chocolate", "Frutas", "Crema", "Mousse"], "coatings": ["Buttercream", "Ganache", "Crema", "Sin cobertura"]}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ------------------------------------------------------------
-- Productos: recategorizar catálogo existente
-- (los inserts placeholder ya cargados solo se saltean por slug repetido;
-- las categorías/precios ya se migraron arriba con el UPDATE de postres)
-- ------------------------------------------------------------
insert into products (name, slug, description, price, price_type, category, image_url, sort_order) values
  ('Alfajores de maicena (x6)', 'alfajores-de-maicena-x6', 'Seis alfajores de maicena bien tiernos, rellenos con abundante dulce de leche y espolvoreados con coco rallado.', 350, 'fixed', 'alfajores', 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=1200&q=80', 1),
  ('Alfajores de chocolate (x6)', 'alfajores-de-chocolate-x6', 'Seis alfajores bañados en chocolate semiamargo, con relleno de dulce de leche repostero.', 380, 'fixed', 'alfajores', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1200&q=80', 2),
  ('Alfajores triples (x6)', 'alfajores-triples-x6', 'Seis alfajores de tres tapas con doble relleno de dulce de leche, bañados en chocolate.', 420, 'fixed', 'alfajores', 'https://images.unsplash.com/photo-1519869325930-281384150729?w=1200&q=80', 3),
  ('Chocotorta individual', 'chocotorta-individual', 'La clásica chocotorta: galletitas de chocolate, dulce de leche y queso crema. Elegí el tamaño y te cotizamos.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80', 4),
  ('Flan casero con dulce de leche', 'flan-casero-con-dulce-de-leche', 'Flan casero bien cremoso, cocido a baño maría, bañado en dulce de leche.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80', 5),
  ('Brownie con nuez (porción)', 'brownie-con-nuez-porcion', 'Brownie húmedo de chocolate con nueces.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=1200&q=80', 6),
  ('Cheesecake de frutos rojos (porción)', 'cheesecake-de-frutos-rojos-porcion', 'Cheesecake horneado con base de galleta y coulis de frutos rojos.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=1200&q=80', 7),
  ('Tiramisú individual', 'tiramisu-individual', 'Tiramisú tradicional con café, mascarpone y cacao amargo.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=1200&q=80', 8),
  ('Mousse de chocolate', 'mousse-de-chocolate', 'Mousse de chocolate semiamargo, textura liviana y sabor intenso.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80', 9),
  ('Lemon pie (porción)', 'lemon-pie-porcion', 'Tarta de limón con merengue tostado.', null, 'quote', 'postres', 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80', 10),
  ('Torta de chocolate personalizada', 'torta-de-chocolate-personalizada', 'Torta de chocolate a medida: elegí tamaño, relleno y cobertura.', null, 'quote', 'tortas', 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=1200&q=80', 11),
  ('Torta de cumpleaños temática', 'torta-de-cumpleanos-tematica', 'Torta decorada según el tema del cumpleaños, para chicos o grandes.', null, 'quote', 'tortas', 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=1200&q=80', 12),
  ('Torta de bodas / eventos', 'torta-de-bodas-eventos', 'Torta para bodas y eventos especiales, con decoración elegante.', null, 'quote', 'tortas', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=1200&q=80', 13),
  ('Torta de frutas', 'torta-de-frutas', 'Torta de bizcochuelo con crema y frutas frescas de estación.', null, 'quote', 'tortas', 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=1200&q=80', 14),
  ('Torta naked cake', 'torta-naked-cake', 'Torta estilo naked cake, sin cobertura exterior, con frutas o flores naturales.', null, 'quote', 'tortas', 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=1200&q=80', 15),
  ('Panettone artesanal', 'panettone-artesanal', 'Panettone artesanal con frutas confitadas y chips de chocolate. Disponible en temporada navideña.', 450, 'fixed', 'temporada', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=80', 16),
  ('Budín de naranja', 'budin-de-naranja', 'Budín casero de naranja, bien húmedo y esponjoso.', 260, 'fixed', 'temporada', 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=1200&q=80', 17)
on conflict (slug) do nothing;

-- El panettone es un producto de temporada navideña: se marca inactivo fuera de fecha
update products set is_active = false where slug = 'panettone-artesanal';

-- Ya no usamos la categoría "otros": si quedó algún producto viejo con esa categoría, se pasa a tortas
update products set category = 'tortas' where category = 'otros';

-- ------------------------------------------------------------
-- Galería placeholder
-- ------------------------------------------------------------
insert into gallery (image_url, caption, sort_order) values
  ('https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=1200&q=80', 'Torta de cumpleaños', 1),
  ('https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&q=80', 'Mesa dulce para evento', 2),
  ('https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=1200&q=80', 'Detalle de decoración', 3),
  ('https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1200&q=80', 'Torta de casamiento', 4),
  ('https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=1200&q=80', 'Cupcakes decorados', 5),
  ('https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=1200&q=80', 'Torta temática infantil', 6),
  ('https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&q=80', 'Postres surtidos', 7),
  ('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&q=80', 'Torta naked cake con flores', 8)
on conflict do nothing;

-- ------------------------------------------------------------
-- Testimonios placeholder (editables desde /admin/testimonios)
-- ------------------------------------------------------------
insert into testimonials (name, text, rating, sort_order)
select * from (values
  ('Valentina R.', 'Encargué una torta para el cumpleaños de mi hija y quedó espectacular, tanto de sabor como de decoración. ¡Repetimos seguro!', 5, 1),
  ('Martín G.', 'Los alfajores son una locura, el dulce de leche es casero y se nota. Los pedimos seguido para la oficina.', 5, 2),
  ('Sofía P.', 'Pedí un cheesecake para un evento y llegó impecable, súper rico y bien presentado. Muy buena comunicación por WhatsApp.', 5, 3),
  ('Lucía F.', 'La torta de casamiento superó lo que imaginábamos. Atención personalizada de principio a fin.', 5, 4)
) as t(name, text, rating, sort_order)
where not exists (select 1 from testimonials);
