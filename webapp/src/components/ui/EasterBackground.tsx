// Fixed, animated Easter decoration layer — sits behind all page content

const ITEMS = [
  // emoji, left%, animClass, delay(s), size(rem), duration(s)
  { e: '🥚', l: 5,  a: 'easter-float',  d: 0,   s: 1.6, dur: 6  },
  { e: '🐣', l: 15, a: 'easter-sway',   d: 1.2, s: 1.4, dur: 7  },
  { e: '🌸', l: 25, a: 'easter-float',  d: 2.5, s: 1.8, dur: 5  },
  { e: '🥚', l: 35, a: 'easter-spin',   d: 0.5, s: 1.2, dur: 8  },
  { e: '🌷', l: 45, a: 'easter-sway',   d: 3.0, s: 2.0, dur: 6  },
  { e: '🐇', l: 55, a: 'easter-bounce', d: 1.5, s: 1.6, dur: 5  },
  { e: '🌼', l: 65, a: 'easter-float',  d: 0.8, s: 1.4, dur: 7  },
  { e: '🥚', l: 75, a: 'easter-sway',   d: 2.0, s: 1.8, dur: 6  },
  { e: '🐥', l: 85, a: 'easter-bounce', d: 3.5, s: 1.5, dur: 5  },
  { e: '🌸', l: 92, a: 'easter-spin',   d: 1.0, s: 1.2, dur: 9  },
  // second layer, different vertical positions
  { e: '🌷', l: 8,  a: 'easter-bounce', d: 4.0, s: 1.3, dur: 6  },
  { e: '🐇', l: 20, a: 'easter-float',  d: 1.8, s: 1.6, dur: 8  },
  { e: '🥚', l: 30, a: 'easter-sway',   d: 0.3, s: 1.4, dur: 7  },
  { e: '🌼', l: 50, a: 'easter-spin',   d: 2.2, s: 1.2, dur: 10 },
  { e: '🐣', l: 70, a: 'easter-float',  d: 3.8, s: 1.5, dur: 6  },
  { e: '🌸', l: 80, a: 'easter-sway',   d: 0.6, s: 1.8, dur: 7  },
  { e: '🥚', l: 95, a: 'easter-bounce', d: 2.8, s: 1.3, dur: 5  },
];

// Spread items vertically across the full page height
const TOP_POSITIONS = [
  '4%', '12%', '20%', '28%', '36%', '44%', '52%', '60%', '68%', '76%',
  '84%', '92%', '8%', '24%', '40%', '56%', '72%',
];

export default function EasterBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className={item.a}
          style={{
            position: 'absolute',
            left: `${item.l}%`,
            top: TOP_POSITIONS[i],
            fontSize: `${item.s}rem`,
            animationDelay: `${item.d}s`,
            animationDuration: `${item.dur}s`,
            opacity: 0.18,
            userSelect: 'none',
          }}
        >
          {item.e}
        </span>
      ))}
    </div>
  );
}
