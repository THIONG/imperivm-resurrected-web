# Parches

Empieza con la [plantilla de jugabilidad](templates/gameplay), un mod vacío con las carpetas que usa esta guía.

Un parche cambia una parte de un archivo del juego sin sustituir el archivo entero. Dos mods pueden parchear el mismo archivo y los dos cambios se suman. Si cada uno incluyera su propia copia del archivo, la segunda pisaría a la primera.

Sirven los archivos XML (comandos, objetos, bonificaciones, definiciones de unidades), los INI (constantes, interfaz) y los scripts `.vs` (IA, comportamientos). El archivo tiene que existir en el juego. Ejemplo para copiar: [`examples/patches-example`](examples/patches-example).


## Dónde va

En tu mod, dentro de `patches`, con la misma ruta que tiene el archivo en el juego:

```
mods\my-mod\
  mod.json
  patches\data\commands\RBarracks.xml     patches data\commands\RBarracks.xml
  patches\data\const.ini                  patches data\const.ini
```

- Cada vez que el juego abre ese archivo, se le aplican los parches de los mods activos. Los originales nunca se tocan.
- Con varios mods, los parches se aplican desde el último mod del [orden de carga](reference.md#1-mod-structure) hasta el primero: el primero tiene la última palabra. El juego calcula ese orden y es el mismo en todos los ordenadores con los mismos mods; la comprobación de multijugador no depende de él.
- Si tu mod incluye además su propia copia del archivo (sin `patches`), los parches de los demás mods se aplican encima.
- Para probar un parche sin crear un mod, ponlo en `<game>\mod\patches\<path>`. Se aplica el último, por encima de todo.
- Un parche cambia la jugabilidad si el archivo la cambia (`data\...`, mapas, unidades). En ese caso todos los jugadores deben usar el mismo mod.
- Los parches se leen cuando el juego abre cada archivo. Si cambias uno, reinicia el juego.

## Ver el resultado

Añade esto a `imperivm-mod.ini` y abre el juego:

```ini
[Debug]
Dump=data/commands/RBarracks.xml,data/const.ini
```

Cada archivo se copia a `mod-dump\<path>` tal como lo lee el juego, con los parches ya aplicados. Para ver el original, usa el perfil Original. Indica el nombre exacto de cada archivo, separados por comas; la línea entera no puede pasar de 1.023 caracteres. Un `*` solo vuelca todos los archivos que abre el juego: son miles, así que ten cuidado.

## Parches XML

Un `<patch>` con operaciones que se aplican en orden:

```xml
<patch>
  <set select="/commands/cmd[@name='trainRHastatus']" costgold="60" execdelay="3000" unset="costpop"/>
  <add select="/commands"><cmd name="miOrden" method="train" .../></add>
  <remove select="//cmd[@name='otraOrden']"/>
  <replace select="/commands/cmd[@name='trainRArcher']/src"><src obj="RBarracks"/></replace>
</patch>
```

- `<set select="…" attribute="value" …/>`: cambia o añade esos atributos en los elementos seleccionados. `unset="a b"` quita atributos.
- `<add select="…">…</add>`: añade el contenido al final del elemento seleccionado. Con `position="start"` va al principio; con `"before"` o `"after"`, junto al elemento seleccionado en lugar de dentro.
- `<remove select="…"/>`: quita los elementos seleccionados.
- `<replace select="…">…</replace>`: sustituye los elementos seleccionados por el contenido.

Si lo que buscas puede no existir y no quieres que dé error, pon `optional="yes"` en la operación.

### El selector

Una ruta como las de las carpetas, con condiciones entre corchetes. Empiézala siempre con `/` o `//`: si no, el validador da un error.

| Selector | Selecciona |
|---|---|
| `/commands` | la raíz `<commands>` |
| `/commands/cmd` | todos los `<cmd>` dentro de `<commands>` |
| `/commands/cmd[@name='trainRHastatus']` | el `<cmd>` con ese `name` |
| `//cmd[@name='trainRHastatus']` | ese `<cmd>`, esté donde esté |
| `/commands/cmd[@key]` | los elementos `<cmd>` que tienen un atributo `key` |
| `/commands/cmd[3]` | el tercer `<cmd>` |
| `/commands/cmd[@name='x']/src` | los elementos `<src>` de ese `<cmd>` |
| `//*[@name='x']` | cualquier elemento con `name="x"` |

Solo existen estas condiciones: `[@a='v']`, `[@a]` y `[n]`. Puedes encadenar varias (`[@a='v'][2]`). No hay `and`, `contains`, `text()` ni `..`. No distingue mayúsculas de minúsculas, y los valores van entre comillas simples o dobles.

### Reglas

- El parche tiene que ser XML bien formado. En los valores, escribe `&` como `&amp;` y `<` como `&lt;`. Si está mal formado, se salta el parche entero, y el error aparece en el registro y en la ficha del mod.
- Una operación que falla (un selector que no coincide con nada) se salta con un aviso. Las demás se aplican igualmente.
- El parche no cambia la codificación: usa la del archivo del juego (casi siempre ASCII).
- El resultado pierde la sangría de los atributos (quedan todos en una línea). El contenido es el mismo.
- Si quitas o renombras algo que usan otros archivos, se rompe. Las IA del juego llaman a los comandos por nombre (`trainRScout`): quita el comando y la IA fallará.

## Parches INI

Un INI con las secciones y las claves que quieres cambiar:

```ini
; Change gameplay constants
[GamePlay]
DamageAmplify = 250
-TeachingLevel2

; In lists of bare names (no =), + adds a line if it isn't there
[GameOptions Objects]
+MiBotonNuevo
-RSText
```

- `Key = value` cambia o añade la clave en esa sección.
- `-Key` quita la clave (o la línea que sea exactamente ese texto).
- `+Line` añade una línea suelta a la sección si todavía no está.
- Si la sección no existe, se crea al final del archivo.
- Quitar una clave que no existe da un error en el registro.
- Los comentarios al final de las líneas del archivo original (`Key = 20 ;comment`) se pierden en la línea que cambias.

**No pongas comentarios detrás de una línea en el parche.** El motor no los descarta: `-Key ; text` busca una clave con ese nombre y falla, `[Section] ; text` no se reconoce como sección, y `Key = 250 ; text` guarda el comentario dentro del valor. Los comentarios van en líneas propias que empiecen por `;`. El validador no avisa de esto.

## Parches de script

Un parche para un `.vs` (por ejemplo `patches\data\ai\GetTacticScript.vs`) es texto con directivas que empiezan por `@` en la primera columna. El código que escribes bajo cada una se añade al script del juego:

```
@before nRace = set.GetCentralBuilding.race;
// MOD: my civilization
if (Mod_TrueRace(set.GetCentralBuilding) == Dacia)
	return TS_GaulTactic2;

@after player = set.player;
Mod_Log("GetTacticScript: choosing a tactic");
```

`Dacia` no es una constante del juego: existe si hay una civilización activa con ese nombre (el `id` de su `civs\<id>.json`). Mira [Civilizaciones](civilizations.md).

| Directiva | Dónde pone el código |
|---|---|
| `@top` | Justo después de la primera línea del script (la firma). Solo sirve para declarar variables o poner comentarios. |
| `@bottom` | Al final del script. |
| `@before TEXT` | Antes de la primera línea del script que contiene `TEXT`. |
| `@after TEXT` | Después de esa línea. |
| `@replace TEXT` | En lugar de esa línea. |
| `@end` | Cierra el bloque anterior. Opcional: lo que haya después, hasta la siguiente directiva, se ignora. |

- `TEXT` es un trozo de una línea del script, tal como está escrito (no una expresión regular). Se ancla a la primera línea que lo contiene, así que elige un texto que aparezca una sola vez; si no, tu código acaba donde no esperabas. Si ninguna línea lo contiene, el error aparece en el registro y la directiva se salta.
- En los scripts, las variables se declaran todas arriba y el código va después. Un `if` o un `return` colocado con `@top` queda antes de las declaraciones y no compila (`Unexpected starting token`). Usa `@before` con la primera línea de código del script.
- Los parches de varios mods se suman, así que dos mods pueden cambiar el mismo script (por ejemplo, dos civilizaciones que eligen su táctica en `GetTacticScript.vs`).
- El script resultante tiene que compilar. Si no compila, el error aparece en `Logs\imperivm\imperivm-mod.log` como `script: compilation error`.
- El validador no comprueba el código de estos parches, ni las funciones `Mod_*`, ni la firma.

## Si algo sale mal

Busca en `Logs\imperivm\imperivm-mod.log` las líneas con la etiqueta `patch`: indican qué archivo se parcheó y qué operación falló. Los errores también aparecen en la ficha del mod. Los errores de compilación de un parche de script aparecen como `script: compilation error`.
