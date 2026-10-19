# Modello di gameplay

Regole, statistiche, costi, IA, modalità di vittoria, bonus iniziali e opzioni di partita. Le patch modificano una parte di un file del gioco senza sostituirlo, quindi due mod possono toccare lo stesso file.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. Metti ciò che ti serve nelle cartelle indicate sotto ed elimina le altre. La cartella `patches\` non è nel modello (un file di note lì dentro verrebbe segnalato come patch errata): creala con il percorso del file del gioco che modifichi con la patch, per esempio `patches\data\classes\RHastatus.sc.xml`.
4. Attiva la mod nel tuo profilo e riavvia il gioco.
5. Leggi `Logs\imperivm\imperivm-mod.log`, nella cartella del gioco: elenca ciò che la tua mod ha caricato e i suoi errori.

## Struttura delle cartelle

```
my-gameplay-mod\
  mod.json
  README.md
  patches\
    data\
      classes\                a patch has the path and name of the game file it changes
      commands\
  events\                      OnGameStart.vs ...
  data\
    GameScripts\               victory modes
    BonusScripts\              starting bonuses
    mod\                       your own scripts
  options\                     lobby switches
```

## Cosa va dove

| Cartella | Guida |
|---|---|
| `patches\` | [Patch](../../patches.md) |
| `events\`, `data\mod\` | [Script](../../scripts.md) |
| `data\GameScripts\` | [Modalità di vittoria](../../victory-modes.md) |
| `data\BonusScripts\` | [Bonus iniziali](../../bonuses.md) |
| `options\` | [Opzioni di partita](../../options.md) |

## Note

- Questo è gameplay: tutti i giocatori della stanza devono avere la stessa mod.
- Gli esempi completi sono in [examples](../../examples): `patches-example`, `scripts-example`, `victory-example`, `options-example`.

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
