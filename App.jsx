import { useState, useEffect, useRef } from "react";

/* ---------------------------------------------------------------
   GETIJDEN — een dag in drie uren
   Palet: kalkpleister, inkt, eiken, koper (sobere kerk)
   Type:  EB Garamond (tekst) + Barlow Condensed (labels)
   Signatuur: de getijdenband — de dag als één lijn
---------------------------------------------------------------- */

const DAG = {
  bg: "#E4E5E1",
  paper: "#F1F1ED",
  ink: "#1A1F26",
  soft: "#5A6270",
  faint: "#9AA0A6",
  line: "#C9CAC4",
  oak: "#6E5B45",
  brass: "#9C7C33",
};

const NACHT = {
  bg: "#14171A",
  paper: "#1B1F23",
  ink: "#E6E3DB",
  soft: "#9BA1A8",
  faint: "#6C737A",
  line: "#2F353B",
  oak: "#B99B77",
  brass: "#C9A24E",
};

/* C wordt bij het wisselen van dag naar nacht bijgewerkt; alles leest hem
   tijdens het renderen, dus de hele app kleurt mee. */
const C = { ...DAG };

const TIDES = [
  {
    id: "morgen",
    naam: "Morgen",
    latijn: "Lauden",
    van: 4,
    tot: 11,
    verzen: [
      { t: "Ik sla mijn ogen op naar de bergen: vanwaar zal mijn hulp komen? Mijn hulp is van de HEERE, die hemel en aarde gemaakt heeft. Hij zal uw voet niet laten wankelen; uw Bewaarder zal niet sluimeren.", b: "Psalm 121:1-3", bron: "naar het Hebreeuws" },
      { t: "Sla acht op mijn luide roepen, mijn Koning en mijn God, want tot U bid ik. HEERE, in de morgen hoort U mijn stem; in de morgen leg ik het U voor en zie ik uit.", b: "Psalm 5:3-4", bron: "naar het Hebreeuws" },
      { t: "Laat mij in de morgen uw goedertierenheid horen, want op U vertrouw ik. Maak mij de weg bekend die ik moet gaan, want tot U hef ik mijn ziel op.", b: "Psalm 143:8", bron: "naar het Hebreeuws" },
      { t: "Zoek eerst het Koninkrijk van God en zijn gerechtigheid, en al deze dingen zullen u erbij gegeven worden. Wees dan niet bezorgd over de dag van morgen, want de dag van morgen zal voor zichzelf zorgen. Elke dag heeft genoeg aan zijn eigen kwaad.", b: "Matte\u00fcs 6:33-34", bron: "naar het Grieks" },
      { t: "Verzadig ons in de morgen met uw goedertierenheid, dan zullen wij juichen en ons verblijden, al onze dagen. Laat de lieflijkheid van de Heere, onze God, over ons zijn; bevestig het werk van onze handen over ons, ja, het werk van onze handen, bevestig dat.", b: "Psalm 90:14, 17", bron: "naar het Hebreeuws" },
      { t: "Want u bent gestorven, en uw leven is met Christus verborgen in God.", b: "Kolossenzen 3:3", bron: "naar het Grieks" },
      { t: "U hebt niet een geest van slavernij ontvangen, die opnieuw tot angst leidt, maar u hebt de Geest van het zoonschap ontvangen, door wie wij roepen: Abba, Vader! De Geest zelf getuigt met onze geest dat wij kinderen van God zijn.", b: "Romeinen 8:15-16", bron: "naar het Grieks" },
      { t: "O God, U bent mijn God! U zoek ik vroeg in de morgen; mijn ziel dorst naar U, mijn lichaam verlangt naar U in een land, dor en dorstig, zonder water. Want uw goedertierenheid is beter dan het leven; mijn lippen zullen U prijzen.", b: "Psalm 63:2, 4", bron: "naar het Hebreeuws" },
      { t: "Wees in niets bezorgd, maar laat in alles uw verlangens door gebed en smeking, met dankzegging, bij God bekend worden. En de vrede van God, die alle begrip te boven gaat, zal uw harten en uw gedachten bewaken in Christus Jezus.", b: "Filippenzen 4:6-7", bron: "naar het Grieks" },
      { t: "Daarom verliezen wij de moed niet. Integendeel: ook al vergaat onze uiterlijke mens, toch wordt de innerlijke mens van dag tot dag vernieuwd.", b: "2 Korinthe 4:16", bron: "naar het Grieks" },
    ],
    woorden: [
      { t: "Onze Vader, die in de hemelen zijt, uw Naam worde geheiligd; uw Koninkrijk kome; uw wil geschiede, gelijk in de hemel, zo ook op de aarde. Geef ons heden ons dagelijks brood.", bron: "Het gebed des Heeren" },
      { t: "Heere, open mijn lippen, dan zal mijn mond uw lof verkondigen.", bron: "Psalm 51" },
      { t: "Ik dank U, hemelse Vader, dat U mij deze nacht bewaard hebt. Bewaar mij ook vandaag voor kwaad. In uw handen leg ik mijzelf en alles wat van mij is.", bron: "Luther" },
      { t: "U hebt mij gemaakt tot U, en mijn hart is onrustig totdat het rust vindt in U.", bron: "Augustinus" },
      { t: "Christus met mij, Christus v\u00f3\u00f3r mij, Christus achter mij, Christus in mij, Christus onder mij, Christus boven mij, Christus aan mijn rechterhand, Christus aan mijn linkerhand.", bron: "Patrick" },
      { t: "Geef mij, Heere, te weten wat ik weten moet, lief te hebben wat ik liefhebben moet, en te doen wat U behaagt.", bron: "Thomas a Kempis" },
      { t: "Mijn God, mijn Vader, U hebt mij deze dag gegeven. Geef dat ik hem in uw dienst besteed, en dat ik niets denk, zeg of doe dan tot uw eer.", bron: "Calvijn" },
      { t: "Breng mij vandaag veilig door deze dag. Bewaar mij voor kwaad, en laat alles wat ik doe recht zijn voor U.", bron: "Oud morgengebed" },
      { t: "Heere, leer mij bidden.", bron: "Lukas 11" },
      { t: "Heere, ik ben het niet waard dat U bij mij binnenkomt; zeg \u00e9\u00e9n woord, en het is genoeg.", bron: "Matte\u00fcs 8" },
    ],
  },
  {
    id: "middag",
    naam: "Middag",
    latijn: "Noon",
    van: 11,
    tot: 17,
    verzen: [
      { t: "God is ons een toevlucht en kracht; Hij is in benauwdheden overvloedig als hulp gebleken. Geef het op en weet dat Ik God ben; Ik zal verhoogd worden onder de volken, Ik zal verhoogd worden op de aarde.", b: "Psalm 46:2, 11", bron: "naar het Hebreeuws" },
      { t: "Kom naar Mij toe, allen die vermoeid en belast bent, en Ik zal u rust geven. Neem mijn juk op u en leer van Mij, want Ik ben zachtmoedig en nederig van hart, en u zult rust vinden voor uw ziel. Want mijn juk is zacht en mijn last is licht.", b: "Matte\u00fcs 11:28-30", bron: "naar het Grieks" },
      { t: "Op de dag dat ik vrees, vertrouw ik op U. Mijn omzwerving hebt U geteld; doe mijn tranen in uw kruik. Staan zij niet in uw boek?", b: "Psalm 56:4, 9", bron: "naar het Hebreeuws" },
      { t: "Mijn genade is u genoeg, want mijn kracht wordt in zwakheid volbracht.", b: "2 Korinthe 12:9", bron: "naar het Grieks" },
      { t: "Waar zou ik heen gaan voor uw Geest, waarheen zou ik vluchten voor uw aangezicht? Nam ik de vleugels van de dageraad, woonde ik aan het einde van de zee, ook daar zou uw hand mij leiden en uw rechterhand mij vasthouden.", b: "Psalm 139:7, 9-10", bron: "naar het Hebreeuws" },
      { t: "Ik ben de wijnstok, u bent de ranken. Wie in Mij blijft en Ik in hem, die draagt veel vrucht, want zonder Mij kunt u niets doen.", b: "Johannes 15:5", bron: "naar het Grieks" },
      { t: "Zeker, mijn ziel, zwijg voor God, want van Hem is mijn verwachting. Zeker, Hij is mijn rots en mijn heil, mijn veilige vesting; ik zal niet wankelen.", b: "Psalm 62:6-7", bron: "naar het Hebreeuws" },
      { t: "Zoals een vader zich ontfermt over zijn kinderen, zo ontfermt de HEERE Zich over wie Hem vrezen. Want Hij weet wat voor maaksel wij zijn en blijft bedenken dat wij stof zijn.", b: "Psalm 103:13-14", bron: "naar het Hebreeuws" },
      { t: "Werp al uw zorg op Hem, want Hij zorgt voor u.", b: "1 Petrus 5:7", bron: "naar het Grieks" },
      { t: "Wij hebben geen Hogepriester die geen medelijden kan hebben met onze zwakheden, maar Een die in alles op dezelfde wijze als wij verzocht is, maar zonder zonde. Laten wij dan met vrijmoedigheid naderen tot de troon van de genade, opdat wij barmhartigheid ontvangen en genade vinden om geholpen te worden op het juiste moment.", b: "Hebree\u00ebn 4:15-16", bron: "naar het Grieks" },
    ],
    woorden: [
      { t: "Heere, ontferm U. Christus, ontferm U. Heere, ontferm U.", bron: "Kyrie" },
      { t: "Heere Jezus Christus, Zoon van God, ontferm U over mij, zondaar.", bron: "Het Jezusgebed" },
      { t: "Geef wat U beveelt, en beveel wat U wilt.", bron: "Augustinus" },
      { t: "Ziel van Christus, heilig mij. Binnen uw wonden verberg mij. Laat mij nooit van U gescheiden worden.", bron: "Anima Christi" },
      { t: "Heere, ik geloof; kom mijn ongeloof te hulp.", bron: "Markus 9" },
      { t: "Heere, U weet alles; U weet dat ik U liefheb.", bron: "Johannes 21" },
      { t: "Wees mij genadig, o God, naar uw goedertierenheid.", bron: "Psalm 51" },
      { t: "Heere, ik weet niet wat goed voor mij is; U weet het. Doe met mij wat U goeddunkt.", bron: "Thomas a Kempis" },
      { t: "Kom, Heilige Geest, vervul mijn hart en ontsteek in mij het vuur van uw liefde.", bron: "Oud pinkstergebed" },
      { t: "Niet mijn wil, maar de uwe geschiede.", bron: "Lukas 22" },
    ],
  },
  {
    id: "avond",
    naam: "Avond",
    latijn: "Completen",
    van: 17,
    tot: 24,
    verzen: [
      { t: "Genadig is de HEERE en rechtvaardig, onze God is barmhartig. De HEERE bewaart de eenvoudigen; ik was uitgeteerd, maar Hij heeft mij verlost. Mijn ziel, keer terug tot uw rust, want de HEERE is goed voor u geweest.", b: "Psalm 116:5-7", bron: "naar het Hebreeuws" },
      { t: "Zo is er dan nu geen veroordeling voor hen die in Christus Jezus zijn.", b: "Romeinen 8:1", bron: "naar het Grieks" },
      { t: "Velen zeggen: wie zal ons het goede doen zien? Verhef over ons het licht van uw aangezicht, HEERE. In vrede zal ik gaan liggen en meteen slapen, want U alleen, HEERE, doet mij veilig wonen.", b: "Psalm 4:7, 9", bron: "naar het Hebreeuws" },
      { t: "Als wij onze zonden belijden: Hij is getrouw en rechtvaardig om ons de zonden te vergeven en ons te reinigen van alle ongerechtigheid.", b: "1 Johannes 1:9", bron: "naar het Grieks" },
      { t: "Als de HEERE het huis niet bouwt, is het tevergeefs dat de bouwers eraan werken; als de HEERE de stad niet bewaart, houdt de wachter tevergeefs de wacht. Tevergeefs staat u vroeg op, gaat u laat rusten en eet u brood dat met zwoegen verdiend is; zo geeft Hij het zijn beminde in de slaap.", b: "Psalm 127:1-2", bron: "naar het Hebreeuws" },
      { t: "Laten wij naderen met een waarachtig hart, in volle zekerheid van het geloof, nu ons hart gereinigd is van een kwaad geweten en ons lichaam gewassen is met rein water.", b: "Hebree\u00ebn 10:22", bron: "naar het Grieks" },
      { t: "De HEERE is uw Bewaarder, de HEERE is uw schaduw aan uw rechterhand. De HEERE zal u bewaren voor alle kwaad, Hij zal uw ziel bewaren. De HEERE zal uw uitgaan en uw ingaan bewaren, van nu aan tot in eeuwigheid.", b: "Psalm 121:5, 7-8", bron: "naar het Hebreeuws" },
      { t: "Zij roepen en de HEERE hoort; uit al hun benauwdheden redt Hij hen. Nabij is de HEERE bij de gebrokenen van hart; wie verbrijzeld zijn van geest, verlost Hij.", b: "Psalm 34:18-19", bron: "naar het Hebreeuws" },
      { t: "Ik ben ervan overtuigd dat noch dood, noch leven, noch engelen, noch overheden, noch tegenwoordige, noch toekomstige dingen, noch machten, noch hoogte, noch diepte, noch enig ander schepsel ons zal kunnen scheiden van de liefde van God in Christus Jezus, onze Heere.", b: "Romeinen 8:38-39", bron: "naar het Grieks" },
      { t: "Hij heeft zelf gezegd: Ik zal u beslist niet loslaten en u beslist niet verlaten.", b: "Hebree\u00ebn 13:5", bron: "naar het Grieks" },
    ],
    woorden: [
      { t: "Ik dank U, hemelse Vader, dat U mij deze dag bewaard hebt. Vergeef mij alles waarin ik verkeerd deed, en bewaar mij ook deze nacht.", bron: "Luther" },
      { t: "Bewaar mij, Heere, terwijl ik waak, en bescherm mij terwijl ik slaap, opdat ik wakend bij Christus mag zijn en slapend mag rusten in vrede.", bron: "Avondgetijde" },
      { t: "Heere, nu laat U uw dienaar gaan in vrede, naar uw woord, want mijn ogen hebben uw heil gezien.", bron: "Lofzang van Simeon" },
      { t: "In uw handen, Heere, beveel ik mijn geest. U hebt mij verlost, getrouwe God.", bron: "Psalm 31" },
      { t: "Waak, Heere, bij wie deze nacht wakker ligt. Geef rust aan wie moe is, en ontferm U over wie verdriet heeft.", bron: "Augustinus" },
      { t: "Verlicht mijn duisternis, Heere, en bescherm mij deze nacht.", bron: "Oud avondgebed" },
      { t: "Geef mij rust in U, boven alles wat er te krijgen is.", bron: "Thomas a Kempis" },
      { t: "Doorgrond mij, o God, en ken mijn hart; zie of er bij mij een weg is die pijn doet, en leid mij op de eeuwige weg.", bron: "Psalm 139" },
      { t: "Vergeef mij wat ik vandaag verkeerd deed, en wat ik heb nagelaten.", bron: "Oude belijdenis" },
      { t: "Blijf bij mij, Heere, want het wordt avond.", bron: "Lukas 24" },
    ],
  },
];

