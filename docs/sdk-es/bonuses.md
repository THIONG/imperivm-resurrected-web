# Bonificaciones iniciales

Una bonificación inicial es un script que el juego ejecuta para un jugador cuando empieza la partida. La sala las lista en la columna "Bonus" de cada jugador, y un mod puede añadir las suyas.

## El script

Va en `data\BonusScripts\` dentro de tu mod, con el nombre `NNN NAME.vs`:

```
data\BonusScripts\004 Tribute.vs
```

- El número ordena la lista y es el valor que la sala envía a los demás jugadores. Solo los números de `000` a `099` aparecen en la sala; los de `100` en adelante son scripts que arrancan otros scripts (los usan las conquistas del juego) y nunca se ofrecen.
- `000 None.vs` tiene que existir y permanecer vacío: es la opción "sin bonificación". El juego trae del `000` al `003`; una bonificación nueva toma el siguiente número libre.
- El nombre en la lista es el del archivo sin el número, con mayúscula solo al principio de cada palabra (`004 BOAR TEETH.vs` se muestra como "Boar Teeth").
- La firma es fija: `//void, Settlement set, int playerid`. El script se ejecuta una vez por cada jugador que la eligió, con su asentamiento principal.

Ejemplo, 3000 de oro al empezar:

```
//void, Settlement set, int playerid
//@name 3000 gold
//@name.es 3000 de oro
//@description 3000 gold at the start.
//@description.es 3000 de oro al empezar.

Sleep(100);
set.SetGold(set.gold + 3000);
set.GoldConverted(3000);
```

## Nombre y descripción en la sala

Las líneas que empiezan por `//@` al principio del script dan el texto del desplegable. Tienen que ir antes de la primera línea de código.

| Línea | Uso |
|---|---|
| `//@name Text` | El nombre que se muestra en el desplegable y en la fila del jugador (corto: la columna es estrecha). |
| `//@description Text` | Qué hace la bonificación. Se muestra junto al desplegable cuando el puntero está sobre esa bonificación. |
| `//@name.es`, `//@description.it`… | Lo mismo para un idioma concreto (`en`, `es`, `it`). Si el idioma del jugador no tiene línea, se usa la línea sin idioma y, después, la inglesa. |

Sin estas líneas, el nombre es el del archivo y no hay descripción. Las tres bonificaciones del juego tienen sus propios nombres y descripciones mientras su script sea el del juego; si un mod cambia el efecto de una de ellas, se queda con el nombre del archivo, así que conviene que añada estas líneas. Si dos bonificaciones acaban con el mismo nombre, la sala añade el número del archivo para distinguirlas.

## En línea

Todos los jugadores necesitan los mismos archivos: el contenido de la sala se compara antes de la partida, y el valor de la bonificación es una posición en la lista.

Requiere Imperivm Resurrected 0.9.0 o posterior.
