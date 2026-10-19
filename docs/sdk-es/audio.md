# Música, sonidos y voces

Un paquete de audio reemplaza o añade música, sonidos y voces de unidades. El audio nunca tiene que coincidir entre jugadores, así que no cuenta como jugabilidad. Parte de la [plantilla de audio](templates/audio).

| Qué | Carpeta en el mod | Formato |
|---|---|---|
| Música | `music\` | `.ogg` |
| Sonidos | `sounds\<group>\` | `.wav` |
| Voces de unidades | `local\<language>\voices\<unit>\` | `.wav`, de `1.wav` a `5.wav` |

Un archivo con la misma ruta y el mismo nombre que uno del juego lo reemplaza. Un nombre nuevo añade un archivo que pueden usar tus propias clases y mapas.

## Música

La música del juego está en `<game folder>\Music`: de `GBR_TRACK_1.ogg` a `GBR_TRACK_7.ogg`, y `_menu.ogg` para el menú. Un mod con `music\GBR_TRACK_1.ogg` reemplaza esa pista.

## Sonidos

Los sonidos del juego están en `Packs\Sounds.pak`, dentro de `sounds\`, agrupados en carpetas: `AMBIENT`, `ANIMALS`, `DEATH`, `EFFECTS`, `FIGHT`, `GATES`, `NOTIFICATIONS`, `SELECTION`, `UI` y `WALK`. Para ver los nombres exactos, extráelos:

```
node tools\extract-data.js "<game folder>" <output folder> Sounds.pak
```

Tus archivos van en las mismas carpetas: `sounds\FIGHT\<name>.wav`. Una clase nombra sus sonidos con `<sounds attack="…" die="…"/>`; en [Gráficos personalizados](graphics.md#sounds) se explica cómo apuntarla a los nuevos.

## Voces

Las voces pertenecen a un idioma, así que van en `local\<language>\voices\<unit>\`, con el nombre inglés del idioma en minúsculas (`english`, `spanish`, `french`…): `local\french\voices\<unit>\1.wav`, hasta `5.wav` según la unidad. Solo se usa el idioma que el jugador tiene seleccionado. Consulta [Idiomas y textos](languages.md#files-for-a-single-language).

## En `mod.json`

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

`Language` es el idioma de las voces. Si el paquete solo tiene música y sonidos, usa `Multilingual`.

El audio se publica en la sección **Sounds** de GameBanana, no en Mods. Consulta [Publicar en GameBanana](publishing.md).
