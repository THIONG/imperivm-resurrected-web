# Modello di civiltà

Una nuova civiltà che si può scegliere nella stanza, con le sue unità, i suoi edifici e la sua IA.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. Estrai i dati del gioco una sola volta: `node tools\extract-data.js "<game folder>" <output folder>`.
4. Clona una civiltà del gioco:

   ```
   node tools\clone-civilization.js <output folder>\DATA <your mod folder> MyCiv M Gaul 10
   ```

   Scrive `civs\`, le classi e i comandi. [Civiltà](../../civilizations.md) spiega le opzioni, l'`index` (da 10 a 99, uno per civiltà) e come modificare poi le unità.
5. Facoltativo: una città e un villaggio propri per le mappe casuali. `create-template.js` li scrive in `patches\randommapsettlements\` ([Modelli di città e villaggio](../../city-templates.md)).
6. Elimina le note. Attiva la mod nel tuo profilo e scegli la civiltà nella stanza.

## Struttura delle cartelle

```
my-civilization\
  mod.json
  README.md
  civs\
    myciv.json
  data\
    classes\
      MyCiv....sc.xml          one per unit and building
    commands\
      MyCiv.xml
  patches\
    randommapsettlements\     optional: city and village templates
  loc\
    spanish.loc.xml
```

## Note

- Una civiltà cambia ciò che accade nel gioco: tutti i giocatori della stanza devono avere la mod.
- L'esempio completo è [civilization-example](../../examples/civilization-example).

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
