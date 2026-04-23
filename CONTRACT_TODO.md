# Contract Signing Page — TODO

Status of the `/sign/[token]` signing flow. Pick up from here in any terminal.

## Done
- [x] Supabase schema (`supabase/schema.sql`) — tables `contracts`, `signatures` with RLS
- [x] `lib/supabase.ts` — service-role admin client
- [x] `lib/contract.ts` — template + SHA-256 hasher (contract text is a PLACEHOLDER)
- [x] `components/ui/SignaturePad.tsx` — canvas signature with touch support
- [x] `app/sign/[token]/page.tsx` — server page loads contract by token, handles expired/signed/voided
- [x] `app/sign/[token]/SignForm.tsx` — client form with legal fields + consent
- [x] `app/api/sign/route.ts` — validates, re-renders & hashes contract server-side, stores, emails
- [x] `app/api/contracts/route.ts` — admin endpoint to create signing links (Bearer ADMIN_SECRET)
- [x] Build passes, pushed to master (`1bd048d`)

## To do (in order)

### 1. Supabase setup
- [ ] Open Supabase project → SQL editor → paste and run `supabase/schema.sql`
- [ ] Project Settings → API: copy `Project URL` and `service_role` key (NOT anon)

### 2. Resend setup
- [ ] Sign up at resend.com
- [ ] Add `dotcome.co.il` as a sending domain, add the DNS records they give you
- [ ] Once verified, create an API key
- [ ] If you want to start testing before domain verification, use `onboarding@resend.dev` as `RESEND_FROM_EMAIL`

### 3. Vercel env vars (Settings → Environment Variables)
Add for Production + Preview:
- [ ] `SUPABASE_URL` — `https://xxxx.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — service-role key (server-only, never expose)
- [ ] `RESEND_API_KEY` — `re_...`
- [ ] `RESEND_FROM_EMAIL` — `DotCome <noreply@dotcome.co.il>` (or `onboarding@resend.dev` temporarily)
- [ ] `ADMIN_SECRET` — long random string (generate with `openssl rand -base64 32`)
- [ ] Redeploy after adding

### 4. Drop in the real contract text
- [ ] Open `lib/contract.ts`
- [ ] Replace `TEMPLATE` constant with the real Hebrew contract body
- [ ] Keep these placeholders where relevant: `{{clientName}}`, `{{priceAmount}}`, `{{priceCurrency}}`, `{{projectDescription}}`, `{{date}}`
- [ ] Commit + push

### 5. Smoke test
- [ ] Create a test contract:
  ```bash
  curl -X POST https://dotcome.co.il/api/contracts \
    -H "Authorization: Bearer $ADMIN_SECRET" \
    -H "Content-Type: application/json" \
    -d '{"clientName":"Test","priceAmount":100,"priceCurrency":"ILS","expiresInDays":7}'
  ```
- [ ] Open the returned URL, fill form, sign, submit
- [ ] Verify row appears in `signatures` table
- [ ] Verify both emails arrive (to `liamgolanbusiness@gmail.com` and to the test address)
- [ ] Verify `contracts.status` flipped to `signed`

## Nice-to-haves (optional, later)
- [ ] Replace `.txt` attachment with a rendered PDF (use `@react-pdf/renderer` server-side; embed the signature image inside it)
- [ ] Admin dashboard page at `/admin/contracts` (list, create, view signed) behind the same `ADMIN_SECRET` via cookie auth
- [ ] Rate-limit `/api/sign` (Vercel KV or Upstash) to prevent abuse
- [ ] Israeli ID checksum validation (not just 9-digit regex) in `lib/contract.ts`
- [ ] Hide site Navbar/Footer on `/sign/*` routes (move Navbar/Footer out of root layout or add a route-group layout)
- [ ] Add a `voided_at` column + admin action to void a pending link
- [ ] Webhook to Slack/Discord when a contract is signed

## File map
```
app/
  sign/[token]/
    page.tsx          server — loads contract, gates by status/expiry
    SignForm.tsx      client — form + signature + submit
  api/
    sign/route.ts     POST — save signature, send emails
    contracts/route.ts POST — create contract (admin)
components/ui/
  SignaturePad.tsx    canvas signature
lib/
  contract.ts         template + hash (EDIT THE TEMPLATE)
  supabase.ts         service-role client factory
supabase/
  schema.sql          run once in Supabase SQL editor
```

## Key design notes
- Contract text is **re-rendered on the server** before saving; client-submitted text is compared to server-rendered and rejected on mismatch → price tampering is impossible.
- SHA-256 hash of the exact signed text is stored alongside the signature → proof of integrity.
- Service-role key is used server-side only; RLS is on so the anon key has zero access.
- Audit trail (ip, user-agent, signed_at) is collected automatically from request headers.
