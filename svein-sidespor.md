# Sveins Sidespor — "Agent Øransen"
## Bursdags-påskekrim for den erfarne detektiven

---

## KONTEKST

**Hvem:** Svein, 50+ år, onkel til Sander og Selda
**Profil:** Daglig leder Betonmast Romerike. Liverpool-supporter. Glad i alpint, aquavit, crémant og er nevenyttig. Veldig dyktig på trivia.
**Bursdag:** Samme dag som påskejakten
**Varighet:** Ca. 1 time
**Tone:** Påskekrim-ramme med bursdagsvri — personlige referanser, humor og en dose ydmykelse
**Kobling til barnas løp:** Uavhengig inntil et naturlig samlingspunkt mot slutten, der alle trenger hverandre for finalen

---

## KONSEPT

Piip (påskekyllingen, Påskeharens assistent) har et eget oppdrag til Svein — et som er "for vanskelig for barna." Svein er rekruttert som **Agent Øransen** (hemmelig kodenavn, en vri på "oransje" som kobler til barnas oransje flagg-ledetråd senere). Han mottar et forseglet kuvert merket **KLASSIFISERT — KUN FOR AGENT ØRANSEN**.

Oppdraget: Påskeharens **hemmelige arkiv** er kryptert bak 6 trivia-grupper i webappen. Svein må knekke alle 6 for å låse opp sin del av finalen. Uten hans kode kommer ingen videre.

**Twisten:** Trivia-gruppene avslører gradvis at "etterforskningen" handler om Svein selv — det er hans liv som er mysteriet. Siste gruppe avslører at det hele er en bursdagshyllest.

---

## DIGITAL FLYT — WEBAPP

Sveins løp kjøres i **samme webapp** som barnas. Han logger inn med koden **SVEIN** på en egen side (`/agent`).

### Spillmekanikk

- **6 trivia-grupper**, hver med 5 spørsmål
- **Krav:** Minst **4 av 5 riktige** for å låse opp neste gruppe
- **Feil:** Ved færre enn 4 riktige → "AVVIST — Prøv igjen, Agent" — samme spørsmål, ny sjanse
- **Progresjon:** Etter hver bestått gruppe avslører appen én bokstav (til sammen 6 bokstaver → koden **ONKELS**)
- **Fullført:** Når alle 6 grupper er bestått, viser appen: "Agent Øransen — oppdraget er fullført. Møt barna ved peisen."

### Gate-mekanikk — felles finale

Finalesiden i appen (`/finale`) krever at **ALLE tre** har fullført:
- Sander ✅ (sin quiz + kode)
- Selda ✅ (sin quiz + kode)
- Svein ✅ (alle 6 trivia-grupper)

Først når alle tre er i mål, låses finalen opp. Appen viser en "venteskjerm" for den som er ferdig først: *"Venter på de andre agentene…"* med en progress-indikator.

---

## WEBAPP — SIDESTRUKTUR (tillegg til hovedplanen)

| Side | Innhold |
|------|---------|
| /agent | Sveins innlogging (kode: SVEIN) |
| /agent/gruppe/1–6 | Trivia-gruppene, låst sekvensielt |
| /agent/fullfort | Ferdig-side med kode + bursdagsbrev |

**Design:** Samme Minecraft-achievement-estetikk som barnas sider, men med et "KLASSIFISERT"-tema oppå — stemplede dokumenter, røde "TOP SECRET"-stempler, mørkere fargepalett.

---

## STEG 0 — Rekrutteringen *(Fysisk — samtidig med barnas Steg 1)*

Svein finner et forseglet kuvert på kaffekoppen sin (eller i kjøleskapet ved crémant-flaskene). Innhold:

> **KLASSIFISERT**
> Agent Øransen — du er aktivert.
>
> Barna tror de er de eneste detektivene. De tar feil.
> Påskeharen hadde et hemmelig arkiv — 6 låste mapper med kritisk informasjon.
> Bare en erfaren agent kan dekryptere dem.
>
> Gå til [URL] og tast inn koden SVEIN.
> Du har 60 minutter.
>
> Lykke til — og gratulerer med dagen, Agent.
>
> /Piip

---

## TRIVIA-GRUPPENE

### GRUPPE 1 — "Fotballhjerne"

Intro-tekst i appen: *"Arkivmappe #1: Agentens lojalitet til en engelsk klubb er godt dokumentert. Bevis din kunnskap."*

