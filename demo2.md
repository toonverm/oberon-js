# Toon
intro: Boiler plate

# Ruben:
Als we muziek willen maken dan gaan we eerst moeten beginnen met een muziekant te maken.
``` js
public playSongSimple() {
  return from(["A","B","C"])
}
```
Tonen op localhost:8500 (of 8080) whatever
Dus we zien nu dat de data van onze Flux word doorgegeven aan de frontend

Top , maar nog niet helemaal wat we willen voor muziek te maken.
Hiervoor moet alles een beetje trager gaan. Daar hebben we een oplossing voor.
``` js
pubblic playSongSimple() {
       const notes = ["C","D","E","C"];
       
       return interval(500)
           .pipe(
               map(i => notes[i])
           )
    }
}
```
dat begint er al meer op te lijken 

alleen gaat dat kapot na dit nummer (SLIDES)
``` js
public playSongSimple() {
        const notes = ["C","D","E","C"];

       return timer(0,500)
           .pipe(
               take(notes.length),
               map(i => notes[i]),
           )
    }
```
# Toon

Een liedje is nogal saai misschien moeten we hier achter een ander liedje spelen
``` java
    public playSong(notes:string[]){
        return timer(0,500)
            .pipe(
                map(i => notes[i%notes.length]),
                take(notes.length)
            )
    }

    public listenToMePlay():Observable<string> {
        const songOne = ["G","A","B","G"];
        const songTwo = ["B", "C","D"];
        return concat(this.playSong(songOne), this.playSong(songTwo));
    }
```

nu gaan we deze liedjes na elkaar herhalen
```
      public listenToMePlay():Observable<string> {
        const songOne = ["G","A","B","G"];
        const songTwo = ["B", "C","D"];
        const playTwoSong$  = concat(this.playSong(songOne), this.playSong(songTwo));
        return playTwoSong$ .pipe(repeat());
     }
```

slokje water
```
    public listenToMePlay():Observable<string> {
        const songOne = ["G","A","B","G"];
        const songTwo = ["B", "C","D"];
        const playTwoSong$  = concat(this.playSong(songOne), this.playSong(songTwo));
        return playTwoSong$ .pipe(delay(3000), repeat(), );
    }
```

# Ruben

we willen weten de hoeveelste keer hij dit nummer speelde (SLIDES)

```
    public listenToMePlay():Observable<string> {
        const songOne = ["G","A","B","G"];
        const songTwo = ["B", "C","D"];
        const playTwoSong$  = concat(this.playSong(songOne), this.playSong(songTwo));
        return range(1,1000)
            .pipe(
                concatMap(i => playTwoSong$.pipe(delay(3000),map(n => n+i) ))
            )       
    }
```
# Toon
Open “open twee tabs” , we zien nu dat ze niet gelijk speler

Dit komt omdat het nu zogenaamde cold streams zijn.
→ wil zeggen dat de gedefinede observables in zijn geheel elke keer word afgespeeld. Zie
het als een soort CD. Iedereen dat de cd beluisterd krijgt hetzelfde te horen.
Om er voor te zorgen dat iedereen op hetzelfde moment hetzelfde te zien/horen krijgt moeten we dus onze cold stream omvormen naar een hotstream.
→ wil zeggen dat als je subscribed je inplugt op de bestaande stream of events.

We gaan dus er voor moeten zorgen dat onze gitaar speler maar één keer begint met spelen.

