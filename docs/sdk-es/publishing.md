# Publicar un mod en GameBanana

Los mods de Imperivm Resurrected se publican en https://gamebanana.com/games/26069. La pestaña **Explorar contenido** del gestor de contenido lee esa página: busca, filtra, abre la página de un mod y lo instala con un clic. Para que tu mod aparezca en el tipo y los filtros correctos, sigue estos pasos.

## Antes de subirlo

1. Pon la categoría en tu `mod.json` (una de la tabla de abajo) y, si hace falta, sus [tags](#tags): más categorías si tu mod hace varias cosas, los jugadores si es un escenario y el idioma si es una aventura, una traducción o un paquete de audio:

   ```json
   {
     "id": "duel-on-the-nile",
     "name": "Duel on the Nile",
     "version": "1.0",
     "authors": ["Your name"],
     "category": "Scenarios",
     "tags": ["Players: 2"]
   }
   ```

2. Pásalo por el [validador](validating.md). Avisa si la categoría no es una que el juego reconozca o usa un nombre antiguo, si un tag está mal escrito, si un escenario no tiene tag de jugadores y si una aventura, una traducción o un paquete de audio no tiene tag de idioma.

3. Comprime la carpeta del mod en un zip, con su `mod.json` dentro. No incluyas ejecutables ni scripts de sistema (`.exe .dll .asi .bat .cmd .com .scr .ps1 .vbs .js .msi .sys .cpl .lnk .reg .jar .hta .wsf .pif`): un mod que contenga alguno no se carga.

## En GameBanana

1. Ve a **Add → Mod** desde la página del juego (`https://gamebanana.com/mods/add?_idGameRow=26069`). El audio es la excepción: va en **Add → Sound** (`https://gamebanana.com/sounds/add?_idGameRow=26069`). Lo que se suba como Tool o Script no aparece en el juego.
2. **Category**: la misma que en tu `mod.json`.
3. **Tags**: los mismos tags. Cada uno tiene un título y un valor: en `Type: Civilizations` el título es `Type` y el valor `Civilizations`. No hace falta crearlos antes: se escriben en cada mod.
4. **Files**: tu `.zip` y, en el campo **Version**, la misma versión que en `mod.json`. Cada versión nueva es un archivo nuevo: no reemplaces el anterior, porque quien juegue en línea con la versión antigua sigue necesitándolo.
5. **Requirements**: si tu mod necesita otro, enlaza su página (`https://gamebanana.com/mods/...`, o `https://gamebanana.com/sounds/...` para audio). El juego lo instala junto con el tuyo.
6. Al menos una captura de pantalla. La primera es la imagen que se muestra en el juego.
7. Para el registro de cambios, publica un **Update** con la versión como título (por ejemplo `1.1`). El juego lo muestra junto a esa versión.

Solo reciben el aviso de versión nueva quienes instalaron el mod desde Explorar contenido (eso escribe `sources.gamebanana` en su `mod.json`, o `sources.gamebananaSound` si viene de Sounds), o quienes tienen un mod con el mismo `id` que la entrada. Si alguien descarga el zip a mano y lo descomprime, no recibe aviso.

## Categorías

**En resumen:** en GameBanana eliges **una categoría**, la que mejor describe el mod en conjunto. Todo lo demás que aporte va en los **tags** `Type`, `Players` y `Language`: añade todos los que apliquen, y solo esos.

GameBanana permite solo una por mod: elige aquella en la que el mod más aporta. Si tu mod hace más, por ejemplo uno grande que trae civilizaciones y mapas, añade las demás con tags `Type` (mira [Tags](#tags)) y aparecerá en todas. Hay nueve, en los tres tipos que distingue el juego. El tipo no lo decide la categoría sino los archivos del mod (mira [¿Qué cuenta como jugabilidad?](README.md#what-counts-as-gameplay)); la categoría es cómo lo encuentra la gente en Explorar contenido.

| Categoría | En el juego | Qué va aquí | Dónde van sus archivos | Ejemplo |
|---|---|---|---|---|
| **Cambian la jugabilidad** | | *Todos los jugadores en línea deben tenerlos* | | |
| **Gameplay & Balance** | Gameplay & Balance | Reglas, estadísticas, costes, IA; también mods grandes que cambian todo el juego | `data\`, parches | [patches-example](examples/patches-example), [scripts-example](examples/scripts-example), [custom-orders](examples/custom-orders) |
| **Units & Heroes** | Units & Heroes | Unidades y héroes nuevos o modificados | `data\classes\`, `specials\` | [ability-example](examples/ability-example), [specialty-example](examples/specialty-example) |
| **Civilizations** | Civilizations | Civilizaciones nuevas o rehechas | `civs\`, `data\` | [civilization-example](examples/civilization-example) |
| **Contenido para jugar** | | *Solo lo necesita quien lo juega* | | |
| **Scenarios** | Scenarios | Mapas para escaramuza y multijugador | `scenarios\MyMap.bfhp` | [random-map-example](examples/random-map-example) |
| **Adventures** | Adventures | Grandes batallas, desafíos y campañas de un jugador, con historia y objetivos | `adventures\` | |
| **Conquests** | Conquests | Mapas y partidas de conquista | `conquests\` | |
| **Cosméticos** | | *Cada jugador tiene los suyos* | | |
| **Graphics** | Graphics | Texturas, aspecto de unidades, terreno, menús, iconos, fuentes | las rutas de paquetes del juego, `menuini\` | |
| **Audio & Voices** | Audio & Voices | Música, sonidos y voces. Se publica en la sección **Sounds** de GameBanana, no en Mods | `sounds\`, `currentlang\voices\` | |
| **Translations** | Translations | El juego o un mod en otro idioma, textos cambiados | `loc\` | [french-language](examples/french-language), [custom-texts](examples/custom-texts) |

Cada categoría tiene una [plantilla](templates) con la estructura de sus carpetas. Para [escenarios, aventuras y conquistas](maps.md) y para el [audio](audio.md) hay además guías breves.

**Mapas sueltos.** Si el `.zip` solo contiene el `.bfhp`, sin carpetas, el juego lo coloca solo al instalarlo, según el tipo que declara el propio mapa (lo que eligió su autor en el editor): una aventura va a `adventures\` (con su `.bmp` del mismo nombre), una conquista a `conquests\` y un mapa de escaramuza a `scenarios\`, o a `adventures\` si la categoría es Adventures (misiones de un jugador hechas como un mapa normal). Aun así, es mejor subirlo ya dentro de su carpeta; el [validador](validating.md) avisa cuando un mapa está en la equivocada, por ejemplo una aventura en `scenarios\`, que la lista de Scenarios no muestra.

**Vista previa del escenario.** Cuando se elige un escenario en la sala, el juego dibuja una vista previa a partir del terreno del propio mapa, con sus jugadores y sus civilizaciones, y de dónde procede: no hace falta subir ninguna imagen. Los colores salen de los mosaicos del minimapa del juego, así que un terreno nuevo se ve bien si trae su mosaico en `minimapzoom8\terrain`.

**Nombres antiguos.** Scenarios, Adventures y Conquests se llaman como las carpetas del juego (`scenarios\`, `adventures\`, `conquests\`). Antes eran **Maps**, **Campaigns** y **Conquest**: un `mod.json` con esos nombres, o con `Interface` o `Total Conversions`, sigue funcionando, pero el validador pide el nombre nuevo.

## Tags

Cada tag tiene un título y un valor. El juego usa tres:

| Tag | Para qué | Ejemplo |
|---|---|---|
| `Type: <category>` | Más categorías, además de la principal. Un tag por categoría | `Type: Civilizations`, `Type: Scenarios` |
| `Players: <players>` | Jugadores de un escenario, de 2 a 8. Puedes añadir varios | `Players: 4`, `Players: 2-4` |
| `Language: <language>` | Idioma de una aventura, una traducción o un paquete de audio: `Spanish`, `English`, `Italian`, `German`, `French`, `Polish` o `Multilingual`. Puedes añadir varios | `Language: English` |

Escríbelos exactamente como se muestran, en inglés, en los `tags` de tu `mod.json` (por ejemplo `"tags": ["Type: Scenarios", "Players: 2-4"]`) y en el campo **Tags** de GameBanana: el juego los muestra en el idioma de cada jugador. Usa solo estos tres: el juego no usa ningún otro, y el validador avisa si hay alguno más.

Un escenario sin `Players` no aparece al filtrar por jugadores, y una aventura, una traducción o un paquete de audio sin `Language` no aparece al filtrar por idioma. Lo mismo vale para las categorías de `Type`: un mod con `Type: Scenarios` necesita `Players` para aparecer al filtrar por jugadores.

Las formas sin título de versiones anteriores (`4 players`, `Spanish`) siguen funcionando, pero el validador pide la nueva. Los tags `Gameplay`, `Cosmetic` y `Online tested` ya no hacen falta: si un mod cambia la jugabilidad, el juego lo sabe por sus archivos.

## Mods anteriores a Imperivm Resurrected

Los mods antiguos se instalaban copiándolos sobre el juego: traen paquetes `.pak` enteros que reemplazan los del juego, y casi todo lo que hay dentro son archivos del juego sin tocar. Conviértelos para que contengan solo lo que cambian o añaden:

```
node tools/shrink-mod.js <old mod> <game folder> <new folder> --id my-mod --name "My mod" --version 1.0 --category "Gameplay & Balance"
```

La herramienta calcula qué ve el juego con el mod copiado encima y qué ve sin él, y conserva solo la diferencia:

- De los paquetes, los archivos que difieren de los del juego, respetando su orden (en una carpeta gana el paquete de nombre mayor, como `zzMod.pak` sobre `Data.pak`).
- Los textos y sonidos de cada idioma en `Local\<language>\` (o en `currentlang\` si son iguales en todos), y el resto de un paquete de idioma en `Local\<language>.pak`.
- Lo que el mod antiguo quitó del juego al reemplazar sus paquetes, en `hidden.txt`, para que el juego tampoco lo vea.
- `data\const.ini` como parche y sin la sección `[Resolutions]`: la resolución la elige el jugador en las opciones.
- Si el mod trae su propio `rle.mmp`, solo lo que cambia o añade respecto al del juego, en `rle.mmp.tail`; el del juego se deja como está.
- Deja fuera las copias `.bak`, `Config.ini` y `Settings.ini` (ajustes de instalación) y los ejecutables, con los que el mod no se cargaría.

Opciones:

- `--exclude <patterns>` deja fuera más archivos del mod antiguo, como las guías de instalación (rutas con `*` y `?`, separadas por comas).
- `--hide <patterns>` oculta archivos sueltos del juego que el léame del mod antiguo mandaba borrar (por ejemplo `currentlang/*,units/*`).
- `--paths`, en lugar de la carpeta de salida, solo muestra qué carpetas hay dentro de los paquetes, sin escribir nada.

La carpeta de salida tiene que estar vacía. Si el mod antiguo ya tiene un `mod.json`, la herramienta lo conserva, salvo `sources` (de dónde se descarga el mod original), para que los avisos de versión no apunten a la página de otra persona. Al final indica qué dejó fuera y qué oculta.

Pruébalo en el juego antes de subirlo.
