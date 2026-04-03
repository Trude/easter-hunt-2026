# Påskedetektivene 2026 — Webapp-plan

*Dette dokumentet er detaljplanen for webappen. Se plan.md for den fysiske jakten og svein-sidespor.md for Sveins løp.*

---

## ÅPNE SPØRSMÅL (må avklares før bygging)

- [x] **Mini-spill poengkrav** — startverdi: fang 20 egg / treff 12 Piip / Bunny Jump høyde TBD. Justeres under testing. ✅
- [x] **Feil svar trivia** — umiddelbar tilbakemelding per spørsmål, men ingen retry. Hele seksjonen må tas på nytt ved ett eller flere feil. ✅
- [x] **Familietrivia** — ingen spørsmål som krever å spørre de voksne. Alle svar er validerbare automatisk. ✅
- [x] **Seldas dansespørsmål** — erstattet av musikkseksjon med Spotify-embeds. ✅
- [x] **2-sifrede koder** — Sander: 42, Selda: 08 → kombinasjonslås: 4208. ✅

---

## OVERORDNET ARKITEKTUR

**Hosting:** Vercel eller Netlify
**State:** `localStorage` per enhet — ingen database, ingen innlogging
**Entry point:** Én URL for alle. Kodefeltet på forsiden router til riktig side.
**Ukjent kode:** Nøytral feilmelding — "Ugyldig kode, prøv igjen" — slik at nye ruter kan legges til uten å påvirke eksisterende flyt.

### Ruter

| Rute | Kode | Innhold |
|------|------|---------|
| `/` | — | Forside — Piip ønsker velkommen, kodefelt |
| `/sander` | SANDER | Detektivkontoret — Sanders hub |
| `/selda` | SELDA | Detektivkontoret — Seldas hub |
| `/agent` | SVEIN | Sveins løp — klassifisert tema |
| `/agent/gruppe/[1-6]` | — | Trivia-grupper, låst sekvensielt |
| `/agent/fullfort` | — | ONKELS-kode + bursdagsbrev |
| `/kombiner` | — | Alle tre koder kombineres |
| `/minecraft` | — | Crafting-gåte |
| `/finale` | VARDEN26 | AI-video av Påskeharen |
| `/voksne` | *(TBD)* | Reservert for fremtidig voksen-sidespor |

---

## FORSIDE — `/`

Piip ønsker detektivene velkommen. Kort intro-tekst. Ett kodefelt. Knapp: "Tast inn kode".

Koder som routes:
- `SANDER` → `/sander`
- `SELDA` → `/selda`
- `SVEIN` → `/agent`
- `VARDEN26` → `/finale`
- Ukjent → feilmelding på samme side

---

## DETEKTIVKONTORET — HUB-MODELL

### Prinsipp

Hvert barn logger inn og ser sitt **Detektivkontor** — en hubside med 12 avdelinger som kort/dører.

- **Sekvensiell låsing:** Avdeling 1 må fullføres før 2 åpner seg, osv.
- **Replay:** Fullførte avdelinger kan åpnes og spilles på nytt fritt.
- **Fullført:** Når alle 12 er grønne → fullføringsskjerm med barnets kode (f.eks. «08») tydelig og stor, pluss en «Gå til kombiner →»-knapp. Barna kan trykke med en gang de er ferdige — kombiner-siden krever alle fire felt utfylt før noe skjer, så det er ingen fare i å ankomme først.
- **Visuelt:** Hvert kort har et ikon og en tittel. Låste kort er grå/dimmet. Fullførte kort er grønne med hake. Aktiv (neste å gjøre) pulserer/gløder.

### Mekanikk per avdelingstype

**Trivia-mapper:**
- Spørsmål vises ett om gangen
- Umiddelbar tilbakemelding etter hvert svar: grønn hake (riktig) eller rød X + riktig svar vises (feil)
- Alle spørsmål gjennomføres uansett — ingen mulighet til å prøve enkeltspørsmål på nytt
- Hvis ett eller flere svar var feil → seksjonen er ikke bestått, og de må ta hele mappen på nytt fra starten
- Bestått: alle svar riktig → avdeling markeres grønn og neste låses opp

**Interaktive steg (labyrint, memory, prikk-til-prikk, puslespill):**
- Fullført når oppgaven er løst
- Ingen poengkrav — bare løs det

