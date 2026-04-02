import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function Puzzle({ onComplete }: Props) {
  const [solved, setSolved] = useState(false);

  const handleSolved = () => {
    setSolved(true);
    setTimeout(onComplete, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-pixel text-xs text-gray-600 text-center leading-relaxed">
        Sett sammen bildet av Piip og Påskeharen! 🧩
      </p>

      <div className="w-full max-w-sm rounded-lg overflow-hidden border-2 border-mc-yellow">
        <JigsawPuzzle
          imageSrc="/assets/piip/piip_and_bunny.png"
          rows={5}
          columns={6}
          onSolved={handleSolved}
        />
      </div>

      {solved && (
        <p className="font-pixel text-mc-green text-xs text-center">
          🎉 Bildet er ferdig!
        </p>
      )}

      <p className="font-pixel text-xs text-gray-600 text-center leading-relaxed">
        Dra bitene på plass
      </p>
    </div>
  );
}
