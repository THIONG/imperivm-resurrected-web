# Estadísticas de unidades y edificios

Todo lo que no lleva etiqueta sale directamente de los datos del juego. *(inferred)* es una suposición sobre cómo usa el juego ese valor, y *(partial)* es lo menos fiable.

Las estadísticas son atributos de `<properties>` en la clase (`data\classes\<Class>.sc.xml`). Para cambiarlas sin copiar la clase entera, usa un [parche](patches.md); para crear una unidad, mira [Unidades nuevas](units.md).

```xml
<patch>
  <!-- Legionaries run faster: speed 60 -> 75 -->
  <set select="/class/properties[@speed]" speed="75"/>
</patch>
```

Va en `patches\data\classes\RHastatus.sc.xml`. Un atributo que la clase no define lo hereda de su padre.

## Qué atributo hace qué

| Quiero cambiar… | Atributo | Notas |
|---|---|---|
| Velocidad de movimiento | `speed` | La animación de andar se adapta sola (inferred) |
| Cadencia de ataque | sin atributo | Duración de la animación de ataque, o `SetSpeedFactor` desde un script |
| Alcance de los arqueros | `range` | |
| Alcance mínimo (catapultas) | `min_range` | |
| Tamaño real (hitbox) | `radius` | Colisión, rutas y alcance (inferred) |
| Área de clic | `selection_radius` | Cosmético (inferred) |
| Daño | `damage` | |
| Armadura | `armor_slash` | `armor_pierce` no hace nada (partial) |
| Vida | `maxhealth` | |
| Visión | `sight` | |
| Qué se ataca primero | `target_factor` | |
| Proyectiles | `projectile_class` | Con límites, mira *Alcance* |

### Velocidad (`speed`)

- Unidades de mapa por segundo. En el juego: infantería 60-80, arqueros 60-160, caballería 130-190, héroes 120, arietes 40, barcos 240.
- El ciclo de la animación de andar dura `step × 1000 / speed` milisegundos, con `step` tomado del `.ent.xml` (Hastatus: 42 × 1000 / 60 = 700 ms).
  Cambiar solo `speed` no desincroniza el sprite: la animación se acelera o se frena con el movimiento. *(inferred)*
- `speed="0"` en una unidad que anda cuelga el juego por una división entre cero. Lo mismo ocurre con una clase que ni define `speed` ni lo hereda. *(inferred)*

### Cadencia de ataque

No hay un atributo de "velocidad de ataque" para las unidades. *(inferred)*

- Un golpe dura lo que la animación de ataque, la suma de los valores `<frame duration>` del `.ent.xml`, y el daño cae en el `action_time` de la animación. En las 118 animaciones del juego, los golpes duran de 594 a 1584 ms, con una mediana de 990 ms (Hastatus: 994 ms, `action_time` 426).
- `attack_delay` no sirve para unidades: solo lo definen `Catapult` (500) y `FakeTower` (400), y nada más en los datos. *(inferred)*
- Hay dos formas de atacar más rápido. Una: acortar los fotogramas de la animación de ataque y reescalar `action_time` en la misma proporción.
  La otra: `Unit::SetSpeedFactor(150)` desde un script, que acelera un 50 % tanto el andar como el ataque. `SetSpeedFactor(0)` cuelga el juego. *(inferred)*
- Para cambiar el `.ent.xml` desde un mod, un parche XML debería funcionar. Un `.ent.xml` suelto no reemplaza al del juego ([Gráficos personalizados](graphics.md)).
- La cadencia de ataque y el momento del golpe son simulación: deben ser iguales para todos los jugadores.

### Alcance (`range`, `min_range`)

- Valores del juego: infantería 15-40, arqueros 300-500 (los barcos llegan a 700), centinelas 600, caballería 15-40, catapultas 700-800, torres 600-800. `RCatapult` tiene `min_range=201`.
- Se mide de borde a borde: la distancia entre centros menos el `radius` de las dos unidades. Por eso `radius` también cuenta. *(inferred)*
- Una unidad cuerpo a cuerpo pasa a ser a distancia con `range` más un `projectile_class` (Arrow, Javelin, Axe, Slingstone) y una animación de ataque con `action_time`.
- Con `range` por debajo de `min_range` nunca ataca. Con `range="0"` en una unidad cuerpo a cuerpo, tampoco. *(inferred)*
- Un proyectil tarda lo que dura su animación, sea cual sea la distancia (flecha 495 ms, hacha y jabalina 561, piedra de honda 300). No hay un atributo de velocidad de proyectil. Un atacante con proyectil hace la mitad de daño a los edificios. *(inferred)*
- Catapultas: el arco sale de `shot_tan` y `shot_height`. No los cambies en un solo ordenador.

### Hitbox y tamaño

| Atributo | Qué hace | Valores del juego |
|---|---|---|
| `radius` | Tamaño físico: colisión, rutas, separación y alcance (inferred). Simulación | Infantería 10, caballería 20, héroes 20-30, arietes 80, catapultas 50 |
| `selection_radius` | Anillo de selección y área de clic. Cosmético mientras la unidad tenga un `formation_radius` (inferred) | |
| `formation_radius` | Separación entre huecos de una formación. Simulación | Infantería 26, caballería 35, héroes 45 |

Define siempre `radius` en un edificio nuevo. El heredado (`Building`: 600) es enorme, y los atacantes "alcanzan" el edificio desde muy lejos. Los edificios reales usan 160-250 en los cuarteles, 47 en las torres, 80-110 en las murallas y 333-345 en los fortines.

### Daño y armadura

