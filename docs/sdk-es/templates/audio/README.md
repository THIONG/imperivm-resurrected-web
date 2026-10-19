# Plantilla de audio

Música, sonidos y voces de unidades. Cada jugador puede usar los suyos: el audio nunca tiene que coincidir entre jugadores.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. En `tags`, `Language` es el idioma de las voces. Si solo tienes música y sonidos, deja `"Language: Multilingual"`.
4. Pon tus archivos en la carpeta que corresponda a lo que cambias y borra las demás.
5. Activa el mod en tu perfil y reinicia el juego.

## Estructura de carpetas

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

## Dónde encontrar los nombres

Extrae los sonidos del juego para ver los nombres y las carpetas exactos: `node tools\extract-data.js "<game folder>" <output folder> Sounds.pak`. La música del juego está en `<game folder>\Music`.

## Notas

- El audio va en la sección **Sounds** de GameBanana, no en Mods. Consulta [Publicar en GameBanana](../../publishing.md).
- Para sonidos nuevos que use una clase de unidad, consulta [Gráficos personalizados](../../graphics.md) (`<sounds attack="…" die="…"/>`).
- Los vídeos y la música son iguales en todos los idiomas: solo cambian con el idioma las voces, los textos, la ayuda y algunas imágenes de menú ([Idiomas](../../languages.md)).

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
