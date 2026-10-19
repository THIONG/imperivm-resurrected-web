# Modos de victoria propios

Las condiciones de victoria del juego (Elimination, Score limit…) son scripts `.vs`. Un mod puede traer los suyos, y aparecen solos en el desplegable "Mode" de la sala.

Ejemplo: [`examples/victory-example`](examples/victory-example) (el modo "Dominio": gana quien controla N asentamientos).

## El script

Va en `data\GameScripts\` dentro de tu mod:

```
data\GameScripts\6 Dominio.vs
```

- **El nombre del archivo es el id del modo**, número incluido. La sala lista los modos por el nombre completo del archivo. Dos mods solo chocan si usan exactamente el mismo nombre (`6 Dominio.vs` en ambos). Los modos del propio juego son del 1 al 5.
- La sala lo muestra sin el número inicial y lo pasa por la traducción: si el texto "Dominio" tiene una entrada en tu `loc`, aparece traducido ([Idiomas](languages.md)).
- La firma es `//void, int player, str param`. El juego siempre carga el script con ella, así que la primera línea es opcional, pero conviene escribirla. `player` es el jugador (de 1 a 8). `param` es el valor del límite elegido en la sala (mira más abajo).
- El juego lanza 8 copias del script, una por jugador, cada una en su propio hilo, aunque haya menos jugadores. Escríbelo desde el punto de vista de un solo jugador, mirando a los demás. Tiene que soportar los huecos vacíos: el ejemplo los trata como eliminados porque no tienen asentamientos ni tropas.

## Funciones que usarás

| Función | Qué hace |
|---|---|
| `EndGame(player, false)` / `EndGame(player, true)` | El jugador gana / pierde. Sigue con un `return` |
| `SetPlayerStatus(player, linea, texto, important)` | Texto de estado en la parte superior: la línea 0 es el nombre del modo, la 1 el aviso. También existe `SetPlayerStatus(player, linea, bool)`; los scripts del juego usan las dos |
| `ClassPlayerObjs("BaseTownhall", player)` | Los objetos de una clase de un jugador; `.count` los cuenta, `.IsEmpty()` dice si no hay ninguno |
| `MilUnits(player)` | Cuántas tropas tiene |
| `DiplAreAllied(a, b)` | Si dos jugadores son aliados |
| `Str2Int(param)` | Convierte `param` en número |
| `EnvReadInt` / `EnvWriteInt` | Variables compartidas entre scripts. Con un jugador (`EnvWriteInt(player, "clave", n)`) o sin él (`EnvWriteInt("modo", 1)`) |
| `GetConst("…")` | Constantes de `CONST.INI` |
| `Translate("…")` / `Translatef("…", a, b)` | Texto localizado |

Para ver cómo lo hace el juego, extrae sus scripts con `extract-data.js` (`node tools\extract-data.js "<game folder>" <output folder>`) y lee `GAMESCRIPTS\1 ELIMINATION.VS` y `2 SCORE LIMIT.VS`. También puedes usar el volcado de [Parches](patches.md), con la ruta completa: `Dump=data/GameScripts/1 ELIMINATION.VS`.

## El desplegable "Limit"

El juego lo rellena con entradas de `CONST.INI`, sección `[GamePlay]`. La clave es el nombre del archivo con `_` en lugar de espacios, más un número desde 0. El valor tiene dos partes separadas por una coma: el texto que ves y lo que el script recibe como `param`.

El ejemplo lo hace con un parche de INI en `patches\data\const.ini`:

```ini
[GamePlay]
6_Dominio0 = 2 asentamientos, 2
6_Dominio1 = 3 asentamientos, 3
6_Dominio2 = 4 asentamientos, 4
6_Dominio3 = 5 asentamientos, 5
```

Sin entradas, el desplegable sale vacío y no hay límite que elegir. Lo que recibe `param` en ese caso no se ha visto en partida: el ejemplo recurre a 3 si `Str2Int(param)` da menos de 2.

## Ajustes fijos y civilizaciones de un modo

Un modo puede fijar ajustes de la sala y las civilizaciones que se pueden elegir con él. Va en `modes\<name>.json`:

```json
{
  "mode": "2 LIGA",
  "gold": 5000,
  "population": 100,
  "noFog": false,
  "explored": false,
  "bonus": 1,
  "civilizations": ["RomeImperial", "Gaul", "Iberia", "CarthageNumidian"]
}
```

| Campo | Qué es |
|---|---|
| `mode` | El nombre del script del modo en `data\GameScripts`, sin `.vs` (`2 LIGA` para `2 LIGA.vs`), hasta 31 caracteres. Si lo omites, el nombre del archivo json. También vale para los modos del juego. |
| `gold` | (Opcional) El oro inicial: uno de los valores del desplegable (`5000`, `10000`…). |
| `population` | (Opcional) La población: `50`, `100` o `150` (`LowPop`, `NormalPop` y `HighPop` de `CONST.INI`). |
| `noFog` | (Opcional) `true` quita la niebla, `false` la mantiene. |
| `explored` | (Opcional) `true` empieza con el mapa explorado. |
| `bonus` | (Opcional) La bonificación de todos los jugadores, de 0 (ninguna) a 3, el mismo número que el botón de bonificación de la sala. Ya no se puede marcar Disable bonuses. |
| `civilizations` | (Opcional) Las civilizaciones que se pueden jugar en ese modo: las del juego (`Gaul`, `RepublicanRome`…) o el `id` de una del mod. Una base del juego permite todas sus variantes; una variante, solo esa. |

Mientras ese modo está elegido, la sala no deja cambiar lo que fija: el anfitrión ve esas filas pero no puede modificarlas. Un jugador con una civilización que el modo no permite pasa a la primera de la lista, y la civilización aleatoria se sortea solo entre las permitidas. El anfitrión lo aplica al crear la partida, así que todos juegan con lo mismo. Las partidas guardadas y los escenarios con civilizaciones fijas no cambian.

## Online

Un modo nuevo cambia la jugabilidad: todos los jugadores deben tener el mismo mod.