Laten we een hotstream guitarplayer maken
``` javascript
export class GuitarPlayer {
    private play: Observable<string>;

    constructor() {
        const songOne = ["G","A","B","G"];
        const songTwo = ["B", "C","D"];
        const playTwoSong$  = concat(this.playSong(songOne), this.playSong(songTwo));
        this.play =  range(10)
            .pipe(
                concatMap(i => playTwoSong$.pipe(delay(3000),map(n => n+i) ))
            ) 
    }

    public playSong(notes:string[]){
        return interval(500)
            .pipe(
                map(i => notes[i%notes.length]),
                take(notes.length)
            )
    }
    
    public listenToMePlay():Observable<string> {
        return this.play;
    }

```
Nog steeds niet goed. want we vragen nog steeds elke keer een volledig nieuwe observable aan.
Operators to the reque!
``` javascript
export class GuitarPlayer {
    private play: Observable<string>;

    constructor() {
        const songOne = ["G","A","B","G"];
        const songTwo = ["B", "C","D"];
        const playTwoSong$  = concat(this.playSong(songOne), this.playSong(songTwo));
        this.play =  range(10)
            .pipe(
                concatMap(i => playTwoSong$.pipe(delay(3000),map(n => n+i) )),
                share()
            ) 
    }

    public playSong(notes:string[]){
        return interval(500)
            .pipe(
                map(i => notes[i%notes.length]),
                take(notes.length)
            )
    }
    
    public listenToMePlay():Observable<string> {
        return this.play;
    }

```
share zorgt er voor dat er een hot observable wordt gemaakt

als er 1 iemand geconnecteerd wordt begin de speler te spelen andere subscribers worden op deze live stream omdat die gedeeld is.


Hoewel solo muziekanten bestaan. word meeste muziek wel met meerdere mensen gemaakt.

Hoe kunnen we er nu voor zorgen dat we zeg nu, twee gitaarspelers tegelijk kunnen bezig horen.

Tot nu toe gingen we rechtstreeks de guitaarspeler ophalen en doorsturen naar de frontend. Maar nu kunnen we in onze service meerdere speler gaan aanmaken en ze samenvoegen!

``` javaScript
export class Orchestra{

    private playerOne = new GuitarPlayer();
    private playerTwo = new GuitarPlayer();

    private music: Observable<string>;

    constructor() {
        this.music =
                    merge(
                        this.playerOne.listenToMePlay().pipe(map(n => "player ONE:" + n)),
                        this.playerTwo.listenToMePlay().pipe(map(n => "player TWO:" + n))
                    )
            )
    }

    getMusic(){
        return this.music
    }
```


# Ruben

Nu is er nog steeds iets niet ideaal. Vanaf dat de eerste persoon naar de stream luisterd beginnen we te spelen. Zo werkt dat natuurlijk niet in een concert. Stel u voor dat de eerste binnenwandeld en de overture start. Daar heeft het meeste van het publiek niets aan natuurlijk.

We gaan iets van een start sein moeten gebruiken.
We gaan gebruik maken van een Subject. Een Subject is nog zo een vreemde eend in de beitd. Het is zowel een Publisher als een Observable. Je kan er op subscriben en naar luisteren maar tegelijk ook data op duwen. Dit is dus uitermate handig voor commands op te vangen en in een stream om te zetten. Door te doen wat wij nu doen zorgen we er voor dat de play methode ook een stream is. En met streams kunnen we spelen!

``` java
private playSubject = new Subject<void>();
private stopSubject = new Subject<void>();

    constructor() {
        this.music =
            this.playSubject.pipe(
                mergeMap(() =>
                    merge(
                        this.playerOne.listenToMePlay().pipe(map(n => "player ONE:" + n)),
                        this.playerTwo.listenToMePlay().pipe(map(n => "player TWO:" + n))
                    ).pipe(
                        takeUntil(this.stopSubject)
                    )),
            )
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

```
Voor het gemak, een GET requestje!
``` java
app.get("/play", (req,res) =>  {
    orchestra.play()
    res.send("play")
})
```
We gaan gebruik maken van een DirectProcessor. Een processor is nog zo een vreemde eend in de beitd. Het is zowel een Publisher als een Observable. Je kan er op subscriben en naar luisteren maar tegelijk ook data op duwen. Dit is dus uitermate handig voor commands op te vangen en in een stream om te zetten. Door te doen wat wij nu doen zorgen we er voor dat de play methode ook een stream is. En met streams kunnen we spelen!


BOOM. wat hier in essentie doen is elke play command omvormen naar een eindelose stream van twee guitaar spelers.

Nu dat we kunnen starten, willen we mss kunnen stoppen ook.

Het eerste deel heb je mij al juist zien doen


Het interessante is natuurlijk hoe de verschillende streams samen werken.

We kunnen nu met de TakeUntil operator er voor zorgen dat we van een stream blijven afnemen tot er een event komt van een andere stream. Klinkt mij als start en stop events!


