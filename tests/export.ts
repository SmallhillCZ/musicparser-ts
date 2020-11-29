import { Chord, Song, HtmlExporter, DebugExporter } from "..";
import { testSong, testSongHTML } from "./assets/song";
import { hasUncaughtExceptionCaptureCallback } from "process";

describe("Exports of song", () => {

  const song = new Song(testSong);

  test("Debug", () => {
    const exporter = new DebugExporter();
    const output = exporter.export(song);
    expect(output).toEqual(`Song
  - Section
    - Column
      - Verse ()
        - VerseContent
          - Text
            - Text Line
              - ChordGroup
                - Chord (Chord: C, Tone: C)
    - Column
      - Verse (3.)
        - VerseContent
          - Text
            - Text Line
              - TextPart (Source: Third )
              - ChordGroup
                - Chord (Chord: D, Tone: D)
              - TextPart (Source: verse...)
      - Chorus (R:)
        - VerseContent
          - Text
            - Text Line
              - TextPart (Source: Chorussssssss...)
          - Text
            - Text Line
              - Diagram (Chord: C, Code: x32010)
          - Tab
            - Tab Line (Source: e|---1--2--)`);
  });

  test("HTML", () => {

    const exporter = new HtmlExporter();
    const output = exporter.export(song);

    expect(output.outerHTML).toEqual(testSongHTML);
  });
});
