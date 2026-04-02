import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';

const CORRECT = {
  sander: '42',
  selda: '08',
  svein: 'ONKELS',
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
          onClick={() => navigate('/minecraft')}
          className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
        >
          GÅ TIL MINECRAFT →
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
      normalize(kodeord) === normalize(CORRECT.kodeord);

    if (ok) {
      storage.setKombinerDone();
      navigate('/minecraft');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const fields = [
    {
      label: 'SANDERSS KODE',
      icon: '🔢',
      value: sander,
      set: setSander,
      hint: '2 siffer',
      inputMode: 'numeric' as const,
    },
    {
      label: 'SELDAS KODE',
      icon: '🔢',
      value: selda,
      set: setSelda,
      hint: '2 siffer',
      inputMode: 'numeric' as const,
    },
    {
      label: 'SVEINS KODE',
      icon: '🔐',
      value: svein,
      set: setSvein,
      hint: '6 bokstaver',
      inputMode: 'text' as const,
    },
    {
      label: 'HEMMELIG KODEORD',
      icon: '🅿️',
      value: kodeord,
      set: setKodeord,
      hint: '9 bokstaver — finn det på bevisene',
      inputMode: 'text' as const,
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔒</div>
        <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-xl px-5 py-2 mb-2">
          <h1 className="font-pixel text-mc-yellow text-xs leading-relaxed">
            KOMBINER KODENE
          </h1>
        </div>
        <p className="font-pixel text-gray-600 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
          Alle tre agenter må legge inn kodene sine, pluss det hemmelige kodeordet.
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
              type={f.inputMode === 'numeric' ? 'tel' : 'text'}
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
            ✗ En eller flere koder er feil. Sjekk igjen.
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
        Kodeordet finner dere ved å kombinere bokstavene på de fysiske bevisene
      </p>
    </div>
  );
}
