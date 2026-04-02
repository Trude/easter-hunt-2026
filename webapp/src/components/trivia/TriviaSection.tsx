import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TriviaSection as TriviaSectionType } from '../../data/types';
import { validateAnswer } from '../../lib/validate-answer';
import SpotifyEmbed from './SpotifyEmbed';

interface Props {
  section: TriviaSectionType;
  onComplete: () => void;
}

type AnswerState = 'unanswered' | 'correct' | 'wrong';

interface QuestionResult {
  questionId: number;
  state: AnswerState;
  userAnswer: string;
}

export default function TriviaSection({ section, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [showResult, setShowResult] = useState(false);
  const [sectionDone, setSectionDone] = useState(false);

  const currentQuestion = section.questions[currentIndex];
  const isLastQuestion = currentIndex === section.questions.length - 1;

  // Shuffle options so correct answer isn't always in the same position
  const shuffledOptions = useMemo(() => {
    const opts = (currentQuestion as any).options as string[] | undefined;
    if (!opts) return [];
    return [...opts].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    const correct = validateAnswer(answer, currentQuestion.answer as string | string[]);
    const state: AnswerState = correct ? 'correct' : 'wrong';
    setAnswerState(state);
    setShowResult(true);

    const newResults = [...results, { questionId: currentQuestion.id, state, userAnswer: answer }];
    setResults(newResults);

    setTimeout(() => {
      if (isLastQuestion) {
        setSectionDone(true);
      } else {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setTextInput('');
        setAnswerState('unanswered');
        setShowResult(false);
      }
    }, 1800);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setResults([]);
    setSelectedOption(null);
    setTextInput('');
    setAnswerState('unanswered');
    setShowResult(false);
    setSectionDone(false);
  };

  const allCorrect = results.length > 0 && results.every(r => r.state === 'correct');

  if (sectionDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-6 text-center"
      >
        {allCorrect ? (
          <>
            <div className="text-6xl">🏆</div>
            <p className="font-pixel text-mc-green text-sm leading-relaxed">
              ALLE SVAR RIKTIGE!
            </p>
            <button
              onClick={onComplete}
              className="bg-mc-green text-white font-pixel text-xs px-6 py-3 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
            >
              FORTSETT →
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl">❌</div>
            <p className="font-pixel text-red-400 text-xs leading-relaxed">
              {results.filter(r => r.state === 'wrong').length} feil svar.
              <br /><br />
              Du må ta hele mappen på nytt.
            </p>
            <div className="text-left w-full max-w-sm space-y-2">
              {results.map((r, i) => (
                <div key={r.questionId} className={`text-xs flex items-start gap-2 ${r.state === 'correct' ? 'text-mc-green' : 'text-red-400'}`}>
                  <span>{r.state === 'correct' ? '✓' : '✗'}</span>
                  <span>Spørsmål {i + 1}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleRetry}
              className="bg-mc-yellow text-black font-pixel text-xs px-6 py-3 rounded border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
            >
              PRØV IGJEN
            </button>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Progress */}
      <div className="flex gap-1 justify-center">
        {section.questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentIndex
                ? results[i]?.state === 'correct' ? 'bg-mc-green' : 'bg-red-500'
                : i === currentIndex
                ? 'bg-mc-yellow'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Spørsmål */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col gap-4"
        >
          {/* Spotify embed */}
          {currentQuestion.spotify && (
            <SpotifyEmbed trackId={currentQuestion.spotify} />
          )}

          <p className="font-pixel text-gray-800 text-xs leading-relaxed text-center px-2">
            {currentQuestion.question}
          </p>

          {/* Multiple choice */}
          {currentQuestion.format === 'multiple-choice' && (
            <div className="grid grid-cols-1 gap-2">
              {shuffledOptions.map((option: string) => {
                const isSelected = selectedOption === option;
                const correctAnswer = (currentQuestion as any).answer;
                let btnClass = 'bg-yellow-50 border border-gray-300 text-gray-700';
                if (showResult && isSelected) {
                  btnClass = answerState === 'correct'
                    ? 'bg-mc-green border-mc-green text-white'
                    : 'bg-red-700 border-red-500 text-white';
                }
                if (showResult && option === correctAnswer && answerState === 'wrong') {
                  btnClass = 'bg-mc-green border-mc-green text-white';
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
                className={`bg-yellow-50 border rounded px-3 py-3 font-pixel text-xs text-gray-800 placeholder-gray-500 outline-none focus:border-mc-yellow disabled:opacity-60 ${
                  showResult
                    ? answerState === 'correct' ? 'border-mc-green' : 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {showResult && answerState === 'wrong' && (
                <p className="text-mc-green font-pixel text-xs text-center">
                  Riktig svar: {Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer}
                </p>
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
              {showResult && (
                <div className={`font-pixel text-xs text-center ${answerState === 'correct' ? 'text-mc-green' : 'text-red-400'}`}>
                  {answerState === 'correct' ? '✓ Riktig!' : '✗ Feil'}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
