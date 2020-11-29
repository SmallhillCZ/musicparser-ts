import { SongPart } from "../schema/songpart";
import { Tab } from "./tab";
import { Text } from "./text";

export class VerseContent extends SongPart {

  re_tab = /^[a-hA-H ]?\|/;

  children: (Text | Tab)[];

  constructor(source: string) {

    super(source);

    this.children = this.source
      .split(/\n\s*\n/)
      .map(blockSource => blockSource.trim())
      .filter(blockSource => blockSource.length > 0)
      .map(blockSource => {
        if (blockSource.match(this.re_tab)) return new Tab(blockSource);
        else return new Text(blockSource);
      })

  }

  getName() {
    return `VerseContent`;
  }

  getChildren() {
    return this.children;
  }

}