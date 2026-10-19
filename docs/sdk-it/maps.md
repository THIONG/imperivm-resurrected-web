# Scenari, avventure e conquiste

I tre tipi di mappa del gioco. Si creano nell'editor di mappe del gioco e si salvano come file `.bfhp`; a una mod basta mettere quel file, e i pochi file che lo accompagnano, nella cartella giusta.

| Tipo | Cartella nella mod | File | Modello |
|---|---|---|---|
| Scenario (mappa per schermaglia e multigiocatore) | `scenarios\` | `MyMap.bfhp` | [scenario](templates/scenario) |
| Avventura (missioni e campagne per giocatore singolo) | `adventures\` | `MyAdventure.bfhp` e `MyAdventure.bmp` | [avventura](templates/adventure) |
| Conquista | `conquests\` e `conquestmaps\` | `MyConquest.bfhp` e una cartella di immagini | [conquista](templates/conquest) |

Il tipo non dipende dalla cartella: lo dichiara la mappa stessa, in base a ciò che l'autore ha scelto nell'editor. La cartella deve coincidere. Un'avventura o una conquista in `scenarios\` non compare nell'elenco degli scenari, e il [validatore](validating.md) lo segnala.

## Scenari

Metti il `.bfhp` in `scenarios\`. Quando qualcuno lo sceglie nella stanza, il gioco disegna l'anteprima a partire dal terreno della mappa, con i suoi giocatori e le loro civiltà: non c'è nessuna immagine da fornire. I colori vengono dalle tessere della minimappa del gioco, quindi un terreno nuovo ha l'aspetto giusto se porta la sua tessera in `minimapzoom8\terrain`.

In `mod.json` usa `"category": "Scenarios"` e indica quanti giocatori ha la mappa con un tag `Players` (`"Players: 2"`, `"Players: 2-4"`). Vedi [Pubblicare su GameBanana](publishing.md#tags).

## Avventure

Ogni avventura è composta da due file con lo stesso nome, in `adventures\`: il `.bfhp` e un `.bmp` (`The Punic Wars.BFHP` e `The Punic Wars.bmp`). Le campagne del gioco tengono ogni serie in una sottocartella: `Adventures\GreatBattles\` e `Adventures\GreatChallenges\`, con le missioni numerate.

In `mod.json` usa `"category": "Adventures"` e un tag `Language` con la lingua dei testi.

## Conquiste

Una conquista è un `.bfhp` in `conquests\` più una cartella in `conquestmaps\` con le immagini e l'elenco dei territori. Quella del gioco, `Conquests\mediterranean.BFHP`, conserva al proprio interno il nome della sua cartella: `ConquestMaps/1 - GBR Europe`. La tua conquista fa lo stesso, quindi **la cartella di `conquestmaps\` deve chiamarsi esattamente come dice la mappa**.

La cartella della conquista del gioco contiene questi file:

| File | Cos'è |
|---|---|
| `territories.xml` | I territori (`id`, `index`, `state`, `neighbours`) e i colori che la mappa usa per i territori posseduti, nemici e disabilitati. `data=` ripete il nome della cartella. |
| `territories.bmp` | 1024x768, 8 bit (256 colori). |
| `global.bmp` | 1024x768, 16 bit. |
| `Shield<Name>.bmp` | 74x79, 16 bit, uno per territorio (`ShieldSpain.bmp` per `Spain`), più `ShieldArrow.bmp`. |

I territori della conquista del gioco sono `Spain`, `Britain`, `Gaul`, `Italy`, `Carthage`, `Egypt` e `Germany`. Per creare la tua, copia la cartella del gioco (`<game folder>\ConquestMaps\1 - GBR europe`) e modificala: è il modo più rapido per ottenere `index` e `state` corretti. Il [modello di conquista](templates/conquest) contiene la struttura delle cartelle e un `territories.xml` ridotto.

## Filmati

Un'avventura o una conquista può riprodurre dei video. Metti ogni `.avi` in `movies\` nella mod e riproducilo dallo script della mappa, nell'editor:

```
PlayMovie(Translate("movies\\MyVideo.avi"));
```

È il modo in cui le avventure del gioco richiamano i propri (`movies\\1_Intro_Great_B_Zama.avi`). Il gioco cerca il file prima nelle mod attive, secondo l'[ordine di caricamento](reference.md#1-mod-structure), e poi nella propria cartella `Movies\`: una mod può quindi sostituire anche uno dei video del gioco.

Il gioco riproduce i video tramite Windows (DirectShow), quindi il computer deve essere in grado di decodificare il formato. I video del gioco sono file AVI con video Xvid (1920x1080, 25 fotogrammi al secondo) e audio PCM: usa lo stesso formato.

I video sono identici in tutte le lingue e non contano come gameplay.

## In multigiocatore

Mappe, avventure e conquiste sono file di gameplay: tutti i giocatori della stanza devono avere lo stesso file. Con `"redistributable": true` in `mod.json`, l'host della stanza può inviare la mod ai giocatori che non la hanno.

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Poi segui [Pubblicare su GameBanana](publishing.md). Uno `.zip` che contiene solo il `.bfhp`, senza cartelle, viene collocato dal gioco stesso al momento dell'installazione, in base al tipo dichiarato dalla mappa.
