# Validare una mod

Il validatore controlla la tua mod senza aprire il gioco e segnala i problemi indicando file e riga. Ti serve [Node.js](https://nodejs.org).

```
node tools/validate-mod.js <mod folder>
node tools/validate-mod.js <mod folder> --data <DATA folder>
```

`--data` è la cartella `DATA` ottenuta estraendo `data.pak` (la estrae `tools/extract-data.js`, vedi il [README](README.md#game-data)). Con essa, il validatore controlla anche che i file a cui la tua mod applica patch esistano e che gli script a cui puntano le tue classi esistano. Guarda solo i percorsi che iniziano con `data/`: se applichi patch a `units/…`, `buildings/…` o `currentlang/…`, non li controlla. Senza `--data`, tutto il resto viene comunque controllato.

Con `--game <game folder>` (sola lettura) controlla i nomi in `Units.pak`, `Buildings.pak`, `MapObjects.pak` e `Visuals.pak` per verificare se esistono le immagini e le entità che la tua mod prende dal gioco, e avvisa se un tuo `.rle` ha lo stesso nome di uno del gioco:

```
node tools/validate-mod.js <mod folder> --data <DATA> --game "C:\Program Files (x86)\Steam\steamapps\common\Imperivm - Great Battles of Rome HD"
```

Termina con codice 1 se ci sono errori, 0 se ci sono solo avvisi o nessun problema, e 2 se lo hai chiamato in modo sbagliato. Puoi sfruttarlo per automatizzare il controllo.

Un errore è qualcosa che il gioco rifiuterebbe o che fallirà. Un avviso è un sospetto: qualcosa che il gioco ignora o che probabilmente non volevi.

## Cosa controlla

- **`mod.json`**: JSON rotto, una categoria che non è di GameBanana, testi del tipo sbagliato (errori). `id`, `name`, `version` o `category` mancanti, un vecchio nome di categoria, tag scritti male, nella vecchia forma o non usati dal gioco, una mappa senza tag dei giocatori e una campagna, traduzione o pacchetto audio senza tag della lingua (avvisi).
- **File**: estensioni di eseguibili e di script di sistema (errore: la mod non si caricherebbe) e percorsi con `..`. Un'estensione strana ma innocua (`.psd`, `.gif`, `.zip`…) dà solo un avviso: la mod si carica, il file occupa soltanto spazio.
- **Mappe (`.bfhp`)**: il tipo che la mappa stessa dichiara (scenario, avventura o conquista) confrontato con la cartella in cui si trova. Un'avventura o una conquista in `scenarios\` non compare nell'elenco degli scenari; una mappa sciolta nella radice viene collocata durante l'installazione (avvisi).
- **`civs\*.json`**: un `id` non valido, un `index` fuori da 10–99 o duplicato, una `base` che non esiste, una `letter` più lunga di una lettera, un `biome` sconosciuto, un `template` scritto male o senza il suo file. Con `"ai": true` e senza una tabella `alias` emette un avviso, e controlla che l'`alias` punti a classi e ordini che la mod possiede.
- **`specials\*.json`**: un `id` non valido o che coincide con una specialità di un'unità del gioco, un `bit` fuori da 36–63 o duplicato.
- **`options\*.json`**: l'assegnazione dei bit (in tutte le mod ne entrano 8).
- **Patch XML**: XML malformato (la patch non verrebbe applicata affatto), un'operazione senza `select`, un selettore scritto male, tag che non sono operazioni. Un selettore che non inizia con `/` o `//` è un errore anche se la DLL lo accetterebbe.
- **Patch di script (`.vs`)**: una direttiva che non esiste, `@before`, `@after` o `@replace` senza testo, una direttiva senza codice sotto, e `@top` con codice che non è una dichiarazione di variabile. Non controlla il codice della patch, le funzioni `Mod_*` né la firma.
- **Patch INI**: righe che non riesce a interpretare, e una nuova sezione in `UNIT_SPECIALS.INI` (il gioco potrebbe bloccarsi). Non segnala i commenti a fine riga in una riga di patch, che il motore non supporta (vedi [Patch](patches.md)).
- **Classi (`data\classes`)**: XML malformato, una `race` sconosciuta, `unit_specials` scritte male o sconosciute (il gioco distingue maiuscole e minuscole: `Parry`, non `parry`), e una classe senza `entity` (avviso: il gioco non la eredita dal genitore e l'unità sparisce).
- **Codifica**: un XML di classe in Latin-1 con caratteri accentati. Il gioco non carica la classe e non avvisa; salvalo in UTF-8.
- **Ordini (`data\commands`)**: XML malformato, e un avviso quando due ordini con lo stesso nome sono per lo stesso edificio (avrebbe due pulsanti con quel nome). Con lo stesso nome per edifici diversi funzionano: il gioco associa ciascuno agli edifici del suo `<src>`.
- **Entità (`.ent.xml`)**: errore se l'immagine non esiste (il gioco si blocca al caricamento della classe; si controlla nella cartella della mod se include i propri file `.rle`, e sempre con `--game`), `idx` duplicato o fuori da 1–32, livelli e animazioni che puntano a qualcosa che non c'è, limiti del motore (32 immagini, 32 livelli, 8 stati, animazioni 1–28, 64 fotogrammi), e `columns`, `rows` o un numero di `<frame>` che non tornano. Un'animazione che legge più righe di quante ne abbia la sua immagine dà solo un avviso.
- **Grafica (`.rle`, `.pass`)**: un `.rle` troncato o corrotto, un `.rle.mmp` rinominato (senza pixel, non si carica da una mod), una tavolozza vuota, un `.pass` malformato o vuoto, un `pass_file` che non esiste, e un `.rle` con lo stesso nome di uno del gioco (vince quello del gioco; con `--game`).
- **`placeobjects.xml`** (mappe casuali): una classe nominata che non esiste (con `--data`). La generazione della mappa si blocca senza alcun messaggio.
- **Testi (`loc`)**: XML malformato, voci senza `text` o senza `result`.
- **Script (`.vs`)**: firma mancante nella prima riga (eccetto nei comportamenti di una classe, nelle modalità di vittoria e negli script degli oggetti, che il gioco carica sempre con una propria firma), un evento sconosciuto o con la firma sbagliata, `Sleep` in un evento che non può attendere, funzioni `Mod_*` che non esistono, `Mod_HasSpecial` con un `Obj` invece di un `Unit`.

## Esempio di output

```
WARNING  specials/c.json  no "name": the id will be shown
ERROR  specials/d.json  bit 40 is already used by specials/c.json
WARNING  data/classes/G.sc.xml:2  unknown unit special "Zzz": the game ignores it

5 files checked: 1 errors, 5 warnings.
```

## Cosa non fa

Non applica le patch né esegue gli script: lo vedi solo nel gioco (usa `Dump=` da [Patch](patches.md) per vedere il risultato, e `Logs\imperivm\imperivm-mod.log` per gli errori a tempo di esecuzione). Non giudica nemmeno la qualità delle immagini.

È pensato per le mod nuove realizzate con questo SDK. Una vecchia mod che funziona nel gioco, come la Community Mod, produce errori (script senza firma, script di classe che non esistono, righe di animazione) senza che questo significhi che non si caricherà.
