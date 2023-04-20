import {concat, from, map, Observable, repeat, take, zip} from "rxjs";


export class GuitarPlayer {
    private play: Observable<string>;

    constructor() {
        const songOne = ["G", "A", "B", "G"];
        const songTwo = ["B", "C", "D"];
        const playTwoSong$ = concat(this.playSong(songOne), this.playSong(songTwo));
        this.play = playTwoSong$;
    }

    public playSong(notes: string[]) {
        return from(notes);
    }

    public listenToMePlay(metronoom: Observable<number>): Observable<string> {
        return zip(metronoom, this.play.pipe(repeat(), take(1000)))
            .pipe(map(part => part[1] + " " + Math.floor(part[0] / 7)),
                map(t => {
                    if (Math.random() > 0.8) {
                        throw new Error("helahola");
                    }
                    return t;
                }));
    }
}