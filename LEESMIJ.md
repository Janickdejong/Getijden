# Getijden

Een dag in drie uren. Statische React-app, alles blijft op je eigen toestel.

## Lokaal draaien

```bash
npm install
npm run dev
```

Openen op `http://localhost:5173`.

## Online zetten via Cloudflare Pages

**Via GitHub (aanbevolen, dan werkt elke wijziging automatisch)**

1. Zet deze map in een nieuwe repository op GitHub.
2. Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git*.
3. Kies de repository en vul in:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Opslaan. Cloudflare bouwt en zet hem op `getijden.pages.dev`.

**Zonder GitHub, rechtstreeks vanaf je laptop**

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=getijden
```

De eerste keer vraagt wrangler om in te loggen bij Cloudflare.

## Eigen domein

In Cloudflare Pages → je project → *Custom domains* → domein toevoegen. Als het
domein al bij Cloudflare staat, is het één klik.

## Op je beginscherm zetten

Open de site in Chrome op je telefoon → menu → *Toevoegen aan startscherm*.
Hij opent dan zonder browserbalk en werkt offline; het kruis is het pictogram.

## Waar je gegevens staan

Alles staat in `localStorage` van de browser waarin je hem opent — dus op je
telefoon, en nergens anders. Niets gaat naar een server.

Twee gevolgen:

- Op je laptop zie je een lege app; dat is een aparte opslag.
- Als je de gegevens van de site wist, is alles weg.

Gebruik daarom af en toe de knop onder *Terugblik* → schuifjes → **Opslaan**.
Dat geeft een `getijden-JJJJ-MM-DD.json` bestand. Met **Terugzetten** lees je
dat weer in, ook op een ander toestel.

## Na een wijziging

De service worker cachet de app voor offline gebruik. Verhoog na elke nieuwe
versie het versienummer bovenin `public/sw.js` (`getijden-v1` → `getijden-v2`),
anders blijven telefoons de oude versie tonen.

## Waar wat staat

- `src/App.jsx` — de hele app. Bovenin staan de getijden met per uur zeven
  Schriftgedeelten en zeven gebeden. Die kun je zonder meer aanpassen.
- `public/` — pictogrammen, manifest, service worker.

De teksten zijn eigen vertalingen uit het Hebreeuws en het Grieks; de gebeden
komen uit de traditie. Beide zijn vrij van rechten, dus je mag de app publiek
zetten zonder problemen.
