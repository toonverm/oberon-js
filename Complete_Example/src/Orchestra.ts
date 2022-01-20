import {GuitarPlayer} from "./guitarPlayer";
import {map, merge, mergeMap, Observable, Subject, takeUntil} from "rxjs";


export class Orchestra{

    private playerOne = new GuitarPlayer();
    private playerTwo = new GuitarPlayer();

    private music: Observable<string>;
    private playSubject = new Subject<void>();
    private stopSubject = new Subject<void>();

    constructor() {

        this.music =this.playSubject.pipe(
            mergeMap(() =>
                merge(
                    this.playerOne.listenToMePlay().pipe(map(n => "PLAYER ONE: " + n)),
                    this.playerTwo.listenToMePlay().pipe(map(n => "PLAYER TWO: " + n)),
                )
            ),
            takeUntil(this.stopSubject)
        )

        // this.music =
        //     this.playSubject.pipe(
        //         mergeMap(() =>
        //             merge(
        //                 this.playerOne.listenToMePlay().pipe(map(n => "player ONE:" + n)),
        //                 this.playerTwo.listenToMePlay().pipe(map(n => "player TWO:" + n))
        //             ).pipe(
        //                 takeUntil(this.stopSubject)
        //             )),
        //     )
    }

    getMusic(){
        return this.music
    }

    stop(){
        this.stopSubject.next();
    }

    play() {
        this.playSubject.next();
    }

}
