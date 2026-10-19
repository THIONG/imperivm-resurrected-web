# Especialidades de unidad propias

El juego trae 36 especialidades de unidad fijas (Parry, Penetration, Deflection…). No se pueden ampliar, pero un mod puede declarar
otras nuevas, y tú programas su efecto con scripts.

Ejemplo listo para copiar: [`examples/specialty-example`](examples/specialty-example), "Golpe crítico": el 25 % de los golpes del hastatus
hacen el triple de daño.

## Cómo funciona

Cada unidad lleva una máscara de 64 bits, un bit por especialidad. Los bits 0 a 35 son las 36 del juego. Los bits 36 a 63 son tuyos y se guardan con la partida. Una especialidad de mod ocupa un bit.

Hay tres pasos.

**1. Declararla.** Un archivo `specials\<id>.json` en tu mod:

```json
{
  "id": "Critical",
  "bit": 36,
  "name": {"spanish": "Golpe crítico", "english": "Critical hit", "italian": "Colpo critico"},
  "description": {"spanish": "Uno de cada cuatro golpes hace el triple de daño.", "english": "One hit in four does triple damage.", "italian": "Un colpo su quattro fa il triplo del danno."}
}
```

| Campo | Qué es |
|---|---|
| `id` | El nombre: letras, números y `_`, empezando por letra, hasta 24 caracteres. Lo escribes en `unit_specials` y es la constante del script (`Critical`). No puede ser el nombre de una de las 36 del juego (`Triple strike`…). Evita también los ids que, en minúsculas y con `_` en lugar de espacios, coincidan con constantes del juego (`triple_strike`, `keen_sight`, `life_steal`…): el validador no lo comprueba y la constante chocaría con la del juego. |
| `bit` | Un número de 36 a 63. No lo cambies una vez publicado: las partidas guardadas lo recuerdan. Dos mods no pueden usar el mismo. |
| `name` | Su nombre en cada idioma, o una sola cadena. |
| `description` | Se lee, pero todavía no se muestra en ningún sitio. Descríbela en el texto de ayuda de la unidad. |
| `icon` | (Opcional) Se lee, pero no se usa. |

**2. Asignarla a clases.** Con el atributo habitual `unit_specials`. El juego ignora los nombres que no conoce y el mod activa el bit. Mejor hacerlo con
un [parche](patches.md), para no reemplazar el archivo de la clase:

```xml
<patch>
  <set select="/class/properties[@unit_specials='Deflection']" unit_specials="Deflection, Critical"/>
</patch>
```

La herencia funciona como en el juego. Si una clase define `unit_specials`, su lista reemplaza la del padre; si no lo define, hereda la lista entera del padre. Al
añadir una a una clase que ya tiene otras, repite las que tenía (`Deflection, Critical`). En el juego los nombres distinguen mayúsculas; los de tu mod no.

**3. Programar el efecto.** El juego solo guarda el bit. Lo que hace lo escribes tú en un [script](scripts.md):

| Función | Qué hace |
|---|---|
| `Mod_HasSpecial(Unit unidad, int bit)` : `bool` | Indica si la unidad tiene esta especialidad. Vale para cualquier bit de 0 a 63, también los del juego. Recibe una `Unit`; con un `Obj`, usa `objeto.AsUnit()` (si no es una unidad, devuelve `false`). |
| `Mod_SetSpecial(Unit unidad, int bit, bool puesta)` | Activa o quita la especialidad de esa unidad, por ejemplo al subir de nivel. Se guarda con la partida. |

El bit es la constante que se llama como el `id`: `Mod_HasSpecial(attacker.AsUnit(), Critical)`.

El lugar natural para el efecto es el evento `OnAttackResolved`, que puede cambiar el daño de cada golpe (`events\OnAttackResolved.vs`). Sirve
cualquier otro script: un `<behavior>` que revise las unidades cada cierto tiempo, `OnObjectKill`, `OnObjectDie`…

```
// void, Obj attacker, Obj victim, int damage
if (!attacker.IsValid) return;
if (!Mod_HasSpecial(attacker.AsUnit(), Critical)) return;
if (rand(100) >= 25) return;
Mod_SetAttackDamage(damage * 3);
```

## Multijugador

`specials\`, `events\` y `civs\` cuentan como jugabilidad: todos los jugadores necesitan el mismo mod.

## Errores

Salen en `Logs\imperivm\imperivm-mod.log` (líneas con la etiqueta `specials`) y en la tarjeta del mod en el gestor: un `id` no válido, un `bit` que falta o está
duplicado, un nombre que pertenece a una especialidad del juego.

Aviso: si añades una `[Section]` desconocida a `UNIT_SPECIALS.INI` (con un parche, para darle icono y texto a una especialidad),
el juego puede cerrarse por un fallo. No lo hagas. Las especialidades de mod no usan ese archivo.

## Lo que falta

- La barra de información de la unidad, arriba, donde el juego muestra hasta tres especialidades de una unidad con su icono, no muestra las de los mods.
- El texto de estadísticas del botón de reclutar debería listarlas debajo de las del juego, sin el título "Specials":
  una unidad con solo especialidades de mod las mostraría sin título.
- Iconos propios: no se muestran.
- No se puede ampliar la tabla de las 36 del juego ni crear habilidades nativas de héroe nuevas. Las activas se hacen
  con [comandos y scripts](abilities.md).
