import { SongPart } from "../schema";
import { tone2index, index2tone, transposeTone } from "../util/transpose";
import { normalizeChord } from "../util/normalize-chord";

export class Chord extends SongPart {

  re_tone = /^[A-H][♯♭]?/i;
  re_bass_tone = /(?<=\/)[A-H][♯♭]?/i;

  chord: string;

  constructor(source: string) {
    super(source);
    this.chord = normalizeChord(source);
  }

  getTone() {
    const matches = this.chord.match(this.re_tone);
    return matches ? matches[0] : null;
  }

  setTone(newTone: string) {
    this.chord = this.chord.replace(this.re_tone, newTone);
  }

  getBassTone() {
    const matches = this.chord.match(this.re_bass_tone);
    return matches ? matches[0] : null;
  }
  setBassTone(newTone: string) {
    this.chord = this.chord.replace(this.re_bass_tone, newTone);
  }

  transpose(difference: number) {

    super.transpose(difference);

    const tone = this.getTone();
    if (tone) this.setTone(transposeTone(tone, difference));

    const bassTone = this.getBassTone();
    if (bassTone) this.setBassTone(transposeTone(bassTone, difference));

  }

  getName() {
    return `Chord (Chord: ${this.chord}, Tone: ${this.getTone()})`;
  }

  getChildren() {
    return [];
  }
}