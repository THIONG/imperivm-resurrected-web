# Modifiche

La versione dell'SDK e le mod che puoi creare con ciascuna. La versione dell'API degli script (`Mod_ApiVersion()`) è separata: al momento è la 7.

## 1.0

Richiede Imperivm Resurrected 1.0 o successivo.

La prima versione numerata dell'SDK. È solo in inglese.

- **Modelli** in [`templates/`](templates): una mod vuota per ogni tipo di contenuto (scenario, avventura, conquista, unità, civiltà, gameplay, audio, traduzione, grafica) e una completa con tutte le cartelle che il gioco legge. Ognuno ha il proprio `mod.json`, un README con i passaggi e la struttura delle cartelle, e una nota `PUT-YOUR-FILES-HERE.txt` in ogni cartella vuota. Superano il validatore.
- **Guide** per tutto ciò che una mod può fare: lingue e testi, tasti, patch, script, civiltà, modelli di città e villaggio, unità, statistiche, specialità, abilità, oggetti, formazioni, avamposti, modalità di vittoria, bonus iniziali, opzioni di partita, mappe casuali, immagini, grafica, [scenari, avventure e conquiste](maps.md) (con filmati) e [musica, suoni e voci](audio.md), più il validatore, la pubblicazione su GameBanana e un riferimento.
- **Strumenti** in `tools\`, scritti in inglese: `create-unit`, `create-item`, `create-ability`, `create-formation`, `create-option`, `create-outpost`, `create-random-map`, `create-template`, `clone-civilization`, `convert-image`, `convert-sprite`, `create-entity`, `read-rle`, `extract-data`, `validate-mod` e `shrink-mod`. Le loro opzioni sono in inglese (`--name`, `--player`, `--output`). In `create-unit`, `create-ability` e `create-option`, `--name` è il testo inglese e quello spagnolo va in `--name-es`.
- **Esempi** in `examples\`, tutti validi, con id in inglese (`example-unit`, `example-options`…). `draw-soldier.js`, che ridisegna gli sprite di `unit-graphics-example`, è in `tools\`.
- Le chiavi spagnole di un vecchio `mod.json` vengono ancora lette dal validatore.
