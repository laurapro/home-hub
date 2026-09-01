# Household OS — Lovable V1 deployment

Use this checklist to publish Home Hub as the primary household UI. The app is private to two
authorized users, but the published URL itself may be reachable publicly; Supabase authentication
and the `household_memberships` check protect household data.

## Architecture

- Supabase is the canonical Household OS state and authentication service.
- Lovable/React is the hosted UI for household slug `home` in `America/Chicago`.
- Local n8n remains the automation host for iCloud Calendar sync, Pets scans, Projects follow-up
  scans, Costco/receipt workflows, and other background jobs.
- The old local browser UI and FastAPI service remain available as a temporary fallback.
- The hosted UI talks directly to the public Supabase HTTPS API. It does not require n8n, FastAPI,
  localhost, or a LAN address in the browser.

## Production environment

In Lovable, keep the existing external Supabase project connected. Confirm these six variables use
the same project as `supabase/config.toml`; copy the values from the project's current `.env` or
Supabase Project Settings without posting them in chat or screenshots:

```text
SUPABASE_PROJECT_ID
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

The `VITE_` values are embedded in browser assets and therefore must contain only the Supabase
project ID, HTTPS project URL, and publishable/legacy anon key. The non-`VITE_` URL and publishable
key support the generated server integration. These values are public client configuration, not
secret credentials.

Do **not** configure `SUPABASE_SERVICE_ROLE_KEY`, an `sb_secret_...` key, Apple/iCloud credentials,
n8n credentials, `LOVABLE_CRON_SECRET`, or a local/LAN service URL for this deployment. The
repository contains generated, currently unused server helpers that mention service-role and cron
variables; the application does not import those helpers and does not need those variables.

## Publish from Lovable

Existing project: <https://lovable.dev/projects/3c52a3e0-4e35-4571-8656-96b1742939ac>

1. Merge the reviewed deployment-readiness PR into GitHub `main`. Do not force-push or rewrite the
   published Git history.
2. Open the existing Home Hub project in Lovable and wait for GitHub synchronization. Confirm the
   Code view/default branch contains `docs/LOVABLE_V1_DEPLOYMENT.md` and the merged commit.
3. Confirm the existing external Supabase connection and the six production variables above. Do
   not create or connect a replacement Lovable database.
4. Click the **Publish** icon in the top-right.
5. Choose the permanent `*.lovable.app` address, or leave it blank for Lovable to generate one.
   The final production domain is not stored in this repository, so record the exact HTTPS URL from
   the publish result. A custom domain can be connected later on a supported paid plan.
6. Select website visibility that allows both household users to load the sign-in page. Household
   data remains gated by the app's Supabase authentication and membership checks.
7. Review the title, description, icon, and URL. Run Lovable's security check and investigate any
   actual credential exposure or missing-auth finding; do not perform broad database refactoring
   solely to silence generic advisor warnings.
8. Click **Publish**. For later releases, use **Publish → Update** after changes have synced to
   `main`.
9. Open the resulting production URL in a signed-out/private browser and complete the smoke tests
   below before announcing cutover.

The current TanStack Start/Nitro build handles direct HTTP requests for every application route;
Lovable should deploy the generated Cloudflare-compatible server and assets. No extra redirect file
or static-host SPA fallback is required for Lovable publishing.

## Supabase Auth configuration

After the first publish, open Supabase Dashboard → Authentication → URL Configuration:

- **Site URL:** set this to the exact production origin, for example
  `https://your-final-name.lovable.app` (no guessed placeholder should be saved).
- **Redirect URLs:** none are required by the current sign-in form. It calls
  `signInWithPassword({ email, password })`, receives the session directly, and navigates to
  `/home` in the browser.
- If a production redirect allow-list entry is desired for future password-reset or invite flows,
  add the exact production origin/path pattern only after publishing. Those flows are not present
  in this V1.
- Existing Lovable preview redirect URLs are not required for password sign-in. Keep only exact
  preview entries that are actively used during cutover, then remove stale or broad preview
  wildcards once production is stable.

Do not enable public signup. The app intentionally has no signup, invitation, OAuth, magic-link, or
password-reset flow.

## Add the second household user

Perform this manually in Supabase; do not create test or production users from the browser app.