**Mini-spill (fang egg, fang Piip):**
- Krever X poeng for å låse opp neste avdeling
- Kan spilles om igjen ubegrenset
- Poengkrav: **20 egg / 12 Piip** — justeres under testing

### Skjulte Easter eggs + Hemmelig avdeling

Spredt rundt i appen er det gjemt **skjulte Easter eggs** — små, klikk/trykkbare elementer som er subtilt plassert i bakgrunner, hjørner og mellom elementer på siden. Ingen hint om at de finnes. Ingen teller som viser fremgang. Ren oppdagelse.

**Mekanikk:**
- Klikk/trykk på et skjult egg → liten "Funnet!"-animasjon + achievement-pop-up
- Hvert barn har sitt eget sett med eggs, på sine egne sider — Sander og Selda finner ikke de samme
- Når alle eggs er funnet → **Avdeling 13: HEMMELIG MAPPE** dukker opp i hubben
- Avdeling 13 er påkrevd for fullføring — de oppdager at den mangler når alt annet er grønt
- Sander og Selda har **samme** hemmelige avdeling 13 — innhold TBD, bestemmes senere

**Svein har samme opplegg** på sine `/agent`-sider — egne skjulte eggs, egen hemmelig gruppe 7 som låses opp når alle er funnet.

---

## SANDER — 12 AVDELINGER

### Avdeling 1 — Saksmappe: Påske & Krim (trivia, 6 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva heter Påskeharens assistent i dette oppdraget? | Piip | Tekst |
| 2 | Hva er din detektivtittel? | Kodeknekkeren | Tekst |
| 3 | Hva heter hunden på hytten? | Odin | Tekst |
| 4 | Hva er det vanligste å finne inni et påskeegg? | Sjokolade | Flervalg: Sjokolade / Gull / Sand / Stein |
| 5 | Hva heter fjellstedet dere er på ferie i? | Kvitfjell | Tekst |
| 6 | Hvilken fugl er typisk påskesymbol i Norge? | Kylling / påskekylling | Flervalg: Kylling / Kråke / Pingvin / Papegøye |

---

### Avdeling 2 — Utfordring: Memory (interaktiv)

18 kort (9 par). Vend kort og finn alle parene. Fullført når alle par er matchet.

**Bilder (`assets/memory/`):**
`egg.png` · `hare.png` · `kylling.png` · `chocklate.png` · `flower.png` · `tulip.png` · `odin.png` · `c.png` · `revi.png`

*Ingen tidsbegrensning — bare finn alle parene.*

---

### Avdeling 3 — Saksmappe: Minecraft & Gaming (trivia, 8 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hvem laget Minecraft? | Notch (Markus Persson) | Flervalg: Notch / Steve / Herobrine / Jeb |
| 2 | Hva heter den grønne fienden som eksploderer? | Creeper | Tekst |
| 3 | Hva heter dimensjonen der Ender Dragon bor? | The End | Flervalg: The End / Nether / Overworld / Aether |
| 4 | Hva er Roblox sin valuta? | Robux | Tekst |
| 5 | Hva heter den ildfylte dimensjonen i Minecraft? | Nether | Tekst |
| 6 | Hva er den hardeste naturlige blokken (kan ikke brytes med verktøy)? | Bedrock | Flervalg: Bedrock / Obsidian / Diamond / Emerald |
| 7 | Hva heter det magiske bordet du bruker for å fortrølle gjenstander? | Enchantment table | Flervalg: Enchantment table / Crafting table / Furnace / Anvil |
| 8 | I hvilket år ble Minecraft offisielt lansert? | 2011 | Flervalg: 2009 / 2011 / 2013 / 2015 |

---

### Avdeling 4 — Mini-spill: Fang påskeegg! 🥚

Påskeegg faller ned fra toppen av skjermen. Beveg kurven til venstre og høyre (touch/klikk) for å fange dem. Kråker faller også — treffer du en kråke trekkes ett egg fra poengsummen.

**Krav:** Fang *⚠️ TBD (forslag: 20)* egg for å fullføre.
**Timer:** 60 sekunder per forsøk.
**Replay:** Ubegrenset forsøk til kravet er nådd.

---

