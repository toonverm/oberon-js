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
    constructor() {
    }

    public listenToMePlay():Observable<string> {

    }

}