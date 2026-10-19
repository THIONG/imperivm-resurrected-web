# Grafica personalizzata per unità ed edifici

Parti dal [modello di grafica](templates/graphics), una mod vuota con le cartelle usate in questa guida.

L'SDK non disegna nulla: usa Photoshop, Paint.NET, Aseprite, Blender… Il gioco legge solo il suo formato `.rle`, che nessun programma esporta, quindi l'SDK include un convertitore.

Una mod può includere i propri sprite come file sciolti, con gli stessi percorsi che usa il gioco. Una nuova unità o un nuovo edificio modifica il gameplay: tutti i giocatori della partita devono avere la mod.

Esempio: [`examples/unit-graphics-example`](examples/unit-graphics-example) (un soldato a forma di cubo, 8 direzioni, colore del giocatore). È disegnato da `tools\draw-soldier.js`, l'unica cosa che sostituiresti con i tuoi disegni.

Esegui ogni comando di questa guida dalla radice del repository. Gli strumenti sono in Node.js e non richiedono altro.

## Cosa puoi fare

- Una nuova unità con sprite propri: sì, in una nuova cartella `units\MyUnit\`.
- Cambiare lo sprite di un'unità esistente: non con un file sciolto, perché il gioco preferisce i propri. Crea una nuova unità.
- Un nuovo edificio con sprite propri: sì, ma con più lavoro (fogli grandi, fasi di costruzione, impronta `.pass` e punti). Vedi Edifici.
- Icone e pulsanti dell'interfaccia: già trattati in [Immagini personalizzate](images.md).
- Nuovi suoni: `.wav` e `.ogg`.

## Gli strumenti

- `tools\convert-sprite.js`: dai tuoi PNG a `.rle`. Ritaglia, riduce a 256 colori, segna il colore del giocatore e crea l'ombra.
- `tools\create-entity.js`: scrive il `.ent.xml` (immagini, livelli, stati, animazioni) di un'unità o di un edificio, e l'impronta `.pass` di un edificio.
- `tools\read-rle.js`: l'operazione inversa, da `.rle` a PNG. Usalo per guardare uno sprite del gioco e per partire da esso.
- `tools\validate-mod.js`: segnala immagini mancanti, valori `idx` ripetuti, righe e colonne che non tornano ([Validare una mod](validating.md)).

## Un'unità, passo per passo

### 1. Disegna e salva i PNG

Un PNG per ogni animazione, direzione e fotogramma, tutti della stessa dimensione (la tela, 150 x 150 per un'unità) con sfondo trasparente:

```
Idle_d0_f00.png  Idle_d0_f01.png  ...  Idle_d7_f07.png      <Name>_d<direction>_f<frame>.png, counting from 0
Walk_d0_f00.png  ...
Fight_..., Death_..., Transition_..., Taunt_...
```

- **Animazioni.** Obbligatorie: `Idle` (fermo), `Walk`, `Fight` (attacco) e `Death`. Facoltative: `Transition` (dal riposo al combattimento) e `Taunt`. Se mancano, si usa `Idle` al loro posto.
- **Direzioni.** 8 per i soldati, 12 per eroi e animali, 4 per le navi. Tutte le animazioni di un'unità usano lo stesso numero.
- **Ordine delle direzioni.** Nei fogli del gioco, la colonna 0 guarda verso la telecamera (in basso sullo schermo) e le altre seguono in senso orario: sud, ovest, nord, est, con le diagonali nel mezzo. Se fai uno sprite tuo, guarda un foglio del gioco con `read-rle.js` prima di disegnare tutte e otto le direzioni.
- **Tela e piedi.** La stessa tela in ogni fotogramma, con i piedi nello stesso punto. Nelle unità del gioco è il pixel (75, 100) di 150 x 150. Cambialo con `--canvas` e `--feet`.
- **Dimensione.** Il motore non ne impone una: ogni fotogramma viene ritagliato a ciò che hai disegnato. Come riferimento, un soldato del gioco misura circa 40 x 52 pixel e un eroe circa 40 x 88 (valori approssimativi).
- **Fotogrammi.** Fino a 62 per animazione. Hastatus: camminata 15, attacco 14, morte 20, riposo 8.
- **Trasparenza.** Tutto o niente: un alfa inferiore a 128 è trasparente. Il gioco non ha semitrasparenze.
- **Colori.** Fino a 256 per set; con il colore del giocatore, 192 (gli altri 64 sono la tinta). Se ne usi di più, il convertitore li riduce e te lo segnala.
- **Colore del giocatore.** Dipingi di magenta ciò che deve cambiare con la squadra. Il convertitore tratta i magenta (rosso e blu simili, quasi nessun verde) come tinta. `(255, 0, 255)` è quasi colore del giocatore puro; `(128, 0, 128)`, `(64, 0, 64)`… ne sono le sfumature (7 livelli utilizzabili). Evita viola e rosa nel resto della figura: potrebbero finire per errore nella tinta. Non sfumare i bordi: un bordo semitrasparente sfumato diventa rosa, non tinta.
- **Ombra.** Facoltativa: un PNG per fotogramma con lo stesso nome più `_sombra` (`Walk_d3_f05_sombra.png`), nero opaco o grigio scuro su sfondo trasparente. Se la salti, il convertitore disegna un'ellisse sotto i piedi. Il gioco scurisce della metà il terreno sotto l'ombra.

Puoi anche fornire un solo foglio assemblato per animazione: `Walk.png` con le direzioni come colonne e i fotogrammi come righe, ogni cella grande quanto la tela (`--canvas WidthxHeight`). L'ombra va in `Walk_sombra.png` con la stessa disposizione.

### Partire da uno sprite del gioco

Gli sprite del gioco sono nei file `.rle.mmp` dei file `.pak`, e i loro pixel in `rle.mmp`, nella cartella del gioco. Estraili prima con `extract-data.js`:

```
node tools\extract-data.js "<game folder>" <output folder> Units.pak HASTATUS
```

E convertili in PNG con `--convention`, che scrive esattamente ciò che si aspetta `convert-sprite.js` (un PNG per direzione e fotogramma, tela intera, la tinta del giocatore in magenta e l'ombra in `_sombra`):

```
node tools\read-rle.js <output folder>\UNITS\RHASTATUS\WALK.RLE.MMP --rle-mmp "<game folder>\rle.mmp" --convention --output <carpeta de PNG>
node tools\convert-sprite.js <carpeta de PNG> --player --output <mod>\units\MyUnit
```

Senza `--convention`, `read-rle.js` scrive un foglio con celle grandi quanto ogni ritaglio, e `convert-sprite.js` non lo accetta. `--canvas WidthxHeight` cambia la tela (150 x 150 per impostazione predefinita). L'ombra del gioco è un file a parte (`WALK_SHADOW.RLE.MMP`): se non lo estrai, il convertitore disegna l'ellisse. Sono file del tuo gioco, per studiarli o partire da essi: non ridistribuirli.

### 2. Converti in `.rle`

```
node tools\convert-sprite.js <folder with the PNGs> --output <mod>\units\MyUnit --player
```

- `--player`: usa il colore del giocatore (il magenta diventa la tinta della squadra). Senza, la palette è libera, 256 colori senza colore del giocatore; è la più semplice ed è quella che usano lupi e cervi.
- `--shadow auto|files|none`: `auto` per impostazione predefinita (i tuoi file `_shadow` se presenti, altrimenti un'ellisse).
- `--palette-per-animation`: una palette per ogni `.rle`. Per impostazione predefinita ce n'è una per tutta l'unità, con la perdita di qualità dovuta alla riduzione a 192 o 256 colori se ne usi di più. Il gioco ne usa una per animazione.
- `--canvas WidthxHeight` (per impostazione predefinita la dimensione dei PNG), `--feet X,Y` (solo per l'ombra automatica), `--alpha-threshold N`.

Scrive `Idle.rle`, `Idle_shadow.rle`, `Walk.rle`…

### 3. Crea l'entità (`.ent.xml`)

```
node tools\create-entity.js unit <mod>\units\MyUnit --name MyUnit
```

Legge i file `.rle` della cartella e scrive `MyUnit.ent.xml`: 2 livelli (unità `z=1000`, ombra `z=800`), 2 stati (riposo e combattimento) e le 7 animazioni del motore (camminata 1, attacco 5, morte 9, `Idle` 13, `ToIdle` 18, `ToAttack` 19, `Taunt` 20) con i tempi di Hastatus (camminata 55 ms per fotogramma, attacco 71, morte 80 con una parte finale lenta, riposo 150…). Sono 6 fogli di animazione per 7 animazioni del motore, perché il foglio `Transition` serve `ToAttack` e, invertito, `ToIdle`.

Limiti del motore: vedi *Riferimento del formato*. Per cambiare il ritmo, usa `--config animations.json`:

```json
{ "Walk": { "duration": 55, "step": 42 }, "Fight": { "duration": 71, "hit": 426 } }
```

`duration` sono i millisecondi per fotogramma. `step` e `hit` (`action_time`, i millisecondi che passano prima che il colpo vada a segno) fanno parte della simulazione e influiscono sul gameplay.

### 4. La classe e il resto

La classe (`data\classes\MyUnit.sc.xml`) è una copia completa di una classe del gioco con `entity="Units/MyUnit/MyUnit.ent.xml"`. L'ordine di reclutamento, il pulsante e i testi sono trattati in [Nuove unità](units.md). Non fare della classe un figlio di un'altra: il gioco non eredita `entity` dal genitore e l'unità scompare. Il nome della cartella deve essere nuovo: se riusi il nome di un'unità del gioco, il gioco usa il suo `.rle` e il tuo viene ignorato.

### 5. Valida e prova

```
node tools\validate-mod.js <mod> --data <DATA> --game "<game folder>"
```

Un'immagine mancante manda in crash il gioco quando carica la classe (lo stesso vale per un `idx` ripetuto o un `.rle` corrotto), e il validatore la individua prima. Poi copia la mod in `<game>\mods\`, abilitala e riavvia. Se il gioco si chiude, `Logs\imperivm\imperivm-mod.log` indica l'immagine che ha dato problemi.

## Edifici

Stessa struttura di un'unità, con queste differenze:

- **Una sola direzione** (`_d0`) e più righe, che sono le fasi di costruzione (quelle del gioco ne usano 4). Un foglio per ogni livello dell'edificio, `layer1`, `layer2`… (fino a 5 nel gioco), più `shadow`. PNG: `layer1_d0_f00.png` (livello 1, fase 0), `layer1_d0_f01.png`… e `shadow_d0_f00.png`… Un'animazione di nome `shadow` viene presa direttamente come maschera d'ombra (conta qualsiasi pixel opaco).
- **Tele grandi**, circa 700 x 700 nel gioco. Scegli tu il punto in cui l'edificio è ancorato (`--feet`); sulla caserma romana è (305, 330).

```
node tools\convert-sprite.js <PNG> --output <mod>\buildings\MyBuilding --player --shadow none
node tools\create-entity.js building <mod>\buildings\MyBuilding --name MyBuilding --feet 305,330 --footprint 8x8 --points-from <another .ent.xml>
```

- **L'impronta (`.pass`)** è la griglia a 1 bit che indica dove le unità non possono camminare. Ogni cella è di 16 unità di mappa (poco meno di metà della larghezza di un soldato). `--footprint WidthxHeight` crea un rettangolo centrato sul punto di ancoraggio. `--footprint-png máscara.png` usa un disegno (1 pixel = 1 cella, nord in alto; opaco e scuro = bloccato, trasparente o bianco = libero). Tienila entro circa 120 x 120 celle. Una casa del gioco misura circa 15 celle per lato e la caserma romana circa 29.
- **I punti (`<point>`)** sono porte, posti per le sentinelle, fumo… Il convertitore non può inventarli. Con `--points-from <.ent.xml of a similar game building>` copia i punti di quell'edificio; le loro coordinate sono relative al punto di ancoraggio, quindi correggile se il tuo ha una forma diversa.
- La classe dell'edificio (`CVXBuilding`, `parent="Building"`, ordini, costi…) si crea come in [Nuove unità](units.md): una copia completa di una del gioco.
- Non gestito: le versioni invernali (`entity_winter`) e le animazioni degli edifici (fumo, fuoco). Puoi aggiungerle a mano.
- Il messaggio finale di `convert-sprite.js` suggerisce `create-entity.js unit` anche quando converti un edificio: usa `edificio`.

## Riferimento del formato

Se vuoi leggere o scrivere i formati da solo, il codice è in `tools\lib\rle.js` (`.rle`) e `tools\lib\pass.js` (`.pass`). Gli strumenti scrivono file `.rle` a 256 colori (con o senza colore del giocatore) e ombra; il true color non esiste.

Limiti del `.ent.xml`:

- `<image idx file rows columns drawmode>`: 32 immagini; `idx` da 1 a 32, senza ripetizioni; `file` senza estensione oppure con `.rle`.
- `<layer idx name image z …>`: 32. Unità `z=1000`, ombra `z=800`.
- `<state idx …>`: 8.
- `<anim idx name frames duration action_time step>`: `idx` da 1 a 28; `frames` = righe + 2 (due fotogrammi sentinella con durata 0); fino a 64 fotogrammi.
- `variations` di `<entity>`: pari alle colonne di tutte le immagini.

## Suoni

La classe nomina i propri suoni con `<sounds attack="…" die="…"/>`. Ogni nome è un file `data\sound entities\<Name>.xml` che elenca i file `.wav` o `.ogg`; puoi inserire i tuoi nella mod. Se non vuoi nuovi suoni, copia quelli di un'unità simile (`attack="UnitSwordFight" die="UnitDeath"`).
