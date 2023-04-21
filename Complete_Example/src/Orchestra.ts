import {
  catchError,
  interval,
  map,
  merge,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { GuitarPlayer } from "./guitarPlayer";

export class Orchestra {
  private playerOne = new GuitarPlayer();
  private playerTwo = new GuitarPlayer();

  private music: Observable<string>;
  private metronoom: Observable<number>;

  private playSubject = new Subject<void>();
  private stopSubject = new Subject<void>();

  constructor() {
    this.metronoom = this.playSubject.pipe(
      switchMap(() =>
        interval(500).pipe(
          //take the interval until the stopSubject emits a value
          //you need this on the inner observable not the outer because than you can no
          //longer start the playSubject again since it's "completed"
          takeUntil(this.stopSubject)
        )
      ),
      //share and replay the last value of the switchmapped playsubject
      //this prevents the metronoom from restarting when an error is caught and retried
      shareReplay(1)
    );
    // this.metronoom =     interval(500).pipe(share());
    // @RUBEN why is this needed
    // this.metronoom.subscribe((a) => console.log(a));
    this.music = this.buildMusic();
  }

  buildMusic(): Observable<string> {
    return merge(
      this.playerOne
        .listenToMePlay(this.metronoom)
        .pipe(map((n) => "PLAYER ONE: " + n)),
      this.playerTwo
        .listenToMePlay(this.metronoom)
        .pipe(map((n) => "PLAYER TWO: " + n))
    ).pipe(catchError((err, caught) => caught));
  }

  getMusic() {
    return this.music;
  }

  stop() {
    this.stopSubject.next();
  }

  play() {
    this.playSubject.next();
  }
}
