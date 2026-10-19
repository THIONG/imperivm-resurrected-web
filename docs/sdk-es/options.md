# Opciones de partida propias

Un mod puede añadir **interruptores** (activado / desactivado) y **listas de valores** (un desplegable) a la lista de REGLAS de la sala, junto a "Fog of war" o "Lock diplomacy". El anfitrión las elige, todos las ven y tus scripts leen la elección con `Mod_GetOption("id")` (interruptor) o `Mod_GetOptionValue("id")` (lista). Las dos son API de scripts 6.

Ejemplo: [`examples/options-example`](examples/options-example) (el interruptor "Fast heroes" y la lista "Hero speed").

## Camino rápido

`create-option.js` escribe el JSON y, si quieres, un esqueleto de script. No necesita la carpeta `DATA`.

```
node tools/create-option.js mods/my-mod fast-heroes --name "Fast heroes" --description "All heroes move 50% faster."
node tools/create-option.js mods/my-mod hero-speed --name "Hero speed" --values "Normal,Fast,Very fast" --default Normal --script
```

El primero crea un interruptor; con `--values` (de 2 a 16, separados por comas) crea una lista.

| Opción | Qué hace |
|---|---|
| `--name` | Obligatoria. El nombre que se muestra en la sala |
| `--name-es`, `--name-it` | El nombre en español y en italiano |
| `--description`, `--description-es`, `--description-it` | El texto de ayuda de la sala |
| `--values`, `--values-es`, `--values-it` | Los valores de una lista, en el mismo orden y en el mismo número. El id de cada valor sale de su texto en `--values` |
| `--default` | Interruptor: `true` o `false`. Lista: el número del valor (desde 0), su id o su texto. Sin ella: `false`, o el primer valor |
| `--script` | Crea además `data\mod\<id>.vs`, un comportamiento con el `if (Mod_GetOption("<id>"))` (o `Mod_GetOptionValue`) listo para rellenar. Engánchalo a una clase con un parche, como hace el ejemplo |

Genera `options\<id>.json` y, con `--script`, `data\mod\<id>.vs`. Te dice cuántos de los 8 bits usa y cuántos usa ya el mod. Nunca sobrescribe nada: si el mod ya tiene ese id, se detiene sin escribir.

## Hacerlo a mano

1. Un archivo `options\<id>.json` en tu mod.

   Un interruptor:

   ```json
   {
     "id": "fast-heroes",
     "name": "Fast heroes",
     "description": "All heroes move 50% faster.",
     "default": false
   }
   ```

   Una lista (de 2 a 16 valores):

   ```json
   {
     "id": "hero-speed",
     "name": "Hero speed",
     "values": [
       { "id": "normal", "name": "Normal" },
       { "id": "fast", "name": "Fast (+25%)" },
       "Very fast"
     ],
     "default": "normal"
   }
   ```

   - `id`: letras, números, `_` y `-`, hasta 32. Lo usan los scripts; no distingue mayúsculas. Si falta, se usa el nombre del archivo.
   - `name` y `description`: un solo texto, o uno por idioma: `{"english": "Fast heroes", "spanish": "Héroes veloces"}` (el idioma del juego, y el inglés si falta). [El ejemplo](examples/options-example) lo hace así.
   - `values`: cada uno es un texto o un objeto con `id` y `name`. El primero es el 0.
   - `default`: en un interruptor, `true` o `false`; en una lista, el número del valor (desde 0) o su `id`. Un `id` que no existe vuelve al 0 sin avisar; `validate-mod.js` lo detecta.

2. Un script que la lea (un comportamiento de clase, un evento o un script de victoria):

   ```
   if (Mod_GetOption("fast-heroes")) {
       This.AsUnit().SetSpeedFactor(150);
   }
   if (Mod_GetOptionValue("hero-speed") == 1) {
       This.AsUnit().SetSpeedFactor(125);
   }
   ```

   `Mod_GetOption` devuelve `true` si el valor no es 0 (también en las listas). `Mod_GetOptionValue` devuelve el número del valor elegido.

## Límites

- **Hay 8 bits para todas las opciones de todos los mods activos.** Un interruptor usa 1; una lista usa 1 para 2 valores, 2 para 3 o 4, 3 para 5 a 8 y 4 para 9 a 16. Se reparten por orden alfabético de `id`; lo que no cabe se ignora y el registro lo indica. Si dos opciones comparten `id`, el juego usa la primera que encuentra al ensamblar los mods.
- **Solo funcionan con sala.** Las opciones se fijan cuando una partida empieza desde la sala (o cuando vuelves a entrar en una online). Las aventuras, las campañas y los tutoriales no tienen sala: `Mod_GetOption` devuelve siempre 0 y una lista vale 0, incluso con `"default": true`.
- Los preajustes de la sala (Classic, Competitive) no tocan las opciones de los mods.

## Reglas fijas de un mod

Algunas reglas del motor no son opciones de la sala: el mod las fija para todas sus partidas en `rules\game.json`:

```json
{
  "armyStaysWithHero": true,
  "sentriesUnselectable": true,
  "protectedClasses": ["Peasant", "PeasantAmbient", "Trader", "Tradecar_Donkey", "Camel", "CartTrader"]
}
```

| Campo | Qué hace |
|---|---|
| `armyStaysWithHero` | Con `true`, las unidades de un ejército no se separan de su héroe cuando uno está dentro de las murallas y el otro fuera. El camino se recalcula igualmente. |
| `sentriesUnselectable` | Con `true`, los centinelas de las murallas no se pueden seleccionar (al hacer clic en uno se selecciona la puerta) y no se unen a los ejércitos de la IA. |
| `protectedClasses` | Clases que no reciben daño y no pueden ser atacadas, junto con todas las que heredan de ellas. Son nombres de clase (`Peasant`), no de unidad. |

Cambian el juego, así que en multijugador todos deben usar el mod. Si varios mods activos aportan reglas, se suman.

## Online

Esto es jugabilidad: todos los jugadores deben tener el mismo mod. La opción viaja con el resto de reglas de la sala y se guarda con la partida.
