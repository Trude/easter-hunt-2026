import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { sveinGroups } from '../data/svein-trivia';
import { validateAnswer } from '../lib/validate-answer';
import AchievementPopup from '../components/ui/AchievementPopup';

const MIN_CORRECT = 4;

type AnswerState = 'unanswered' | 'correct' | 'wrong';

interface Result {
  idx: number;
  state: AnswerState;
}

export default function AgentGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const game = useGame();

  const group = sveinGroups.find(g => g.id === parseInt(groupId || '1'));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [showResult, setShowResult] = useState(false);
  const [groupDone, setGroupDone] = useState(false);
  const [achievement, setAchievement] = useState(false);

  const alreadyDone = group ? game.isDeptComplete('svein', group.id) : false;

  const handleRetry = useCallback(() => {
    setCurrentIdx(0);
    setResults([]);
    setSelectedOption(null);
    setTextInput('');
    setAnswerState('unanswered');
    setShowResult(false);
    setGroupDone(false);
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    if (!group) return;
    const q = group.questions[currentIdx];
    const correct = validateAnswer(answer, q.answer as string | string[]);
    const state: AnswerState = correct ? 'correct' : 'wrong';
    setAnswerState(state);
    setShowResult(true);

    const newResults = [...results, { idx: currentIdx, state }];
    setResults(newResults);

    setTimeout(() => {
      if (currentIdx === group.questions.length - 1) {
        setGroupDone(true);
      } else {
        setCurrentIdx(i => i + 1);
        setSelectedOption(null);
        setTextInput('');
        setAnswerState('unanswered');
        setShowResult(false);
      }
    }, 1500);
  }, [group, currentIdx, results]);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-red-400 text-xs">Ukjent gruppe</p>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div className="min-h-screen bg-mc-dark px-4 py-8 max-w-lg mx-auto flex flex-col items-center gap-6 text-center">
        <div className="text-4xl">{group.icon}</div>
        <p className="font-pixel text-mc-green text-xs">✅ MAPPE #{group.id} ALLEREDE DEKRYPTERT</p>
        <div className="border border-mc-yellow rounded p-4">
          <p className="font-pixel text-gray-400 text-xs mb-2">BOKSTAV AVSLØRT:</p>
          <p className="font-pixel text-mc-yellow text-4xl">{group.letter}</p>
        </div>
        <button
          onClick={() => navigate('/agent')}
          className="font-pixel text-gray-400 text-xs"
        >
          ← TILBAKE
        </button>
      </div>
    );
  }

  const correctCount = results.filter(r => r.state === 'correct').length;
  const passed = correctCount >= MIN_CORRECT;

  if (groupDone) {
    if (passed && !game.isDeptComplete('svein', group.id)) {
      game.completeDept('svein', group.id);
    }

    return (
      <div className="min-h-screen bg-mc-dark px-4 py-8 max-w-lg mx-auto flex flex-col items-center gap-6 text-center">
        <AchievementPopup
          show={achievement}
          title="ARKIVMAPPE DEKRYPTERT 🔓"
          description={`Bokstav avslørt: ${group.letter}`}
          onDone={() => { setAchievement(false); navigate('/agent'); }}
        />

        <div className="border-2 border-red-700 bg-black/50 rounded px-4 py-1">
          <p className="font-pixel text-red-500 text-xs tracking-widest">KLASSIFISERT</p>
        </div>

        <div className="text-4xl">{group.icon}</div>

        {passed ? (
          <>
            <p className="font-pixel text-mc-green text-xs">
              {correctCount}/5 RIKTIGE — MAPPE DEKRYPTERT
            </p>
            <div className="border-2 border-mc-yellow rounded p-6">
              <p className="font-pixel text-gray-400 text-xs mb-2">BOKSTAV AVSLØRT:</p>
              <p className="font-pixel text-mc-yellow text-5xl">{group.letter}</p>
            </div>
            <button
              onClick={() => setAchievement(true)}
              className="bg-mc-green text-white font-pixel text-xs py-3 px-8 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
            >
              FORTSETT →
            </button>
          </>
        ) : (
          <>
            <p className="font-pixel text-red-400 text-xs leading-relaxed">
              AVVIST — {correctCount}/5 riktige.
              <br /><br />
              Du trenger minst {MIN_CORRECT}. Prøv igjen, Agent.
            </p>
            <div className="text-left w-full max-w-sm space-y-2">
              {results.map((r, i) => (
                <div key={i} className={`text-xs flex items-center gap-2 font-pixel ${r.state === 'correct' ? 'text-mc-green' : 'text-red-400'}`}>
                  <span>{r.state === 'correct' ? '✓' : '✗'}</span>
                  <span>Spørsmål {i + 1}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleRetry}
              className="bg-mc-yellow text-black font-pixel text-xs py-3 px-8 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
            >
              PRØV IGJEN
            </button>
          </>
        )}
      </div>
    );
  }

  const currentQuestion = group.questions[currentIdx];

  return (
    <div className="min-h-screen bg-mc-dark px-4 py-6 max-w-lg mx-auto">
      <AchievementPopup
        show={achievement}
        title="ARKIVMAPPE DEKRYPTERT 🔓"
        description={`Bokstav avslørt: ${group.letter}`}
        onDone={() => { setAchievement(false); navigate('/agent'); }}
      />

      {/* Tilbake */}
      <button
        onClick={() => navigate('/agent')}
        className="font-pixel text-xs text-gray-400 mb-6 flex items-center gap-2"
      >
        ← TILBAKE
      </button>

      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-block border border-red-700 bg-black/30 rounded px-3 py-0.5 mb-2">
          <p className="font-pixel text-red-500 text-xs">ARKIVMAPPE #{group.id}</p>
        </div>
        <div className="text-3xl mb-1">{group.icon}</div>
        <p className="font-pixel text-mc-yellow text-xs">{group.title.toUpperCase()}</p>
      </div>

      {/* Intro (kun ved første spørsmål) */}
      {currentIdx === 0 && !showResult && (
        <div className="border border-gray-700 rounded p-3 mb-4">
          <p className="font-pixel text-gray-400 text-xs leading-relaxed italic">
            {group.intro}
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="flex gap-1 justify-center mb-4">
        {group.questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentIdx
                ? results[i]?.state === 'correct' ? 'bg-mc-green' : 'bg-red-500'
                : i === currentIdx
                ? 'bg-mc-yellow'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      <p className="font-pixel text-gray-500 text-xs text-center mb-4">
        {currentIdx + 1}/{group.questions.length} · Trenger {MIN_CORRECT}/5 riktige
      </p>

      {/* Spørsmål */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col gap-4"
        >
          <p className="font-pixel text-white text-xs leading-relaxed text-center px-2">
            {currentQuestion.question}
          </p>

          {/* Multiple choice */}
          {currentQuestion.format === 'multiple-choice' && (
            <div className="flex flex-col gap-2">
              {(currentQuestion as any).options.map((option: string) => {
                const isSelected = selectedOption === option;
                const correctAnswer = (currentQuestion as any).answer;
                let btnClass = 'bg-black/30 border border-gray-600 text-gray-300';
                if (showResult && isSelected) {
                  btnClass = answerState === 'correct'
                    ? 'bg-mc-green/20 border-mc-green text-white'
                    : 'bg-red-900/40 border-red-600 text-white';
                }
                if (showResult && option === correctAnswer && answerState === 'wrong') {
                  btnClass = 'bg-mc-green/20 border-mc-green text-white';
                }
                return (
                  <button
                    key={option}
                    disabled={showResult}
                    onClick={() => { setSelectedOption(option); handleAnswer(option); }}
                    className={`${btnClass} font-pixel text-xs py-3 px-4 rounded text-left transition-colors disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Text input */}
          {currentQuestion.format === 'text' && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && textInput.trim() && !showResult) handleAnswer(textInput.trim()); }}
                disabled={showResult}
                placeholder="Skriv svaret her..."
                className={`bg-black/30 border rounded px-3 py-3 font-pixel text-xs text-white placeholder-gray-600 outline-none focus:border-mc-yellow disabled:opacity-60 ${
                  showResult
                    ? answerState === 'correct' ? 'border-mc-green' : 'border-red-600'
                    : 'border-gray-600'
                }`}
              />
              {/* Svaret vises IKKE ved feil — Svein må finne ut selv */}
              {showResult && (
                <div className={`font-pixel text-xs text-center ${answerState === 'correct' ? 'text-mc-green' : 'text-red-400'}`}>
                  {answerState === 'correct' ? '✓ Riktig!' : '✗ Feil svar'}
                </div>
              )}
              {!showResult && (
                <button
                  onClick={() => { if (textInput.trim()) handleAnswer(textInput.trim()); }}
                  disabled={!textInput.trim()}
                  className="bg-mc-yellow text-black font-pixel text-xs py-3 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 disabled:opacity-40"
                >
                  SVAR
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
