Noten-> noten zijn letters

Muziek maken --> guitaarspeler

```js
//guitarplayer

public listenToMePlay(): Observable<string> {
    return from(["E", "A", "D", "G", "B", "E"]);
  }

// index
const gp = new GuitarPlayer();

wss.on("connection", function connection(ws) {
  gp.listenToMePlay().subscribe((n) => ws.send(n));
});
```

te veel noten tegelijk --> interval

```js

  public listenToMePlay(): Observable<string> {
    const notes = ["E", "A"];
    return interval(1000).pipe(map((i) => notes[i]));
  }
```

maar nu blob blob in de frontend

NAAR SLIDES voor take

```js
  public listenToMePlay(): Observable<string> {
    const notes = ["E", "A"];
    return interval(1000).pipe(
      take(notes.length),
      map((i) => notes[i])
    );
  }
```

één lieke spelen, is wa kort

twee liekes spelen

```js
export class GuitarPlayer {
  private songOne = ["E", "A"];
  private songTwo = ["G", "B", "E"];
  constructor() {}

  public playSong(notes: string[]): Observable<string> {
    return interval(100).pipe(
      take(notes.length),
      map((i) => notes[i])
    );
  }

  public listenToMePlay(): Observable<string> {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    return concat(songOne$, songTwo$);
  }
}
```

stoppen me spelen, boe. Nie veel verdienen

willen blijven spelen

```js

  public listenToMePlay(): Observable<string> {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    return concat(songOne$, songTwo$).pipe(repeat());
  }
```

nu een slokje water. pijnlijke handen, te veel guitaar, af en toe pauze nemen!

Delay op het einde

```js
public listenToMePlay(): Observable<string> {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    return concat(songOne$, songTwo$).pipe(repeat(), delay(1000));
  }
```

oei hij wacht maar één keer

delay achter de repeat dus de repeat negeert de delay

```js
  public listenToMePlay(): Observable<string> {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    return concat(songOne$, songTwo$).pipe(delay(1000), repeat());
  }
```

nu repeaten we de delay

Ok maar nu willen we tellen oei toch even moeilijk

naar de SLIDES!

we doen het met concatmap

```js
  public listenToMePlay(): Observable<string> {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    const playTwoSong$ = concat(songOne$, songTwo$).pipe(delay(1000), repeat());
    return range(1, 1000).pipe(
      concatMap((i) => playTwoSong$.pipe(map((n) => n + i)))
    );
  }
```

Maar nu zien we nog steeds geen optellende nummertjes , hoe kan dat nu?

--> repeat staat er nog --> niet meer nodig!

top top, nu twee tabbladen. Geen gelijk spelen

uitleg over cdtje

```js
export class GuitarPlayer {
  private songOne = ["E", "A"];
  private songTwo = ["G", "B", "E"];
  private play: Observable<string>;
  constructor() {
    const songOne$ = this.playSong(this.songOne);
    const songTwo$ = this.playSong(this.songTwo);
    const playTwoSong$ = concat(songOne$, songTwo$).pipe(delay(1000));
    this.play = range(1, 1000).pipe(
      concatMap((i) => playTwoSong$.pipe(map((n) => n + (i + 1))))
    );
  }

  public playSong(notes: string[]): Observable<string> {
    return timer(0, 100).pipe(
      take(notes.length),
      map((i) => notes[i])
    );
  }

  public listenToMePlay(): Observable<string> {
    return this.play;
  }
}
```

oei marcheert niet! tis een QR code voor ne spotify lijst

we moeten dat delen! sharen

```js
this.play = range(1, 1000).pipe(
  concatMap((i) => playTwoSong$.pipe(map((n) => n + (i + 1)))),
  share()
);
```

ed sheeran, is ne lonely lozer, beter meer gitaar laweit

orchestra om samen te spelen

```js
export class Orchestra {
  private daveMustain = new GuitarPlayer();
  private jamesHetfield = new GuitarPlayer();

  private music: Observable<string>;

  constructor() {
    this.music = merge(
      this.daveMustain.listenToMePlay(),
      this.jamesHetfield.listenToMePlay()
    );
  }

  getMusic() {
    return this.music;
  }
}

//index

const o = new Orchestra();

wss.on("connection", function connection(ws) {
  o.getMusic().subscribe((n) => ws.send(n));
});
```

nie zo handig da je niet ziet wie wat speelt

even mappenµ

````js
    this.music = merge(
      this.daveMustaine.listenToMePlay().pipe(map((n) => n + " - Dave")),
      this.jamesHetfield.listenToMePlay().pipe(map((n) => n + " - James"))
    );
```

nu kunnen starten en stoppen

controle nodig ove een observable speciaal kindje -> subject koning kan zijn subjects commanderen


```
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
      mergeMap(() => song$),
      takeUntil(this.stopSubject)
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

//index

app.get("/play", (req, res) => {
  o.play();
  res.send("playing");
});

app.get("/stop", (req, res) => {
  o.stop();
  res.send("stopped");
});
```
````

starten , jeej
stoppen, jeej

terug starten, ooooh :(

wat ging er mis? takeUntil completes de observable en dan kan die niet meer starten tot je opnieuw subscribed?

maar eerst even die takeuntil fixen

```js
this.music = this.playSubject.pipe(
  mergeMap(() => song$.pipe(takeUntil(this.stopSubject)))
);
```

**SLIDES** met lifecycle?

ofwel bezig, ofwel complete, ofwel error

error simuleren, verkeerde noot spelen

```js
public playSong(notes: string[]): Observable<string> {
    return timer(0, 100).pipe(
      take(notes.length),
      map((i) => {
        if (Math.random() > 0.8) {
          throw new Error("I broke my guitar string");
        }
        return notes[i];
      })
    );
  }
```

tga nu wel hard kaput
