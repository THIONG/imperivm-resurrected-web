# Modello di unità

Una nuova unità o un nuovo eroe: la sua classe, il comando che la recluta, le sue immagini e i suoi testi.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. Crea l'unità a partire da una già esistente. Dalla cartella dell'SDK:

   ```
   node tools\create-unit.js <DATA folder> <your mod folder> MyUnit --base RHastatus --health 260 --damage 20 --armor 14 --building RBarracks --gold-cost 180 --time 9000 --key v --name "My unit"
   ```

   Scrive la classe, il comando e i testi nelle cartelle indicate sotto. [Nuove unità](../../units.md) spiega ogni opzione e da dove proviene la cartella DATA.
4. Crea il ritratto e il pulsante a partire da file PNG con `tools\convert-image.js` ([Immagini personalizzate](../../images.md)).
5. Elimina le note. Attiva la mod nel tuo profilo e recluta l'unità.

## Struttura delle cartelle

```
my-unit\
  mod.json
  README.md
  data\
    classes\
      MyUnit.sc.xml
    commands\
      MyUnit.xml
  gameres\
    icons\
      MyUnit.bmp
    cmdbar\Actions\
      train MyUnit.bmp
  loc\
    spanish.loc.xml
```

## Per andare oltre

- Sprite propri invece di quelli di un'altra unità: [Grafica personalizzata](../../graphics.md) e il [modello di grafica](../graphics) (`units\MyUnit\`).
- Una nuova abilità, specialità od oggetto per l'unità: [abilità](../../abilities.md), [specialità](../../specials.md), [oggetti](../../items.md).
- Gli attributi che hanno un effetto e quelli che bloccano il gioco: [Statistiche delle unità](../../stats.md).

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