const VERSIE = "1.2.0";
const STORAGE_KEY = "getijden:v1";

/* Werkt zowel in de Claude-artefactomgeving als op een gewone website. */
const opslag = {
  async get(k) {
    if (typeof window !== "undefined" && window.storage) return window.storage.get(k);
    const v = localStorage.getItem(k);
    return v == null ? null : { key: k, value: v };
  },
  async set(k, v) {
    if (typeof window !== "undefined" && window.storage) return window.storage.set(k, v);
    localStorage.setItem(k, v);
    return { key: k, value: v };
  },
};

const DEFAULT_HABITS = [
  { id: "h1", naam: "Voor 23:00 naar bed" },
  { id: "h2", naam: "20 minuten bewegen" },
  { id: "h3", naam: "Iemand gesproken of geschreven" },
];

function dateKey(d) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

function currentTide(date) {
  const h = date.getHours();
  for (const t of TIDES) if (h >= t.van && h < t.tot) return t;
  return TIDES[2];
}

export default function Getijden() {
  const [now, setNow] = useState(new Date());
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("laden");
  const [note, setNote] = useState("");
  const [editHabits, setEditHabits] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [view, setView] = useState("nu");
  const [backup, setBackup] = useState(false);
  const [nacht, setNacht] = useState(false);
  const saveTimer = useRef(null);

  Object.assign(C, nacht ? NACHT : DAG);

  const today = dateKey(now);
  const nuTide = currentTide(now);
  const [gekozenUur, setGekozenUur] = useState(null);
  // je kunt terug naar een uur dat al geweest is, niet vooruit
  const beschikbaar = TIDES.filter((t) => t.van <= now.getHours() || t.id === nuTide.id).map((t) => t.id);
  const tide =
    (gekozenUur && beschikbaar.includes(gekozenUur) && TIDES.find((t) => t.id === gekozenUur)) || nuTide;
  const doy = dayOfYear(now);
  const vers = tide.verzen[doy % tide.verzen.length];
  const woord = tide.woorden[doy % tide.woorden.length];

  /* ---------- opslag ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      let loaded = null;
      try {
        const r = await opslag.get(STORAGE_KEY);
        if (r && r.value) loaded = JSON.parse(r.value);
      } catch (e) {
        loaded = null;
      }
      if (!alive) return;
      const base = loaded && loaded.habits ? loaded : { habits: DEFAULT_HABITS, days: {}, boeken: [] };
      if (!base.boeken) base.boeken = [];
      base.boeken.forEach((b) => {
        if (!b.notities) b.notities = [];
        if (b.notitie) {
          b.notities.push({ id: "n" + Math.random().toString(36).slice(2), pagina: null, tekst: b.notitie, datum: b.begonnen || "" });
          delete b.notitie;
        }
      });
      // oude opzet (één boek + plank) meenemen naar de nieuwe boekenkast
      if (base.boek) {
        base.boeken.push({ ...base.boek, id: "b" + Date.now(), status: "lezend", notitie: "" });
        base.boek = null;
      }
      if (base.plank && base.plank.length) {
        base.plank.forEach((b, n) =>
          base.boeken.push({ ...b, id: "p" + Date.now() + n, status: "uit", dagen: {}, notitie: "" })
        );
        base.plank = [];
      }
      setData(base);
      const d = base.days[dateKey(new Date())];
      setNote(d && d.note ? d.note : "");
      setNacht(!!base.nacht);
      setStatus("klaar");
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  const persist = (next) => {
    setData(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await opslag.set(STORAGE_KEY, JSON.stringify(next));
        setStatus("bewaard");
        setTimeout(() => setStatus("klaar"), 1400);
      } catch (e) {
        setStatus("niet bewaard");
      }
    }, 600);
  };

  const dayRecord = (d) => (data && data.days[d]) || { done: [], note: "", tides: [] };

  const toggleHabit = (id) => {
    const rec = { ...dayRecord(today) };
    const done = rec.done.includes(id) ? rec.done.filter((x) => x !== id) : [...rec.done, id];
    persist({ ...data, days: { ...data.days, [today]: { ...rec, done } } });
  };

  const markTide = () => {
    const rec = { ...dayRecord(today) };
    if (rec.tides.includes(tide.id)) return;
    persist({
      ...data,
      days: { ...data.days, [today]: { ...rec, tides: [...rec.tides, tide.id] } },
    });
  };

  const saveNote = (v) => {
    setNote(v);
    const rec = { ...dayRecord(today) };
    persist({ ...data, days: { ...data.days, [today]: { ...rec, note: v } } });
  };

  const addHabit = () => {
    const n = newHabit.trim();
    if (!n) return;
    persist({
      ...data,
      habits: [...data.habits, { id: "h" + Date.now(), naam: n }],
    });
    setNewHabit("");
  };

  const removeHabit = (id) =>
    persist({ ...data, habits: data.habits.filter((h) => h.id !== id) });

  const verplaats = (id, richting) => {
    const lijst = [...data.habits];
    const i = lijst.findIndex((h) => h.id === id);
    const j = i + richting;
    if (i < 0 || j < 0 || j >= lijst.length) return;
    [lijst[i], lijst[j]] = [lijst[j], lijst[i]];
    persist({ ...data, habits: lijst });
  };

  /* ---------- afgeleide waarden ---------- */
  const rec = dayRecord(today);
  // de band toont de drie uren als gelijke vakken; het ruitje schuift binnen het huidige vak
  const posVanTijd = (d) => {
    const u = d.getHours() + d.getMinutes() / 60;
    const i = TIDES.findIndex((t) => u >= t.van && u < t.tot);
    if (i === -1) return u < TIDES[0].van ? 0 : 1;
    const t = TIDES[i];
    return (i + (u - t.van) / (t.tot - t.van)) / TIDES.length;
  };
  const nowFrac = posVanTijd(now);

  // de weken lopen van zondag tot zaterdag, zodat de letters ernaast kloppen
  const eind = new Date(now);
  const start = new Date(now);
  start.setDate(start.getDate() - 55);
  start.setDate(start.getDate() - start.getDay());
  const last56 = [];
  for (let d = new Date(start); d <= eind; d.setDate(d.getDate() + 1)) {
    const k = dateKey(d);
    const r = (data && data.days[k]) || null;
    const total = (data ? data.habits.length : 3) + 3;
    const hit = r ? r.done.length + r.tides.length + (r.note ? 1 : 0) + (r.gelezen ? 1 : 0) : 0;
    last56.push({ k, d: new Date(d), rec: r, v: total ? Math.min(1, hit / Math.max(1, total * 0.6)) : 0, hit });
  }

  const aangeraakt = last56.slice(-10).filter((x) => x.hit > 0).length;

  const wisselDagNacht = () => {
    const aan = !nacht;
    setNacht(aan);
    if (data) persist({ ...data, nacht: aan });
  };

  if (!data) {
    return (
      <div style={{ ...page, alignItems: "center", justifyContent: "center", display: "flex" }}>
        <Fonts />
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: ".22em", fontSize: 12, color: C.faint, textTransform: "uppercase" }}>
          {status}
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...page }}>
      <Fonts />

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 22px 72px" }}>
        {/* ---------- kop ---------- */}
        <header style={{ paddingTop: 40, paddingBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ ...label }}>
              {now.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <button
              onClick={wisselDagNacht}
              title={nacht ? "Naar dag" : "Naar nacht"}
              aria-label={nacht ? "Naar dag" : "Naar nacht"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 8px 14px", lineHeight: 0, marginTop: -3 }}
            >
              {/* half licht, half donker; niets te verwarren met de maan van het avonduur */}
              <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="9" cy="9" r="7.4" fill="none" stroke={C.soft} strokeWidth="1.1" />
                <path d="M9 1.6 A7.4 7.4 0 0 1 9 16.4 Z" fill={C.soft} />
              </svg>
            </button>
          </div>
          <h1
            style={{
              fontFamily: "'EB Garamond',Georgia,serif",
              fontSize: 46,
              lineHeight: 1,
              fontWeight: 400,
              color: C.ink,
              margin: "10px 0 0",
              letterSpacing: "-0.01em",
            }}
          >
            Getijden
          </h1>
        </header>

        {/* ---------- de getijdenband ---------- */}
        <Band tide={tide} nuId={nuTide.id} beschikbaar={beschikbaar} onKies={setGekozenUur} nowFrac={nowFrac} rec={rec} />

        {/* ---------- navigatie ---------- */}
        <nav style={{ display: "flex", gap: 20, margin: "30px 0 24px", overflowX: "auto" }}>
          {[
            ["nu", "Uur"],
            ["gewoontes", "Gewoontes"],
            ["lezen", "Lezen"],
            ["terug", "Terugblik"],
          ].map(([k, n]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              style={{
                ...label,
                fontSize: 11,
                letterSpacing: ".13em",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
                background: "none",
                border: "none",
                borderBottom: view === k ? "1px solid " + C.brass : "1px solid transparent",
                padding: "0 0 5px",
                cursor: "pointer",
                color: view === k ? C.ink : C.faint,
              }}
            >
              {n}
            </button>
          ))}
        </nav>

        {view === "nu" && (
          <section style={{ ...card }}>
            <div style={{ ...label, color: C.brass }}>
              {tide.naam} · {tide.latijn}
            </div>

            <blockquote
              style={{
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: 22,
                lineHeight: 1.52,
                color: C.ink,
                margin: "18px 0 14px",
                padding: "2px 0 2px 16px",
                borderLeft: "1px solid " + C.brass,
                fontStyle: "italic",
              }}
            >
              {vers.t}
            </blockquote>
            <div style={{ ...label, color: C.faint }}>{vers.b} · {vers.bron}</div>

            <Breath nachtstand={nacht} />

            <Scheiding marge={24} />

            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Cross size={11} color={C.brass} stroke={0.9} />
              <span style={{ ...label, color: C.soft }}>Gebed</span>
            </div>
            <p
              style={{
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: 20,
                lineHeight: 1.55,
                color: C.ink,
                margin: "9px 0 22px",
              }}
            >
              {woord.t}
            </p>
            <div style={{ ...label, fontSize: 9, letterSpacing: ".14em", color: C.faint, margin: "-14px 0 0" }}>
              {woord.bron}
            </div>

            <Scheiding marge={24} />

            <div style={{ ...label, color: C.soft }}>Ruimte voor gedachte:</div>
            <textarea
              value={note}
              onChange={(e) => saveNote(e.target.value)}
              placeholder="Een paar regels is genoeg."
              rows={3}
              style={{
                width: "100%",
                marginTop: 9,
                background: "transparent",
                border: "none",
                borderBottom: "1px solid " + C.line,
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: 18,
                lineHeight: 1.6,
                color: C.ink,
                resize: "vertical",
                outline: "none",
                padding: "2px 0 10px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={markTide}
              disabled={rec.tides.includes(tide.id)}
              style={{
                ...label,
                marginTop: 22,
                width: "100%",
                padding: "13px 0",
                cursor: rec.tides.includes(tide.id) ? "default" : "pointer",
                background: "transparent",
                color: rec.tides.includes(tide.id) ? C.faint : C.brass,
                border: "1px solid " + (rec.tides.includes(tide.id) ? C.line : C.brass),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {rec.tides.includes(tide.id) && <Cross size={13} color={C.brass} stroke={1.1} />}
              {rec.tides.includes(tide.id) ? "Dit uur gehouden" : "Uur afsluiten"}
            </button>
          </section>
        )}

        {view === "gewoontes" && (
          <section style={{ ...card }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ ...label, color: C.soft }}>Vandaag</span>
              <span style={{ ...label, fontSize: 10, color: rec.done.length ? C.brass : C.faint }}>
                {rec.done.length} van {data.habits.length}
              </span>
            </div>
            <div style={{ marginTop: 14 }}>
              {data.habits.map((h, n) => {
                const on = rec.done.includes(h.id);
                return (
                  <div key={h.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 0", borderBottom: "1px solid " + C.line }}>
                    <button
                      onClick={() => toggleHabit(h.id)}
                      aria-label={h.naam}
                      style={{
                        width: 19,
                        height: 19,
                        marginTop: 4,
                        flexShrink: 0,
                        border: "1px solid " + (on ? C.brass : C.faint),
                        background: "transparent",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {on && (
                        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" stroke={C.brass} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1.4 5.6 L4.7 9.2 L11.6 1.6" />
                        </svg>
                      )}
                    </button>
                    <span
                      style={{
                        fontFamily: "'EB Garamond',Georgia,serif",
                        fontSize: 19,
                        color: on ? C.soft : C.ink,
                        flex: 1,
                        textDecoration: on ? "line-through" : "none",
                        textDecorationColor: C.brass,
                        textDecorationThickness: "1px",
                      }}
                    >
                      {h.naam}
                    </span>
                    {editHabits && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2, flexShrink: 0 }}>
                        <button
                          onClick={() => verplaats(h.id, -1)}
                          disabled={n === 0}
                          aria-label="omhoog"
                          style={{ background: "none", border: "none", cursor: n === 0 ? "default" : "pointer", padding: 6, lineHeight: 0, opacity: n === 0 ? 0.3 : 1 }}
                        >
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" stroke={C.soft} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1.2 6.4L5.5 1.6L9.8 6.4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => verplaats(h.id, 1)}
                          disabled={n === data.habits.length - 1}
                          aria-label="omlaag"
                          style={{ background: "none", border: "none", cursor: n === data.habits.length - 1 ? "default" : "pointer", padding: 6, lineHeight: 0, opacity: n === data.habits.length - 1 ? 0.3 : 1 }}
                        >
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" stroke={C.soft} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1.2 1.6L5.5 6.4L9.8 1.6" />
                          </svg>
                        </button>
                        <button onClick={() => removeHabit(h.id)} style={{ ...label, fontSize: 10, background: "none", border: "none", color: C.faint, cursor: "pointer", padding: "6px 0 6px 6px" }}>
                          weg
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {editHabits && (
              <div style={{ marginTop: 18 }}>
                <input
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="Nieuwe gewoonte"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid " + C.line,
                    fontFamily: "'EB Garamond',Georgia,serif",
                    fontSize: 18,
                    color: C.ink,
                    outline: "none",
                    padding: "4px 0",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={addHabit}
                  style={{ ...label, fontSize: 11, letterSpacing: ".13em", width: "100%", marginTop: 12, background: "none", border: "1px solid " + C.line, padding: "10px 0", cursor: "pointer", color: C.ink }}
                >
                  Toevoegen
                </button>
              </div>
            )}

            <button
              onClick={() => setEditHabits(!editHabits)}
              style={{ ...label, background: "none", border: "none", color: C.faint, cursor: "pointer", marginTop: 20, padding: 0 }}
            >
              {editHabits ? "Klaar" : "Aanpassen"}
            </button>

            <Scheiding marge={24} />
            <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, lineHeight: 1.55, color: C.soft, margin: 0, fontStyle: "italic" }}>
              Klein genoeg om te halen op je slechtste dag. Anders is het geen gewoonte maar een opdracht.
            </p>
          </section>
        )}

        {view === "lezen" && <Lezen data={data} persist={persist} today={today} />}

        {view === "terug" && (
          <section style={{ ...card }}>
            <div style={{ ...label, color: C.soft }}>De laatste acht weken</div>
            <Heatmap cells={last56} habits={data.habits} />
            <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 19, lineHeight: 1.5, color: C.ink, marginTop: 22 }}>
              Aangeraakt op <span style={{ color: C.brass }}>{aangeraakt}</span> van de laatste tien dagen.
            </p>
            <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, lineHeight: 1.55, color: C.soft, marginTop: 8, fontStyle: "italic" }}>
              Geen reeks om te breken. Alleen dagen waarop je er was.
            </p>

            <Scheiding marge={24} />

            <div style={{ ...label, color: C.soft }}>Gedachten</div>
            <div style={{ marginTop: 12 }}>
              {(() => {
                // dagelijkse gedachten en boeknotities door elkaar, nieuwste eerst
                const alles = [];
                last56.forEach((c) => {
                  const r = data.days[c.k];
                  if (r && r.note) alles.push({ k: c.k + "-dag", datum: c.k, tekst: r.note, bron: null });
                });
                (data.boeken || []).forEach((b) => {
                  (b.notities || []).forEach((n) => {
                    alles.push({
                      k: n.id,
                      datum: n.datum || "",
                      tekst: n.tekst,
                      bron: b.titel + (n.pagina ? " \u00b7 blz. " + n.pagina : ""),
                    });
                  });
                });
                alles.sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));

                if (!alles.length)
                  return (
                    <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, color: C.faint, fontStyle: "italic" }}>
                      Nog niets opgeschreven. Begin vanavond bij het uur.
                    </p>
                  );

                return alles.slice(0, 20).map((n) => (
                  <div key={n.k} style={{ padding: "12px 0 12px 14px", borderLeft: "1px solid " + C.brass, borderBottom: "1px solid " + C.line, marginBottom: 2 }}>
                    <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 18, lineHeight: 1.55, color: C.ink, margin: 0, whiteSpace: "pre-wrap" }}>
                      {n.tekst}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                      {n.bron && <span style={{ ...label, fontSize: 9, color: C.brass }}>{n.bron}</span>}
                      <span style={{ ...label, fontSize: 9, color: C.faint }}>
                        {n.datum
                          ? new Date(n.datum + "T12:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "long" })
                          : ""}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </section>
        )}

        {view === "terug" && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <button
              onClick={() => setBackup(true)}
              title="Instellingen"
              aria-label="Instellingen"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 10, lineHeight: 0, opacity: 0.5 }}
            >
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" stroke={C.soft} strokeWidth="1.1" strokeLinecap="round">
                <path d="M1.5 4H16.5M1.5 8H16.5M1.5 12H16.5" />
                <circle cx="6" cy="4" r="1.9" fill={C.paper} />
                <circle cx="12" cy="8" r="1.9" fill={C.paper} />
                <circle cx="5" cy="12" r="1.9" fill={C.paper} />
              </svg>
            </button>
          </div>
        )}

        <div style={{ ...label, fontSize: 10, color: C.faint, textAlign: "center", marginTop: 18 }}>
          {status === "bewaard" ? "bewaard" : "\u00A0"}
        </div>

        {backup && (
          <Venster kop="Instellingen" onSluit={() => setBackup(false)}>
            <Backup data={data} persist={persist} />
          </Venster>
        )}
      </div>
    </div>
  );
}

