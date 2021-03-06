import { Exporter, SongPart } from "../schema";

import { createDiagram } from "./html/createDiagram";
import { Song, Section, Column, Verse, Tab, Text, TextPart, ChordLine, Diagram, Chord, TabLine, TextLine } from "../structure";
import { ETXTBSY } from "constants";
import { VerseContent } from "../structure/verse-content";

export class HtmlExporter implements Exporter {

  document: Document;

  constructor(customDocument?: Document) {
    if (customDocument) this.document = customDocument;
    else if (window?.document) this.document = window?.document;
    else throw new Error("DOM document must be either present in window namespace or provided in HtmlExporter constructor");
  }

  export(part: SongPart): HTMLElement {
    if (part instanceof Song) return this.exportSong(part);
    else if (part instanceof Section) return this.exportSection(part);
    else if (part instanceof Column) return this.exportColumn(part);
    else if (part instanceof Verse) return this.exportVerse(part);
    else if (part instanceof VerseContent) return this.exportVerseContent(part);
    else if (part instanceof Tab) return this.exportTab(part);
    else if (part instanceof TabLine) return this.exportTabLine(part);
    else if (part instanceof Text) return this.exportText(part);
    else if (part instanceof TextLine) return this.exportTextLine(part);
    else if (part instanceof ChordLine) return this.exportChordLine(part);
    else if (part instanceof Diagram) return this.exportDiagram(part);
    else if (part instanceof Chord) return this.exportChord(part);
    // else if (part instanceof TextPart) return this.exportTextPart(part); // globalThis.Text is a private property wont compile
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
    if (verse.right) el.classList.add("right");

    if (verse.label) {
      const label = this.document.createElement("div");
      label.classList.add("label");
      label.textContent = `${verse.label}${verse.separator}`;
      el.appendChild(label);
    }

    verse.getChildren().forEach(child => el.appendChild(this.exportVerseContent(child)));

    return el;
  }

  private exportVerseContent(content: VerseContent) {
    const el = this.document.createElement("div");
    el.classList.add("content");

    content.getChildren().forEach(child => {
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

    const hasChords = text.getChildren().filter(item => item instanceof ChordLine).length > 0;
    if (hasChords) el.classList.add("has-chords");

    const hasText = text.getChildren().filter(item => item instanceof TextPart).length > 0;
    if (hasText) el.classList.add("has-text");

    const children = text.getChildren().slice();
    let child: SongPart | undefined;

    while (child = children.shift()) {

      if (child instanceof ChordLine) {
        if (hasText) el.appendChild(this.createLinePart(child, !child.separator && children[0] instanceof TextPart ? <TextPart>children.shift() : undefined));
        else el.appendChild(this.exportChordLine(child));
      }

      else if (child instanceof TextPart) {
        if (hasChords) el.appendChild(this.createLinePart(undefined, child));
        else el.appendChild(this.exportTextPart(child));
      }

      else if (child instanceof Diagram) el.appendChild(this.exportDiagram(child));
    }

    return el;
  }

  private createLinePart(chordLine?: ChordLine, textPart?: TextPart) {
    const groupEl = this.document.createElement("span");
    groupEl.classList.add("line-part");
    groupEl.style.display = "inline-block";
    groupEl.appendChild(chordLine ? this.exportChordLine(chordLine) : this.document.createTextNode("\u00A0"));
    groupEl.appendChild(this.document.createElement("br"));
    groupEl.appendChild(textPart ? this.exportTextPart(textPart) : this.document.createTextNode("\u00A0"));
    return groupEl;
  }

  private exportTextPart(textpart: TextPart) {
    const el = this.document.createElement("span");
    el.classList.add("text-part");
    el.textContent = textpart.source;
    return el;
  }

  private exportChordLine(chordgroup: ChordLine) {
    const el = this.document.createElement("span");
    el.classList.add("chord-line");
    if (chordgroup.separator) el.classList.add("separated");

    chordgroup.getChildren().forEach(child => {
      if (child instanceof Chord) el.appendChild(this.exportChord(child));
      else if (child instanceof TextPart) el.appendChild(this.exportTextPart(child));
    });

    el.appendChild(this.document.createTextNode("\u00A0"));

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

  private exportOther(part: SongPart) {
    const el = this.document.createElement("span");
    el.textContent = part.source;
    return el;
  }

}