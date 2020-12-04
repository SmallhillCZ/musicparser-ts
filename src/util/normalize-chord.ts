export function normalizeChord(chord: string): string {
  return [

    chord.substr(0, 1).toUpperCase(),

    chord.substr(1).replace(/^(?:es|s(?!us)|b)/, "♭").replace(/^is|#/, "♯")
  ].join("");
}

function superscriptNumber(number: string) {
  const numbers = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return number.split("").map(char => numbers.charAt(Number(char)));
}