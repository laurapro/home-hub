# Home Hub

Build a new app named Household OS — Lovable Web App V1.

Architecture is fixed:
- Existing external Supabase project household-os is the canonical data/state source.
- Existing local n8n remains responsible for automations/background jobs.
- Lovable is UI only.
- Do NOT provision or use a new Lovable Cloud database.
- Do NOT expose localhost/LAN n8n or FastAPI endpoints.
- No AI, weather, money, calendar writes, or domain-logic rewrites.

Milestone 1 ONLY: authenticated, read-only Household Home for household slug `home`, timezone America/Chicago.

Use Supabase Auth and the existing connected external Supabase project. Browser code may use only the Supabase project URL plus its publishable/anon client key; never use a service-role key.

Read data ONLY through these authenticated RPCs that already exist in Supabase:
- get_lovable_today_timeline('home')
- get_lovable_household_attention('home')
- get_lovable_home_meals('home')
- get_lovable_shopping_summary('home')

These RPCs enforce household_memberships against auth.uid(). Do not query the underlying Home views directly.

UX should be calm, household-oriented, touch-friendly, responsive, and action/time oriented rather than vertical-oriented. Build:
1. Auth screen for sign-in. No public dashboard data before authentication.
2. Home route after sign-in.
3. Today — synchronized Calendar occurrences plus nanny departure routine, sorted by time. Nanny departure is informational.
4. Needs You — only attention severity `critical` and `due`. Do not include normal Calendar events.
5. Meals — prominently show Tonight and Tomorrow from canonical household_home_meals RPC output. Display canonical feasibility/prep/thaw state; do not recalculate it in React.
6. Shopping — compact per-store summary showing item_count, urgent_count where useful, next_needed_by where useful, and dog_food_included.
7. Coming Up — a small number of useful `upcoming` attention items, using existing sort order/rank; do not manufacture vertical logic.
8. Hide empty sections. A quiet household should make a quiet dashboard.

No mutations or action buttons yet. Do not build kitchen mode yet. Do not connect to iCloud. Do not create domain tables/functions.

Important: membership may initially be absent for new Auth users. If authenticated but the read RPCs return no rows because the user is not authorized for household `home`, show a clear "Household access not configured" state rather than treating it as an empty household.

Use polished but simple cards, good mobile spacing, readable desktop layout, and subtle severity treatment. Keep navigation minimal. Include sign-out.

If the external Supabase integration is not automatically bound to this project, stop and tell me exactly what connection step is required rather than creating a substitute database.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3c52a3e0-4e35-4571-8656-96b1742939ac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
