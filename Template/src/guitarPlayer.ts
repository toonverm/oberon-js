import {
  catchError,
  concat,
  concatMap,
  delay,
  map,
  Observable,
  of,
  range,
  share,
  take,
  timer,
} from "rxjs";

export class GuitarPlayer {
  private songOne = ["A", "D", "G"];
  private songTwo = ["G", "B", "E"];
  private play: Observable<string>;
  constructor() {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    const playTwoSong$ = concat(songOne$, songTwo$).pipe(delay(1000));
    this.play = range(1, 1000).pipe(
      share(),
      concatMap((i) =>
        playTwoSong$.pipe(
          map((n) => {
            return n + (i + 1);
          })
        )
      )
    );
  }

  public playSong(notes: string[]): Observable<string> {
    return timer(0, 1000).pipe(
      take(notes.length),
      map((i) => {
        if (Math.random() > 0.8) {
          throw new Error("I broke my guitar string");
        }
        return notes[i];
      }),
      catchError((err, caught) => {
        console.log(err);
        return concat(of("kapot"), this.playSong(notes));
      })
    );
  }

  public listenToMePlay(): Observable<string> {
    return this.play;
  }
}
