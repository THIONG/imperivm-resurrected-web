# Modello di grafica

Texture, aspetto delle unità, edifici, icone e immagini dei menu. Ogni giocatore può usare le proprie: la grafica non deve coincidere tra i giocatori.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. Metti i tuoi file nella cartella corrispondente a ciò che modifichi, con lo stesso percorso e lo stesso nome del file del gioco quando ne sostituisci uno. Elimina le altre cartelle.
4. Attiva la mod nel tuo profilo e riavvia il gioco.

## Struttura delle cartelle

```
my-graphics\
  mod.json
  README.md
  units\
    MyUnit\                   sprites (.rle) and MyUnit.ent.xml
  buildings\
    MyBuilding\
  gameres\
    icons\                    unit portraits (.bmp)
    cmdbar\Actions\          command buttons (.bmp)
```

## Da dove cominciare

- Sprite per un'unità o un edificio a partire da file PNG: [Grafica personalizzata](../../graphics.md) (`convert-sprite.js`, `create-entity.js`).
- Pulsanti e icone a partire da un PNG: [Immagini personalizzate](../../images.md) (`convert-image.js`).
- Una nuova unità che li usa: [Nuove unità](../../units.md) e il [modello di unità](../units).

## Note

- I file `.rle` e le immagini non contano come gameplay. I file `.xml` e `.pass` in `units\`, `buildings\` e `mapobjects\` sì: se li modifichi, tutti i giocatori della stanza devono avere la mod.
- Un `.rle` con lo stesso nome di uno del gioco viene ignorato; il validatore lo segnala con `--game`.

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
