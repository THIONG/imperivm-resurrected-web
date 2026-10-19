# Modello di conquista

Una conquista: una mappa di territori (quella del gioco è il Mediterraneo) con una propria cartella di immagini, elencata nel menu del gioco come conquista.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. Crea la tua conquista nell'editor e metti il suo `.bfhp` in `conquests\`.
4. La mappa della conquista è una cartella in `conquestmaps\`. Il suo nome deve essere **esattamente** quello memorizzato nel `.bfhp` della tua conquista (la conquista del gioco memorizza `ConquestMaps/1 - GBR Europe`). Rinomina `MY-CONQUEST-MAP` con quel nome e cambia `data=` in `territories.xml` con lo stesso nome.
5. Metti le immagini in quella cartella (elenco più sotto) e modifica `territories.xml`.
6. I filmati sono facoltativi, vanno in `movies\` e si riproducono dallo script della mappa con `PlayMovie(Translate("movies\\MyVideo.avi"))`.
7. Elimina le note e le cartelle che non usi. Attiva la mod nel tuo profilo e cerca la conquista nel menu del gioco.

## Struttura delle cartelle

```
my-conquest\
  mod.json
  README.md
  conquests\
    MyConquest.bfhp
  conquestmaps\
    MY-CONQUEST-MAP\
      territories.xml
      territories.bmp
      global.bmp
      ShieldArrow.bmp
      ShieldBritain.bmp
      ShieldCarthage.bmp
      ShieldEgypt.bmp
      ShieldGaul.bmp
      ShieldGermany.bmp
      ShieldItaly.bmp
      ShieldSpain.bmp
  movies\
    MyVideo.avi
```

## I file della mappa della conquista

Sono i file della conquista del gioco (`ConquestMaps\1 - GBR europe\`), con le dimensioni che usa:

| File | Cos'è |
|---|---|
| `territories.xml` | I territori. Ognuno ha un `id`, un `index`, uno `state` e i suoi `neighbours`. Gli id della conquista del gioco sono `Spain`, `Britain`, `Gaul`, `Italy`, `Carthage`, `Egypt` e `Germany`. Il file di questo modello ne contiene tre come esempio; se hai dubbi su `index` e `state`, copia il file del gioco. |
| `territories.bmp` | 1024x768, 8 bit (256 colori). |
| `global.bmp` | 1024x768, 16 bit: l'immagine della mappa. |
| `Shield<Name>.bmp` | 74x79, 16 bit: uno scudo per territorio (`ShieldSpain.bmp` per `Spain`), più `ShieldArrow.bmp`. |

I file del gioco si trovano in `<game folder>\ConquestMaps\1 - GBR europe`: aprili in un editor di immagini per vedere cosa contiene ciascuno.

## Note

- Il `.bfhp` della conquista e tutto ciò che sta in `conquestmaps\` contano come contenuto di gioco: tutti i giocatori della stanza devono avere la stessa mod.
- I video vengono cercati prima nelle mod attive, secondo l'ordine di caricamento.

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
