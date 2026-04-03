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
    title: 'Musikk',
    icon: '🎵',
    questions: [
      { id: 1, format: 'text', question: 'Hva heter denne sangen?', answer: ['Give That Wolf a Banana', 'Give that wolf a banana'], spotify: '50Cf2eYv8zT3v2HAkwhIiL' },
      { id: 2, format: 'text', question: 'Hvem synger denne sangen?', answer: ['Tommy Cash', 'Tommy cash'], spotify: '4f5sxA4nQywcBlU05Ixdc7' },
      { id: 3, format: 'text', question: 'Hva heter denne sangen?', answer: ['Cha Cha Cha', 'Cha cha cha'], spotify: '7wnrrEdwxQWZsDjW7rGZZc' },
      { id: 4, format: 'text', question: 'Hva heter denne sangen?', answer: ['Grevling i taket', 'Grevling I Taket'], spotify: '0XyPunztpCUh9Uh6D4OoAh' },
      { id: 5, format: 'text', question: 'Hvem synger denne sangen?', answer: ['DJ MøMø', 'DJ Mømo', 'dj mømo'], spotify: '5F8c71PbayLIedqmjskrhM' },
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
  13: {
    id: 13,
    title: 'Hemmelig Mappe',
    icon: '🔍',
    questions: [
      { id: 1, format: 'multiple-choice', question: 'Hva heter Påskeharens lille gule assistent?', options: ['Piip', 'Tweety', 'Odin', 'Kyllingen'], answer: 'Piip' },
      { id: 2, format: 'multiple-choice', question: 'Hva heter hemmelighetsmappen som Kodeknekkeren låste opp?', options: ['Hemmelig Mappe', 'Detektivarkivet', 'Påskemappa', 'Sporloggen'], answer: 'Hemmelig Mappe' },
      { id: 3, format: 'multiple-choice', question: 'Hva er ditt hemmelige agentnavn?', options: ['Kodeknekkeren', 'Sporhunden', 'Agent Øransen', 'Detektiven'], answer: 'Kodeknekkeren' },
      { id: 4, format: 'multiple-choice', question: 'Hva er Seldas hemmelige agentnavn?', options: ['Sporhunden', 'Kodeknekkeren', 'Agent Piip', 'Superdetektiven'], answer: 'Sporhunden' },
      { id: 5, format: 'multiple-choice', question: 'Det finnes en hemmelige agenten til som dere snart trenger hjelp av, finne ut hvem det er. Hva er agentnavnet tildenne personen?', options: ['Agent Øransen', 'En mystisk fremmed', 'Påskeharen selv', 'Piip'], answer: 'Agent Øransen' },
    ],
  },
};
