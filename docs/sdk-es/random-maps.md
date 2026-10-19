# Tipos de mapa aleatorio propios

Un mod puede añadir un tipo de mapa aleatorio (como Costero, Islas o Pasos de montaña) al desplegable «Tipo de mapa» de la sala. El tipo es una forma dibujada: tierra, mar, montañas y los puntos donde empieza cada jugador. El juego la deforma, la gira y la rellena con terreno, árboles y objetos siguiendo sus reglas habituales.

Ejemplo: [`examples/random-map-example`](examples/random-map-example) (un anillo de tierra con un mar en medio y montañas entre ambos). El repositorio solo incluye el dibujo: los archivos que lee el juego se generan con el comando del paso 2.

## Cómo hacerlo

1. **Dibuja la forma** en un PNG cuadrado, con el programa que quieras y cuatro colores:

   | Color | Significado |
   |---|---|
   | negro `(0, 0, 0)` | mar |
   | blanco `(255, 255, 255)` | tierra |
   | magenta `(255, 0, 255)` | montañas: líneas finas, de unos 3 píxeles (opcional) |
   | rojo `(255, 0, 0)` | puntos donde el juego puede colocar puntos de inicio y ciudades neutrales (opcional) |

   Un color que no sea exacto se ajusta al más cercano. Lo transparente cuenta como mar. Si el PNG no es cuadrado, se estira a 512 x 512 sin avisar. Después el juego lo estira al tamaño del mapa, así que usa trazos gruesos: los detalles finos se pierden.

   Los dibujos del propio juego tienen cientos de puntos rojos sueltos repartidos por la tierra, y el juego elige entre ellos. Normalmente no pintes ninguno y deja que la herramienta los reparta. Pinta rojo solo si quieres los puntos de inicio en zonas concretas.

2. **Conviértelo en un tipo de mapa**, desde la raíz del repositorio:

   ```
   node tools\create-random-map.js <mod folder> Anillo dibujo.png --players 8
   ```

   Para el ejemplo:

   ```
   node tools\create-random-map.js examples\random-map-example Anillo examples\random-map-example\drawings\ring.png --players 8
   ```

   La herramienta escribe `data\randommap\Anillo.rm.xml` y `randommap\Anillo\010.bmp … 120.bmp` en tu mod. El nombre (`Anillo`) usa solo letras sin acentos, números y espacios, empieza por una letra y tiene de 2 a 31 caracteres. No uses el nombre de un tipo del juego (`Coastal`…): la herramienta no avisa y sobrescribirías el del juego.

   | Opción | Qué hace |
   |---|---|
   | `--players N` | Máximo de jugadores en un mapa grande (2 a 8). En uno mediano, hasta 6 |
   | `--small N` | Máximo en un mapa pequeño (0 = no aparece en pequeño; por defecto 2) |
   | `--distortion X` | Cuánto se deforma la forma al generarla, de 0 a 0,5 (0,1 apenas, 0,25 mucho; por defecto 0,2) |
   | `--no-rotate` | No la gires ni la reflejes al azar |

   Puedes pasar varios PNG (`dibujo1.png dibujo2.png …`) y el juego elige uno al azar en cada partida. La herramienta rellena hasta 12 repitiendo los tuyos. Si 12 no es múltiplo del número de PNG, el reparto es desigual (con 5, tres PNG salen 3 veces y dos salen 2). Con uno solo, siempre sale esa forma.

3. Activa el mod y reinicia. La sala ofrece «Random: Anillo».

## Cosas que debes tener en cuenta

- Cambia la jugabilidad: todos los jugadores deben tener el mismo mod.
- «Buscar partida» usa una lista fija de cinco tipos de juego: un tipo nuevo solo aparece en las partidas que creas tú.
- No se pueden crear biomas nuevos: el juego tiene cuatro zonas fijas. Puedes cambiar lo que contiene cada una con [parches](patches.md) sobre `data\randommap\terrainmix.xml`, `placetrees.xml` y `placeobjects.xml`.
- Prueba con el número de jugadores que pienses permitir.
