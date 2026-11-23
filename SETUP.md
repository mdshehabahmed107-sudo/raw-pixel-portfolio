# RAW PIXEL — MD Shehab Ahmed portfolio

A responsive dark navy + yellow portfolio starter with a Supabase-powered content manager.

## Included
- Public portfolio: introduction, services, selected work, packages and contact form
- `/admin`: email/password login, service/package/portfolio creation, image upload, delete, and client-message inbox
- Supabase database, authentication and public portfolio image storage
- Your supplied portrait is included as `public/shehab-portrait.png`

## 1. Create the Supabase project
1. Create a project at https://supabase.com.
2. Open **Project Settings → API** and copy the Project URL and anon/public key.
3. Copy `.env.example` to `.env.local`, then fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase **SQL Editor**, run all of `supabase/schema.sql`.

## 2. Create your private admin login
In Supabase **Authentication → Users**, add your admin email and a strong password.
Keep public signups disabled. Do not share your admin password.

## 3. Run locally
Install Node.js 20.9 or newer, then in this folder run:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Admin: http://localhost:3000/admin

## 4. Deploy free on Vercel
1. Push this project to a private GitHub repository.
2. Import it at https://vercel.com.
3. Add the two Supabase environment variables in Vercel Project Settings → Environment Variables.
4. Deploy. Your public site and `/admin` will be online.

## 5. Customize before publishing
- Replace `hello@rawpixel.design` in `app/page.tsx` with your real email.
- Replace the `#` social profile links with your real URLs.
- Edit package starting prices from `/admin` after Supabase is connected.
- Add service and portfolio entries from `/admin`.
- Update the SEO title/description in `app/layout.tsx` if desired.

## Important security notes
- The public anon key is designed to be used in browser apps; never put a Supabase service-role key in this project.
- The SQL policies allow authenticated users to manage site content. Create only your own admin account and keep sign-ups disabled.
- The public contact form can receive spam. Before a high-traffic launch, add CAPTCHA/rate limiting and email notifications.
- Current admin manager supports adding and deleting entries. Editing existing entries and automated email notifications can be added as a next iteration.
