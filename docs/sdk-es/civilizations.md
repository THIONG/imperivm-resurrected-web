# Civilizaciones

Empieza desde la [plantilla de civilización](templates/civilization), un mod vacío con las carpetas que usa esta guía.

El juego trae 8 civilizaciones, numeradas del 0 al 7: Galia, Roma republicana, Cartago, Iberia, Roma imperial, Britania, Egipto y Germania.

Imperivm Resurrected te permite declarar civilizaciones nuevas, numeradas a partir del 10. Cada una hereda de una civilización del juego (su
*base*) todo lo que tu mod no defina. Las herramientas necesitan Node.js.

Ejemplo listo para copiar: [`examples/civilization-example`](examples/civilization-example).

## Declarar una civilización

Un archivo `civs\<id>.json` en tu mod:

```json
{
  "id": "dacia",
  "index": 10,
  "base": "Gaul",
  "name": {"spanish": "Dacia", "english": "Dacia", "italian": "Dacia"},
  "letter": "D"
}
```

| Campo | Qué es |
|---|---|
| `id` | El nombre: letras, números y `_`, empezando por una letra, hasta 24 caracteres. Lo usas en `race="..."` y en los scripts. |
| `index` | Un número del 10 al 99. No lo cambies una vez publicado: las partidas guardadas lo recuerdan. Dos mods no pueden usar el mismo. |
| `base` | La civilización del juego de la que hereda: `Gaul`, `RepublicanRome`, `Carthage`, `Iberia`, `ImperialRome`, `Britain`, `Egypt` o `Germany`. Por defecto, `Gaul`. |
| `name` | Su nombre en cada idioma, o una sola cadena. |
| `letter` | La letra que antecede a sus clases y órdenes (`DSwordsman`, `trainDSwordsman`). Si la omites, usa la de la base. Pon la tuya solo si tienes clases y órdenes con esa letra: el juego construye nombres a partir de ella, como el de entrenar campesinos. |
| `template` | (Opcional) Prefijo de tus plantillas de ciudad y aldea, para que el mapa aleatorio no use las de la base. Mira [Plantillas](city-templates.md). |
| `internalName` | (Opcional) El nombre que usa el juego para encontrar los archivos de interfaz de la civilización; por defecto, el de la base. |
| `folder` | (Opcional) El nombre que se muestra en los textos de selección. |
| `random` | (Opcional, por defecto `true`) Si entra en el sorteo de civilización aleatoria, también en mapas aleatorios. La IA solo la sortea si además tiene `"ai": true`. Pon `false` para excluirla. |
| `biome` | (Opcional) Una civilización del juego: el terreno, los árboles y los objetos que el mapa aleatorio coloca alrededor de su inicio son los de esa civilización. Sin este campo, los de la base. Mira *El bioma*. |
| `ai` | (Opcional) Con `true`, la IA juega con tus clases y órdenes. Si no, juega como la civilización base. La herramienta de clonado lo pone a `true`. Mira *La IA*. |
| `ownAi` | (Opcional, junto con `ai`) Para mods que incluyen todos sus propios scripts de IA y quieren ver la civilización como ella misma (`Dacia`, no su base). |
| `alias` | (Opcional, lo escribe la herramienta de clonado) `classes` y `commands`: nombre en la base a nombre en tu civilización (`"GArcher": "DArcher"`, `"trainGSwordsman": "trainGSwordsman Dacia"`). La IA los usa para traducir. |
| `variant` | (Opcional) Con `true`, es una variante de su base: juega con las clases de la base y los scripts la ven como la base. Mira *Variantes*. |
| `replacesBase` | (Opcional) Con `true`, la base deja de aparecer en la sala y esta civilización ocupa su lugar. Mira *Variantes*. |

Con solo `id`, `index` y `base` obtienes una copia de la base con otro nombre. A partir de ahí, cambia lo que quieras.

## Usarla en tus clases y scripts

En el `.sc.xml` de cada unidad o edificio:

```xml
<properties race="Dacia"/>
```

El juego solo conoce los nombres de sus 8 civilizaciones. El mod reconoce el `id` de tus civilizaciones (sin distinguir mayúsculas) y lo
asigna a la clase. Si pones `internalName` a mano, también funciona. El nombre por defecto (el de la base) no cuenta, así que `race="Gaul"` sigue
siendo la Galia aunque tengas una civilización clonada de ella.

