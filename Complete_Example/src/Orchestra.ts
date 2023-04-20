import {GuitarPlayer} from "./guitarPlayer";
import {catchError, interval, map, merge, Observable, share, Subject} from "rxjs";


export class Orchestra {

    private playerOne = new GuitarPlayer();
    private playerTwo = new GuitarPlayer();

    private music: Observable<string>;
    private metronoom: Observable<number>;

    private playSubject = new Subject<void>();
    private stopSubject = new Subject<void>();

    constructor() {
        this.metronoom = interval(500).pipe(share());
        // @RUBEN why is this needed
        this.metronoom.subscribe(a => console.log(a));
        this.music = this.buildMusic();
    }

    buildMusic(): Observable<string> {
        return merge(
            this.playerOne.listenToMePlay(this.metronoom).pipe(map(n => "PLAYER ONE: " + n)),
            this.playerTwo.listenToMePlay(this.metronoom).pipe(map(n => "PLAYER TWO: " + n)),
        )
            .pipe(
                catchError((err, caught) => caught)
            )
    }


    getMusic() {
        return this.music
    }

    stop() {
        this.stopSubject.next();
    }

    play() {
        this.playSubject.next();
    }

}
