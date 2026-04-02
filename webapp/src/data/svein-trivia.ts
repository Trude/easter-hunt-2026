import type { Question, TriviaSection } from './types';

// Sveins fødselsår: 4. april 1972 → fyller 54 i 2026. Verifisert ✅

export interface SveinGroup {
  id: number;
  title: string;
  icon: string;
  intro: string;
  letter: string;
  questions: Question[];
}

// Re-eksporter som TriviaSection-kompatibel type for gjenbruk
export const sveinGroups: SveinGroup[] = [
  {
    id: 1,
    title: 'Fotballhjerne',
    icon: '⚽',
    letter: 'R',
    intro: 'Arkivmappe #1: Agentens lojalitet til en engelsk klubb er godt dokumentert. Bevis din kunnskap.',
    questions: [
      {
        id: 11,
        question: 'Hvilket år vant Liverpool sin første Europacup for seriemestere?',
        format: 'multiple-choice',
        options: ['1973', '1977', '1981', '1984'],
        answer: '1977',
      },
      {
        id: 12,
        question: 'Hvem scoret det FØRSTE målet i den legendariske 3–0-seieren mot AC Milan i Istanbul 2005?',
        format: 'multiple-choice',
        options: ['Steven Gerrard', 'Michael Owen', 'Xabi Alonso', 'Vladimir Šmicer'],
        answer: 'Steven Gerrard',
      },
      {
        id: 13,
        question: 'Hva heter den berømte tribunen på Anfield som er kjent for atmosfæren?',
        format: 'multiple-choice',
        options: ['The Kop', 'The Stand', 'North End', 'The Reds End'],
        answer: 'The Kop',
      },
      {
        id: 14,
        question: 'Hva het Liverpools manager da de vant Champions League i 2005?',
        format: 'multiple-choice',
        options: ['Rafael Benítez', 'Gérard Houllier', 'Kenny Dalglish', 'Graeme Souness'],
        answer: 'Rafael Benítez',
      },
      {
        id: 15,
        question: 'Hva er teksten som henger over spillertunnelen på Anfield?',
        format: 'multiple-choice',
        options: ['"This Is Anfield"', '"You\'ll Never Walk Alone"', '"The Kop"', '"Liverpool FC"'],
        answer: '"This Is Anfield"',
      },
    ] as Question[],
  },
  {
    id: 2,
    title: 'Byggmesteren',
    icon: '🏗️',
    letter: 'G',
    intro: 'Arkivmappe #2: Den mistenkte har forbindelser til byggebransjen. Avhør pågår.',
    questions: [
      {
        id: 21,
        question: 'Hva er hovedbindemiddelet i betong?',
        format: 'multiple-choice',
        options: ['Sement', 'Sand', 'Grus', 'Stål'],
        answer: 'Sement',
      },
      {
        id: 22,
        question: 'Hva heter den kjemiske prosessen som gjør at betong herder?',
        format: 'multiple-choice',
        options: ['Hydratisering', 'Karbonisering', 'Oksidisering', 'Polymerisering'],
        answer: 'Hydratisering',
      },
      {
        id: 23,
        question: 'Hva kalles armeringsjern på fagspråk — hvilken symbol brukes foran diameteren?',
        format: 'multiple-choice',
        options: ['Ø', 'A', 'B', 'C'],
        answer: 'Ø',
      },
      {
        id: 24,
        question: 'Hva er den korrekte forklaringen på forskjellen mellom betong og sement?',
        format: 'multiple-choice',
        options: [
          'Sement er bindemiddelet; betong = sement + vann + tilslag',
          'Betong er finere enn sement',
          'Sement brukes ute, betong inne',
          'De er det samme, bare forskjellige navn',
        ],
        answer: 'Sement er bindemiddelet; betong = sement + vann + tilslag',
      },
      {
        id: 25,
        question: 'Hva kalles det når betong støpes på byggeplassen i stedet for å leveres ferdig?',
        format: 'multiple-choice',
        options: ['Plasstøpt', 'Prefabrikert', 'Ferdigblandet', 'Elementbetong'],
        answer: 'Plasstøpt',
      },
    ] as Question[],
  },
  {
    id: 3,
    title: 'Smaksdommeren',
    icon: '🥃',
    letter: 'O',
    intro: 'Arkivmappe #3: Agenten har kjent svakhet for visse væsker. Etterforsk.',
    questions: [
      {
        id: 31,
        question: 'Hva er hovedkrydderet som skiller norsk akevitt fra dansk?',
        format: 'multiple-choice',
        options: ['Karve (kummin)', 'Dill', 'Anis', 'Timian'],
        answer: 'Karve (kummin)',
      },
      {
        id: 32,
        question: 'Hva heter akevitt-typen som fraktes over ekvator i fat på skip?',
        format: 'multiple-choice',
        options: ['Linje Aquavit', 'Kors Aquavit', 'Havet Aquavit', 'Tur-retur Aquavit'],
        answer: 'Linje Aquavit',
      },
      {
        id: 33,
        question: 'Hva betyr "brut" på en flaske musserende vin?',
        format: 'multiple-choice',
        options: ['Svært tørr / lite restsukker', 'Søt', 'Halvtørr', 'Fruktig'],
        answer: 'Svært tørr / lite restsukker',
      },
      {
        id: 34,
        question: 'Crémant d\'Alsace er laget hovedsakelig av hvilken drue?',
        format: 'multiple-choice',
        options: ['Pinot Blanc', 'Chardonnay', 'Sauvignon Blanc', 'Gewürztraminer'],
        answer: 'Pinot Blanc',
      },
      {
        id: 35,
        question: 'Hva kalles prosessen der musserende vin gjærer direkte på flaske — den "tradisjonelle metoden"?',
        format: 'multiple-choice',
        options: ['Méthode traditionnelle', 'Charmat-metoden', 'Cava-metoden', 'Transfer-metoden'],
        answer: 'Méthode traditionnelle',
      },
    ] as Question[],
  },
  {
    id: 4,
    title: 'Fjellmannen',
    icon: '⛷️',
    letter: 'T',
    intro: 'Arkivmappe #4: Den mistenkte er observert i alpinbakken ved Varden. Kryss-sjekk kunnskapene.',
    questions: [
      {
        id: 41,
        question: 'I hvilket år ble Kvitfjell brukt som OL-arena?',
        format: 'multiple-choice',
        options: ['1992', '1994', '1998', '2002'],
        answer: '1994',
      },
      {
        id: 42,
        question: 'Hvilken alpin øvelse ble IKKE kjørt i Kvitfjell under OL — men i Hafjell?',
        format: 'multiple-choice',
        options: ['Slalåm', 'Utfor', 'Super-G', 'Storslalåm'],
        answer: 'Slalåm',
      },
      {
        id: 43,
        question: 'Hvem vant herrenes utfor i Kvitfjell under OL 1994?',
        format: 'multiple-choice',
        options: ['Tommy Moe', 'Kjetil André Aamodt', 'Luc Alphand', 'Paul Accola'],
        answer: 'Tommy Moe',
      },
      {
        id: 44,
        question: 'Hva heter det norske alpine landslaget sin uoffisielle betegnelse?',
        format: 'multiple-choice',
        options: ['Attacking Vikings', 'Norwegian Eagles', 'Alpine Wolves', 'Viking Raiders'],
        answer: 'Attacking Vikings',
      },
      {
        id: 45,
        question: 'Hvilket land har vunnet flest olympiske gullmedaljer i alpint totalt (t.o.m. 2022)?',
        format: 'multiple-choice',
        options: ['Østerrike', 'Sveits', 'Norge', 'USA'],
        answer: 'Østerrike',
      },
    ] as Question[],
  },
  {
    id: 5,
    title: 'Mysteriet om Agent Øransen',
    icon: '🔎',
    letter: 'U',
    intro: 'Arkivmappe #5: ADVARSEL — denne mappen inneholder opplysninger om deg, Agent. Påskeharens arkiv hadde en fil på DEG. Bekreft eller avkreft.',
    questions: [
      {
        id: 51,
        question: 'Den mistenkte hevder å være daglig leder. Hva heter firmaet hans — FULLT navn?',
        format: 'text',
        answer: ['Betonmast Romerike', 'betonmast romerike'],
      },
      {
        id: 52,
        question: 'Den mistenkte har kjent svakhet for en engelsk fotballklubb. Hva er klubbens KALLENAVN (ikke bynavn)?',
        format: 'text',
        answer: ['The Reds', 'the reds'],
      },
      {
        id: 53,
        question: 'I henhold til våre kilder fyller agenten år i dag. Hvilket årstall er han født?',
        format: 'multiple-choice',
        options: ['1970', '1972', '1974', '1976'],
        answer: '1972',
      },
      {
        id: 54,
        question: 'Den mistenkte har en nevø og en niese. Hva heter de?',
        format: 'text',
        answer: ['Sander og Selda', 'Selda og Sander', 'sander og selda', 'selda og sander'],
      },
      {
        id: 55,
        question: 'Agenten fyller 54 år i dag. Omtrent hvor mange DAGER har han levd? (±500 dager)',
        format: 'multiple-choice',
        options: ['~16 500 dager', '~18 000 dager', '~19 700 dager', '~21 500 dager'],
        answer: '~19 700 dager',
      },
    ] as Question[],
  },
  {
    id: 6,
    title: 'Siste mappe — Oppdraget',
    icon: '📁',
    letter: 'L',
    intro: 'Arkivmappe #6: Du har kommet lenger enn noen annen agent. Siste sikkerhetskontroll. Dette er personlig.',
    questions: [
      {
        id: 61,
        question: 'Hva heter hunden som også er på oppdrag i dag?',
        format: 'text',
        answer: ['Odin', 'odin'],
      },
      {
        id: 62,
        question: 'Hvor er du akkurat nå? (Fjellområde)',
        format: 'multiple-choice',
        options: ['Kvitfjell', 'Hafjell', 'Lillehammer', 'Hemsedal'],
        answer: 'Kvitfjell',
      },
      {
        id: 63,
        question: 'Hva het påskekyllingen som rekrutterte deg til dette oppdraget?',
        format: 'text',
        answer: ['Piip', 'piip'],
      },
      {
        id: 64,
        question: 'Hva er ditt kodenavn?',
        format: 'multiple-choice',
        options: ['Agent Øransen', 'Agent Svein', 'Agent Betonmast', 'Agent Liverpool'],
        answer: 'Agent Øransen',
      },
      {
        id: 65,
        question: 'Hva er den viktigste datoen i dag — ifølge deg selv?',
        format: 'text',
        answer: ['bursdagen min', 'bursdagen', 'bursdag', 'min bursdag', 'fødselsdagen min', 'fødselsdagen'],
      },
    ] as Question[],
  },
];

// Flat TriviaSection-format for kompatibilitet (ikke brukt av Agent-sidene direkte)
export function sveinGroupAsSection(group: SveinGroup): TriviaSection {
  return {
    id: group.id,
    title: group.title,
    icon: group.icon,
    questions: group.questions,
  };
}