/* ---------------- ornamenten ---------------- */

/* een gegraveerd ruitje met twee streepjes, zoals in oud drukwerk */
function Fleuron({ kleur = C.brass, breed = 30 }) {
  return (
    <svg width={breed} height="9" viewBox="0 0 30 9" fill="none" stroke={kleur} strokeWidth="1" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M15 1.4 L18.2 4.5 L15 7.6 L11.8 4.5 Z" />
      <path d="M1 4.5 H8.6" />
      <path d="M21.4 4.5 H29" />
    </svg>
  );
}

/* scheiding met een ornament in het midden */
function Scheiding({ marge = 26 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: `${marge}px 0` }}>
      <div style={{ flex: 1, height: 1, background: C.line }} />
      <Fleuron breed={26} />
      <div style={{ flex: 1, height: 1, background: C.line }} />
    </div>
  );
}

/* de tekens van de drie uren: opgaande zon, zon in top, wassende maan */
function Uurteken({ id, kleur }) {
  const g = { fill: "none", stroke: kleur, strokeWidth: 1, strokeLinecap: "round" };
  if (id === "morgen")
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" {...g}>
        <path d="M2.5 10.5 A5.5 5.5 0 0 1 13.5 10.5" />
        <path d="M0.8 10.5 H15.2" />
        <path d="M8 1.4 V0.6M3 3 L2.2 2.2M13 3 L13.8 2.2" />
      </svg>
    );
  if (id === "middag")
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" {...g}>
        <circle cx="7" cy="7" r="3.1" />
        <path d="M7 0.6V2.2M7 11.8V13.4M0.6 7H2.2M11.8 7H13.4M2.4 2.4l1.1 1.1M10.5 10.5l1.1 1.1M11.6 2.4l-1.1 1.1M3.5 10.5l-1.1 1.1" />
      </svg>
    );
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" {...g}>
      <path d="M9.4 1.2 A6 6 0 1 0 9.4 12.8 A4.8 4.8 0 1 1 9.4 1.2 Z" />
    </svg>
  );
}

