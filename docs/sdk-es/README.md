# SDK de Imperivm Resurrected

Imperivm Resurrected es un mod para Imperivm HD (Great Battles of Rome) que abre el juego a mods que antes no eran posibles: civilizaciones nuevas, habilidades, objetos, modos de victoria, idiomas, scripts que reaccionan a lo que pasa en la partida y más. Aquí están las guías y las herramientas para crearlos. Cada guía incluye un mod de ejemplo en [`examples/`](examples).

## Por dónde empezar

1. Instala Imperivm Resurrected: copia su contenido en la carpeta del juego (`...\steamapps\common\Imperivm - Great Battles of Rome HD`) y lanza el juego desde Steam.
2. Copia una carpeta de [`templates/`](templates) en `mods\`, dentro de la carpeta del juego: tiene la estructura exacta que el juego espera para lo que quieres hacer (mira [Plantillas](#templates)). Para ver un mod terminado, copia uno de [`examples/`](examples), por ejemplo `patches-example`.
3. En el menú principal, pulsa **Contenido adicional** y activa el mod en tu perfil.
4. Reinicia el juego si no se ha reiniciado solo.
5. Abre `Logs\imperivm\imperivm-mod.log`, en la carpeta del juego. Ahí aparecen los errores de tu mod y lo que ha cargado.

Antes de lanzar el juego, pasa tu mod por el [validador](validating.md).

## Cómo es un mod

Una carpeta dentro de `mods\` con un `mod.json` y los archivos que cambia o añade, con las mismas rutas que usa el juego:

```
mods\
  my-mod\
    mod.json
    data\classes\MyUnit.sc.xml       <- new file, or one that replaces the game's
    loc\english.loc.xml              <- texts added to the game's
