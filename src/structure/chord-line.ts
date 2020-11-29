import { SongPart } from "../schema";
import { Chord } from "./chord";
import { TextPart } from "./text-part";

export class ChordLine extends SongPart {

  re_chords = /^\[([^\|]+)(\|?)\]$/;
  re_chord = /[a-hA-H][^,\s]*/g;

  children: (TextPart | Chord)[] = [];

  separator: boolean = false;

  constructor(source: string) {
    super(source);

    const contentMatch = this.re_chords.exec(source);

    if (contentMatch) {

      if (contentMatch[2]) this.separator = true;

      let match: RegExpExecArray | null;
      let content = contentMatch[1];
      let lastIndex: number = 0;


      while (match = this.re_chord.exec(content)) {
        const partSource = match[0];

        // preceding text
        const preText = content.substring(lastIndex, match.index);
        if (preText) this.children.push(new TextPart(preText));

        // current token
        this.children.push(new Chord(partSource));

        lastIndex = match.index + partSource.length;
      }

      // add remaining text
      if (content.substring(lastIndex)) this.children.push(new TextPart(content.substring(lastIndex)));
    }

  }

  getName() {
    return "ChordGroup";
  }

  getChildren() {
    return this.children;
  }
}