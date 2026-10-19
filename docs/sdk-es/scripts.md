# Scripts

Parte de la [plantilla de jugabilidad](templates/gameplay), un mod vacío con las carpetas que usa esta guía.

Los scripts (`.vs`) son el lenguaje con el que el juego programa la IA, las habilidades, las condiciones de victoria y el comportamiento de edificios y unidades. Un mod puede incluir los suyos y usar las funciones nuevas de Imperivm Resurrected (`Mod_...`).

Ejemplo para copiar: [`examples/scripts-example`](examples/scripts-example). Ojo: ese ejemplo cambia el equilibrio (los hastati hacen doble daño y se curan al matar), así que no lo actives en una partida seria.

## Cómo es un script

Un archivo de texto `.vs`. La primera línea es un comentario con la firma: qué devuelve y qué parámetros recibe. Cada sitio donde se usa un script espera una firma concreta. Hay tres excepciones, que el juego carga siempre con su firma, tengan la línea o no: los comportamientos de una clase (`<behavior script="...">`), con `void, Obj This`; los modos de victoria (`data/GameScripts`), con `void, int player, str param`; y los scripts de objetos (mira [Objetos](items.md)), con la firma de su atributo.

```
// void, Obj This

Sleep(rand(500) + 100);
Mod_Log("A Roman hastatus entered the map");
while(true) Sleep(50000);
```

Para ver cómo escribe el juego los suyos, vuélcalos con `Dump=` (mira [Parches](patches.md); hay que dar cada archivo por su nombre, sin comodines) o consulta la carpeta `DATA` que extrae `extract-data.js`: `data/subai/*.vs` (comportamientos y habilidades), `data/ai/*.vs` (IA) y `data/GameScripts/*.vs` (victoria). Todas las funciones del lenguaje, con sus firmas, están en [funciones-del-juego.txt](game-functions.txt).

## Dónde engancha un script

| Sitio | Cómo | Firma |
|---|---|---|
| Un comportamiento de clase | `<behavior script="data/mod/mi.vs"/>` en el `.sc.xml` de la clase (con un [parche](patches.md) si es una clase del juego). Se ejecuta para cada objeto de la clase mientras exista. | `// void, Obj This` |
| Orden o habilidad | `<method sig="miOrden" vs="data/mod/mi.vs"/>` en la clase, y un `<cmd name="miOrden">` en `data\commands` | depende de la orden: mira la del juego |
| Cuando muere una unidad | `<method sig="ondie" vs="data/mod/mi.vs"/>` en la clase (y `sig="onkill"` para cuando mata) | mira `data/subai/unit_on_kill.vs` |
| Condición de victoria | un `.vs` en `data/GameScripts` (mira [Modos de victoria](victory-modes.md)) | `// void, int player, str param` |
| Objetos de `items.xml` | atributos como `use_script` o `equip_script` (mira [Objetos](items.md)) | depende del atributo |

`ondie` y `onkill` son métodos (`<method sig=...>`), no atributos. Si escribes `ondie="..."` en la clase, no pasa nada, y el juego no avisa.

Un script de comportamiento no debe terminar: ciérralo con `while(true) Sleep(50000);`.

Una clase admite solo 8 elementos `<behavior>`.

## Eventos

Pon un script en `events\<Event>.vs` dentro de tu mod y el juego lo ejecuta cuando ocurre el evento, en todos los PC a la vez. Si varios mods tienen el mismo evento, se ejecutan todos. Para probar sin crear un mod, ponlo en `<game>\mod\events\<Event>.vs`.