Constantes de `data\const.ini`, sección `[GamePlay]`: `MinDamage=3`, `MinPercentOfAttackersDamage=20`, `DamageAmplify=200` y `LevelDifferenceDamageTable`. Cómo se usan es *(inferred)*:

- Un golpe hace `damage − armor_slash` del defensor, con un mínimo del 20 % del daño del atacante y nunca menos de 3. Después se aplica la diferencia de nivel entre los dos: va de −90 % a +90 %, y si el defensor tiene el nivel más alto, resta.
- `armor_pierce` no entra en el cálculo: puedes escribirlo y no hace nada *(partial: un script puede usarlo)*. Para dar armadura, usa `armor_slash`.
- `damage_type` (`slash`, `pierce`, `siege`, `none`) no cambia el daño: decide qué puede atacar la unidad. `slash` y `pierce` atacan unidades (y edificios si hay proyectil), `siege` ataca también edificios, `none` no ataca.
- Los edificios no tienen armadura: el daño entra entero.
- `DamageAmplify` es el daño a la guarnición de un edificio. Ajusta estas constantes con [parches INI](patches.md).

### Otros atributos

| Atributo | Qué hace |
|---|---|
| `maxhealth` | Vida. Infantería 160-3000, héroes 1000-1300, fortines 10000. `0` cuelga un edificio o hace aparecer la unidad muerta *(inferred)* |
| `maxstamina` | La energía que gastan los especialidades de unidad y las [habilidades](abilities.md). Todos los soldados del juego tienen 10. Con menos que el coste, el especial no se activa *(inferred)* |
| `sight` | Visión: revela la niebla (inferred). Infantería 500, centinelas 600, civiles 150 |
| `target_factor` | Qué se ataca primero: menor significa antes. Por defecto 100, héroes 200, civiles 1000. Negativo = nunca se elige por sí solo (la fauna usa -1) *(inferred)* |
| `unit_specials` | [Especialidades de unidad](specials.md), los del juego y los tuyos |
| `feeds`, `max_food` | `Unit` hereda `feeds=1` y `max_food=20`: toda unidad normal come. Con 0 de comida pierden vida *(inferred; no está claro cuándo exactamente)*. `RamUnit`, `Sentry`, `GGhost` y los animales tienen `feeds=0`; ponlo en máquinas y criaturas mágicas |
| `does_not_regenerate` | `1`: sin comida y sin regeneración. Útil para invocaciones y máquinas *(inferred)* |
| `stamina_dec_time` | En unidades invocadas: milisegundos entre cada pérdida de 1 de energía. Viven ≈ `(maxstamina+1) × this value`, donde "this value" es el de este atributo; con `0` o menos mueren al instante *(inferred)* |
| `water_unit` | Barcos y peces: rutas y objetivos en el agua |
| `desync_hash` | `1`: el movimiento de este objeto entra en la comprobación de sincronía. Pon `0` en los efectos visuales nuevos *(inferred)* |

## Lo que no hace nada

`armor_pierce` *(partial)*, `speed_modify` y `taunt` (como propiedad es el nombre de un sonido) se leen y nunca se usan. *(inferred)* `attack_delay` no sirve en unidades. `target_priority` solo importa para torres y catapultas; para unidades, usa `target_factor`.

## Cambiar cosas durante la partida (desde un script)

| Qué | Cómo |
|---|---|
| Vida, vida máxima, energía, energía máxima | `SetHealth`, `SetMaxHealth`, `SetStamina`, `SetMaxStamina`. El juego recalcula los máximos al equipar un objeto o subir de nivel, y sobrescribe tu valor |
| Visión | `SetSight(n)`, de 100 a 2048 |
| Velocidad y cadencia de ataque | `Unit::SetSpeedFactor(n)`, como porcentaje (100 = normal). `0` cuelga el juego |
| Nivel, experiencia, especialidades de unidad | `SetLevel`, `SetExperience`, `Mod_SetSpecial` |
| Daño, armadura, alcance o radio de una unidad concreta | No hay función. Crea otra clase con esos valores y convierte la unidad con `Unit::Mutate("OtraClase")`, que conserva vida, experiencia y órdenes |

Las funciones están en [funciones-del-juego.txt](game-functions.txt). Para cambiar el daño de un solo golpe, usa el evento `OnAttackResolved` con `Mod_SetAttackDamage` ([Especialidades de unidad](specials.md)).

## Lo que el XML no puede hacer

- La fórmula de combate (armadura plana, mínimos, tabla de niveles). Solo puedes ajustar las constantes de `const.ini`.
- La velocidad del proyectil y su alcance de vuelo: el golpe cae si la distancia es menor que `range + 150`. *(inferred)*
- Comportamientos nuevos en código: los valores de `cpp_class` son solo los que trae el juego.
- La lógica de formaciones, más allá de lo que permite [Formaciones](formations.md).

## Multijugador

Casi todo lo anterior es simulación. Todos los jugadores deben tener el mismo mod, y el juego lo comprueba al entrar en una sala; una diferencia entre dos jugadores desincroniza la partida y se aborta. Son cosméticos: `selection_radius`, `healthbar_*`, `icon`, `display_name`, `help` y los sprites.

Los sprites (`.rle`) no forman parte de la comprobación. La lista completa de lo que se comprueba está en el [README](README.md).

## Lo que no sabemos

- La conversión exacta entre unidades de mapa y píxeles de pantalla.
- Si `sight` limita también hasta dónde busca objetivos una unidad. Revela la niebla y los scripts lo usan para buscar, pero se desconoce el cálculo exacto.
- Qué `formation_priority` va delante en una formación.
- Qué pasa con un `action_time` más largo que la animación. Evítalo.