1. In Supabase Dashboard → Authentication → Users, choose **Add user → Create new user**.
2. Enter the second household user's real email and a strong temporary password. Create/confirm the
   user according to the dashboard prompt, then copy that user's UUID. Share the password through a
   private channel and replace it in the dashboard if it was exposed.
3. In SQL Editor, replace the placeholder UUID below and run the statement. `member` is an allowed
   role; do not change the existing owner's membership.

```sql
insert into public.household_memberships (household_id, user_id, role)
select id, 'SECOND_USER_UUID'::uuid, 'member'
from public.households
where slug = 'home'
on conflict (household_id, user_id)
do update set role = excluded.role;
```

4. Verify the membership without exposing credentials:

```sql
select h.slug, hm.user_id, hm.role
from public.household_memberships hm
join public.households h on h.id = hm.household_id
where h.slug = 'home'
order by hm.created_at;
```

5. In a separate private browser profile, have the second user sign in and confirm Home loads. A
   valid Supabase user without this membership must see **Household access not configured** and no
   household data.

## Post-publish smoke test

Use real household accounts. Do not invent data automatically, and do not mark pet medication
Given merely for testing.

### Auth and routing

- [ ] In a private window, directly open `/`, `/home`, `/kitchen`, `/shopping`, `/pets`, a known
      `/projects/{projectId}`, and a known `/meals/{plannedMealId}`; protected routes show sign-in
      before household data.
- [ ] Refresh each route and confirm it remains functional; an unknown path shows Page not found.
- [ ] Sign in as the first household user, then as the second user in a separate profile.
- [ ] Confirm an authenticated account without a `home` membership cannot access household data.

### Home and navigation

- [ ] Today, Needs You, Meals, Shopping, and Coming Up match expected canonical household state;
      empty sections remain quiet.
- [ ] Eligible cards open the correct detail page and **Back to Home** returns correctly.
- [ ] Use an actually due, low-risk inline action if one exists and confirm its control does not
      accidentally open the parent card. Do not manufacture a pet-medication event.

### Low-risk actions

- [ ] Food: with the user's explicit choice, plan a temporary meal and cancel it, or correct one
      known inventory item; verify Home and detail state refresh.
- [ ] Shopping: add one harmless temporary item, verify it appears, then skip/restore/complete it as
      appropriate.
- [ ] Projects: create a temporary test project, edit it, and complete it through the confirmation
      dialog.
- [ ] Pets: verify the read state and attention display only. Use **Given** only during a real due
      medication event.

### Kitchen and phone

- [ ] Open `/kitchen`; verify the large layout, live Chicago clock, automatic refresh, and absence
      of management clutter.
- [ ] On a phone, sign in and test dialogs, detail navigation, inline controls, and Back to Home;
      verify no horizontal overflow.

### Background automation

- [ ] Allow one normal n8n background cycle to run and confirm its Supabase change appears in the
      hosted Home or relevant detail view without any LAN URL in the browser.

## Cutover PASS criteria

Declare Lovable the primary household UI only when every item passes:

- [ ] The permanent Lovable production URL loads over HTTPS and direct-route refreshes work.
- [ ] Signed-out access is gated and both household users can sign in.
- [ ] An authenticated non-member cannot read household data.
- [ ] Home canonical data matches expected household state.
- [ ] One low-risk Food action, Shopping action, and Projects action is verified.
- [ ] Pets state is verified without a fake medication completion.
- [ ] Kitchen mode and a real phone are verified.
- [ ] n8n continues updating Supabase and those updates reach the Lovable UI.
- [ ] Browser network traffic has no localhost, LAN, n8n, FastAPI, or secret-key dependency.

## Rollback and local dependencies

During cutover, do not move n8n or delete the old browser UI/FastAPI service. If a PASS criterion
fails, stop using the Lovable URL as the primary UI, return to the known local UI, and leave n8n and
Supabase running. Fix the issue through a reviewed GitHub change on `main`, publish an update, and
repeat the failed smoke tests. Removing the fallback is a later decision after the hosted UI has
been stable in normal household use.

The Mac/Docker automation host must remain powered, network-connected, and running n8n for iCloud
Calendar sync, Pets scans, Projects follow-up scans, Costco/receipt workflows, and scheduled
background jobs. Publishing Lovable replaces only the primary browser UI; it does not replace any
automation or local integration service.
