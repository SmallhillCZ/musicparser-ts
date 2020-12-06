import { Chord } from "..";

describe("Chords: Simple chord", () => {
  const chord = new Chord("Cmaj");
  
  test("getTone", () => {
    expect(chord.getTone()).toEqual("C");
  });

  test("getBassTone", () => {
    expect(chord.getBassTone()).toEqual(null);
  });
});

describe("Chords: Combined chord", () => {
  const chord = new Chord("Cmaj/G");

  test("getTone", () => {
    expect(chord.getTone()).toEqual("C");
  });

  test("getBassTone", () => {
    expect(chord.getBassTone()).toEqual("G");
  });

  test("transpose", () => {
    chord.transpose(2);
    expect(chord.getTone()).toEqual("D");
    expect(chord.getBassTone()).toEqual("A");
  });



});