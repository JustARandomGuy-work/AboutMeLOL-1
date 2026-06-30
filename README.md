# about-me.lol (Vercel static landing)

## Files
- `index.html` — About Me landing page
- `styles.css` — guns.lol-inspired styling
- `app.js` — subtle canvas background effects + copy-domain button

## Deploy to Vercel
1. Create a new Vercel project from this repo.
2. Framework preset: **Static** (or any preset—Vercel will serve the static HTML).
3. **Root Directory:** keep as **`/`** (repo root).
4. Build settings can be left as defaults (no build step needed).

Vercel will serve:
- `https://about-me.lol/` from `index.html`

## Point your domain (about-me.lol)
1. In Vercel, open **Settings → Domains** and add `about-me.lol`.
2. Vercel will provide DNS records (A/AAAA or CNAME).
3. Add those records in your domain provider DNS.
4. Wait for propagation and SSL issuance.

## Customize content
- Change the title/subtitle text in `index.html`
- Update the accent color in `styles.css` (`--accent`, `--accent2`)
- Update link cards in `index.html` under the **Links** section