/* ---------------- het kruis ---------------- */
function Cross({ size = 20, color = C.ink, stroke = 1 }) {
  const w = size * 0.62;
  return (
    <svg width={w} height={size} viewBox="0 0 62 100" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <line x1="31" y1="0" x2="31" y2="100" stroke={color} strokeWidth={stroke * 2.6} />
      <line x1="0" y1="33" x2="62" y2="33" stroke={color} strokeWidth={stroke * 2.6} />
    </svg>
  );
}

/* ---------------- back-up ---------------- */
function Backup({ data, persist }) {
  const [melding, setMelding] = useState(null);
  const [terug, setTerug] = useState(null);   // ingelezen bestand, wacht op bevestiging
  const [wis, setWis] = useState(0);          // 0 niets, 1 eerste vraag, 2 tweede vraag
  const invoerRef = useRef(null);

  const bestandsnaam = () => "getijden-" + dateKey(new Date()) + ".json";

  const opslaan = () => {
    const tekst = JSON.stringify(data, null, 2);
    try {
      const blob = new Blob([tekst], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = bestandsnaam();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      persist({ ...data, laatsteBackup: dateKey(new Date()) });
      setMelding("Bestand opgeslagen als " + bestandsnaam());
    } catch (e) {
      try {
        navigator.clipboard.writeText(tekst);
        setMelding("Opslaan lukte niet, maar alles staat nu op je klembord.");
      } catch (e2) {
        setMelding("Opslaan lukte niet op dit toestel.");
      }
    }
  };

  const lees = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || typeof d !== "object" || (!d.habits && !d.days && !d.boeken))
          throw new Error("geen getijden-bestand");
        setTerug(d);
        setMelding(null);
      } catch (err) {
        setMelding("Dat lijkt geen back-up van Getijden te zijn.");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  const zetTerug = () => {
    // een oude of half ingevulde back-up mag de app niet laten struikelen
    const veilig = {
      habits: Array.isArray(terug.habits) && terug.habits.length ? terug.habits : DEFAULT_HABITS,
      days: terug.days && typeof terug.days === "object" ? terug.days : {},
      boeken: Array.isArray(terug.boeken) ? terug.boeken : [],
      nacht: !!terug.nacht,
    };
    veilig.boeken = veilig.boeken.map((b) => ({
      ...b,
      dagen: b.dagen && typeof b.dagen === "object" ? b.dagen : {},
      notities: Array.isArray(b.notities) ? b.notities : [],
      status: ["lezend", "te-lezen", "uit"].includes(b.status) ? b.status : "te-lezen",
    }));
    persist(veilig);
    setTerug(null);
    setMelding("Terugzetten gelukt.");
  };

  const dagen = Object.keys(data.days || {}).length;
  const boeken = (data.boeken || []).length;
  const geleden = data.laatsteBackup
    ? Math.round((new Date(dateKey(new Date())) - new Date(data.laatsteBackup)) / 86400000)
    : null;

  return (
    <div>
      <div style={{ ...label, color: C.soft, marginBottom: 10 }}>Back-up</div>
      <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, lineHeight: 1.55, color: C.soft, margin: "0 0 10px", fontStyle: "italic" }}>
        Alles staat alleen in deze app. {dagen} {dagen === 1 ? "dag" : "dagen"} en {boeken}{" "}
        {boeken === 1 ? "boek" : "boeken"} opgeslagen.
      </p>
      <p style={{ ...label, fontSize: 10, color: geleden === null || geleden > 21 ? C.brass : C.faint, margin: "0 0 18px" }}>
        {geleden === null
          ? "nog nooit een back-up gemaakt"
          : geleden === 0
          ? "laatste back-up: vandaag"
          : geleden === 1
          ? "laatste back-up: gisteren"
          : "laatste back-up: " + geleden + " dagen geleden"}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={opslaan} style={{ ...hoofdknop, fontSize: 11, letterSpacing: ".13em", flex: 1, padding: "11px 8px" }}>
          Bewaren
        </button>
        <button onClick={() => invoerRef.current && invoerRef.current.click()} style={{ ...label, fontSize: 11, letterSpacing: ".13em", flex: 1, background: "none", color: C.ink, border: "1px solid " + C.line, padding: "11px 8px", cursor: "pointer" }}>
          Terugzetten
        </button>
      </div>
      <input ref={invoerRef} type="file" accept="application/json,.json" onChange={lees} style={{ display: "none" }} />

      {terug && (
        <div style={{ border: "1px solid " + C.brass, padding: 16, marginTop: 16 }}>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, lineHeight: 1.5, color: C.ink, margin: "0 0 14px" }}>
            Deze back-up bevat {Object.keys(terug.days || {}).length} dagen en{" "}
            {(terug.boeken || []).length} boeken. Terugzetten overschrijft wat er nu in staat.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={zetTerug} style={{ ...hoofdknop, fontSize: 11, flex: 1, padding: "10px 8px" }}>
              Terugzetten
            </button>
            <button onClick={() => setTerug(null)} style={{ ...label, fontSize: 11, flex: 1, background: "none", color: C.soft, border: "1px solid " + C.line, padding: "10px 8px", cursor: "pointer" }}>
              Laat maar
            </button>
          </div>
        </div>
      )}

      {melding && (
        <p style={{ ...label, fontSize: 10, color: C.faint, marginTop: 14, letterSpacing: ".1em" }}>{melding}</p>
      )}

      <div style={{ height: 1, background: C.line, margin: "30px 0 20px" }} />

      {wis === 0 && (
        <button
          onClick={() => setWis(1)}
          style={{ ...label, fontSize: 10, background: "none", border: "none", color: C.faint, cursor: "pointer", padding: 0 }}
        >
          Alles wissen
        </button>
      )}
      {wis === 1 && (
        <div>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, lineHeight: 1.5, color: C.ink, margin: "0 0 14px" }}>
            Alles wissen verwijdert je {dagen} {dagen === 1 ? "dag" : "dagen"}, je gedachten en je{" "}
            {boeken} {boeken === 1 ? "boek" : "boeken"} met alle notities.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setWis(2)} style={{ ...label, fontSize: 11, flex: 1, padding: "11px 0", background: "transparent", color: C.ink, border: "1px solid " + C.ink, cursor: "pointer" }}>
              Ga door
            </button>
            <button onClick={() => setWis(0)} style={{ ...label, fontSize: 11, flex: 1, padding: "11px 0", background: "transparent", color: C.soft, border: "1px solid " + C.line, cursor: "pointer" }}>
              Laat maar
            </button>
          </div>
        </div>
      )}
      {wis === 2 && (
        <div>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, lineHeight: 1.5, color: C.ink, margin: "0 0 6px" }}>
            Zeker weten? Dit kan niet ongedaan gemaakt worden.
          </p>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, lineHeight: 1.5, color: C.soft, fontStyle: "italic", margin: "0 0 14px" }}>
            Maak eerst een back-up als je het later nog terug wilt kunnen zetten.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                persist({ habits: DEFAULT_HABITS, days: {}, boeken: [], nacht: !!data.nacht });
                setWis(0);
                setMelding("Alles gewist.");
              }}
              style={{ ...label, fontSize: 11, flex: 1, padding: "11px 0", background: "transparent", color: C.brass, border: "1px solid " + C.brass, cursor: "pointer" }}
            >
              Wissen
            </button>
            <button onClick={() => setWis(0)} style={{ ...label, fontSize: 11, flex: 1, padding: "11px 0", background: "transparent", color: C.soft, border: "1px solid " + C.line, cursor: "pointer" }}>
              Laat maar
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 1, background: C.line, margin: "24px 0 14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ ...label, fontSize: 10, color: C.faint }}>Getijden</span>
        <span style={{ ...label, fontSize: 10, color: C.faint }}>versie {VERSIE}</span>
      </div>
    </div>
  );
}

