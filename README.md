## iglesia-saas-frontend

Frontend en Next.js (App Router) + TypeScript + Tailwind para el SaaS de control estadístico de Iglesia.

Plan completo y decisiones de diseño: ver `PLAN.md` en el repo hermano `iglesia-saas` (`Documents/personal/iglesia-saas/PLAN.md`).

## Desarrollo local

```bash
cp .env.local.example .env.local   # completar con las credenciales del proyecto Supabase local
npm install
npm run dev
```

Requiere que el backend (`iglesia-saas-backend`) esté corriendo localmente (`supabase start`) para obtener `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Estructura

- `src/lib/supabase/client.ts` — cliente de Supabase para Client Components.
- `src/lib/supabase/server.ts` — cliente de Supabase para Server Components/Actions.
- `src/lib/supabase/middleware.ts` + `src/middleware.ts` — refresco de sesión en cada request.
