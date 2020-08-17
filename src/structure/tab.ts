import { SongPart } from "../schema";
import { TabLine } from "./tab-line";

export class Tab extends SongPart {

  children: TabLine[] = [];

  constructor(source: string) {
    super(source);

    this.children = source.split(/\r?\n/g).map(line => new TabLine(line));
  }

  getName() {
    return `Tab`;
  }

  getChildren() {
    return this.children;
  }

}