/* ---------------- de boekenkast ---------------- */

const LEEG_BOEK = { titel: "", paginas: "" };
const STANDAARD_PER_DAG = 10;

function Lezen({ data, persist, today }) {
  const [open, setOpen] = useState(null);      // id van het boek in het venster
  const [nieuw, setNieuw] = useState(false);
  const [kast, setKast] = useState(false);
  const [form, setForm] = useState(LEEG_BOEK);

  const boeken = data.boeken || [];
  const lezend = boeken.find((b) => b.status === "lezend");
  const teLezen = boeken.filter((b) => b.status === "te-lezen");
  const uit = boeken.filter((b) => b.status === "uit");

  /* Eén plek waar de kast verandert. Zo kan een knop nooit
     een andere wijziging overschrijven. */
  const bewerk = (fn, ookGelezen) => {
    const dagRec = data.days[today] || { done: [], note: "", tides: [] };
    persist({
      ...data,
      boeken: fn(boeken),
      days: ookGelezen ? { ...data.days, [today]: { ...dagRec, gelezen: true } } : data.days,
    });
  };

  const wijzig = (id, velden, ookGelezen) =>
    bewerk((bs) => bs.map((b) => (b.id === id ? { ...b, ...velden } : b)), ookGelezen);

  const zetPagina = (id, pagina) => {
    const b = boeken.find((x) => x.id === id);
    if (!b) return;
    wijzig(id, { dagen: { ...(b.dagen || {}), [today]: pagina } }, true);
  };

  const nuLezen = (id, perDag) =>
    bewerk((bs) =>
      bs.map((b) =>
        b.id === id
          ? { ...b, status: "lezend", perDag: perDag || b.perDag || STANDAARD_PER_DAG }
          : b.status === "lezend"
          ? { ...b, status: "te-lezen" }
          : b
      )
    );

  const voegNotitie = (id, pagina, tekst) => {
    const b = boeken.find((x) => x.id === id);
    if (!b || !tekst.trim()) return;
    const n = { id: "n" + Date.now(), pagina: pagina || null, tekst: tekst.trim(), datum: today };
    wijzig(id, { notities: [...(b.notities || []), n] });
  };

  const wisNotitie = (id, nid) => {
    const b = boeken.find((x) => x.id === id);
    if (!b) return;
    wijzig(id, { notities: (b.notities || []).filter((n) => n.id !== nid) });
  };

  const voegToe = () => {
    const p = parseInt(form.paginas, 10);
    if (!form.titel.trim() || !p) return;
    bewerk((bs) => [
      ...bs,
      {
        id: "b" + Date.now(),
        titel: form.titel.trim(),
        paginas: p,
        perDag: STANDAARD_PER_DAG,
        dagen: {},
        notities: [],
        status: "te-lezen",
      },
    ]);
    setForm(LEEG_BOEK);
    setNieuw(false);
  };

  const stand = (b) => {
    const d = (b && b.dagen) || {};
    const k = Object.keys(d).sort();
    return k.length ? d[k[k.length - 1]] : 0;
  };
  const vorige = (b) => {
    const d = (b && b.dagen) || {};
    const k = Object.keys(d).filter((x) => x < today).sort();
    return k.length ? d[k[k.length - 1]] : 0;
  };

  const boekInVenster = boeken.find((b) => b.id === open);

  return (
    <section style={{ ...card }}>
      {lezend ? (
        <NuLezend
          boek={lezend}
          stand={stand(lezend)}
          vorige={vorige(lezend)}
          zetPagina={zetPagina}
          opendetail={() => setOpen(lezend.id)}
        />
      ) : (
        <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 18, color: C.faint, fontStyle: "italic", margin: "4px 0 10px" }}>
          Je leest op dit moment niets. Pak een boek uit de kast.
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
        <button
          onClick={() => setKast(true)}
          title="Boekenkast"
          aria-label="Boekenkast"
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: "6px 0", cursor: "pointer" }}
        >
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none" stroke={C.soft} strokeLinejoin="miter">
            {/* drie ruggen met koperen banden, zoals op de plank zelf */}
            <g strokeWidth="1">
              <rect x="2" y="4" width="5" height="13" />
              <path d="M2 6.6H7M2 14.4H7" stroke={C.brass} strokeWidth="0.9" />
              <rect x="8.5" y="6.5" width="4.5" height="10.5" />
              <path d="M8.5 8.7H13M8.5 14.8H13" stroke={C.brass} strokeWidth="0.9" />
              {/* een boek dat schuin tegen de rest aan leunt */}
              <path d="M15.6 17L19.4 3.6L23.6 4.8L20.6 17Z" />
              <path d="M16.4 14.2L21.4 15.6" stroke={C.brass} strokeWidth="0.9" />
            </g>
            {/* de plank met steunen */}
            <path d="M0.6 18.4H25.4" strokeWidth="1.7" />
            <path d="M0.9 18.4V20.6M25.1 18.4V20.6" strokeWidth="1.1" />
          </svg>
          <span style={{ ...label, fontSize: 10, color: C.faint }}>{boeken.length}</span>
        </button>
      </div>

      {kast && (
        <Venster kop="Boekenkast" onSluit={() => setKast(false)}>
          <Plank titel="Te lezen" boeken={teLezen} leeg="Nog niets klaargezet." onKies={(b) => { setKast(false); setOpen(b.id); }} />
          <div style={{ marginTop: 30 }}>
            <Plank titel="Uitgelezen" boeken={uit} leeg="Het eerste boek dat je uitleest komt hier te staan." onKies={(b) => { setKast(false); setOpen(b.id); }} gedimd />
          </div>
          <button
            onClick={() => { setKast(false); setNieuw(true); }}
            style={{ ...hoofdknop, padding: "12px 16px", marginTop: 34, width: "100%" }}
          >
            Boek toevoegen
          </button>
        </Venster>
      )}

      {nieuw && (
        <Venster onSluit={() => setNieuw(false)} kop="Nieuw boek">
          {[
            ["Titel", "titel", "text"],
            ["Aantal bladzijden", "paginas", "number"],
          ].map(([lab, veld, type]) => (
            <div key={veld} style={{ marginBottom: 18 }}>
              <div style={{ ...label, fontSize: 10, color: C.faint }}>{lab}</div>
              <input
                type={type}
                value={form[veld]}
                onChange={(e) => setForm({ ...form, [veld]: e.target.value })}
                style={{ ...invoer }}
              />
            </div>
          ))}
          <button onClick={voegToe} style={{ ...hoofdknop, width: "100%", marginTop: 12, padding: "13px 0" }}>
            Op de plank zetten
          </button>
        </Venster>
      )}

      {boekInVenster && (
        <Detail
          boek={boekInVenster}
          stand={stand(boekInVenster)}
          lezendId={lezend ? lezend.id : null}
          zetPagina={zetPagina}
          voegNotitie={voegNotitie}
          wisNotitie={wisNotitie}
          nuLezen={nuLezen}
          wijzig={wijzig}
          today={today}
          onSluit={() => setOpen(null)}
          onVerwijder={(id) => {
            bewerk((bs) => bs.filter((b) => b.id !== id));
            setOpen(null);
          }}
        />
      )}
    </section>
  );
}

