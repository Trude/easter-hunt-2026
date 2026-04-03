import { useNavigate } from 'react-router-dom';
import DepartmentCard from '../components/ui/DepartmentCard';

const DEPT_META = [
  { id: 1,  title: 'Memory',               icon: '🃏' },
  { id: 2,  title: 'Fang påskeegg!',       icon: '🥚' },
  { id: 3,  title: 'Fang Piip!',           icon: '🐥' },
  { id: 4,  title: 'Labyrint',             icon: '🗺️' },
  { id: 5,  title: 'Gulvet er lava',       icon: '🌋' },
  { id: 6,  title: 'Puslespill',           icon: '🧩' },
  { id: 7,  title: 'Påsken & Tradisjoner', icon: '🐣' },
  { id: 8,  title: 'Film & Serier',        icon: '🎬' },
  { id: 9,  title: 'Norsk Historie',       icon: '🏔️' },
  { id: 10, title: 'Mat & Drikke',         icon: '🍷' },
  { id: 11, title: 'Sport & Idrett',       icon: '⚽' },
  { id: 12, title: 'Verden & Geografi',    icon: '🌍' },
];

export default function VoksneHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto relative">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-2xl mb-3 select-none">🐇🥚🌸</div>
        <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-xl px-5 py-2 mb-2 shadow-sm shadow-yellow-200">
          <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
            VOKSENKONTORET
          </h1>
        </div>
        <div className="inline-block bg-purple-100 border border-purple-300 rounded px-3 py-1 mt-1">
          <p className="font-pixel text-purple-600 text-xs">KODE: PÅSKEHAREN</p>
        </div>
        <p className="font-pixel text-gray-500 text-xs mt-2 leading-relaxed">
          Alle seksjoner er åpne — bare for gøy!
        </p>
      </div>

      {/* Tilbake */}
      <button
        onClick={() => navigate('/')}
        className="font-pixel text-xs text-gray-500 mb-5 flex items-center gap-1 underline decoration-dotted"
      >
        ← TILBAKE TIL START
      </button>

      {/* Avdelingskort */}
      <div className="grid grid-cols-2 gap-3">
        {DEPT_META.map(dept => (
          <DepartmentCard
            key={dept.id}
            id={dept.id}
            title={dept.title}
            icon={dept.icon}
            status="active"
            onClick={() => navigate(`/voksne/${dept.id}`)}
          />
        ))}
      </div>

      <p className="font-pixel text-purple-400 text-xs text-center mt-6">
        Ingen poeng, ingen kode — bare påskekos 🐣
      </p>
    </div>
  );
}