### Avdeling 5 — Saksmappe: Norsk & Verden (trivia, 6 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva heter den nasjonale dagen i Norge? | 17. mai | Tekst |
| 2 | Hva er den lengste elven i verden? | Nilen | Tekst |
| 3 | Hva heter det høyeste fjellet i Norge? | Galdhøpiggen | Flervalg: Galdhøpiggen / Snøhetta / Glittertind / Jotunheimen |
| 4 | Hva heter planeten som er nærmest solen? | Merkur | Flervalg: Venus / Merkur / Mars / Jorda |
| 5 | Hva er hovedstaden i Frankrike? | Paris | Tekst |
| 6 | I hvilket år var det Vinter-OL på Kvitfjell? | 1994 | Flervalg: 1988 / 1992 / 1994 / 1998 |

---

### Avdeling 6 — Mini-spill: Fang Piip! 🐥

Piip dukker opp på tilfeldige steder på skjermen. Trykk/klikk på ham så fort som mulig. Kråker dukker også opp — treffer du en kråke trekkes ett poeng fra poengsummen.

**Krav:** Treff *⚠️ TBD (forslag: 12)* Piip for å fullføre.
**Timer:** 45 sekunder per forsøk.
**Replay:** Ubegrenset forsøk til kravet er nådd.

---

### Avdeling 7 — Saksmappe: Sport (trivia, 6 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva kalles ett slag under par på et hull i golf? | Birdie | Flervalg: Eagle / Birdie / Bogey / Par |
| 2 | Hva kalles to slag under par i golf? | Eagle | Flervalg: Eagle / Birdie / Albatross / Hole-in-one |
| 3 | Hva kalles ett slag over par i golf? | Bogey | Flervalg: Eagle / Birdie / Bogey / Double |
| 4 | Hvor mange spillere er det på et fotballag på banen? | 11 | Tekst |
| 5 | Hva heter den øverste fotballdivisjonen i Norge? | Eliteserien | Tekst |
| 6 | Hvilken sport drives med i Kvitfjell-bakkene? | Alpint / slalom | Flervalg: Alpint / Fotball / Tennis / Svømming |

---

### Avdeling 8 — Utfordring: Labyrint 🗺️

Hjelp Piip finne veien gjennom snølabyrinten til Påskeharen. Klikk/tap for å bevege Piip ett steg om gangen (opp/ned/venstre/høyre). Kom frem til utgangen for å fullføre.

*Labyrinten er ferdig designet på forhånd — én løsning, rimelig størrelse (ca. 12×12 celler).*

---

### Avdeling 9 — Saksmappe: Natur & Dyr (trivia, 5 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva er det raskeste dyret på land? | Gepard | Flervalg: Løve / Gepard / Hest / Tiger |
| 2 | Hva er det største dyret i verden? | Blåhvalen | Flervalg: Elefant / Blåhval / Isbjørn / Hai |
| 3 | Hva heter det når dyr sover hele vinteren? | Dvale | Tekst |
| 4 | Hva heter forvandlingsprosessen fra larve til sommerfugl? | Metamorfose | Flervalg: Metamorfose / Hibernasjon / Migrasjon / Evolusjon |
| 5 | Hva er det eneste pattedyret som kan fly? | Flaggermus | Flervalg: Flygende ekorn / Flaggermus / Papegøye / Pingvin |

---

### Avdeling 10 — Mini-spill: Bunny Jump 🐇

Påskeharen hopper oppover mellom plattformer. Trykk venstre/høyre (eller trykk på sidene av skjermen på mobil) for å styre ham til siden. Plattformene genereres tilfeldig — noen er solide, noen er kortere. Hopp høyt nok for å fullføre.

**Krav:** Nå høyde X for å låse opp neste avdeling.
**Game over:** Faller ned under nedre kant → start på nytt.
**Replay:** Ubegrenset forsøk.
*Høydekrav: ⚠️ TBD — bestemmes under testing.*

---

### Avdeling 11 — Saksmappe: Slang & Popkultur (trivia, 5 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva betyr "sigma" i ungdomsslang? | Kul, selvsikker person som gjør det på egenhånd | Flervalg: Kul og selvsikker / Redd og sjenert / Morsom / Slem |
| 2 | Hva heter toilet-karakteren fra YouTube? | Skibidi Toilet | Tekst |
| 3 | Hva er en "W" i gaming-slang? | En seier | Flervalg: Seier / Tap / Uavgjort / Pause |
| 4 | Hva betyr "no cap"? | Ingen løgn / for real | Flervalg: Ingen løgn / Ingen hatt / Ingen grunn / Aldri |
| 5 | Hva betyr "NPC" i gaming? | Ikke-spillbar karakter styrt av datamaskinen | Flervalg: Datakarakter / Spiller / Boss / Fiende |