/* het boek dat open ligt */
function NuLezend({ boek, stand, vorige, zetPagina, opendetail }) {
  const doel = Math.min(boek.paginas, vorige + boek.perDag);
  const teGaan = Math.max(0, doel - stand);
  const voortgang = Math.min(1, stand / boek.paginas);

  return (
    <div>
      <div style={{ ...label, color: C.brass }}>Nu aan het lezen</div>
      <h2
        onClick={opendetail}
        style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 26, fontWeight: 400, color: C.ink, margin: "10px 0 20px", lineHeight: 1.25, cursor: "pointer" }}
      >
        {boek.titel}
      </h2>

      {teGaan ? (
        <div>
          <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 40, lineHeight: 1, color: C.ink }}>
            {teGaan}
          </div>
          <div style={{ ...label, fontSize: 11, letterSpacing: ".13em", color: C.soft, marginTop: 7 }}>
            bladzijden te gaan vandaag
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 17, lineHeight: 1, color: C.brass }}>{"\u2713"}</span>
          <span style={{ ...label, color: C.brass }}>vandaag gehaald</span>
        </div>
      )}

      <div style={{ height: 2, background: C.line, margin: "22px 0 14px", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: voortgang * 100 + "%", background: C.brass }} />
        <div
          style={{
            position: "absolute",
            left: voortgang * 100 + "%",
            top: -2.5,
            width: 7,
            height: 7,
            marginLeft: -3.5,
            background: C.brass,
            transform: "rotate(45deg)",
          }}
        />
      </div>
      <div style={{ ...label, color: C.faint }}>
        bladzijde {stand} van {boek.paginas}
      </div>

      {teGaan > 0 && (
        <button
          onClick={() => zetPagina(boek.id, doel)}
          style={{ ...hoofdknop, marginTop: 20, width: "100%", padding: "13px 0" }}
        >
          Gelezen tot {doel}
        </button>
      )}
    </div>
  );
}

/* een plank met ruggen */
function Plank({ titel, boeken, leeg, onKies, gedimd }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...label, color: C.soft }}>{titel}</span>
        <span style={{ ...label, fontSize: 10, color: boeken.length ? C.brass : C.faint }}>
          {boeken.length}
        </span>
      </div>

      {boeken.length ? (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 14, overflowX: "auto", paddingBottom: 2 }}>
          {boeken.map((b, n) => {
            const dik = Math.max(26, Math.min(46, Math.round(b.paginas / 11)));
            const hoog = 116 + ((b.titel.length + b.paginas) % 4) * 7;
            return (
              <button
                key={b.id}
                onClick={() => onKies(b)}
                title={b.titel}
                style={{
                  flex: "0 0 auto",
                  width: dik,
                  height: hoog,
                  border: "1px solid " + C.oak,
                  background: n % 2 ? C.bg : C.paper,
                  opacity: gedimd ? 0.6 : 1,
                  cursor: "pointer",
                  padding: 0,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <span style={{ position: "absolute", left: 0, right: 0, top: 14, height: 1, background: C.brass, opacity: 0.75 }} />
                <span style={{ position: "absolute", left: 0, right: 0, top: 18, height: 1, background: C.brass, opacity: 0.4 }} />
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 1, background: C.brass, opacity: 0.75 }} />
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 18, height: 1, background: C.brass, opacity: 0.4 }} />
                <span
                  style={{
                    fontFamily: "'EB Garamond',Georgia,serif",
                    fontSize: 12.5,
                    color: C.ink,
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxHeight: hoog - 46,
                    padding: "0 2px",
                  }}
                >
                  {b.titel}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ height: 96, display: "flex", alignItems: "flex-end", paddingBottom: 10 }}>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, color: C.faint, fontStyle: "italic", margin: 0 }}>
            {leeg}
          </p>
        </div>
      )}

      {/* de plank zelf, met steunen aan weerskanten */}
      <div style={{ position: "relative" }}>
        <div style={{ height: 2, background: C.oak, opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 0, top: 2, width: 2, height: 7, background: C.oak, opacity: 0.6 }} />
        <div style={{ position: "absolute", right: 0, top: 2, width: 2, height: 7, background: C.oak, opacity: 0.6 }} />
      </div>
    </div>
  );
}

