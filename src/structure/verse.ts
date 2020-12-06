import { SongPart } from "../schema/songpart";
import { VerseContent } from "./verse-content";

export class Verse extends SongPart {

  private re_right = /^\-{2,}>/;
  private re_chorus = /(^r$|^rf|^ref|^chorus|^®)/i;
  private re_autolabel = /#/;

  public right = false;

  public content: VerseContent;

  public isChorus: boolean;

  constructor(source: string, public label: string | null, public separator: string | null) {

    super(source);

    if (this.re_right.test(source)) {
      this.right = true;
      source = source.replace(this.re_right, "");
    }

    this.content = new VerseContent(source);

    this.isChorus = label ? this.re_chorus.test(label) : false;
  }

  getName() {
    return this.isChorus ? `Chorus (${this.label || ""}${this.separator || ""})` : `Verse (${this.label || ""}${this.separator || ""})`;
  }

  getChildren() {
    return [this.content];
  }

  autoNumber(i: number): number {

    if (this.label && this.re_autolabel.test(this.label)) {
      i++;
      this.label = this.label.replace(this.re_autolabel, String(i));
    }
    return i;
  }

}