| Evento | Cuándo | Firma |
|---|---|---|
| `OnGameStart` | Al empezar una escaramuza, un escenario o una partida multijugador, justo después de arrancar los scripts de victoria. Puede usar `Sleep` y se guarda con la partida. | `// void` |
| `OnObjectDie` | Cuando muere cualquier objeto del mapa (unidades, héroes, edificios, decoraciones…), justo antes de que el juego procese su muerte: el objeto todavía existe. Es el mismo momento que el `ondie` de su clase. | `// void, Obj victim` |
| `OnObjectKill` | Cuando un golpe mata a un objeto. `killer` dio el golpe y `victim` murió. Es el mismo momento que el `onkill` de la clase del atacante. | `// void, Obj killer, Obj victim` |
| `OnSettlementCaptured` | Cuando un asentamiento cambia de dueño durante la partida (por captura, o por un script que se lo da a otro). No se dispara mientras se prepara el mapa. `building` es su edificio central. Jugadores del 1 al 16: los asentamientos sin dueño empiezan con los jugadores 15 y 16; el 0 solo aparece si no hay dueño. | `// void, Obj building, int oldPlayer, int newPlayer` |
| `OnAttackResolved` | En cada golpe que hace daño, justo antes de aplicarlo: la armadura, los especialidades de unidad y las bonificaciones ya cuentan. `damage` es lo que va a recibir la víctima; `Mod_SetAttackDamage(n)` lo cambia (0 lo anula). No se dispara si el golpe no hace daño (desvíos, paradas). | `// void, Obj attacker, Obj victim, int damage` |
| `OnPlayerDefeated` | Cuando el juego declara derrotado a un jugador (del 1 al 8), justo después de marcarlo. Una vez por jugador. | `// void, int player` |

Salvo `OnGameStart`, los eventos se ejecutan al instante y no pueden esperar: nada de `Sleep`. `OnAttackResolved` y `OnObjectDie` se disparan muchas veces por segundo en una batalla. Descarta pronto lo que no te interese (`if (!victim.IsValid) return;`, `victim.IsMilitary`, `victim.player`, `victim.IsHeirOf("RHastatus")`…) y no hagas trabajo costoso.

En `OnSettlementCaptured`, `building` es un `Obj`. Para llegar a su asentamiento, pasa por `AsBuilding`: `building.AsBuilding.settlement`.

`OnObjectKill` sirve para hacer habilidades pasivas. Un hastatus que se cura al matar:

```
// void, Obj killer, Obj victim
if (!killer.IsValid) return;
if (!killer.IsHeirOf("RHastatus")) return;
if (!victim.IsMilitary) return;
killer.Heal(25);
```

Si varios mods usan `OnAttackResolved`, `damage` es siempre el daño original: se calcula una sola vez. Dos mods que hagan cada uno `Mod_SetAttackDamage(damage * 2)` no se acumulan. Para partir de lo que otro mod ya cambió, empieza por `Mod_AttackDamage()`.

### Reaccionar a que aparezca un objeto

No hay un evento para esto (los objetos se crean en decenas de sitios, también al cargar un mapa o una partida). Usa un comportamiento: un `<behavior>` añadido con un parche a una clase base (`Military` para todos los soldados, `Unit` para todas las unidades) lo heredan todas las clases que cuelgan de ella, y se ejecuta una vez por cada objeto cuando aparece. Mira `patches\data\classes\Military.sc.xml` y `data\mod\soldier.vs` en el ejemplo.

## Funciones `Mod_`

La versión actual de la API es la 7. `Mod_ApiVersion()` la devuelve, y un mod puede exigir una mínima.

