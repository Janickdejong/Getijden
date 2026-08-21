# Getijden

Een dag in drie uren. Statische React-app; alles blijft op je eigen toestel.

## In één keer online zetten

1. Maak op GitHub een lege repository `Getijden`.
2. Sleep **de inhoud van deze map** naar *Add file → Upload files*.
   Dus `App.jsx`, `index.html`, enzovoort én de map `public`. Commit.
3. Cloudflare → *Workers & Pages* → *Create* → *Pages* → *Connect to Git*:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

Klaar. Elke commit bouwt vanaf nu vanzelf opnieuw.

## Belangrijk

- De map `public` moet blijven bestaan. Daar staan het pictogram, het
  manifest en de service worker; Vite kopieert die ongewijzigd naar `dist`.
- `index.html` verwijst naar `/main.jsx`, zonder `/src/`. Alles staat immers
  in de hoofdmap.
- Verhoog bij elke nieuwe versie het nummer bovenin `public/sw.js`
  (`getijden-v1-1-1` → `getijden-v1-1-2`), anders blijven telefoons de oude
  versie tonen.

## Voortaan makkelijker: GitHub Desktop

Installeer GitHub Desktop en koppel deze map één keer aan de repository.
Daarna is een wijziging: bestand overschrijven, *Commit*, *Push*. Geen
uploadschermen meer.

## Waar je gegevens staan

In de `localStorage` van de browser waarin je de app opent. Dus op je
telefoon, en nergens anders; er gaat niets naar een server. Je laptop houdt
een eigen lijst bij.

Maak daarom af en toe een back-up: *Terugblik* → het schuifjes-teken →
**Bewaren**. Dat geeft een `getijden-JJJJ-MM-DD.json`. Met **Terugzetten**
lees je dat weer in, ook op een ander toestel.

## Wat waar staat

`App.jsx` bevat de hele app. Bovenin het versienummer, dan de drie getijden
met per uur tien Schriftgedeelten en tien gebeden, daaronder de kleuren voor
dag en nacht. Die drie blokken kun je zonder verdere kennis aanpassen.

De Bijbelteksten zijn eigen vertalingen uit het Hebreeuws en het Grieks; de
gebeden komen uit de traditie. Beide vrij van rechten.