/* het venster bij een boek: een korte lijst met wat je kunt doen */
function Detail({ boek, stand, lezendId, zetPagina, voegNotitie, wisNotitie, nuLezen, wijzig, onSluit, onVerwijder }) {
  const [pagina, setPagina] = useState(String(stand || ""));
  const [sub, setSub] = useState(null);          // "notities", "beginnen" of "weg"
  const [tempo, setTempo] = useState(String(boek.perDag || 10));
  const [nPagina, setNPagina] = useState("");
  const [nTekst, setNTekst] = useState("");

  const notities = (boek.notities || []).slice().reverse();
  const voortgang = Math.min(1, stand / (boek.paginas || 1));

  const bewaarPagina = () => {
    const v = Math.max(0, Math.min(boek.paginas, parseInt(pagina, 10) || 0));
    zetPagina(boek.id, v);
  };

  const bewaarNotitie = () => {
    if (!nTekst.trim()) return;
    voegNotitie(boek.id, parseInt(nPagina, 10) || null, nTekst);
    setNPagina("");
    setNTekst("");
  };

  return (
    <Venster onSluit={onSluit} kop={boek.titel}>
      <div style={{ ...label, fontSize: 10, color: boek.status === "lezend" ? C.brass : C.faint, marginBottom: 14 }}>
        {boek.status === "lezend"
          ? "bladzijde " + stand + " van " + boek.paginas + " \u00b7 " + boek.perDag + " per dag"
          : boek.paginas + " bladzijden"}
        {boek.status === "uit" ? " \u00b7 uitgelezen" : ""}
        {boek.status === "te-lezen" ? " \u00b7 op de plank" : ""}
      </div>

      {boek.status === "lezend" && (
        <>
          <div style={{ height: 2, background: C.line, margin: "0 0 20px", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: voortgang * 100 + "%", background: C.brass }} />
            <div
              style={{
                position: "absolute",
                left: voortgang * 100 + "%",
                top: -2.5,
                width: 7,
                height: 7,
                marginLeft: -3.5,
                background: C.brass,
                transform: "rotate(45deg)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
            <input
              type="number"
              value={pagina}
              onChange={(e) => setPagina(e.target.value)}
              placeholder="waar ben je nu"
              style={{
                flex: 1,
                boxSizing: "border-box",
                background: "transparent",
                border: "1px solid " + C.line,
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: 17,
                color: C.ink,
                outline: "none",
                padding: "10px 12px",
              }}
            />
            <button onClick={bewaarPagina} style={{ ...knopje, flexShrink: 0, padding: "10px 20px" }}>
              Zet
            </button>
          </div>
        </>
      )}

      {/* wat je met dit boek kunt doen */}
      <div style={{ borderTop: "1px solid " + C.line }}>
        <Regel onClick={() => setSub("notities")} tekst="Notities" bij={notities.length || ""} />
        {boek.status !== "lezend" && (
          <Regel onClick={() => setSub("beginnen")} tekst={lezendId ? "Dit nu lezen" : "Nu lezen"} accent />
        )}
        {boek.status === "lezend" && (
          <>
            <Regel onClick={() => { wijzig(boek.id, { status: "uit" }); onSluit(); }} tekst="Uitgelezen" accent />
            <Regel onClick={() => { wijzig(boek.id, { status: "te-lezen" }); onSluit(); }} tekst="Stoppen met lezen" />
          </>
        )}
        {boek.status === "uit" && (
          <Regel onClick={() => { wijzig(boek.id, { status: "te-lezen" }); onSluit(); }} tekst="Terug op de plank" />
        )}
        <Regel onClick={() => setSub("weg")} tekst="Verwijderen" flauw />
      </div>

      {sub === "notities" && (
        <Venster kop="Notities" onSluit={() => setSub(null)}>
          {notities.length ? (
            <div style={{ marginBottom: 22 }}>
              {notities.map((n) => (
                <div key={n.id} style={{ padding: "12px 0 12px 14px", borderLeft: "1px solid " + C.brass, borderBottom: "1px solid " + C.line, marginBottom: 2 }}>
                  <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 18, lineHeight: 1.55, color: C.ink, margin: 0, whiteSpace: "pre-wrap" }}>
                    {n.tekst}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                    <span style={{ ...label, fontSize: 9, color: C.brass }}>{n.pagina ? "blz. " + n.pagina : ""}</span>
                    <span style={{ ...label, fontSize: 9, color: C.faint }}>{n.datum}</span>
                    <button
                      onClick={() => wisNotitie(boek.id, n.id)}
                      style={{ ...label, fontSize: 9, marginLeft: "auto", background: "none", border: "none", color: C.faint, cursor: "pointer", padding: 0 }}
                    >
                      weg
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, color: C.faint, fontStyle: "italic", margin: "0 0 20px" }}>
              Nog niets bewaard uit dit boek.
            </p>
          )}

          <textarea
            value={nTekst}
            onChange={(e) => setNTekst(e.target.value)}
            rows={3}
            placeholder="een zin die je wilt houden"
            style={{ ...invoer, marginTop: 0, fontSize: 18, lineHeight: 1.55, resize: "vertical" }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <input
              type="number"
              value={nPagina}
              onChange={(e) => setNPagina(e.target.value)}
              placeholder="blz."
              style={{
                width: 84,
                flexShrink: 0,
                boxSizing: "border-box",
                background: "transparent",
                border: "1px solid " + C.line,
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: 17,
                color: C.ink,
                outline: "none",
                padding: "10px 0",
                textAlign: "center",
              }}
            />
            <button
              onClick={bewaarNotitie}
              disabled={!nTekst.trim()}
              style={{
                ...label,
                fontSize: 11,
                letterSpacing: ".13em",
                flex: 1,
                padding: "11px 0",
                background: "transparent",
                color: nTekst.trim() ? C.brass : C.faint,
                border: "1px solid " + (nTekst.trim() ? C.brass : C.line),
                cursor: nTekst.trim() ? "pointer" : "default",
              }}
            >
              Bewaren
            </button>
          </div>
        </Venster>
      )}

      {sub === "weg" && (
        <Venster kop="Verwijderen" onSluit={() => setSub(null)}>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 18, lineHeight: 1.5, color: C.ink, margin: "0 0 8px" }}>
            {boek.titel} verdwijnt uit de kast.
          </p>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 16, lineHeight: 1.55, color: C.soft, fontStyle: "italic", margin: "0 0 24px" }}>
            {notities.length
              ? notities.length === 1
                ? "Je \u00e9\u00e9n bewaarde notitie gaat mee. Dat kan niet ongedaan gemaakt worden."
                : "Je " + notities.length + " bewaarde notities gaan mee. Dat kan niet ongedaan gemaakt worden."
              : "Dat kan niet ongedaan gemaakt worden."}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => onVerwijder(boek.id)}
              style={{ ...label, fontSize: 11, letterSpacing: ".13em", flex: 1, padding: "12px 0", background: "transparent", color: C.ink, border: "1px solid " + C.ink, cursor: "pointer" }}
            >
              Verwijderen
            </button>
            <button
              onClick={() => setSub(null)}
              style={{ ...label, fontSize: 11, letterSpacing: ".13em", flex: 1, padding: "12px 0", background: "transparent", color: C.soft, border: "1px solid " + C.line, cursor: "pointer" }}
            >
              Laat maar
            </button>
          </div>
        </Venster>
      )}

      {sub === "beginnen" && (
        <Venster kop="Beginnen" onSluit={() => setSub(null)}>
          <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 18, lineHeight: 1.5, color: C.ink, margin: "0 0 20px" }}>
            {boek.titel} telt {boek.paginas} bladzijden. Hoeveel wil je er per dag lezen?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <input
              type="number"
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
              style={{
                width: 84,
                flexShrink: 0,
                boxSizing: "border-box",
                background: "transparent",
                border: "1px solid " + C.line,
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: 19,
                color: C.ink,
                outline: "none",
                padding: "10px 0",
                textAlign: "center",
              }}
            />
            <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, color: C.soft, fontStyle: "italic" }}>
              bladzijden per dag
            </span>
          </div>
          <p style={{ ...label, fontSize: 10, color: C.faint, margin: "0 0 22px" }}>
            {Math.max(1, Math.ceil(boek.paginas / Math.max(1, parseInt(tempo, 10) || 1)))} dagen
          </p>
          <button
            onClick={() => { nuLezen(boek.id, parseInt(tempo, 10)); onSluit(); }}
            style={{ ...hoofdknop, width: "100%", padding: "13px 0" }}
          >
            Beginnen
          </button>
        </Venster>
      )}
    </Venster>
  );
}

/* een regel in het keuzelijstje van een boek */
function Regel({ onClick, tekst, bij, accent, flauw }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...label,
        fontSize: 11,
        letterSpacing: ".13em",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "none",
        border: "none",
        borderBottom: "1px solid " + C.line,
        padding: "15px 0",
        cursor: "pointer",
        color: flauw ? C.faint : accent ? C.brass : C.ink,
        textAlign: "left",
      }}
    >
      <span>{tekst}</span>
      <span style={{ ...label, fontSize: 10, color: C.faint }}>{bij}</span>
    </button>
  );
}

function Venster({ kop, children, onSluit }) {
  return (
    <div
      onClick={onSluit}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.42)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.paper,
          borderTop: "1px solid " + C.brass,
          width: "100%",
          maxWidth: 620,
          maxHeight: "88%",
          overflowY: "auto",
          padding: "14px 24px 34px",
          boxSizing: "border-box",
        }}
      >
        {/* greepje, zoals bij een la die je omhoog trekt */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 14 }}>
          <div style={{ width: 34, height: 2, background: C.line }} />
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <h3 style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 24, fontWeight: 400, color: C.ink, margin: 0, lineHeight: 1.25, flex: 1 }}>
            {kop}
          </h3>
          <button onClick={onSluit} style={{ ...label, fontSize: 10, background: "none", border: "none", color: C.faint, cursor: "pointer", padding: "6px 0 0" }}>
            Sluit
          </button>
        </div>
        <div style={{ margin: "9px 0 20px" }}>
          <Fleuron breed={26} />
        </div>
        {children}
      </div>
    </div>
  );
}

const invoer = {
  width: "100%",
  marginTop: 6,
  background: "transparent",
  border: "none",
  fontFamily: "'EB Garamond',Georgia,serif",
  fontSize: 20,
  outline: "none",
  padding: "5px 0",
  boxSizing: "border-box",
  get borderBottom() {
    return "1px solid " + C.line;
  },
  get color() {
    return C.ink;
  },
};

const tekstlink = {
  fontFamily: "'Barlow Condensed',Helvetica,sans-serif",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: ".13em",
  textTransform: "uppercase",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  whiteSpace: "nowrap",
  get color() {
    return C.faint;
  },
};

const hoofdknop = {
  fontFamily: "'Barlow Condensed',Helvetica,sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  background: "transparent",
  cursor: "pointer",
  get border() {
    return "1px solid " + C.brass;
  },
  get color() {
    return C.brass;
  },
};

const knopje = {
  fontFamily: "'Barlow Condensed',Helvetica,sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  background: "none",
  padding: "8px 14px",
  cursor: "pointer",
  get border() {
    return "1px solid " + C.line;
  },
  get color() {
    return C.ink;
  },
};

