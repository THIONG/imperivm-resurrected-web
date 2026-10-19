# Gráficos propios para unidades y edificios

Empieza desde la [plantilla de gráficos](templates/graphics), un mod vacío con las carpetas que usa esta guía.

El SDK no dibuja nada: usa Photoshop, Paint.NET, Aseprite, Blender… El juego solo lee su formato `.rle`, que ningún programa exporta, así que el SDK incluye un conversor.

Un mod puede incluir sus sprites como archivos sueltos, con las mismas rutas que usa el juego. Una unidad o un edificio nuevos cambian la jugabilidad: todos los jugadores de la partida deben tener el mod.

Ejemplo: [`examples/unit-graphics-example`](examples/unit-graphics-example) (un soldado cubo, 8 direcciones, color de jugador). Lo dibuja `tools\draw-soldier.js`, lo único que sustituirías por tus propios dibujos.

Ejecuta todos los comandos de esta guía desde la raíz del repositorio. Las herramientas son de Node.js y no necesitan nada más.

## Qué puedes hacer

- Una unidad nueva con sprites propios: sí, en una carpeta `units\MyUnit\` nueva.
- Cambiar el sprite de una unidad existente: no con un archivo suelto, porque el juego prefiere el suyo. Crea una unidad nueva.
- Un edificio nuevo con sprites propios: sí, con más trabajo (hojas grandes, fases de construcción, huella `.pass` y puntos). Mira Edificios.
- Iconos y botones de interfaz: ya se explican en [Imágenes personalizadas](images.md).
- Sonidos nuevos: `.wav` y `.ogg`.

## Las herramientas

- `tools\convert-sprite.js`: tus PNG a `.rle`. Recorta, reduce a 256 colores, marca el color de jugador y crea la sombra.
- `tools\create-entity.js`: escribe el `.ent.xml` (imágenes, capas, estados, animaciones) de una unidad o un edificio, y la huella `.pass` de un edificio.
- `tools\read-rle.js`: lo inverso, de `.rle` a PNG. Úsalo para ver un sprite del juego y para partir de él.
- `tools\validate-mod.js`: avisa de imágenes que faltan, valores de `idx` repetidos y filas y columnas que no cuadran ([Validar](validating.md)).

## Una unidad, paso a paso

### 1. Dibuja y guarda los PNG

Un PNG por animación, dirección y fotograma, todos del mismo tamaño (el lienzo, 150 x 150 para una unidad) y con fondo transparente:

```
Idle_d0_f00.png  Idle_d0_f01.png  ...  Idle_d7_f07.png      <Name>_d<direction>_f<frame>.png, counting from 0
Walk_d0_f00.png  ...
Fight_..., Death_..., Transition_..., Taunt_...
```

- **Animaciones.** Obligatorias: `Idle` (de pie), `Walk`, `Fight` (ataque) y `Death`. Opcionales: `Transition` (de reposo a combate) y `Taunt`. Si faltan, se usa `Idle` en su lugar.
- **Direcciones.** 8 para soldados, 12 para héroes y animales, 4 para barcos. Todas las animaciones de una unidad usan el mismo número.
- **Orden de las direcciones.** En las hojas del juego, la columna 0 mira a la cámara (hacia abajo en pantalla) y las demás siguen el sentido horario: sur, oeste, norte, este, con las diagonales entre medias. Si usas un sprite propio, mira una hoja del juego con `read-rle.js` antes de dibujar las ocho.
- **Lienzo y pies.** El mismo lienzo en todos los fotogramas, con los pies en el mismo punto. En las unidades del juego es el píxel (75, 100) de 150 x 150. Cámbialo con `--canvas` y `--feet`.
- **Tamaño.** El motor no impone ninguno: cada fotograma se recorta a lo que hayas dibujado. Como referencia, un soldado del juego mide unos 40 x 52 píxeles y un héroe unos 40 x 88 (aproximado).
- **Fotogramas.** Hasta 62 por animación. Hastatus: caminar 15, atacar 14, morir 20, reposo 8.
- **Transparencia.** Todo o nada: un alfa por debajo de 128 es transparente. El juego no tiene semitransparencia.
- **Colores.** Hasta 256 por conjunto; con color de jugador, 192 (los otros 64 son el tinte). Si usas más, el conversor los reduce y te avisa.
- **Color de jugador.** Pinta en magenta lo que deba cambiar con el equipo. El conversor trata los magentas (rojo y azul parecidos, casi nada de verde) como el tinte. `(255, 0, 255)` es casi el color de jugador puro; `(128, 0, 128)`, `(64, 0, 64)`… son sus tonos (7 niveles utilizables). Evita los morados y rosas en el resto de la figura: pueden acabar como tinte por accidente. No suavices los bordes: un borde semitransparente mezclado sale rosa, no tinte.
- **Sombra.** Opcional: un PNG por fotograma con el mismo nombre más `_sombra` (`Walk_d3_f05_sombra.png`), en negro opaco o gris oscuro sobre transparente. Si la omites, el conversor dibuja una elipse bajo los pies. El juego oscurece a la mitad el suelo bajo la sombra.

También puedes dar una hoja ensamblada por animación: `Walk.png` con las direcciones como columnas y los fotogramas como filas, cada celda del tamaño del lienzo (`--canvas WidthxHeight`). La sombra va en `Walk_sombra.png` con la misma disposición.

### Partir de un sprite del juego

Los sprites del juego están en los archivos `.rle.mmp` de los `.pak`, y sus píxeles en `rle.mmp`, en la carpeta del juego. Extráelos primero con `extract-data.js`:

```
node tools\extract-data.js "<game folder>" <output folder> Units.pak HASTATUS
```

Y conviértelos a PNG con `--convention`, que escribe exactamente lo que espera `convert-sprite.js` (un PNG por dirección y fotograma, lienzo completo, el tinte de jugador en magenta y la sombra en `_sombra`):

```
node tools\read-rle.js <output folder>\UNITS\RHASTATUS\WALK.RLE.MMP --rle-mmp "<game folder>\rle.mmp" --convention --output <carpeta de PNG>
node tools\convert-sprite.js <carpeta de PNG> --player --output <mod>\units\MyUnit
```

Sin `--convention`, `read-rle.js` escribe una hoja con celdas del tamaño de cada recorte, y `convert-sprite.js` no la acepta. `--canvas WidthxHeight` cambia el lienzo (150 x 150 por defecto). La sombra del juego es un archivo aparte (`WALK_SHADOW.RLE.MMP`): si no lo extraes, el conversor dibuja la elipse. Estos son archivos de tu juego, para estudiarlos o partir de ellos: no los redistribuyas.

### 2. Convierte a `.rle`

```
node tools\convert-sprite.js <folder with the PNGs> --output <mod>\units\MyUnit --player
```

- `--player`: usa color de jugador (el magenta se convierte en el tinte del equipo). Sin él, la paleta son 256 colores libres sin color de jugador; es lo más simple y lo que usan los lobos y los ciervos.
- `--shadow auto|files|none`: `auto` por defecto (tus archivos `_shadow` si existen, si no una elipse).
- `--palette-per-animation`: una paleta por `.rle`. Por defecto hay una para toda la unidad, con la pérdida de calidad de reducir a 192 o 256 colores si usas más. El juego usa una por animación.
- `--canvas WidthxHeight` (por defecto, el tamaño de los PNG), `--feet X,Y` (solo para la sombra automática), `--alpha-threshold N`.

Escribe `Idle.rle`, `Idle_shadow.rle`, `Walk.rle`…

### 3. Crea la entidad (`.ent.xml`)

```
node tools\create-entity.js unit <mod>\units\MyUnit --name MyUnit
```

Lee los archivos `.rle` de la carpeta y escribe `MyUnit.ent.xml`: 2 capas (unidad `z=1000`, sombra `z=800`), 2 estados (reposo y combate) y las 7 animaciones del motor (caminar 1, atacar 5, morir 9, `Idle` 13, `ToIdle` 18, `ToAttack` 19, `Taunt` 20) con los tiempos del Hastatus (caminar 55 ms por fotograma, atacar 71, morir 80 con una parte final lenta, reposo 150…). Son 6 hojas de animación para 7 animaciones del motor, porque la hoja `Transition` sirve para `ToAttack` y, invertida, para `ToIdle`.

Límites del motor: mira *Referencia de formatos*. Para cambiar el ritmo, usa `--config animations.json`:

```json
{ "Walk": { "duration": 55, "step": 42 }, "Fight": { "duration": 71, "hit": 426 } }
```

`duration` son milisegundos por fotograma. `step` y `hit` (`action_time`, los milisegundos hasta que cae el golpe) forman parte de la simulación y afectan a la jugabilidad.

### 4. La clase y el resto

La clase (`data\classes\MyUnit.sc.xml`) es una copia completa de una clase del juego con `entity="Units/MyUnit/MyUnit.ent.xml"`. La orden de reclutamiento, el botón y los textos se explican en [Unidades nuevas](units.md). No hagas que la clase sea hija de otra: el juego no hereda `entity` del padre y la unidad desaparece. El nombre de la carpeta tiene que ser nuevo: si reutilizas el nombre de una unidad del juego, el juego usa su `.rle` y el tuyo se ignora.

### 5. Valida y prueba

```
node tools\validate-mod.js <mod> --data <DATA> --game "<game folder>"
```

Una imagen que falta cuelga el juego al cargar la clase (un `idx` repetido o un `.rle` corrupto hacen lo mismo), y el validador lo detecta de antemano. Después copia el mod a `<game>\mods\`, actívalo y reinicia. Si el juego se cierra, `Logs\imperivm\imperivm-mod.log` señala la imagen que falló.

## Edificios

Misma forma que una unidad, con estas diferencias:

- **Una dirección** (`_d0`) y varias filas, que son las fases de construcción (las del juego usan 4). Una hoja por capa del edificio, `layer1`, `layer2`… (hasta 5 en el juego), más `shadow`. PNG: `layer1_d0_f00.png` (capa 1, fase 0), `layer1_d0_f01.png`… y `shadow_d0_f00.png`… Una animación llamada `shadow` se toma directamente como máscara de sombra (cuenta cualquier píxel opaco).
- **Lienzos grandes**, de unos 700 x 700 en el juego. Tú eliges el punto donde se ancla el edificio (`--feet`); en el cuartel romano es (305, 330).

```
node tools\convert-sprite.js <PNG> --output <mod>\buildings\MyBuilding --player --shadow none
node tools\create-entity.js building <mod>\buildings\MyBuilding --name MyBuilding --feet 305,330 --footprint 8x8 --points-from <another .ent.xml>
```

- **La huella (`.pass`)** es la cuadrícula de 1 bit que indica dónde no pueden caminar las unidades. Cada celda son 16 unidades de mapa (algo menos de la mitad del ancho de un soldado). `--footprint WidthxHeight` crea un rectángulo centrado en el punto de anclaje. `--footprint-png máscara.png` usa un dibujo (1 píxel = 1 celda, norte arriba; opaco y oscuro = bloqueado, transparente o blanco = libre). Mantenla en unas 120 x 120 celdas como máximo. Una casa del juego mide unas 15 celdas por lado y el cuartel romano unas 29.
- **Los puntos (`<point>`)** son puertas, puestos de centinela, humo… El conversor no puede inventarlos. Con `--points-from <.ent.xml of a similar game building>` copia los puntos de ese edificio; sus coordenadas son relativas al punto de anclaje, así que ajústalas si el tuyo tiene otra forma.
- La clase del edificio (`CVXBuilding`, `parent="Building"`, órdenes, costes…) se hace como en [Unidades nuevas](units.md): una copia completa de una del juego.
- Sin hacer: versiones de invierno (`entity_winter`) y animaciones de edificio (humo, fuego). Puedes añadirlas a mano.
- El mensaje final de `convert-sprite.js` sugiere `create-entity.js unit` incluso cuando conviertes un edificio: usa `edificio`.

## Referencia de formatos

Si quieres leer o escribir los formatos tú mismo, el código está en `tools\lib\rle.js` (`.rle`) y `tools\lib\pass.js` (`.pass`). Las herramientas escriben archivos `.rle` de 256 colores (con o sin color de jugador) y sombra; no hay color verdadero.

Límites del `.ent.xml`:

- `<image idx file rows columns drawmode>`: 32 imágenes; `idx` del 1 al 32, sin repetir; `file` sin extensión o con `.rle`.
- `<layer idx name image z …>`: 32. Unidad `z=1000`, sombra `z=800`.
- `<state idx …>`: 8.
- `<anim idx name frames duration action_time step>`: `idx` del 1 al 28; `frames` = filas + 2 (dos fotogramas centinela con duración 0); hasta 64 fotogramas.
- `variations` de `<entity>`: igual a las columnas de todas las imágenes.

## Sonidos

La clase nombra sus sonidos con `<sounds attack="…" die="…"/>`. Cada nombre es un archivo `data\sound entities\<Name>.xml` que lista los archivos `.wav` u `.ogg`; puedes poner los tuyos en el mod. Si no quieres sonidos nuevos, copia los de una unidad parecida (`attack="UnitSwordFight" die="UnitDeath"`).
