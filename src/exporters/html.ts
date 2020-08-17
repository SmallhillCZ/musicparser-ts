import { Exporter, SongPart } from "../schema";

import { createDiagram } from "./html/createDiagram";
import { Song, Section, Column, Verse, Tab, Text, TextPart, ChordGroup, Diagram, Chord, TabLine, TextLine } from "../structure";

export class HtmlExporter implements Exporter {

  document: Document;

  constructor(customDocument?: Document) {
    if (customDocument) this.document = customDocument;
    else if (window?.document) this.document = window?.document;
    else throw new Error("DOM document is must be either present in window namespace or provided in HtmlExporter constructor");
  }

  export(part: SongPart): HTMLElement {
    if (part instanceof Song) return this.exportSong(part);
    else if (part instanceof Section) return this.exportSection(part);
    else if (part instanceof Column) return this.exportColumn(part);
    else if (part instanceof Verse) return this.exportVerse(part);
    else if (part instanceof Tab) return this.exportTab(part);
    else if (part instanceof TabLine) return this.exportTabLine(part);
    else if (part instanceof Text) return this.exportText(part);
    else if (part instanceof TextLine) return this.exportTextLine(part);
    else if (part instanceof ChordGroup) return this.exportChordGroup(part);
    else if (part instanceof Diagram) return this.exportDiagram(part);
    else if (part instanceof Chord) return this.exportChord(part);
    else if (part instanceof TextPart) return this.exportTextPart(part);
    else return this.exportOther(part);
  }

  private exportSong(song: Song) {
    const el = this.document.createElement("div");
    el.classList.add("song");

    song.getChildren().forEach(section => el.appendChild(this.exportSection(section)));

    return el;
  }

  private exportSection(section: Section) {
    const el = this.document.createElement("div");
    el.classList.add("section");
    section.getChildren().forEach((column, i) => el.appendChild(this.exportColumn(column)));
    return el;
  }

  private exportColumn(column: Column) {
    const el = this.document.createElement("div");
    el.classList.add("column");
    column.getChildren().forEach(verse => el.appendChild(this.exportVerse(verse)));
    return el;
  }

  private exportVerse(verse: Verse) {
    const el = this.document.createElement("div");
    el.classList.add("verse");
    if (verse.isChorus) el.classList.add("chorus");

    if (verse.label) {
      const label = this.document.createElement("div");
      label.classList.add("label");
      label.textContent = `${verse.label}${verse.separator}`;
      el.appendChild(label);
    }

    verse.getChildren().forEach(child => {
      if (child instanceof Tab) el.appendChild(this.exportTab(child));
      else if (child instanceof Text) el.appendChild(this.exportText(child));
    });
    return el;
  }

  private exportTab(tab: Tab) {
    const el = this.document.createElement("div");
    el.classList.add("tab");
    tab.getChildren().forEach((child, i) => el.appendChild(this.exportTabLine(child)));
    return el;
  }

  private exportTabLine(tab: TabLine) {
    const el = this.document.createElement("div");
    el.classList.add("tab-line");
    el.textContent = tab.source;
    return el;
  }

  private exportText(text: Text) {
    const el = this.document.createElement("div");
    el.classList.add("text");

    text.getChildren().forEach((child, i) => el.appendChild(this.exportTextLine(child)));

    return el;
  }

  private exportTextLine(text: TextLine) {
    const el = this.document.createElement("div");
    el.classList.add("text-line");

    text.getChildren().forEach(child => {
      if (child instanceof ChordGroup) el.appendChild(this.exportChordGroup(child));
      else if (child instanceof Diagram) el.appendChild(this.exportDiagram(child));
      else if (child instanceof TextPart) el.appendChild(this.exportTextPart(child));
    });

    return el;
  }

  private exportTextPart(textpart: TextPart) {
    const el = this.document.createElement("span");
    el.classList.add("text-part");
    el.textContent = textpart.source;
    return el;
  }

  private exportChordGroup(chordgroup: ChordGroup) {
    const el = this.document.createElement("span");
    el.classList.add("chordgroup");
    if (chordgroup.separator) el.classList.add("separated");

    chordgroup.getChildren().forEach(chord => el.appendChild(this.exportChord(chord)));

    return el;
  }

  private exportDiagram(diagram: Diagram) {
    const el = this.document.createElement("span");
    el.classList.add("diagram");

    const tones = diagram.getTones();
    if (tones) el.innerHTML = createDiagram(diagram.chord, tones); // TODO: create diagram using DOM API
    else el.textContent = diagram.source;

    return el;
  }

  private exportChord(chord: Chord) {
    const el = this.document.createElement("span");
    el.classList.add("chord");
    el.textContent = chord.chord;
    return el;
  }

  exportOther(part: SongPart) {
    const el = this.document.createElement("span");
    el.textContent = part.source;
    return el;
  }

}