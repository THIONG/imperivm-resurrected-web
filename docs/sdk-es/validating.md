# Validar un mod

El validador comprueba tu mod sin abrir el juego e informa de los problemas con archivo y línea. Necesitas [Node.js](https://nodejs.org).

```
node tools/validate-mod.js <mod folder>
node tools/validate-mod.js <mod folder> --data <DATA folder>
```

`--data` es la carpeta `DATA` del `data.pak` extraído (`tools/extract-data.js` lo extrae, mira el [README](README.md#game-data)). Con ella, el validador comprueba además que existen los archivos que tu mod parchea y los scripts a los que apuntan tus clases. Solo mira las rutas que empiezan por `data/`: si parcheas `units/…`, `buildings/…` o `currentlang/…`, no las comprueba. Sin `--data`, todo lo demás se comprueba igualmente.

Con `--game <game folder>` (solo lectura) comprueba los nombres de `Units.pak`, `Buildings.pak`, `MapObjects.pak` y `Visuals.pak` para ver si existen las imágenes y las entidades que tu mod toma del juego, y avisa si tu `.rle` se llama igual que uno del juego:

```
node tools/validate-mod.js <mod folder> --data <DATA> --game "C:\Program Files (x86)\Steam\steamapps\common\Imperivm - Great Battles of Rome HD"
```

Termina con código 1 si hay errores, 0 si solo hay avisos o nada, y 2 si lo llamas mal. Puedes usarlo para automatizarlo.

Un error es algo que el juego rechazaría o que va a fallar. Un aviso es una sospecha: algo que el juego ignora o que probablemente no querías.

## Qué comprueba

- **`mod.json`**: JSON roto, una categoría que no es de GameBanana, textos con el tipo equivocado (errores). Falta de `id`, `name`, `version` o `category`, un nombre de categoría antiguo, etiquetas mal escritas, en la forma antigua o que el juego no usa, un mapa sin etiqueta de jugadores y una campaña, traducción o paquete de audio sin etiqueta de idioma (avisos).
- **Archivos**: extensiones de ejecutables y de scripts del sistema (error: el mod no se cargaría) y rutas con `..`. Una extensión rara pero inofensiva (`.psd`, `.gif`, `.zip`…) solo da un aviso: el mod se carga, el archivo solo ocupa espacio.
- **Mapas (`.bfhp`)**: el tipo que declara el propio mapa (escenario, aventura o conquista) frente a la carpeta en la que está. Una aventura o una conquista en `scenarios\` no aparece en la lista de Escenarios; un mapa suelto en la raíz se coloca al instalar (avisos).
- **`civs\*.json`**: un `id` no válido, un `index` fuera de 10–99 o duplicado, una `base` que no existe, una `letter` de más de una letra, un `biome` desconocido, una `template` mal escrita o sin su archivo. Con `"ai": true` y sin tabla `alias` avisa, y comprueba que el `alias` apunte a clases y comandos que tiene el mod.
- **`specials\*.json`**: un `id` no válido o que es una especialidad de unidad del juego, un `bit` fuera de 36–63 o duplicado.
- **`options\*.json`**: el reparto de bits (caben 8 entre todos los mods).
- **Parches XML**: XML mal formado (el parche no se aplicaría en absoluto), una operación sin `select`, un selector mal escrito, etiquetas que no son operaciones. Un selector que no empieza por `/` o `//` es un error aunque la DLL lo aceptaría.
- **Parches de script (`.vs`)**: una directiva que no existe, `@before`, `@after` o `@replace` sin texto, una directiva sin código debajo, y `@top` con código que no es una declaración de variable. No comprueba el código del parche, ni las funciones `Mod_*`, ni la firma.
- **Parches INI**: líneas que no consigue entender, y una sección nueva en `UNIT_SPECIALS.INI` (el juego puede cerrarse). No avisa de los comentarios al final de una línea del parche, que el motor no admite (mira [Parches](patches.md)).
- **Clases (`data\classes`)**: XML mal formado, una `race` desconocida, `unit_specials` mal escritas o desconocidas (el juego distingue mayúsculas: `Parry`, no `parry`), y una clase sin `entity` (aviso: el juego no la hereda del padre y la unidad desaparece).
- **Codificación**: un XML de clase en Latin-1 con caracteres acentuados. El juego no carga la clase y no avisa; guárdalo en UTF-8.
- **Comandos (`data\commands`)**: XML mal formado, y un aviso cuando dos comandos con el mismo nombre son para el mismo edificio (tendría dos botones con ese nombre). Con el mismo nombre para edificios distintos funcionan: el juego enlaza cada uno con los edificios de su `<src>`.
- **Entidades (`.ent.xml`)**: error si la imagen no existe (el juego se cuelga al cargar la clase; se comprueba contra la carpeta del mod si incluye sus archivos `.rle`, y siempre con `--game`), `idx` duplicado o fuera de 1–32, capas y animaciones que apuntan a algo que no está, límites del motor (32 imágenes, 32 capas, 8 estados, animaciones 1–28, 64 fotogramas), y `columns`, `rows` o un número de `<frame>` que no cuadran. Una animación que lee más filas de las que tiene su imagen es solo un aviso.
- **Gráficos (`.rle`, `.pass`)**: un `.rle` truncado o corrupto, un `.rle.mmp` renombrado (sin píxeles, no se carga desde un mod), una paleta vacía, un `.pass` mal formado o vacío, un `pass_file` que no existe, y un `.rle` con el mismo nombre que uno del juego (gana el del juego; con `--game`).
- **`placeobjects.xml`** (mapas aleatorios): una clase nombrada que no existe (con `--data`). La generación del mapa se cuelga sin ningún mensaje.
- **Textos (`loc`)**: XML mal formado, entradas sin `text` o sin `result`.
- **Scripts (`.vs`)**: falta de firma en la primera línea (salvo en los comportamientos de una clase, los modos de victoria y los scripts de objetos, que el juego carga siempre con su propia firma), un evento desconocido o con la firma equivocada, `Sleep` en un evento que no puede esperar, funciones `Mod_*` que no existen, `Mod_HasSpecial` con un `Obj` en lugar de un `Unit`.

## Ejemplo de salida

```
WARNING  specials/c.json  no "name": the id will be shown
ERROR  specials/d.json  bit 40 is already used by specials/c.json
WARNING  data/classes/G.sc.xml:2  unknown unit special "Zzz": the game ignores it

5 files checked: 1 errors, 5 warnings.
```

## Qué no hace

No aplica parches ni ejecuta scripts: eso solo lo ves en el juego (usa `Dump=` de [Parches](patches.md) para ver el resultado, y `Logs\imperivm\imperivm-mod.log` para los errores en ejecución). Tampoco juzga la calidad de las imágenes.

Está pensado para los mods nuevos hechos con este SDK. Un mod antiguo que funciona en el juego, como el Community Mod, da errores (scripts sin firma, scripts de clase que no existen, filas de animación) sin que eso signifique que no vaya a cargarse.
