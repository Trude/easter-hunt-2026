export function validateAnswer(userInput: string, correctAnswer: string | string[]): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?]/g, '');

  const answers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
  const normalized = normalize(userInput);

  return answers.some(answer => {
    const norm = normalize(answer);
    // Eksakt match
    if (normalized === norm) return true;
    // Numeriske svar — godta med eller uten mellomrom, komma vs punktum
    const numNorm = (s: string) => s.replace(',', '.').replace(/\s/g, '');
    if (numNorm(normalized) === numNorm(norm)) return true;
    return false;
  });
}