Una clase con `parent=` hereda estadísticas y comportamientos, pero no la entidad (`entity`, el modelo) ni los sonidos: vuelve a ponerlos o
la unidad aparece sin modelo y desaparece. Por eso la herramienta de clonado copia las clases enteras.

En los scripts, cada civilización declarada es una constante con el nombre de su `id` tal como lo escribes, con la primera letra en mayúscula (`dacia` da
`Dacia`, `romeImperial` da `RomeImperial`). El resto en minúsculas también funciona (`Romeimperial`):

```
if (GetPlayerRace(player) == Dacia)
	...
```

Los scripts de IA del juego comparan con `Gaul`, `RepublicanRome`… y no conocen la tuya. Con `"ai": true` ven la base. Para saber con qué
civilización juega realmente un objeto, usa `Mod_TrueRace(objeto)`.

## En la sala y en el mapa

Las civilizaciones declaradas aparecen en los desplegables de la sala multijugador, después de las del juego. En un mapa aleatorio, la tuya usa el terreno de su bioma y empieza con una ciudad y una aldea construidas con sus clases
(`DTownhall`, `DBarracks`…). Si no le das plantillas, la distribución de los edificios es la de la base. La interfaz del jugador (barras de órdenes, esquinas, iconos rápidos y la
pantalla final) es la de la base.

Si algo no aparece, revisa `Logs\imperivm\imperivm-mod.log`: las líneas marcadas con `civilizations` indican qué se registró y qué falló (un `id` no válido,
un `index` ausente o duplicado, una `base` que no existe). Los errores también aparecen en la tarjeta del mod en el gestor.

## Variantes

Una variante es una civilización del juego con otro nombre en la sala y algo propio al empezar la partida. Por ejemplo, un mod
en el que Roma elige al comienzo entre republicana, imperial y púnica puede ofrecer las tres en la sala:

```json
{
  "id": "RomeImperial",
  "index": 21,
  "base": "RepublicanRome",
  "name": {"spanish": "Roma imperial", "english": "Roman Empire", "italian": "Roma imperiale"},
  "variant": true,
  "replacesBase": true
}
```

Con `"variant": true`:

- Juega con las clases y órdenes de la base. No tiene clases propias ni `letter`, salvo que reemplace a toda la base (mira más abajo).
- `GetPlayerRace` devuelve la base, así que los scripts del juego y de otros mods la tratan como la base (barcos, centinelas, IA).
- `Mod_PlayerCiv(player)` devuelve la civilización elegida en la sala (21 en el ejemplo). Lo que la distingue va en un
  [parche de script](patches.md), por ejemplo investigar la Roma correcta al empezar:

```
@before while (EnvReadInt(set, "ChooseRomanRace") != 1)
	if (Mod_PlayerCiv(.player) == RomeImperial && set.CanResearch("ChooseImperialRome"))
		set.Research("ChooseImperialRome");
```

- La IA también la juega: `ai` es `true` salvo que digas otra cosa.
- Con `"replacesBase": true`, la base deja de aparecer en la sala y sus variantes ocupan su lugar. En el sorteo aleatorio, la parte
  de la base se reparte entre ellas. Un jugador que tenía elegida la base pasa a la primera variante. Los mapas y las partidas guardadas que fijan la base
  la siguen usando.
- Una variante con `"replacesBase": true` también puede cambiar la letra y las plantillas de su base para toda la partida. Con `letter`, el juego
  construye los nombres de las clases y órdenes de la base con esa letra (`GetRaceStrPref`, entrenamiento de campesinos, cuarteles, centinelas, contratación
  de héroes). Con `template`, las ciudades y aldeas de la base, incluidas las neutrales del mapa aleatorio, salen de tus plantillas
  `<template> Town N` y `<template> Village N`. Eso es lo que hace falta para reemplazar una civilización entera. Por ejemplo, Grecia ocupa
  el lugar de Roma imperial con `"base": "ImperialRome"`, `"letter": "H"` y `"template": "Greek"`, y sus clases llevan
  `race="ImperialRome"` y la letra `H` (`HTownhall`, `HHoplite`). Si dos variantes activas dan a la misma base letras o
  plantillas distintas, cuenta la primera y el gestor avisa en la otra.

## Clonar una civilización

Escribir a mano las decenas de clases y órdenes de una civilización es un trabajo ingrato. `tools/clone-civilization.js` clona una del juego.
Necesita la carpeta `DATA` del juego, que obtienes con [`extract-data.js`](tools/extract-data.js):

