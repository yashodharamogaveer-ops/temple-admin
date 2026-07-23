# Temple Admin Panel

Vite + React + TypeScript admin panel, Supabase backend. Bilingual (Kannada default / English) CRUD for: Temple Profile, Sevas, Images & Videos, History, Events, Notifications, Committee Members. Two roles: `super_admin`, `admin`. Includes a "Temple Management System — Coming Soon" placeholder in the sidebar.

## 1. Set up Supabase

1. Create a project at supabase.com.
2. Open the SQL editor and run `supabase/schema.sql` — creates all tables, RLS policies, the `temple-media` storage bucket, and helper functions/roles.
3. Deploy the invite function (needed for the Admin Users screen to create new logins):
   ```
   supabase functions deploy invite-admin
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Manually create your first **super_admin**:
   - In Supabase Auth, create a user (email + password).
   - In the SQL editor: `insert into admin_profiles (id, email, full_name, role) values ('<user-id-from-auth>', 'you@temple.org', 'Your Name', 'super_admin');`
   - Every admin after this one can be invited from the Admin Users screen.

## 2. Configure the app

```
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Project Settings > API
```

## 3. Run

```
npm install
npm run dev
```

## Architecture notes

- **Bilingual pattern**: every content field is stored as `_kn` / `_en` columns and edited together via `BilingualField` (Kannada shown first, since it's the site default) — never as separate language pages.
- **Generic CRUD engine**: `useCrud.ts` + `CrudPage.tsx` + `CrudForm.tsx` power Sevas, Events, History, Committee, and Notifications from a single implementation. Each module is just a config object in `src/config/modules.ts` (table name, columns, field list) — adding a new module means writing a config, not new CRUD code.
- **Roles**: `admin_profiles.role` is `super_admin` or `admin`. RLS enforces that only active admins can write content tables, and only `super_admin` can manage other admins. `ProtectedRoute` mirrors this on the frontend (defense in depth, not a substitute for RLS).
- **Storage**: images/videos upload directly to the public `temple-media` Supabase Storage bucket via `useFileUpload.ts`.
- **Extending**: to add a new bilingual module (e.g. FAQ), add a table to `schema.sql` following the existing pattern, add a config to `modules.ts`, and render `<CrudPage config={faqConfig} />` on a new route.
