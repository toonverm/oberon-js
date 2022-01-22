import {
    catchError,
    concat,
    concatMap,
    delay, EMPTY, finalize,
    from,
    interval,
    map, mergeMap,
    Observable, of, publish, range,
    repeat, retry, share,
    switchMap,
    take,
    takeUntil, tap, throwError, timer,
    zipWith
} from "rxjs";




export class GuitarPlayer {
    private play: Observable<string>;

    constructor() {
        const songOne = ["G", "A", "B", "G"];
        const songTwo = ["B", "C", "D"];
        const playTwoSong$ = concat(this.playSong(songOne), this.playSong(songTwo));
        this.play = range(10)
            .pipe(
                concatMap(i => playTwoSong$.pipe(delay(3000), map(n => n + i))),
                share()
            )
    }

    public playSong(notes: string[]) {
        return interval(500)
            .pipe(
                map(i => notes[i]),
                take(notes.length)
            )
    }

    public listenToMePlay(): Observable<string> {
        return this.play;
    }

    public playSong2(song: Array<string>) {
        return interval(200)
            .pipe(
                switchMap(i => {
                    return of(song[i % song.length]).pipe(
                        tap(this.occasionallyPlayAMistake),
                        catchError(err => of("kaput"))
                    )
                }),
                take(song.length),
            );
    }

    public listenToMePlay0(): Observable<string> {
        return from(["C"])
            .pipe(
                delay(1000),
                repeat(),
            )
    }

    public listenToMePlay1(): Observable<string> {
        const notes = ["C", "D", "E", "C"];
        return interval(1000)
            .pipe(
                map(i => notes[i % notes.length]),
                take(notes.length),
            );
    }

    private occasionallyPlayAMistake() {
        const isWrong = Math.round(Math.random() * 2) === 0;
        if (isWrong) throw new Error("KLABANG!");
    }
    public testing(){
        return from(["A","b","c","d"])
            .pipe(
                
            )
    }
    public werkendErrorDing_MaarMoeilijk() {
        const notes = ["C", "D", "E", "C"];
        const otherSong = ['F', 'G', 'A'];

        const note$ = this.playSong(notes);
        const otherSong$ = this.playSong(otherSong);

        const one$ = timer(0, 5000)
            .pipe(
                mergeMap(i => concat(note$, otherSong$)
                    .pipe(
                        map(n => n + i)
                    )
                ),
                share()
            );
        const two$ = one$.pipe(
            tap(this.occasionallyPlayAMistake),
            catchError(err => one$)
        )
        return two$;
        return timer(0, 5000)
            .pipe(
                mergeMap(i => concat(note$, otherSong$)
                    .pipe(
                        map(n => n + i)
                    )
                ),
                tap(this.occasionallyPlayAMistake),
                switchMap(n => of(n).pipe(
                    catchError(err => of(undefined))
                )),
                share(),
                // catchError((err, caught) => {
                //     console.log("tis kupt");
                //     return caught;
                // }),

            );
    }

    public listenToMePlay2(): Observable<string> {
        const notes = ["C", "D", "E", "C"];
        const otherSong = ['F', 'G', 'A'];

        const note$ = this.playSong(notes);
        const otherSong$ = this.playSong(otherSong);

        return timer(0, 5000)
            .pipe(
                mergeMap(i => concat(note$, otherSong$)
                    .pipe(map(n => n + i))),
                tap(this.occasionallyPlayAMistake),
                catchError((err, caught) => {
                    console.error("tis kaput");
                    return of("VALSE NOOT");
                })
            )
    }

    public listenToMePlay3(): Observable<string> {
        return this.play
    }

    public playSongSimple(notes: string[]) {
        // return from(["A","B","C"])
        //     .pipe(
        //         concatMap(n => of(n).pipe(delay(1000)))
        //     )

        return timer(0, 500)
            .pipe(
                map(i => notes[i % notes.length]),
                take(notes.length)
            )
    }


}