---

### Avdeling 12 — Utfordring: Puslespill 🧩

Sett sammen bildet av Piip og Påskeharen. ~30 biter i ulike størrelser og former — klassisk puslespill-stil med uregelmessige kanter og tabs/blanks (ikke rette kvadrater). Dra og slipp bitene på riktig plass. Fullført når alle biter er på plass.

*Bilde: `assets/piip/piip_and_bunny.png` — Piip og Påskeharen maler påskeegg sammen.*
*Bitene er i tilfeldig rekkefølge og rotasjon ved start. Ingen tidsbegrensning.*
*Implementasjon: bruk et jigsaw-bibliotek (f.eks. [Jigsawify](https://github.com/nicktindall/jigsawify) eller tilsvarende canvas-basert løsning) som genererer uregelmessige biter fra bildet automatisk.*

---

### Avdeling 13 — HEMMELIG MAPPE 🔍 *(låses kun av skjulte Easter eggs)*

Vises ikke i hubben før alle Sanders skjulte Easter eggs er funnet. Dukker da opp som et nytt, pulserende kort — uten forklaring på hvordan det ble låst opp.

*Innhold: ⚠️ TBD*
*Påkrevd for fullføring.*

**Sanders skjulte Easter eggs — plassering:**
*(6 stk, spredt på tvers av avdelingene — eksakte plasseringer bestemmes under bygging)*
- 1 × gjemt i bakgrunnen på hubsiden
- 1 × skjult i en trivia-mappe (f.eks. bak et spørsmålstegn-ikon)
- 1 × i labyrinten (ved en vegg eller hjørne)
- 1 × i Fang Piip-minispillet (dukker opp én gang som et gult egg istedenfor Piip)
- 1 × i prikk-til-prikk (gjemt nær et av tallene)
- 1 × på fullføringsskjermen etter en avdeling

---

### Fullføring — Sander

Når alle 13 avdelinger er grønne (inkl. hemmelig):

> **ACHIEVEMENT UNLOCKED: ALLE SAKER LØST 🏆**
>
> Kodeknekkeren — du har bevist at du er Påskedetektivenes beste agent.
> Her er din hemmelige kode: **[XX]**
>
> Ta vare på koden. Du trenger den snart.

*⚠️ XX = 2-sifret kode TBD — bestemmes som del av kombinasjonslåskoden.*

---

## SELDA — 12 AVDELINGER

*(Samme struktur og rekkefølge som Sander. Interaktive steg er identiske. Trivia-innhold er alderstilpasset.)*

---

### Avdeling 1 — Saksmappe: Påske & Krim (trivia, 6 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva heter Påskeharens assistent i dette oppdraget? | Piip | Tekst |
| 2 | Hva er din detektivtittel? | Sporhunden | Tekst |
| 3 | Hva heter hunden på hytten? | Odin | Tekst |
| 4 | Hva er typisk å gjøre i påsken i Norge? | Finne påskeegg / gå på ski | Flervalg: Finne påskeegg / Bade i havet / Feire nyttår / Gå i toga |
| 5 | Hva heter fjellstedet dere er på ferie? | Kvitfjell | Tekst |
| 6 | Hvilken farge har en typisk påskekylling? | Gul | Flervalg: Gul / Grønn / Oransje / Lilla |

---

### Avdeling 2 — Utfordring: Memory (interaktiv)

*Identisk med Sanders — samme kort, samme mekanikk.*

---

### Avdeling 3 — Saksmappe: Minecraft & Roblox (trivia, 7 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva er Roblox sin valuta? | Robux | Tekst |
| 2 | Hva heter den grønne fienden som eksploderer i Minecraft? | Creeper | Flervalg: Creeper / Zombie / Spider / Skeleton |
| 3 | Hva lager du av 4 treplanker i Minecraft? | Crafting table | Flervalg: Crafting table / Seng / Dør / Kiste |
| 4 | Hva heter den hvite skjelett-fienden som skyter piler? | Skeleton | Flervalg: Skeleton / Zombie / Ghast / Creeper |
| 5 | Hva heter den store, mørke fienden med lange armer og lilla øyne? | Enderman | Flervalg: Enderman / Creeper / Ghast / Wither |
| 6 | Hva trenger du for å lage et sverd i Minecraft? | 2 blokker + 1 pinne | Flervalg: 2 blokker + 1 pinne / 3 blokker / 1 blokk + 2 pinner / 4 blokker |
| 7 | Hva er Roblox sin logo-farge? | Rød | Flervalg: Rød / Blå / Grønn / Gul |

---

### Avdeling 4 — Mini-spill: Fang påskeegg! 🥚

*Identisk med Sanders — samme spill, samme poengkrav.*

---

### Avdeling 5 — Saksmappe: Norsk & Verden (trivia, 6 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva heter Norges hovedstad? | Oslo | Tekst |
| 2 | Hva er den norske nasjonaldagen? | 17. mai | Tekst |
| 3 | Hva heter det høyeste fjellet i Norge? | Galdhøpiggen | Flervalg: Galdhøpiggen / Snøhetta / Glittertind / Dovre |
| 4 | Hva heter den lengste elven i verden? | Nilen | Tekst |
| 5 | Hva er hovedstaden i Sverige? | Stockholm | Tekst |
| 6 | Hva heter det vakre lysshowet på himmelen om vinteren i Nord-Norge? | Nordlys | Tekst |

---

### Avdeling 6 — Mini-spill: Fang Piip! 🐥

*Identisk med Sanders — samme spill, samme poengkrav.*

---

### Avdeling 7 — Saksmappe: Musikk (trivia, 6 spørsmål)

*Selda liker: KPop Demon Hunters (Netflix-film 2025, bandet heter HUNTR/X), Emma (Steinbakken), Carina Dahl, Zara Larsson, TIX (Ponyville)*

*Spotify-embed: iframe med 30-sekunders forhåndsvisning, ingen innlogging nødvendig. Format: `https://open.spotify.com/embed/track/[TRACK_ID]`*
*Track-ID "Soda Pop" (HUNTR/X): `02sy7FAs8dkDNYsHp4Ul3f` → embed: `https://open.spotify.com/embed/track/02sy7FAs8dkDNYsHp4Ul3f`*
*Track-ID Zara Larsson: `1rIKgCH4H52lrvDcz50hS8` → embed: `https://open.spotify.com/embed/track/1rIKgCH4H52lrvDcz50hS8`*
*Track-ID Emma Steinbakken: `2qLYadTIWJTXJuS8sTt7m8` → embed: `https://open.spotify.com/embed/track/2qLYadTIWJTXJuS8sTt7m8`*
*Track-ID TIX — Ponyville: `6jUzph9ZLcYCL6fVAgyELu` → embed: `https://open.spotify.com/embed/track/6jUzph9ZLcYCL6fVAgyELu`*

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | 🎵 *[Spotify-embed: "Soda Pop" — HUNTR/X fra KPop Demon Hunters]* Hva heter denne sangen? | Soda Pop | Tekst |
| 2 | KPop Demon Hunters er en animert Netflix-film. Hva heter bandet i filmen? | HUNTR/X (Huntrix) | Flervalg: HUNTR/X / BTS / BLACKPINK / Saja Boys |
| 3 | 🎵 *[Spotify-embed: Emma Steinbakken — velg en kjent sang]* Hvem synger denne sangen? | Emma / Emma Steinbakken | Tekst |
| 4 | 🎵 *[Spotify-embed: Zara Larsson]* Hvem synger denne sangen? | Zara Larsson | Tekst |
| 5 | 🎵 *[Spotify-embed: TIX — Ponyville]* Hva heter denne sangen? | Ponyville | Tekst |
| 6 | Hva heter TIX sitt artistnavn egentlig — er det et kallenavn eller hans ekte navn? | Kallenavn (han heter Andreas Haukeland) | Flervalg: Kallenavn / Ekte navn / Artistnavn fra plateselskap / Internettkallenavn |
| 7 | 🎵 *[Spotify-embed: "Ekstra liv" — FlippKlipp, track `1CEoLFXDBfRtcvS55Eaijl`]* Hva heter denne sangen? | Ekstra liv | Tekst |
| 8 | 🎵 *[Spotify-embed: "Lighter" — Kyle, track `0AMoopn68aGAAaJ9qFXPnX`]* Hvem synger denne sangen? | Kyle | Tekst |

---

### Avdeling 8 — Utfordring: Labyrint 🗺️

*Identisk med Sanders — samme labyrint og mekanikk.*

---

### Avdeling 9 — Saksmappe: Dyr & Natur (trivia, 6 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva er det største dyret i verden? | Blåhvalen | Flervalg: Elefant / Blåhval / Isbjørn / Hai |
| 2 | Hva heter det raskeste dyret på land? | Gepard | Flervalg: Løve / Gepard / Hest / Tiger |
| 3 | Hvor mange bein har en edderkopp? | 8 | Flervalg: 6 / 8 / 10 / 4 |
| 4 | Hva heter babyen til en kenguru? | Joey | Flervalg: Cub / Joey / Foal / Kit |
| 5 | Hva heter det når dyr sover hele vinteren? | Dvale | Tekst |
| 6 | Hva er det eneste pattedyret som kan fly? | Flaggermus | Flervalg: Flygende ekorn / Flaggermus / Papegøye / Pingvin |

---

### Avdeling 10 — Mini-spill: Bunny Jump 🐇

*Identisk med Sanders — samme spill, samme høydekrav.*

---

### Avdeling 11 — Saksmappe: Slang & Popkultur (trivia, 5 spørsmål)

| # | Spørsmål | Svar | Format |
|---|----------|------|--------|
| 1 | Hva betyr "sigma" i ungdomsslang? | Kul, selvsikker person | Flervalg: Kul og selvsikker / Redd og sjenert / Morsom / Slem |
| 2 | Hva heter toilet-karakteren fra YouTube? | Skibidi Toilet | Tekst |
| 3 | Hva er en "W" i gaming? | En seier | Flervalg: Seier / Tap / Uavgjort / Pause |
| 4 | Hva betyr "no cap"? | Ingen løgn | Flervalg: Ingen løgn / Ingen hatt / Ingen grunn / Aldri |
| 5 | Hva heter den grønne ogre-karakteren fra Dreamworks? | Shrek | Tekst |

---

### Avdeling 12 — Utfordring: Puslespill 🧩

*Identisk med Sanders — samme bilde (`assets/piip/piip_and_bunny.png`), ~30 uregelmessige biter.*

---

### Avdeling 13 — HEMMELIG MAPPE 🔍 *(låses kun av skjulte Easter eggs)*

Identisk mekanikk som Sanders — dukker opp uten forklaring når alle Seldas eggs er funnet.

*Innhold: ⚠️ TBD*
*Påkrevd for fullføring.*

**Seldas skjulte Easter eggs — plassering:**
*(6 stk, andre plasseringer enn Sanders)*
- 1 × gjemt i bakgrunnen på hubsiden (annet sted enn Sanders)
- 1 × skjult i musikk-seksjonen (f.eks. bak en Spotify-spiller)
- 1 × i memory-spillet (ett av kortene har et lite egg i hjørnet)
- 1 × i Fang påskeegg-minispillet (ett egg ser annerledes ut — har et lite ansikt)
- 1 × i puslespillet (gjemt langs kanten av bildet)
- 1 × på innloggingssiden etter at hun taster SELDA

---

### Fullføring — Selda

Når alle 13 avdelinger er grønne (inkl. hemmelig):

> **ACHIEVEMENT UNLOCKED: ALLE SAKER LØST 🏆**
>
> Sporhunden — du har bevist at du er Påskedetektivenes beste etterforsker.
> Her er din hemmelige kode: **[YY]**
>
> Ta vare på koden. Du trenger den snart.

*⚠️ YY = 2-sifret kode TBD.*

---

## SVEIN — `/agent`

Se **svein-sidespor.md** for fullstendig innhold.

**Sammendrag:**
- Innloggingskode: `SVEIN`
- Klassifisert tema (TOP SECRET-estetikk, mørkere palett)
- 6 trivia-grupper, låst sekvensielt — minst 4 av 5 riktige per gruppe
- Hver bestått gruppe avslører én bokstav: O-N-K-E-L-S
- Fullføring: kode **ONKELS** + bursdagsbrev til Svein

**Ruter:**
- `/agent` — innlogging + intro
- `/agent/gruppe/1` til `/agent/gruppe/6` — trivia-grupper
- `/agent/fullfort` — ferdig-side

### Skjulte Easter eggs — Svein

Samme opplegg som barna: skjulte klikk/trykkbare elementer spredt på Sveins sider. Ingen hint. Ingen teller. Når alle er funnet → **Gruppe 7: HEMMELIG ARKIVMAPPE** låses opp og er påkrevd for fullføring.

**Sveins skjulte Easter eggs — plassering:**
*(5 stk — litt færre enn barna, Svein har kortere løp)*
- 1 × på innloggingssiden (`/agent`) — gjemt i "KLASSIFISERT"-stempelet
- 1 × i trivia-gruppe 2 (Byggmesteren) — subtilt gjemt i bakgrunnen
- 1 × i trivia-gruppe 4 (Fjellmannen) — langs kanten av siden
- 1 × i trivia-gruppe 5 (Mysteriet om Agent Øransen) — bak et spørsmålstegn
- 1 × på fullføringsskjermen (`/agent/fullfort`) — etter ONKELS avsløres

**Gruppe 7 — HEMMELIG ARKIVMAPPE:**
*Innhold: ⚠️ TBD*
*Påkrevd for at Svein kan levere ONKELS-koden.*

---

## `/kombiner` — Kombiner alle koder

Alle tre løp må fullføres før jakten kan fortsette.

Siden viser fire inntastingsfelt:
1. **Sanders kode** (2 siffer — fra Detektivkontoret)
2. **Seldas kode** (2 siffer — fra Detektivkontoret)
3. **Sveins kode** (ONKELS — fra `/agent`)
4. **Hemmelig kodeord** (PÅSKEJAKT — satt sammen av bokstaver skjult på de fysiske bevis-elementene)

Når alle fire koder stemmer → Achievement-animasjon + redirect til `/minecraft`.

*Merknad: Kombiner-siden trenger ingen ventemekanisme i sanntid — barna fyller inn alle tre kodene manuelt når alle er klare.*

---

## `/minecraft` — Crafting-gåten

Et Minecraft-craftingbord vises på én delt enhet. Barna drar/klikker ingredienser inn i de riktige rutene i crafting-griddet (3×3).

**Delte ingredienser — ekte samarbeid:**
Siden vet hvilke barn som er pålogget (fra localStorage). Ingrediensene er fordelt:
- **Sanders ingredienser** (merket med grønn navnelapp): gulrot, pinne
- **Seldas ingredienser** (merket med gul navnelapp): hvit ull

Begge barns ingredienser vises på siden — men de må sitte sammen for å vite hva den andre har og bli enige om plasseringen. Ingen nettverkssynk nødvendig.

**Eksakt plassering (Minecraft-stil):**
```
[ ] [ull ] [ ]     ← rad 1
[ ] [pinne] [ ]    ← rad 2
[ ] [gulrot] [ ]   ← rad 3
```
Midtre kolonne, topp til bunn. Feil plassering gir ingen reaksjon — prøv igjen.

**Feil kombinasjon:** Ingen ting lages — prøv igjen.
**Riktig kombinasjon:** Animasjon + tekst:
> *"Bra craftet, detektiver! Neste spor er ute i snøen — se etter ballongene!"*

→ Barna går ut og popper ballonger (steg 13, fysisk).

---

## `/finale` — Den digitale finalen

Barna taster inn koden `VARDEN26` (hentet fra konvolutten i alpinbakken, steg 14).

**AI-video av Påskeharen spilles av.**
- Script: `assets/video-script.md`
- Verktøy: ElevenLabs (norsk stemme) + D-ID/HeyGen (leppesync)
- Bilde: portrett av Påskeharen rett frem (Firefly-generert)
- *⚠️ Video er ikke ferdig ennå — bygg inn en placeholder (f.eks. animert Piip-bilde med tekst) som kan byttes ut med ferdig video senere*

**Etter video:** Tekst på skjermen bekrefter gjemmestedet. Alle løper dit.

*⚠️ Gjemmestedet er ikke bestemt — "ved peisen" er foreløpig tekst men må endres. Skatten synes med en gang man kommer inn i hytta hvis den er der. Bestemmes senere og oppdateres i script + appens sluttekst.*

**Kombinasjonslåsen** på skattekisten åpnes med `4208` (Sander: 42, Selda: 08).

---

## DESIGN — VISUELL PROFIL

**Generell stil:** Minecraft achievement-estetikk
- Pixelfonter (f.eks. Press Start 2P eller Minecraft-font)
- Mørk bakgrunn med grønne/gule aksenter
- "ACHIEVEMENT UNLOCKED"-pop-ups ved fullføring av hver avdeling
- Piksel-ikoner for hvert kort i hubben

**Sveins `/agent`-sider:** Mørkere palett, røde "KLASSIFISERT"-stempler, dokumentestetikk over Minecraft-basen.

**Tilgjengelighet:** Stor nok tekst for 8-åring. Knapper store nok for touch. Testes på mobil.

---

## TEKNISKE NOTATER

- **Triviaspørsmål i egne datafiler** — alle spørsmål ligger i `src/data/sander-trivia.ts` og `src/data/selda-trivia.ts`, én array per avdeling. Spillogikken er helt adskilt fra innholdet, slik at spørsmål enkelt kan byttes ut uten å røre koden.
- **Tekstsvar** valideres case-insensitivt og med trimming (fjern mellomrom)
- **Fuzzy matching** for fritekst der flere svar godtas (f.eks. "Nilen" / "nilen" / "Nilen elv")
- **localStorage-nøkler:** én per barn per avdeling, f.eks. `sander_avdeling_3_complete: true`
- **Ingen backend** — alt kjører i nettleseren
- **Offline-fallback:** Siden bør caches med service worker slik at den fungerer ved midlertidig nettbortfall
- **QR-kode** fra bevisstavlen peker til forsiden `/` — barna taster inn koden selv

### ⚠️ Tekniske risikopunkter

- **Puslespill (avdeling 12):** ~30 uregelmessige jigsaw-biter er teknisk mer krevende enn et enkelt grid. Krever et dedikert bibliotek (f.eks. Jigsawify eller tilsvarende). **Må testes tidlig** — særlig drag-and-drop på mobilskjerm med touch. Fallback hvis biblioteket ikke fungerer godt nok på mobil: reduser til ~16 biter med enklere former.
- **Spotify-embed:** Avhenger av internettilkobling og at Spotify ikke blokkerer iframe på den aktuelle enheten. Test på iOS Safari spesielt — Spotify-embeds kan oppføre seg ulikt der.
- **AI-video (`/finale`):** Videofil må være liten nok til å laste raskt på mobilnett. Vurder å hoste videoen på samme Vercel/Netlify-instans fremfor ekstern lenke.

---

## IDÉBANK — Mini-spill til fremtidig bruk

*Disse ble vurdert men ikke valgt i denne omgang. Kan brukes hvis et eksisterende spill ikke fungerer, eller til fremtidige versjoner.*

| Spill | Beskrivelse | Mobil | Vanskelighet å bygge |
|-------|-------------|-------|----------------------|
| **Flappy Piip** | Flappy Bird-stil — trykk for å holde Piip i luften gjennom hindringer. Svært vanedannende, én-knapp på mobil. | ✅ Utmerket | Middels (krevende å balansere vanskelighetsgrad) |
| **Egg Breaker** | Breakout/Arkanoid — dra brett horisontalt, skyt ball opp for å knuse fargede påskeegg. Tilfredsstillende å fullføre. | ✅ God (touch-dra) | Middels |
| **Bubble Shooter** | Skyt fargede egg for å matche 3+. Svært populært for denne aldersgruppen. | ✅ Utmerket | Høy (geometri/trajektori) |
| **Egg Cannon** | Sikt og skyt egg på mål med vinkel/kraft. Kan ha påskekrim-tema. | ✅ God | Middels |
| **Snake** | Klassisk — voks ved å spise egg, unngå å bite deg selv. Tidløst konsept. | ⚠️ Touch-kontroller er frustrerende | Lav |
| **Tetris** | Fallende blokker — roter og plasser for å fylle rader. | ⚠️ Vanskelig på touch | Høy |
| **Prikk-til-prikk** | Koble nummererte prikker for å avsløre et bilde. *Droppet — vanskelig å generere gode bilder med riktig nummerering.* | ✅ God | Lav (men bildeproblematikk) |
