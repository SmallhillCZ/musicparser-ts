import { SongPart } from "../schema";
import { ChordLine } from "./chord-line";
import { TextPart } from "./text-part";
import { Diagram } from "./diagram";

export class TextLine extends SongPart {

  re_chord = /\[[^\[\]\n]+?\]/;
  re_diagram = /\[\[[^ ]+ (?:[\dx]{6}|(?:\d\d|xx){6})\]\]/;

  children: (TextPart | ChordLine | Diagram)[] = [];

  constructor(source: string) {
    super(source);

    this.children = this.parseText(source);
  }

  parseText(source: string): (TextPart | ChordLine | Diagram)[] {

    const children: (TextPart | ChordLine | Diagram)[] = [];

    const regexps = [this.re_chord, this.re_diagram];
    const regexpMerged = new RegExp(`(?:${regexps.map(reg => `(${reg.source})`).join("|")})`, "gm");

    let match: RegExpExecArray | null;
    let lastIndex: number = 0;

    while (match = regexpMerged.exec(source)) {
      const [partSource, chord, diagram] = match;

      // preceding text
      const preText = source.substring(lastIndex, match.index);
      if (preText) children.push(new TextPart(preText));

      // current token
      if (chord) children.push(new ChordLine(partSource));
      if (diagram) children.push(new Diagram(partSource));

      lastIndex = match.index + partSource.length;
    }

    // add remaining text
    if (source.substring(lastIndex)) children.push(new TextPart(source.substring(lastIndex)));

    return children;
  }

  getName() {
    return `Text Line`;
  }

  getChildren() {
    return this.children;
  }

}