# Habilidades de las tropas

Cualquier unidad, normal o héroe, puede tener habilidades nuevas. Una habilidad es un comando (el botón) más un método de clase
(el script que lo ejecuta), como los de los druidas y los sacerdotes. Todo son archivos del mod.

Ejemplo listo para copiar: [`examples/ability-example`](examples/ability-example), "Respiro" (tecla `Y`) para soldados cuerpo a cuerpo.

## Camino rápido

`create-ability.js` escribe las tres piezas. Necesitas la carpeta `DATA` del juego ([Datos del juego](README.md#game-data)):

```
node tools/create-ability.js <DATA> mods/my-mod respiro --class Melee --key y --energy-cost 5 --name "Second wind" --name-es Respiro
```

| Opción | Qué hace |
|---|---|
| `--class` | La clase que recibe el botón. Sirve una clase base (`Melee`, `Military`, `Unit`) y sus hijas la heredan, o una concreta (`RHastatus`, `Hero`). Tiene que existir en el juego |
| `--key` | Una letra |
| `--energy-cost` | Energía de 1 a 9. Si la indicas, el script ya la cobra |
| `--name`, `--name-es` | El nombre en inglés y en español. Sin `--name`, el botón muestra el id |
| `--description`, `--description-es` | El texto de ayuda en inglés y en español |
| `--button` | Un botón del juego (`Actions/Mass Healing.bmp`, el predeterminado) o uno tuyo ([Imágenes personalizadas](images.md)) |

Genera:

```
data\commands\Respiro.xml              the command
patches\data\classes\Melee.sc.xml      the method on the class (added to an existing patch if there is one)
data\mod\respiro.vs                    the script, with the signature and energy charge; you write the body
loc\spanish.loc.xml                    the Spanish texts (added to any that exist)
mod.json                               only if the folder has none
```

Te avisa si la tecla ya la usa otro comando de esa clase, de una clase padre o de una hija, y lista las teclas libres. Genera igualmente. No sobrescribe archivos: si el id ya existe en tu mod o en el juego, se detiene sin escribir nada.

Después escribe el cuerpo de `data\mod\respiro.vs` y pasa el [validador](validating.md).

## Qué hace por dentro (hacerlo a mano)

### Las tres piezas

**1. El comando.** Un `<cmd>` en un archivo nuevo de `data\commands` (el juego carga todos los `.xml` de esa carpeta):

```xml
<cmd name="respiro" priority="10" offset="1"
	button="Actions/Mass Healing.bmp" key="y"
	rollover="Second wind" description="..."
	groupverifier="" groupdispatch="" voidgroupdispatch="1"
	coststamina="5">
	<src obj="Melee"/>
</cmd>
```

- `name` es el nombre del comando y también el `sig` del método.
- `button` es la imagen del botón: una del juego o una tuya ([Imágenes personalizadas](images.md)).
- `<src obj="…"/>` son las clases que reciben el botón. Sirve una clase base y sus hijas la heredan: `Melee` (cuerpo a cuerpo), `Military`,
  `Unit` (todas) o una concreta (`RHastatus`). Cuidado con `Military`: incluye a los héroes, y la tecla `Y` ya la usa la habilidad
  `skill_battle_cry` del héroe. `Melee` no choca.
- `coststamina` es la energía que cuesta. La barra `stamina` de un soldado del juego es 10, así que el 5 del ejemplo gasta la mitad. El juego
  no la cobra por sí solo: la cobra tu script. Usa un valor de 1 a 9. La descripción emergente muestra el coste como energía si es menor que 10 y como lealtad si es 10 o más.
- `key` es la tecla. Aparece en Controles → Contenido y se cambia allí ([Teclas de mod](keys.md)).

**2. El método.** En la clase, con un [parche](patches.md) para no reemplazar el archivo entero. Va en `patches\data\classes\Melee.sc.xml`:

```xml
<patch>
  <add select="/class"><method sig="respiro" vs="data/mod/respiro.vs"/></add>
</patch>
```

Las clases hijas heredan los métodos.

**3. El script.** `data\mod\respiro.vs`. Un comando instantáneo recibe `// void, Obj me`, la unidad que lo ejecuta:

```
// void, Obj me

Unit this;
int cost;

this = me.AsUnit();
if (!.IsAlive)
	return;

cost = GetCmdStaminaCost("respiro");
if (.stamina < cost)
	return;
.SetStamina(.stamina - cost);
.Heal(60);
```

Los comandos con objetivo (un clic sobre otra unidad) reciben `// void, Obj This, Obj target`. Mira cómo lo hacen los del juego en
`data\subai\druid_*.vs` y `data\commands\DRUID.XML`. Todas las funciones están listadas en [funciones-del-juego.txt](game-functions.txt).

### Nombre y descripción

El comando se traduce usando su nombre como contexto. En un `loc\<language>.loc.xml` ([Idiomas y textos](languages.md)):

```xml
<translationtableentry text="Second wind" context="respiro" result="Respiro"/>
<translationtableentry text="The soldier recovers 60 health (costs stamina)" context="respiro" result="El soldado recupera 60 de vida (gasta energía)"/>
```

El `text` es el `rollover` y el `description` del comando. [Unidades nuevas](units.md) muestra la otra forma (`text="…@context"`); `languages.md` dice que
valen las dos.

## Habilidades pasivas

Una habilidad sin botón (curarse al matar, daño extra, un aura…) no necesita comando. Usa un [evento](scripts.md) (`OnObjectKill`, `OnObjectDie`) o
un `<behavior>` en la clase.

## Multijugador

Sigue las reglas de [Scripts](scripts.md#multiplayer): no leas nada local. Todos los jugadores necesitan el mismo mod.

## Lo que no se puede hacer

- Crear nuevas especialidades nativas de unidad (`unit_specials`) o habilidades de héroe (`HeroSkills`) con efecto propio: el efecto lo aporta el juego. Puedes usar y combinar las 25 que existen. Los comandos con script de arriba cubren casi todo lo demás, y las especialidades
  de unidad propias van por otro camino ([Especialidades de unidad](specials.md)).
- Efectos visuales y sonidos nuevos: reutiliza los del juego.
