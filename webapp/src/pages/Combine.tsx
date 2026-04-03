import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';

const CORRECT = {
  sander: 'PÅSKESPOREREN',
  selda: 'PÅSKEBEVISENE',
  svein: 'GULROT',
  kodeord: 'PÅSKEJAKT',
};

export default function Combine() {
  const navigate = useNavigate();

  const [sander, setSander] = useState('');
  const [selda, setSelda] = useState('');
  const [svein, setSvein] = useState('');
  const [kodeord, setKodeord] = useState('');
  const [error, setError] = useState(false);

  if (storage.isKombinerDone()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 text-center">
        <div className="text-5xl">✅</div>
        <p className="font-pixel text-mc-green text-xs leading-relaxed">
          KOMBINER ALLEREDE FULLFØRT
        </p>
        <button
          onClick={() => navigate('/finale')}
          className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
        >
          GÅ TIL FINALEN →
        </button>
      </div>
    );
  }

  const normalize = (s: string) => s.trim().toUpperCase().replace(/\s/g, '');

  const handleSubmit = () => {
    const ok =
      normalize(sander) === CORRECT.sander &&
      normalize(selda) === CORRECT.selda &&
      normalize(svein) === CORRECT.svein &&
      normalize(kodeord) === CORRECT.kodeord;

    if (ok) {
      storage.setKombinerDone();
      navigate('/finale');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const fields = [
    {
      label: 'SANDERS KODEORD',
      icon: '🔍',
      value: sander,
      set: setSander,
      hint: '13 bokstaver',
      inputMode: 'text' as const,
    },
    {
      label: 'SELDAS KODEORD',
      icon: '🐾',
      value: selda,
      set: setSelda,
      hint: '13 bokstaver',
      inputMode: 'text' as const,
    },
    {
      label: 'SVEINS KODEORD',
      icon: '🍊',
      value: svein,
      set: setSvein,
      hint: '6 bokstaver',
      inputMode: 'text' as const,
    },
    {
      label: 'HEMMELIG KODEORD',
      icon: '🔑',
      value: kodeord,
      set: setKodeord,
      hint: '9 bokstaver — finn det på bevisene',
      inputMode: 'text' as const,
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* Tilbake */}
      <button
        onClick={() => navigate(-1)}
        className="font-pixel text-xs text-gray-600 mb-6 flex items-center gap-2"
      >
        ← TILBAKE
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔒</div>
        <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-xl px-5 py-2 mb-2">
          <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
            KOMBINER KODENE
          </h1>
        </div>
        <p className="font-pixel text-gray-600 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
          Alle tre agenter legger inn kodeordene sine, pluss det hemmelige kodeordet fra bevisene.
        </p>
      </div>

      {/* Input-felt */}
      <div className="flex flex-col gap-4 mb-6">
        {fields.map(f => (
          <div key={f.label} className="flex flex-col gap-1">
            <label className="font-pixel text-purple-600 text-xs flex items-center gap-2">
              {f.icon} {f.label}
            </label>
            <input
              type="text"
              inputMode={f.inputMode}
              value={f.value}
              onChange={e => f.set(e.target.value)}
              placeholder={f.hint}
              className="bg-yellow-50 border-2 border-yellow-200 rounded px-3 py-3 font-pixel text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-yellow-400"
            />
          </div>
        ))}
      </div>

      {/* Feil-melding */}
      {error && (
        <div className="border border-red-600 rounded p-3 mb-4 text-center">
          <p className="font-pixel text-red-400 text-xs leading-relaxed">
            ✗ En eller flere kodeord er feil. Sjekk igjen.
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!sander || !selda || !svein || !kodeord}
        className="w-full bg-mc-green text-white font-pixel text-xs py-4 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        LÅS OPP →
      </button>

      <p className="font-pixel text-gray-600 text-xs text-center mt-4 leading-relaxed">
        Finn kodeordene ved å sette sammen bokstavene dere fikk i avdelingene.
      </p>
    </div>
  );
}