| # | Spørsmål | Riktig svar | Kommentar |
|---|----------|-------------|-----------|
| 1 | Hvilket år vant Liverpool sin første Europaliga-tittel (den gang Europacupen)? | 1973 (UEFA-cupen) eller 1977 (Europacupen for seriemestere) | Triksspørsmål — avhenger av tolkning. Godta 1977. |
| 2 | Hvem scoret det FØRSTE målet i Istanbul-comebacket 2005? | Steven Gerrard | |
| 3 | Hva heter tribunen bak det ene målet på Anfield som er mest kjent for atmosfæren? | The Kop | |
| 4 | Hva het Liverpools manager som vant Champions League i 2005? | Rafael Benítez | |
| 5 | Hva er teksten som står over spillertunnelen på Anfield? | "This Is Anfield" | Mange svarer YNWA — men det er på portene, ikke tunnelen. |

**Ved bestått → bokstav: O**

---

### GRUPPE 2 — "Byggmesteren"

Intro-tekst: *"Arkivmappe #2: Den mistenkte har forbindelser til byggebransjen. Avhør pågår."*

| # | Spørsmål | Riktig svar | Kommentar |
|---|----------|-------------|-----------|
| 1 | Hva er hovedbindemiddelet i betong? | Sement (Portland-sement) | |
| 2 | Hva heter den kjemiske prosessen som gjør at betong herder? | Hydratisering (hydrasjon) | |
| 3 | Hva kalles armeringsjern på fagspråk med én bokstav + tall? | Ø (+ diameter, f.eks. Ø12) | Godta "Ø" alene |
| 4 | Hva er forskjellen mellom betong og sement? | Sement er bindemiddelet; betong = sement + vann + tilslag (sand/grus) | Godta rimelig forklaring |
| 5 | Hva kalles det når betong støpes på byggeplassen i stedet for å leveres ferdig? | Plasstøpt (betong) | |

**Ved bestått → bokstav: N**

---

### GRUPPE 3 — "Smaksdommeren"

Intro-tekst: *"Arkivmappe #3: Agenten har kjent svakhet for visse væsker. Etterforsk."*

| # | Spørsmål | Riktig svar | Kommentar |
|---|----------|-------------|-----------|
| 1 | Hva er hovedkrydderet som skiller norsk akevitt fra dansk? | Karve (kummin) | Dansk bruker dill. |
| 2 | Hva heter akevitt-typen som fraktes over ekvator i fat på skip? | Linje Aquavit | |
| 3 | Hva betyr "brut" på en flaske musserende vin? | Tørr / svært lite restsukker | |
| 4 | Crémant d'Alsace er laget hovedsakelig av hvilken drue? | Pinot Blanc | Godta også Riesling/Pinot Gris |
| 5 | Hva kalles prosessen der musserende vin gjærer på flaske — den "tradisjonelle metoden"? | Méthode traditionnelle (Méthode champenoise) | |

**Ved bestått → bokstav: K**

---

### GRUPPE 4 — "Fjellmannen"

Intro-tekst: *"Arkivmappe #4: Den mistenkte er observert i alpinbakken ved Varden. Kryss-sjekk kunnskapene."*

| # | Spørsmål | Riktig svar | Kommentar |
|---|----------|-------------|-----------|
| 1 | I hvilket år ble Kvitfjell brukt som OL-arena? | 1994 | |
| 2 | Hvilken alpin øvelse ble IKKE kjørt i Kvitfjell under OL — slalåm, utfor, super-G eller storslalåm? | Slalåm (kjørt i Hafjell) | |
| 3 | Hvem vant herrenes utfor i Kvitfjell under OL 1994? | Tommy Moe (USA) | |
| 4 | Hva heter det norske alpine landslaget sin uoffisielle betegnelse? | Attacking Vikings | |
| 5 | Hvilket land har vunnet flest olympiske gullmedaljer i alpint totalt (t.o.m. 2022)? | Østerrike | |

**Ved bestått → bokstav: E**

---

### GRUPPE 5 — "Mysteriet om Agent Øransen"

Intro-tekst: *"Arkivmappe #5: ADVARSEL — denne mappen inneholder opplysninger om deg, Agent. Påskeharens arkiv hadde en fil på DEG. Bekreft eller avkreft."*

Her snur temaet. Spørsmålene handler om **Svein selv** — stilt som "etterforskningsspørsmål om den mistenkte." Svarene skrives i fritekstfelt.

| # | Spørsmål | Riktig svar | Kommentar |
|---|----------|-------------|-----------|
| 1 | Den mistenkte hevder å være daglig leder. Hva heter firmaet hans — FULLT navn? | Betonmast Romerike (godta rimelige varianter) | |
| 2 | Den mistenkte har en kjent svakhet for en engelsk fotballklubb. Hva er klubbens KALLENAVN (ikke byen)? | The Reds | Godta også "The Pool" |
| 3 | I henhold til våre kilder fyller agenten år i dag. Hvilket årstall er han født? | *(Tilpasses)* | |
| 4 | Den mistenkte har en nevø og en niese. Hva heter de? | Sander og Selda | |
| 5 | Agenten fyller [X] år i dag. Omtrent hvor mange DAGER har han levd? (±500 dager) | *(Regn ut: alder × 365)* | F.eks. 50 → ca. 18 250. Valider med toleranse. |

