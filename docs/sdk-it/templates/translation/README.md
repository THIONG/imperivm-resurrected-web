# Modello di traduzione

Il gioco, o un'altra mod, in un'altra lingua; oppure testi modificati in una lingua che il gioco ha già.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. In `mod.json`, `language` dichiara una nuova lingua: `code` è il suo nome inglese in minuscolo (`french`), `name` è come appare nel menu e `base` è la lingua usata per tutto ciò che non traduci. Elimina `language` se modifichi solo i testi di una lingua già esistente. In `tags` indica la lingua: `"Language: French"`.
4. Traduci i testi in `loc\french.loc.xml` (rinominalo con il codice della tua lingua). Tutto ciò che lasci fuori appare nella lingua `base`.
5. Facoltativo: file solo per quella lingua, in `local\<language>\`: `help.xml`, `tips.xml`, `credits.txt`, `splash.ini`, immagini dei menu e `voices\`. Vedi [Lingue e testi](../../languages.md).
6. Attiva la mod nel tuo profilo, scegli la lingua in Opzioni → Lingua e riavvia.

## Struttura delle cartelle

```
my-translation\
  mod.json
  README.md
  loc\
    french.loc.xml
  local\
    french\
      help.xml                 optional
      tips.xml                 optional
```

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
