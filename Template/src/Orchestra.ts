import { map, merge, mergeMap, Observable, Subject, takeUntil } from "rxjs";
import { GuitarPlayer } from "./guitarPlayer";

export class Orchestra {
  private daveMustaine = new GuitarPlayer();
  private jamesHetfield = new GuitarPlayer();

  private playSubject = new Subject<void>();
  private stopSubject = new Subject<void>();

  private music: Observable<string>;

  constructor() {
    const song$ = merge(
      this.daveMustaine.listenToMePlay().pipe(map((n) => n + " - Dave")),
      this.jamesHetfield.listenToMePlay().pipe(map((n) => n + " - James"))
    );
    this.music = this.playSubject.pipe(
      mergeMap(() => song$.pipe(takeUntil(this.stopSubject)))
    );
  }

  getMusic() {
    return this.music;
  }
  public play() {
    this.playSubject.next();
  }
  public stop() {
    this.stopSubject.next();
  }
}
