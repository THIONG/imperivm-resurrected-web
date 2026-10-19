# Modello di avventura

Un'avventura o una campagna per giocatore singolo: grandi battaglie, sfide, missioni con una storia e degli obiettivi.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. In `tags` indica la lingua dei testi della tua avventura (`"Language: English"`, `Spanish`, `Italian`, `German`, `French`, `Polish` oppure `Multilingual`).
4. Salva l'avventura nell'editor e metti il `.bfhp` in `adventures\` insieme alla sua immagine: un `.bmp` con esattamente lo stesso nome.
5. I filmati sono facoltativi. Metti ogni `.avi` in `movies\` e riproducilo dallo script della mappa con `PlayMovie(Translate("movies\\MyVideo.avi"))`. È la forma usata dalle avventure del gioco.
6. Elimina le note e le cartelle che non usi. Attiva la mod nel tuo profilo e trova l'avventura nel menu del gioco.

## Struttura delle cartelle

```
my-adventure\
  mod.json
  README.md
  adventures\
    MyAdventure.bfhp
    MyAdventure.bmp
  movies\
    MyVideo.avi
```

Le campagne del gioco seguono questa struttura: per esempio `Adventures\GreatBattles\1_Great_Battles_Zama.BFHP` e il relativo `.bmp`, più `Movies\1_Intro_Great_B_Zama.avi` e `1_Extro_Great_B_Zama.avi` (introduzione e conclusione di ogni missione).

## Note

- I video vengono cercati prima nelle mod attive, secondo l'ordine di caricamento, quindi una mod può sostituire anche uno di quelli del gioco.

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