```
node extract-data.js "<game folder>" <output folder>
node clone-civilization.js <output folder>\DATA <mod folder> Dacia D Gaul 10
```

Genera `civs\dacia.json`, una copia de cada clase de la base (`DSwordsman` es una copia de `GSwordsman`, con `race="Dacia"`), las órdenes que
nombran clases de la base (`trainGSwordsman Dacia`, `trainpeasantd`, `hireheroD`…) y parches que añaden las clases nuevas a las
órdenes compartidas. También clona los héroes `GHero1`…`GHero7`, que cuelgan de `GaulHero` y no tienen `race`: sin héroes que tengan modelo, contratar uno
cuelga el juego. A partir de ahí editas lo que quieras. El resultado de muestra está en
[`examples/civilization-example`](examples/civilization-example).

La herramienta no escribe el campo `template`. Si quieres plantillas propias, añádelo tú ([Plantillas](city-templates.md)).

Las copias no llevan el `altid` de los originales. El `altid` es un alias único (`Barrack`, `Village`) que los scripts y la IA usan para buscar los
«cuarteles» de una civilización. Si dos clases comparten uno, la IA de una civilización deja de ver sus edificios. Si escribes las clases a mano, no lo copies.

## La IA

Por defecto, la IA que elige una civilización de mod juega como su base. Con `"ai": true` juega con tus clases y órdenes. Los scripts de IA del juego
deciden según la civilización del edificio central y construyen nombres a partir de ella, así que el juego les hace ver la base y
traduce lo que piden:

- Las órdenes e investigaciones que piden por nombre (`trainGSwordsman`, `Gaul Axeman`, `hireheroG`…) se asignan a las de tu civilización, según
  `alias.ordenes`, solo en objetos de una IA de tu civilización.
- Tus clases cuentan como las de la base: `DArcher` es un `GArcher` para los recuentos, cuarteles, templos y contraunidades.

La herramienta de clonado rellena las dos tablas. Si escribes las clases a mano, rellénalas tú. Nada cambia para el jugador humano.

Límites de la IA:

- Tu IA se comporta como la de la base, salvo que le des otra táctica.
- Una unidad que no esté en los seis huecos de la base no se recluta.
- Las investigaciones nuevas (que no sean clones de una de la base) le son desconocidas.
- Los costes que lee antes de pagar son los de la base, aunque la orden cobre tus valores.

**Una táctica distinta para tu civilización.** El juego elige la táctica de cada IA al empezar, en `data\ai\GetTacticScript.vs`. Un
[parche de script](patches.md) puede añadirle un fragmento para tu civilización. Como la IA ve la base, pide la civilización real con
`Mod_TrueRace(set.GetCentralBuilding)`. El ejemplo [`examples/ai-tactic-example`](examples/ai-tactic-example) hace que Dacia use una táctica del juego
que ninguna IA usa. Los parches de varios mods se suman, así que dos civilizaciones pueden elegir su táctica a la vez.

Con `"ownAi": true`, el mod tiene que incluir todos los scripts de IA, porque los del juego ven la civilización 10 y sus tablas no la conocen.
Lo normal es dejar `"ai": true` y cambiar solo la táctica.

## El bioma

En un mapa aleatorio, lo que rodea el inicio de cada jugador (hierba, arena, árboles, decoraciones) lo decide su civilización. La tuya usa el de su
`base`, o el que pongas en `biome`:

```json
{ "id": "dacia", "index": 10, "base": "Gaul", "biome": "Britain" }
```

El juego solo tiene cuatro biomas de terreno y árboles, así que las civilizaciones los comparten por parejas:

| Terreno y árboles | Lo usan |
|---|---|
| 1.º | Galia y Roma imperial |
| 2.º | Roma republicana y Britania |
| 3.º | Cartago y Egipto |
| 4.º | Iberia y Germania |

Los objetos del mapa (ruinas, palmeras, rocas) sí distinguen las ocho; Cartago y Egipto funcionan como un interruptor entre «desierto» y «templado».
La ciudad inicial sigue siendo la de la base salvo que uses `template`. Un bioma totalmente propio, con terreno nuevo, no es posible.

## Lo que no puedes hacer

- Partidas contra la IA fuera de la sala multijugador (escenarios y campañas) con civilizaciones de mod.
- Editor de mapas: las clases de tu civilización aparecen mezcladas con las carpetas de su base.
- Scripts de IA nuevos sin incluirlos todos (mira *La IA*).
