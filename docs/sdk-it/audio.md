# Musica, suoni e voci

Un pacchetto audio sostituisce o aggiunge musica, suoni e voci delle unità. L'audio non deve coincidere tra i giocatori, quindi non conta come gameplay. Parti dal [modello audio](templates/audio).

| Cosa | Cartella nella mod | Formato |
|---|---|---|
| Musica | `music\` | `.ogg` |
| Suoni | `sounds\<group>\` | `.wav` |
| Voci delle unità | `local\<language>\voices\<unit>\` | `.wav`, da `1.wav` a `5.wav` |

Un file con lo stesso percorso e lo stesso nome di uno del gioco lo sostituisce. Un nome nuovo aggiunge un file che le tue classi e le tue mappe possono usare.

## Musica

La musica del gioco si trova in `<game folder>\Music`: da `GBR_TRACK_1.ogg` a `GBR_TRACK_7.ogg`, più `_menu.ogg` per il menu. Una mod con `music\GBR_TRACK_1.ogg` sostituisce quel brano.

## Suoni

I suoni del gioco sono in `Packs\Sounds.pak`, dentro `sounds\`, raggruppati in cartelle: `AMBIENT`, `ANIMALS`, `DEATH`, `EFFECTS`, `FIGHT`, `GATES`, `NOTIFICATIONS`, `SELECTION`, `UI` e `WALK`. Per vedere i nomi esatti, estraili:

```
node tools\extract-data.js "<game folder>" <output folder> Sounds.pak
```

I tuoi file vanno nelle stesse cartelle: `sounds\FIGHT\<name>.wav`. Una classe indica i propri suoni con `<sounds attack="…" die="…"/>`; in [Grafica personalizzata](graphics.md#sounds) trovi come collegarla a suoni nuovi.

## Voci

Le voci dipendono dalla lingua, quindi vanno in `local\<language>\voices\<unit>\`, con il nome inglese della lingua in minuscolo (`english`, `spanish`, `french`…): `local\french\voices\<unit>\1.wav`, fino a `5.wav` a seconda dell'unità. Viene usata solo la lingua selezionata dal giocatore. Vedi [Lingue e testi](languages.md#files-for-a-single-language).

## In `mod.json`

```json
{
  "id": "my-audio-pack",
  "name": "My audio pack",
  "version": "1.0",
  "authors": ["Your name"],
  "category": "Audio & Voices",
  "tags": ["Language: Multilingual"]
}
```

`Language` è la lingua delle voci. Se la mod contiene solo musica e suoni, usa `Multilingual`.

L'audio si pubblica nella sezione **Sounds** di GameBanana, non in Mods. Vedi [Pubblicare su GameBanana](publishing.md).