**Ved bestått → bokstav: L**

---

### GRUPPE 6 — "Siste mappe — Oppdraget"

Intro-tekst: *"Arkivmappe #6: Du har kommet lenger enn noen annen agent. Siste sikkerhetskontroll. Dette er personlig."*

| # | Spørsmål | Riktig svar | Kommentar |
|---|----------|-------------|-----------|
| 1 | Hva heter hunden som også er agent i dag? | Odin | |
| 2 | Hvor er du akkurat nå? (Fjellområde) | Kvitfjell | |
| 3 | Hva het påskekyllingen som rekrutterte deg? | Piip | Tester om han husker brevet |
| 4 | Hva er ditt kodenavn? | Agent Øransen | |
| 5 | Hva er den viktigste datoen i dag — ifølge deg selv? | Bursdagen min / Bursdagen hans | Godta alt som refererer til bursdag. Poenget er øyeblikket. |

**Ved bestått → bokstav: S**

---

## FULLFØRT-SKJERM

Når alle 6 grupper er bestått, viser appen:

> **KLASSIFISERT — DEKRYPTERT**
>
> Bokstavene dine: **O - N - K - E - L - S**
>
> Agent Øransen — oppdraget er fullført.
>
> Men det virkelige mysteriet var aldri Påskeharen.
> Det var hvordan noen klarer å bli [50+] og fortsatt tro at Liverpool vinner ligaen hvert år.
>
> Gratulerer med dagen, Svein.
>
> 🎂
>
> Barna trenger deg nå. Møt dem ved peisen.

---

## SAMLINGSPUNKT MED BARNAS LØP

Sveins løp er timet slik at han er ferdig omtrent når barna når **Steg 13 (SMS + kombinere koder)** i hovedplanen. Finalesiden i appen (`/finale`) krever at alle tre har fullført sine løp — Svein er den siste "nøkkelen."

Koden **ONKELS** kan brukes som:
- Et eget felt på `/finale`-siden som må fylles inn sammen med barnas kode VARDEN26
- Eller som koden til kombinasjonslåsen på skattekisten (som allerede er besluttet inn i hovedplanen)

---

## FYSISK SJEKKLISTE — SVEINS LØP

- [ ] 1 × forseglet kuvert "KLASSIFISERT" med URL + kode SVEIN (Steg 0)
- [ ] Valgfritt: liten gave/flaske gjemt ved peisen (avsløres i finalen)
- [ ] Sørg for at Svein har en mobil/nettbrett med god nettilgang

*(Resten er digitalt — ingen konvolutter eller arkivkort nødvendig!)*

**Ansvarlig for oppsettet:** Tommy, Trude eller Trine legger kuverten klar før Svein står opp. Samme person(er) som rigger barnas konvolutter kvelden før.

---

## PRODUKSJONSNOTATER

- **Trivia-spørsmålene bør kvalitetssjekkes** — spesielt Liverpool- og Betonmast-spørsmålene. Tilpass med oppdaterte fakta.
- **Personlige spørsmål i Gruppe 5** må fylles inn med ekte detaljer om Svein (fødselsår, bosted osv.).
- **Gruppe 5 bruker fritekstfelt** — appen trenger fuzzy matching / godkjenningslogikk for disse svarene. Alternativt: flervalg med lure alternativer.
- **Tidssynk med barnas løp:** Barnas individuelle klue-kjede (Steg 2–9, 8 stasjoner hver) tar ca. 40–50 min. Sveins 6 grupper à 5 spørsmål bør ta ca. 30–45 min med tenking + eventuelle nye forsøk. Pausen mellom barnas klue-kjede og felles-stegene (bevisstavle, digitalt detektivkontor) gir buffer.
- **Vanskelighetsgrad:** Spørsmålene er bevisst harde. Svein er god på trivia — ikke gjør det for lett. Triksspørsmål og presise tall er med vilje.
- **Retry-UX:** Når Svein feiler en gruppe, vis hvilke han fikk feil (men IKKE vis riktig svar) — han må finne ut selv. Achievement-popup ved bestått: "ARKIVMAPPE DEKRYPTERT 🔓"

---

## TONE-GUIDE

Språket i appen skal føles som om han er rekruttert av en etterretningsorganisasjon som ikke tar seg selv helt på alvor. Tenk: MI6 møter Kvikk Lunsj. Litt formelt, litt absurd, og med en undertone av "vi vet hvem du er, Agent."

Bursdagselementet bygges opp gradvis — de første gruppene handler om hobbyer og interesser uten å røpe at det handler om ham. Gruppe 5 snur alt på hodet. Gruppe 6 + fullført-skjermen lander det varmt.