| Función | Qué hace |
|---|---|
| `Mod_Log(str texto)` | Escribe `script: texto` en `Logs\imperivm\imperivm-mod.log` (nivel `I`). Hasta 2.000 líneas por sesión. |
| `Mod_LogInt(str texto, int valor)` | Escribe `script: texto: valor`. |
| `Mod_IsActive(str id)` : `bool` | ¿Está activo en el perfil el mod con ese `id` (el de su `mod.json`)? |
| `Mod_ApiVersion()` : `int` | La versión de la API. |
| `Mod_SetInt(str nombre, int valor)` | Guarda una variable (API 2). |
| `Mod_GetInt(str nombre)` : `int` | Lee una variable; 0 si no existe (API 2). |
| `Mod_AddInt(str nombre, int suma)` : `int` | Suma a una variable y devuelve el valor nuevo (API 2). |
| `Mod_HasKey(str nombre)` : `bool` | ¿Existe la variable? (API 2). |
| `Mod_AttackDamage()` : `int` | Solo en `OnAttackResolved`: el daño del golpe que se está resolviendo. Fuera de él devuelve 0 (API 3). |
| `Mod_SetAttackDamage(int damage)` | Solo en `OnAttackResolved`: cambia el daño antes de aplicarlo. Fuera de él no hace nada (API 3). |
| `Mod_HasSpecial(Unit unidad, int bit)` : `bool` | ¿Tiene la unidad ese especialidad de unidad (bit del 0 al 63)? (API 4). Mira [Especialidades de unidad](specials.md). |
| `Mod_SetSpecial(Unit unidad, int bit, bool puesta)` | Activa o desactiva un especialidad de unidad (API 4). |
| `Mod_TrueRace(Obj objeto)` : `int` | La civilización real de un objeto (10 o más si es de un mod), aunque para la IA su raza sea la de su base (API 5). Mira [Civilizaciones](civilizations.md). |
| `Mod_GetOption(str id)` : `bool` | ¿Está marcada en la sala la opción `id` (la de `options\<id>.json`)? Igual en todos los PC (API 6). Mira [Opciones de partida](options.md). |
| `Mod_GetOptionValue(str id)` : `int` | El valor elegido de la opción `id`: 0 o 1 en un interruptor, y el número de la entrada elegida (desde 0) en una lista (API 6). |
| `Mod_PlayerCiv(int player)` : `int` | La civilización que el jugador eligió en la sala (10 o más si es de un mod), aunque sea una variante y `GetPlayerRace` devuelva su base. -1 si no existe ese jugador (API 7). Mira [Civilizaciones](civilizations.md). |
| `Mod_CanExecCmd(Obj objeto, str orden)` : `bool` | ¿Podría el jugador pulsar ahora el botón de esa orden en ese objeto? Es la comprobación del propio juego: el objeto la tiene, no está desactivada (`CmdDisable`) y su verificador (`groupverifier` o el del jugador) la acepta. No mira el coste (API 7). |

Las funciones nuevas se añaden al final y las existentes no cambian. Si tu mod usa una, necesita una versión de Imperivm Resurrected que la tenga. La versión de la API forma parte de la comprobación multijugador cuando hay mods de jugabilidad: todos deben tener la misma.

### Variables del mod

Una tabla de nombre → entero para que tu mod recuerde cosas (contadores, indicadores, tiempos):

```
Mod_AddInt("captures", 1);
if (Mod_GetInt("captures") >= 3) ...
```

- Se guardan con la partida (también en los autoguardados) y vuelven al cargarla. Una partida nueva empieza sin variables.
- Son iguales en todos los PC porque los scripts de juego se ejecutan igual en todos. Cámbialas solo desde scripts de juego, nunca según algo local.
- Nombres de hasta 64 caracteres, hasta 1.024 variables, enteros de 32 bits.
- Pertenecen a toda la partida, no a un jugador. Para una por jugador, añade el jugador al nombre (`"oro1"`, `"oro2"`).
- Se comparten entre todos los mods activos: usa un prefijo propio (`"mymod_captures"`).

## Multijugador

Los scripts forman parte de la simulación: se ejecutan en todos los PC, en el mismo momento, y deben hacer lo mismo en todos.

- Lee solo cosas que sean iguales para todos: objetos del mapa, tiempo de juego, el `rand()` del juego.
- No leas nada local: la cámara, el jugador que mira, la música, el ratón, el reloj del sistema. Si el script cambia el juego según algo local, la partida se desincroniza.
- Si algo viene de una tecla o de la interfaz, tiene que viajar como una orden de juego, que pasa por la red. Mira [Teclas de mod](keys.md).

## Partidas guardadas

Una partida guardada contiene el código de los scripts que se estaban ejecutando. Por eso las funciones del SDK nunca cambian de número y solo se añaden al final: lo guardado sigue cargando. No reutilices los nombres de funciones del juego (`Run`, `Write`…) como si fueran tuyos.

## Errores

- Un script que no compila deja el error (archivo, línea y columna) en `Logs\imperivm\imperivm-mod.log`, como `script: compilation error: …` (nivel `E`), y también en `Logs\comp_out.txt` y `Logs\vxlog.log`. El juego sigue, pero ese script no se ejecuta.
- Los errores en tiempo de ejecución casi nunca se registran. En los eventos sí: el log anota `Event X (…): the script ended with an error`, hasta 5 veces por script. Para todo lo demás, usa `Mod_Log` y revisa el log.
