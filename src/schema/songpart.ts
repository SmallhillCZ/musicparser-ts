export abstract class SongPart {


  constructor(public source: string) {
  }

  abstract getChildren(): SongPart[];

  getAllChildren(): SongPart[] {
    return [
      ...this.getChildren(),
      ...this.getChildren().map(child => child.getAllChildren()).reduce((acc, cur) => [...acc, ...cur], [])
    ];
  };

  transpose(difference: number): void {
    return this.getChildren().forEach(child => child.transpose(difference));
  }

  autoNumber(i: number = 0): number {
    this.getChildren().forEach(child => {
      i = child.autoNumber(i);
    });
    return i;
  }

  abstract getName(): string;

}