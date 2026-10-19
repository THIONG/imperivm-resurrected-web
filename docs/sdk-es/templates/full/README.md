# Plantilla completa

Todas las carpetas que el juego lee de un mod, cada una con una nota sobre lo que va dentro. Úsala cuando tu mod haga varias cosas; para una sola, las otras plantillas son más cortas:

| Qué haces | Plantilla |
|---|---|
| Un mapa de escaramuza y multijugador | [escenario](../scenario) |
| Una aventura o campaña, con vídeos o sin ellos | [aventura](../adventure) |
| Una conquista, con vídeos o sin ellos | [conquista](../conquest) |
| Una unidad o un héroe | [unidades](../units) |
| Una civilización | [civilización](../civilization) |
| Reglas, estadísticas, IA, modos de victoria, opciones | [jugabilidad](../gameplay) |
| Música, sonidos, voces | [audio](../audio) |
| El juego en otro idioma | [traducción](../translation) |
| Texturas, sprites, iconos, menús | [gráficos](../graphics) |

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. Elige `category` de la lista de [Publicar en GameBanana](../../publishing.md). `tags` solo hace falta para un mapa (jugadores) o para una aventura, una traducción o un paquete de audio (idioma).
4. **Borra todas las carpetas que no uses.** Una carpeta vacía con su nota es inofensiva, pero una que se quede dentro de `scenarios\`, `data\` o `patches\` hace que el juego trate el mod como jugabilidad: todos los que jueguen en línea lo necesitarían.
5. En las carpetas que conserves, borra la nota `PUT-YOUR-FILES-HERE.txt` cuando añadas tus archivos.

## Carpetas

| Carpeta | Qué va dentro | Cuenta como jugabilidad |
|---|---|---|
| `data\classes\` | Clases de unidades, edificios y héroes (.sc.xml): nuevas o copias de las del juego. [guía](../../units.md) | sí |
| `data\commands\` | Órdenes y sus botones (.xml). [guía](../../units.md) | sí |
| `data\GameScripts\` | Modos de victoria: un .vs por modo. [guía](../../victory-modes.md) | sí |
| `data\BonusScripts\` | Bonificaciones iniciales: NNN NAME.vs. [guía](../../bonuses.md) | sí |
| `data\mod\` | Tus propios scripts, llamados desde eventos y clases. [guía](../../scripts.md) | sí |
| `patches\data\` | Parches sobre los archivos del juego, con la misma ruta y el mismo nombre. [guía](../../patches.md) | depende del archivo |
| `events\` | Scripts de eventos: OnGameStart.vs, OnObjectDie.vs, etcétera. [guía](../../scripts.md) | sí |
| `civs\` | Civilizaciones nuevas: <id>.json, uno por civilización (index de 10 a 99). Sus unidades y edificios van en data/classes y sus órdenes en data/commands; clone-civilization.js escribe todo eso. [guía](../../civilizations.md) | sí |
| `specials\` | Especialidades de unidad nuevos: *.json. [guía](../../specials.md) | sí |
| `options\` | Interruptores de la sala: *.json. [guía](../../options.md) | sí |
| `scenarios\` | Mapas de escaramuza y multijugador (.bfhp). | sí |
| `adventures\` | Aventuras (.bfhp y el .bmp del mismo nombre). | sí |
| `conquests\` | Conquistas (.bfhp), con su carpeta en conquestmaps. | sí |
| `conquestmaps\` | La carpeta de cada mapa de conquista: territories.xml y sus imágenes. | sí |
| `movies\` | Vídeos (.avi) que un mapa reproduce con PlayMovie. | no |
| `music\` | Música (.ogg), con el mismo nombre que la del juego para reemplazarla. | no |
| `sounds\` | Sonidos (.wav), con la misma ruta que los del juego. | no |
| `loc\` | Textos: <language>.loc.xml. [guía](../../languages.md) | no |
| `units\` | Sprites de unidades (.rle) y archivos de entidad. Los .xml y .pass cuentan. [guía](../../graphics.md) | solo .xml y .pass |
| `buildings\` | Sprites de edificios y archivos de entidad. Los .xml y .pass cuentan. [guía](../../graphics.md) | solo .xml y .pass |
| `mapobjects\` | Archivos de objetos de mapa. Los .xml y .pass cuentan. | solo .xml y .pass |
| `visuals\` | Efectos y proyectiles. Solo cuenta el .xml. | solo .xml |
| `gameres\` | Imágenes de interfaz sueltas: iconos y botones. [guía](../../images.md) | no |
| `packs\` | Mapas (.bfhp) y paquetes (.pak) montados junto a los del juego. | depende del contenido |
| `randommap\` | Formas de mapa aleatorio. [guía](../../random-maps.md) | sí |
| `randommapsettlements\` | Plantillas de ciudad y aldea. [guía](../../city-templates.md) | sí |

La carpeta `patches\` no está en la plantilla (un archivo de notas ahí se marcaría como parche incorrecto): créala con la ruta del archivo del juego que parcheas. Los archivos que no aparecen en la lista van en la misma ruta que tienen en el juego. No se permiten ejecutables ni scripts del sistema (`.exe .dll .asi .bat .cmd .com .scr .ps1 .vbs .js .msi .sys .cpl .lnk .reg .jar .hta .wsf .pif`): un mod que incluya uno no se carga. La referencia completa es [Referencia](../../reference.md).

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