/* ---------------- de getijdenband ---------------- */
function Band({ tide, nuId, beschikbaar, onKies, nowFrac, rec }) {
  return (
    <div style={{ position: "relative", paddingTop: 6 }}>
      <div style={{ position: "relative", height: 1, background: C.line }}>
        <div
          style={{
            position: "absolute",
            left: (TIDES.findIndex((t) => t.id === tide.id) / TIDES.length) * 100 + "%",
            width: 100 / TIDES.length + "%",
            top: 0,
            height: 1,
            background: C.brass,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: nowFrac * 100 + "%",
            top: -3,
            width: 7,
            height: 7,
            background: C.ink,
            transform: "translateX(-50%) rotate(45deg)",
          }}
        />
      </div>
      <div style={{ position: "relative", height: 30, marginTop: 9 }}>
        {TIDES.map((t, idx) => {
          const mid = (idx + 0.5) / TIDES.length;
          const held = rec.tides.includes(t.id);
          const kan = beschikbaar.includes(t.id);
          const actief = t.id === tide.id;
          return (
            <button
              key={t.id}
              onClick={() => kan && onKies(t.id)}
              disabled={!kan}
              style={{
                position: "absolute",
                left: mid * 100 + "%",
                transform: "translateX(-50%)",
                textAlign: "center",
                background: "none",
                border: "none",
                padding: "2px 10px 6px",
                cursor: kan ? "pointer" : "default",
                opacity: kan ? 1 : 0.45,
              }}
            >
              <div
                style={{
                  ...label,
                  fontSize: 10,
                  color: actief ? C.ink : C.faint,
                  borderBottom: actief && t.id !== nuId ? "1px solid " + C.brass : "1px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {t.naam}
              </div>
              <div style={{ height: 15, marginTop: 7, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Uurteken id={t.id} kleur={held ? C.brass : actief ? C.soft : C.line} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- ademhaling ---------------- */
const PHASES = [
  { naam: "adem in", ms: 4000 },
  { naam: "houd vast", ms: 2000 },
  { naam: "adem uit", ms: 6000 },
];

/* ------------- het kruis van Janick ------------- */
/* de tekening zelf, uit het papier gelicht en in eikenkleur gezet */
const KRUIS = "data:image/png;base64,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";

/* De adem zit niet in iets dat op de tekening ligt, maar in het licht erachter.
   De tekening zelf blijft onaangetast; ze komt alleen op en neemt weer af. */
const HART_Y = 124;          // het hart van het bladmotief, in px vanaf de bovenkant
const KRUIS_HOOGTE = 268;
const KRUIS_TOP = 26;
const RING_R = 54;                    // straal: de armen steken er net voorbij
/* De vier openingen tussen de armen, in graden (0 = rechts, met de klok mee).
   De laatste waarde keert de looprichting om, zodat de bogen links en rechts
   spiegelbeeldig naar elkaar toe groeien: boven- en onderaan komen ze samen. */
const BOOG_DEF = [
  [26, 71, false],    // rechtsonder, naar beneden toe
  [109, 154, true],   // linksonder, naar beneden toe
  [204, 245, false],  // linksboven, naar boven toe
  [295, 335, true],   // rechtsboven, naar boven toe
];
const BOGEN = BOOG_DEF.map(([v, t, keer], n) => {
  const p = (deg) => {
    const a = (deg * Math.PI) / 180;
    return [(62 + Math.cos(a) * RING_R).toFixed(2), (62 + Math.sin(a) * RING_R).toFixed(2)];
  };
  const [xa, ya] = p(keer ? t : v);
  const [xb, yb] = p(keer ? v : t);
  return {
    id: n,
    d: `M${xa},${ya} A${RING_R},${RING_R} 0 0 ${keer ? 0 : 1} ${xb},${yb}`,
    lengte: ((t - v) / 360) * 2 * Math.PI * RING_R + 2,
  };
});

function Breath({ nachtstand }) {
  const [aan, setAan] = useState(false);
  const [i, setI] = useState(0);
  const [ronde, setRonde] = useState(0);

  useEffect(() => {
    if (!aan) return;
    const t = setTimeout(() => {
      const next = (i + 1) % PHASES.length;
      setI(next);
      if (next === 0) {
        setRonde((r) => {
          if (r + 1 >= 6) {
            setAan(false);
            return 0;
          }
          return r + 1;
        });
      }
    }, PHASES[i].ms);
    return () => clearTimeout(t);
  }, [aan, i]);

  const fase = PHASES[i];
  const open = aan ? (i === 2 ? 0 : 1) : 0;
  const dur = aan ? fase.ms : 800;

  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ height: 320, position: "relative", overflow: "hidden" }}>
        {/* het licht achter het papier */}
        <div
          className="breath-cross"
          style={{
            position: "absolute",
            left: "50%",
            top: HART_Y,
            width: 180,
            height: 180,
            marginLeft: -90,
            marginTop: -90,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.brass}30 0%, ${C.brass}14 40%, ${C.brass}00 68%)`,
            transform: `scale(${0.5 + open * 0.5})`,
            opacity: 0.05 + open * 0.95,
            transition: `transform ${dur}ms ease-in-out, opacity ${dur}ms ease-in-out`,
          }}
        />

        {/* de ring loopt alleen in de vier openingen tussen de armen door,
            zoals bij een keltisch kruis. Zo kruist hij de tekening nooit. */}
        <svg
          width="124"
          height="124"
          viewBox="0 0 124 124"
          aria-hidden="true"
          style={{ position: "absolute", left: "50%", top: HART_Y - 62, marginLeft: -62 }}
        >
          {BOGEN.map((boog) => (
            <path
              key={boog.id}
              className="breath-cross"
              d={boog.d}
              fill="none"
              stroke={C.brass}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={boog.lengte}
              strokeDashoffset={boog.lengte * (1 - open)}
              style={{
                opacity: 0.55,
                transition: `stroke-dashoffset ${dur}ms linear`,
              }}
            />
          ))}
        </svg>

        <img
          src={KRUIS}
          alt=""
          className="breath-cross"
          style={{
            position: "absolute",
            left: "50%",
            top: KRUIS_TOP,
            height: KRUIS_HOOGTE,
            marginLeft: -84,
            display: "block",
            pointerEvents: "none",
            opacity: 0.72 + open * 0.28,
            filter: nachtstand ? "brightness(1.8)" : "none",
            transition: `opacity ${dur}ms ease-in-out`,
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <span style={{ ...label, color: aan ? C.oak : C.faint }}>
          {aan ? `${fase.naam} · nog ${6 - ronde}` : "vier in, zes uit"}
        </span>
        <button
          onClick={() => {
            setAan(!aan);
            setI(0);
            setRonde(0);
          }}
          style={{ ...label, background: "none", border: "1px solid " + C.line, padding: "6px 14px", cursor: "pointer", color: C.ink }}
        >
          {aan ? "Stop" : "Adem mee"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- heatmap ---------------- */
function Heatmap({ cells, habits }) {
  const [gekozen, setGekozen] = useState(null);
  const weken = [];
  for (let i = 0; i < cells.length; i += 7) weken.push(cells.slice(i, i + 7));
  const dagen = ["z", "m", "d", "w", "d", "v", "z"];

  const omschrijf = (c) => {
    if (!c.rec) return "niets";
    const d = [];
    if (c.rec.tides && c.rec.tides.length) d.push(c.rec.tides.length + " uur" + (c.rec.tides.length > 1 ? "en" : ""));
    if (c.rec.done && c.rec.done.length) d.push(c.rec.done.length + " gewoonte" + (c.rec.done.length > 1 ? "s" : ""));
    if (c.rec.gelezen) d.push("gelezen");
    if (c.rec.note) d.push("een gedachte");
    return d.length ? d.join(" \u00b7 ") : "niets";
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginTop: 16, maxWidth: 268 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginRight: 3 }}>
          {dagen.map((d, i) => (
            <div
              key={i}
              style={{ ...label, fontSize: 8, letterSpacing: 0, textTransform: "none", color: C.faint, height: 24, lineHeight: "24px" }}
            >
              {d}
            </div>
          ))}
        </div>
        {weken.map((w, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {Array.from({ length: 7 }).map((_, ri) => {
              const c = w[ri];
              if (!c) return <div key={ri} style={{ height: 24 }} />;
              const aan = gekozen && gekozen.k === c.k;
              return (
                <button
                  key={c.k}
                  onClick={() => setGekozen(aan ? null : c)}
                  aria-label={c.k}
                  style={{
                    height: 24,
                    padding: 0,
                    cursor: "pointer",
                    background: c.v === 0 ? C.line : C.brass,
                    opacity: c.v === 0 ? 0.45 : 0.3 + c.v * 0.7,
                    border: aan ? "1px solid " + C.ink : "1px solid transparent",
                    boxSizing: "border-box",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ ...label, fontSize: 9, letterSpacing: ".12em", color: C.faint, marginTop: 10, minHeight: 14 }}>
        {gekozen
          ? gekozen.d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" }) +
            " \u00b7 " +
            omschrijf(gekozen)
          : "\u00A0"}
      </div>
    </div>
  );
}

/* ---------------- gedeelde stijl ---------------- */
const page = {
  minHeight: "100%",
  WebkitFontSmoothing: "antialiased",
  get background() {
    return C.bg;
  },
  get color() {
    return C.ink;
  },
};

const card = {
  padding: "26px 24px 28px",
  get background() {
    return C.paper;
  },
  get border() {
    return "1px solid " + C.line;
  },
};

const label = {
  fontFamily: "'Barlow Condensed',Helvetica,sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  get color() {
    return C.soft;
  },
};

const rule = {
  height: 1,
  margin: "26px 0 22px",
  get background() {
    return C.line;
  },
};

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Barlow+Condensed:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      textarea::placeholder, input::placeholder {
        color: ${C.faint};
        font-style: italic;
        font-size: 15px;
        letter-spacing: 0;
      }
      button:focus-visible, textarea:focus-visible, input:focus-visible {
        outline: 2px solid ${C.brass}; outline-offset: 2px;
      }
      @media (prefers-reduced-motion: reduce) {
        .breath-cross { transition: opacity 900ms linear !important; }
      }
    `}</style>
  );
}
