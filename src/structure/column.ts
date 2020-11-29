import { SongPart } from "../schema";
import { Verse } from "./verse";

export class Column extends SongPart {

  re_verse = /^(?:(?:(\d+|#)(\.)|(\S+)(\:))(?:\n|))/m;

  verses: Verse[];

  constructor(source: string) {
    super(source);

    this.verses = this.createVerses(source);
  }

  createVerses(source: string): Verse[] {

    const sourceParts = source.split(this.re_verse);

    const verses: Verse[] = [];

    if (sourceParts.length) {
      const source = sourceParts.shift()!; // cannot be undefined is length > 0
      if (source.trim().length > 0) verses.push(new Verse(source, null, null));
    }

    while (sourceParts.length) {
      const [label1, separator1, label2, separator2, source] = sourceParts.splice(0, 5);
      verses.push(new Verse(source, label1 || label2, separator1 || separator2));
    }

    return verses;
  }


  getName() {
    return "Column";
  }

  getChildren() {
    return this.verses;
  }
}