```

## Plantillas

Una plantilla es un mod vacío con las carpetas que lee el juego, un `mod.json` válido y un README con los pasos. Copia la que corresponda a lo que haces, cámbiale el nombre, rellena `mod.json` y pon tus archivos donde indican las notas. Cada carpeta vacía lleva una nota `PUT-YOUR-FILES-HERE.txt`: bórrala cuando añadas tus archivos.

| Qué haces | Plantilla | Guía |
|---|---|---|
| Un mapa para escaramuza y multijugador | [`scenario`](templates/scenario) | [Mapas](maps.md) |
| Una aventura o campaña, con o sin vídeos | [`adventure`](templates/adventure) | [Mapas](maps.md) |
| Una conquista, con o sin vídeos | [`conquest`](templates/conquest) | [Mapas](maps.md) |
| Una unidad o un héroe | [`units`](templates/units) | [Unidades nuevas](units.md) |
| Una civilización | [`civilization`](templates/civilization) | [Civilizaciones](civilizations.md) |
| Reglas, estadísticas, IA, modos de victoria, opciones | [`gameplay`](templates/gameplay) | [Parches](patches.md), [Scripts](scripts.md) |
| Música, sonidos, voces | [`audio`](templates/audio) | [Audio](audio.md) |
| El juego en otro idioma | [`translation`](templates/translation) | [Idiomas](languages.md) |
| Texturas, sprites, iconos, menús | [`graphics`](templates/graphics) | [Gráficos personalizados](graphics.md) |
| Varias de las anteriores | [`full`](templates/full) | [Referencia](reference.md) |

No incluyas ejecutables ni scripts del sistema (`.exe .dll .asi .bat .cmd .com .scr .ps1 .vbs .js .msi .sys .cpl .lnk .reg .jar .hta .wsf .pif`). Si hay alguno, el mod no se carga. Un `.js` suelto, como un generador tuyo, cuenta.

## `mod.json`

```json
{
  "id": "my-mod",
  "name": "My mod",
  "version": "1.0",
  "authors": ["Me"],
  "description": "What my mod does.",
  "category": "Gameplay & Balance",
  "redistributable": true
}
```

| Campo | Para qué sirve |
|---|---|
| `id`, `name`, `version`, `authors`, `description` | La ficha del mod en el gestor de contenido. `name` y `description` aceptan un único texto o un objeto con un texto por idioma (se muestra el del idioma del juego; si falta, el inglés; si falta, el primero). |
| `category`, `tags` | La categoría principal de GameBanana y las etiquetas: más categorías (`Type`), jugadores (`Players`) e idioma (`Language`). Mira [Publicar en GameBanana](publishing.md). |
| `redistributable` | Con `true`, el anfitrión de la sala puede enviar el mod a los jugadores que no lo tienen. Por defecto es `false`. |
| `license` | Texto libre con la licencia. |
| `requires` | Mods que necesita: una lista de ids o de objetos `{"id": "...", "version": "..."}`. |
| `incompatibleWith` | Lista de ids de mods con los que no se puede activar. |
| `loadAfter`, `loadBefore` | Lo que pides sobre el [orden de carga](reference.md#1-mod-structure), por id; el juego resuelve el resto. Con `loadAfter`, tu mod queda por encima de ese: sus archivos, parches y textos ganan (salvo un archivo que el otro lleve suelto y el tuyo dentro de un `.pak`: gana el suelto). |
| `sources` | `{"url": "...", "gamebanana": 123456}`. El juego lo escribe cuando instalas desde Explorar contenido y sirve para avisar de versiones nuevas. Si viene de la sección Sounds, el número va en `gamebananaSound`. |
| `language` | Declara un idioma nuevo. Mira [Idiomas](languages.md). |
| `commands` | Nombre de cada archivo de comandos en la pantalla Controles. Mira [Teclas de mod](keys.md). |

> Hasta la 0.31.50, los nombres de estos campos estaban en español (`nombre`, `autores`, `descripcion`, `etiquetas`, `categoria`, `redistribuible`, `licencia`, `requiere`, `incompatibleCon`, `cargarDespuesDe`, `cargarAntesDe`, `fuentes`, `idioma`, `ordenes`…). Los antiguos se siguen leyendo, pero escribe los nuevos.

## Guías

- [Idiomas y textos](languages.md): cambia textos del juego o añade un idioma sin reemplazar el archivo entero.
- [Teclas de mod](keys.md): cómo aparecen los comandos de tu mod en Controles y cómo nombrarlos.
- [Parches](patches.md): cambia una parte de un XML, INI o script del juego sin reemplazarlo; dos mods pueden tocar el mismo archivo.
- [Scripts](scripts.md): scripts `.vs`, eventos y las funciones `Mod_...`.
- [Civilizaciones](civilizations.md): declara una civilización nueva o clona una del juego, con su IA, y juégala en la sala.
- [Plantillas de ciudad y aldea](city-templates.md): la ciudad y la aldea iniciales propias de una civilización de mod (`create-template.js`).
- [Unidades nuevas](units.md): clase, comando de reclutamiento, imágenes y textos, y cómo reutilizar el modelo de otra unidad.
- [Estadísticas de unidades](stats.md): qué hace cada atributo, cuáles no hacen nada y cuáles cuelgan el juego.
- [Especialidades de unidad](specials.md): especialidades de unidad nuevos y su efecto mediante scripts.
- [Habilidades de tropa](abilities.md): habilidades nuevas para unidades o héroes (un comando con botón y tecla, más un método de script).
- [Objetos nuevos](items.md): amuletos, hierbas y gemas de héroe.
- [Formaciones nuevas](formations.md): formaciones de héroe con sus bonificaciones y su botón.
- [Fortines y edificios](outposts.md): fortines neutrales nuevos en mapas aleatorios (`create-outpost.js`) y clases de torre, muralla y puerta.
- [Modos de victoria](victory-modes.md): un script en `data\GameScripts` añade un modo al desplegable "Mode" de la sala.
- [Bonificaciones iniciales](bonuses.md): los scripts de `data\BonusScripts` añaden opciones a la columna "Bonus" de la sala.
- [Opciones de partida personalizadas](options.md): interruptores nuevos en las reglas de la sala, que los scripts leen con `Mod_GetOption`.
- [Escenarios, aventuras y conquistas](maps.md): los tres tipos de mapa, los archivos que necesita cada uno y los vídeos.
- [Música, sonidos y voces](audio.md): reemplaza o añade audio.
- [Tipos de mapa aleatorio](random-maps.md): un dibujo de cuatro colores se convierte en un tipo de mapa nuevo (`create-random-map.js`).
- [Imágenes personalizadas](images.md): botones de comando e iconos de unidad a partir de un PNG.
- [Gráficos personalizados](graphics.md): sprites propios para unidades y edificios (`convert-sprite.js`, `create-entity.js`, `read-rle.js`).
- [Validar un mod](validating.md): comprueba un mod sin abrir el juego, con el archivo y la línea de cada problema.
- [Publicar en GameBanana](publishing.md): categorías, etiquetas, subida y mods hechos antes del SDK.
- [Referencia](reference.md): la lista completa de lo que puede declarar un mod (archivos, campos, parches, eventos, funciones y límites).

## Herramientas

Están en `tools\` y necesitan [Node.js](https://nodejs.org). Abre una terminal en esta carpeta y ejecútalas desde aquí (`node tools\validate-mod.js ...`). Cada una explica cómo se usa si la ejecutas sin argumentos, y la guía de su tema trae ejemplos.

| Quieres… | Usa |
|---|---|
| Una unidad nueva | `create-unit.js` ([guía](units.md)) |
| Un objeto nuevo | `create-item.js` ([guía](items.md)) |
| Una habilidad nueva | `create-ability.js` ([guía](abilities.md)) |
| Una formación nueva | `create-formation.js` ([guía](formations.md)) |
| Una opción de partida | `create-option.js` ([guía](options.md)) |
| Una civilización nueva | `clone-civilization.js` ([guía](civilizations.md)) |
| La ciudad y la aldea propias de una civilización | `create-template.js` ([guía](city-templates.md)) |
| Un fortín neutral | `create-outpost.js` ([guía](outposts.md)) |
| Un tipo de mapa aleatorio | `create-random-map.js` ([guía](random-maps.md)) |
| Botones e iconos a partir de un PNG | `convert-image.js` ([guía](images.md)) |
| Sprites a partir de PNG, y el archivo de entidad de una unidad o un edificio | `convert-sprite.js`, `create-entity.js`, `read-rle.js` ([guía](graphics.md)) |
| Redibujar los sprites de `unit-graphics-example` | `draw-soldier.js` ([ejemplo](examples/unit-graphics-example)) |
| Comprobar un mod sin abrir el juego | `validate-mod.js` ([guía](validating.md)) |
| Adaptar un mod hecho antes del SDK | `shrink-mod.js` ([guía](publishing.md)) |
| Extraer los datos del juego | `extract-data.js` (abajo) |

## Datos del juego

Varias herramientas piden la carpeta `DATA` del juego. `extract-data.js` la extrae (necesitas [Node.js](https://nodejs.org)):

```
node tools/extract-data.js "<game folder>" <output folder>
```

Deja `data.pak` en `<output folder>\DATA`. Esa es la carpeta que piden `clone-civilization.js`, `create-outpost.js` y `validate-mod.js --data`.

## ¿Qué cuenta como jugabilidad?

En multijugador, todos deben usar los mismos mods si estos cambian lo que ocurre en la partida. El juego lo deduce por las carpetas que toca tu mod: `data/`, `scenarios/`, `adventures/`, `conquests/`, `civs/`, `specials/`, `events/`, `options/`, `rules/`, `modes/`, `randommap/`, `randommapsettlements/`, los archivos `.xml` y `.pass` de `units/`, `buildings/` y `mapobjects/`, los `.xml` de `visuals/`, los mapas `.bfhp` de `packs/` y los parches (según el archivo que parchean).

Los gráficos, los sonidos, los textos (`loc/`) y los idiomas no cuentan: cada jugador puede usar los suyos.

## Si algo falla

Los errores de tu mod se muestran en su ficha del gestor de contenido y en `Logs\imperivm\imperivm-mod.log`. Cada línea del registro lleva la hora, un nivel (`I` información, `W` advertencia, `E` error) y una etiqueta con la parte del mod de la que viene: `patch`, `language`, `civilizations`, `specials`, `script`, `event`. Mira primero las líneas `W` y `E` de las etiquetas de tu mod.

El registro conserva las cinco últimas sesiones (`imperivm-mod.1.log` a `imperivm-mod.4.log`) y, si el juego se cerró mal, `imperivm-mod.crashed.log`. Para tener más detalle de una parte, pon su etiqueta y un nivel bajo `[Debug]` en `imperivm-mod.ini`, por ejemplo `LogChannels=patch:debug`; `LogLevel=debug` lo hace para todo.

Para pedir ayuda, pulsa el corazón de la esquina inferior izquierda del menú principal y luego **Crear informe**. Genera un zip con los registros y tu sistema, sin tu nombre de usuario de Windows, sin los ids de Steam y sin direcciones IP, y no envía nada: tú decides si lo compartes.

## Versión y licencia

La versión del SDK y los cambios de cada una están en [Cambios](CHANGELOG.md). La licencia está en [Licencia](LICENSE.md).
