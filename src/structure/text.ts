import { SongPart } from "../schema";
import { TextLine } from "./text-line";

export class Text extends SongPart {

  children: TextLine[] = [];

  constructor(source: string) {
    super(source);

    this.children = source.split(/\r?\n/g).map(line => new TextLine(line));
  }

  getName() {
    return `Text`;
  }

  getChildren() {
    return this.children;
  }

}