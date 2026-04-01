import type { TriviaSection } from './types';

export const sanderTrivia: Record<number, TriviaSection> = {
  1: {
    id: 1,
    title: 'Påske & Krim',
    icon: '🔍',
    questions: [
      { id: 1, format: 'text', question: 'Hva heter Påskeharens assistent i dette oppdraget?', answer: 'Piip' },
      { id: 2, format: 'text', question: 'Hva er din detektivtittel?', answer: 'Kodeknekkeren' },
      { id: 3, format: 'text', question: 'Hva heter hunden på hytten?', answer: 'Odin' },
      { id: 4, format: 'multiple-choice', question: 'Hva er det vanligste å finne inni et påskeegg?', options: ['Sjokolade', 'Gull', 'Sand', 'Stein'], answer: 'Sjokolade' },
      { id: 5, format: 'text', question: 'Hva heter fjellstedet dere er på ferie i?', answer: 'Kvitfjell' },
      { id: 6, format: 'multiple-choice', question: 'Hvilken fugl er typisk påskesymbol i Norge?', options: ['Kylling', 'Kråke', 'Pingvin', 'Papegøye'], answer: 'Kylling' },
    ],
  },
  3: {
    id: 3,
    title: 'Minecraft & Gaming',
    icon: '🎮',
    questions: [
      { id: 1, format: 'multiple-choice', question: 'Hvem laget Minecraft?', options: ['Notch', 'Steve', 'Herobrine', 'Jeb'], answer: 'Notch' },
      { id: 2, format: 'text', question: 'Hva heter den grønne fienden som eksploderer?', answer: 'Creeper' },
      { id: 3, format: 'multiple-choice', question: 'Hva heter dimensjonen der Ender Dragon bor?', options: ['The End', 'Nether', 'Overworld', 'Aether'], answer: 'The End' },
      { id: 4, format: 'text', question: 'Hva er Roblox sin valuta?', answer: 'Robux' },
      { id: 5, format: 'text', question: 'Hva heter den ildfylte dimensjonen i Minecraft?', answer: 'Nether' },
      { id: 6, format: 'multiple-choice', question: 'Hva er den hardeste naturlige blokken i Minecraft?', options: ['Bedrock', 'Obsidian', 'Diamond', 'Emerald'], answer: 'Bedrock' },
      { id: 7, format: 'multiple-choice', question: 'Hva heter det magiske bordet du bruker for å fortrølle gjenstander?', options: ['Enchantment table', 'Crafting table', 'Furnace', 'Anvil'], answer: 'Enchantment table' },
      { id: 8, format: 'multiple-choice', question: 'I hvilket år ble Minecraft offisielt lansert?', options: ['2009', '2011', '2013', '2015'], answer: '2011' },
    ],
  },
  5: {
    id: 5,
    title: 'Norsk & Verden',
    icon: '🌍',
    questions: [
      { id: 1, format: 'text', question: 'Hva heter den nasjonale dagen i Norge?', answer: ['17. mai', '17 mai', 'syttende mai'] },
      { id: 2, format: 'text', question: 'Hva er den lengste elven i verden?', answer: ['Nilen', 'Nile'] },
      { id: 3, format: 'multiple-choice', question: 'Hva heter det høyeste fjellet i Norge?', options: ['Galdhøpiggen', 'Snøhetta', 'Glittertind', 'Jotunheimen'], answer: 'Galdhøpiggen' },
      { id: 4, format: 'multiple-choice', question: 'Hva heter planeten som er nærmest solen?', options: ['Venus', 'Merkur', 'Mars', 'Jorda'], answer: 'Merkur' },
      { id: 5, format: 'text', question: 'Hva er hovedstaden i Frankrike?', answer: 'Paris' },
      { id: 6, format: 'multiple-choice', question: 'I hvilket år var det Vinter-OL på Kvitfjell?', options: ['1988', '1992', '1994', '1998'], answer: '1994' },
    ],
  },
  7: {
    id: 7,
    title: 'Sport',
    icon: '⚽',
    questions: [
      { id: 1, format: 'multiple-choice', question: 'Hva kalles ett slag under par på et hull i golf?', options: ['Eagle', 'Birdie', 'Bogey', 'Par'], answer: 'Birdie' },
      { id: 2, format: 'multiple-choice', question: 'Hva kalles to slag under par i golf?', options: ['Eagle', 'Birdie', 'Albatross', 'Hole-in-one'], answer: 'Eagle' },
      { id: 3, format: 'multiple-choice', question: 'Hva kalles ett slag over par i golf?', options: ['Eagle', 'Birdie', 'Bogey', 'Double'], answer: 'Bogey' },
      { id: 4, format: 'text', question: 'Hvor mange spillere er det på et fotballag på banen?', answer: ['11', 'elleve'] },
      { id: 5, format: 'text', question: 'Hva heter den øverste fotballdivisjonen i Norge?', answer: 'Eliteserien' },
      { id: 6, format: 'multiple-choice', question: 'Hvilken sport drives med i Kvitfjell-bakkene?', options: ['Alpint', 'Fotball', 'Tennis', 'Svømming'], answer: 'Alpint' },
    ],
  },
  9: {
    id: 9,
    title: 'Natur & Dyr',
    icon: '🐾',
    questions: [
      { id: 1, format: 'multiple-choice', question: 'Hva er det raskeste dyret på land?', options: ['Løve', 'Gepard', 'Hest', 'Tiger'], answer: 'Gepard' },
      { id: 2, format: 'multiple-choice', question: 'Hva er det største dyret i verden?', options: ['Elefant', 'Blåhval', 'Isbjørn', 'Hai'], answer: 'Blåhval' },
      { id: 3, format: 'text', question: 'Hva heter det når dyr sover hele vinteren?', answer: 'Dvale' },
      { id: 4, format: 'multiple-choice', question: 'Hva heter forvandlingsprosessen fra larve til sommerfugl?', options: ['Metamorfose', 'Hibernasjon', 'Migrasjon', 'Evolusjon'], answer: 'Metamorfose' },
      { id: 5, format: 'multiple-choice', question: 'Hva er det eneste pattedyret som kan fly?', options: ['Flygende ekorn', 'Flaggermus', 'Papegøye', 'Pingvin'], answer: 'Flaggermus' },
    ],
  },
  11: {
    id: 11,
    title: 'Slang & Popkultur',
    icon: '😎',
    questions: [
      { id: 1, format: 'multiple-choice', question: 'Hva betyr "sigma" i ungdomsslang?', options: ['Kul og selvsikker', 'Redd og sjenert', 'Morsom', 'Slem'], answer: 'Kul og selvsikker' },
      { id: 2, format: 'text', question: 'Hva heter toilet-karakteren fra YouTube?', answer: ['Skibidi Toilet', 'Skibidi toilet'] },
      { id: 3, format: 'multiple-choice', question: 'Hva er en "W" i gaming-slang?', options: ['Seier', 'Tap', 'Uavgjort', 'Pause'], answer: 'Seier' },
      { id: 4, format: 'multiple-choice', question: 'Hva betyr "no cap"?', options: ['Ingen løgn', 'Ingen hatt', 'Ingen grunn', 'Aldri'], answer: 'Ingen løgn' },
      { id: 5, format: 'multiple-choice', question: 'Hva betyr "NPC" i gaming?', options: ['Datakarakter', 'Spiller', 'Boss', 'Fiende'], answer: 'Datakarakter' },
    ],
  },
};
