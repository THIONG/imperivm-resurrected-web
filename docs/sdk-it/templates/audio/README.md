# Modello audio

Musica, suoni e voci delle unità. Ogni giocatore può usare i propri: l'audio non deve coincidere tra i giocatori.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. In `tags`, `Language` è la lingua delle voci. Se la mod contiene solo musica e suoni, lascia `"Language: Multilingual"`.
4. Metti i tuoi file nella cartella corrispondente a ciò che modifichi ed elimina le altre cartelle.
5. Attiva la mod nel tuo profilo e riavvia il gioco.

## Struttura delle cartelle

```
my-audio-pack\
  mod.json
  README.md
  music\
    GBR_TRACK_1.ogg            replaces the game's track
  sounds\
    FIGHT\
      ...wav                   same path and name as the game's sound
  local\
    french\
      voices\
        <unit>\1.wav          up to 5.wav, only with that language
```

## Dove trovare i nomi

Estrai i suoni del gioco per vedere i nomi e le cartelle esatti: `node tools\extract-data.js "<game folder>" <output folder> Sounds.pak`. La musica del gioco si trova in `<game folder>\Music`.

## Note

- L'audio va nella sezione **Sounds** di GameBanana, non in Mods. Vedi [Pubblicare su GameBanana](../../publishing.md).
- Per i suoni nuovi usati dalla classe di un'unità, vedi [Grafica personalizzata](../../graphics.md) (`<sounds attack="…" die="…"/>`).
- Filmati e musica sono uguali in tutte le lingue: cambiano con la lingua solo le voci, i testi, la guida e alcune immagini dei menu ([Lingue](../../languages.md)).

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
