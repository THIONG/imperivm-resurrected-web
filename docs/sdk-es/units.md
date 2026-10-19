# Unidades nuevas

Empieza con la [plantilla de unidades](templates/units), un mod vacío con las carpetas que usa esta guía.

Una unidad nueva son tres cosas: una clase (las estadísticas), un comando para reclutarla en un edificio y sus imágenes y textos. Todo son
archivos del mod; no hace falta programar.

Por defecto la unidad reutiliza el modelo y las animaciones de una unidad del juego. Si quieres arte propio, mira [Gráficos personalizados](graphics.md):
convierte tus PNG a `.rle` y genera el `.ent.xml`.

Ejemplo listo para copiar: [`examples/unit-example`](examples/unit-example), el Veterano romano: más fuerte que el hastato, se recluta
en el cuartel de la Roma republicana. Con sprites propios: `examples/unit-graphics-example` (mira [Gráficos personalizados](graphics.md)).

## Vía rápida

Necesitas la carpeta `DATA` del juego ([`extract-data.js`](tools/extract-data.js)). El Veterano del ejemplo sale de:

```
node tools/create-unit.js <DATA> <mod folder> RVeteran --base RHastatus --health 260 --damage 20 --armor 14 --building RBarracks --gold-cost 180 --time 9000 --key v --name Veteran --name-es Veterano
```

Genera, dentro de la carpeta del mod:

- `data\classes\RVeteran.sc.xml`: una copia completa de la clase base, con tu id y tus estadísticas.
- `data\commands\RVeteran.xml`: el comando de reclutamiento, copiado del de la base.
- `loc\english.loc.xml` (y `spanish.loc.xml` con `--name-es`, `italian.loc.xml` con `--name-it`): nombre, plural y texto del botón. Si el archivo ya existe, añade las entradas.
- `mod.json`, solo si no había uno.

| Opción | Qué hace |
|---|---|
| `--base` | La unidad del juego que se copia (obligatoria). Acepta su id o su `altid` |
| `--health`, `--damage`, `--armor`, `--speed` | Estadísticas. `--armor` fija `armor_slash` y `armor_pierce`. Sin ellas, las de la base |
| `--building` | Dónde se recluta. Sin ella, donde se recluta la base (si son varios, el de su propia civilización) |
| `--gold-cost`, `--food-cost`, `--time` | Precio y tiempo de reclutamiento (en milisegundos) |
| `--key` | La tecla del botón. Sin ella, una letra del nombre que esté libre en ese edificio |
| `--name`, `--plural` | Nombre en inglés. El plural se deduce; corrígelo con `--plural` si no es correcto |
| `--name-es`, `--plural-es`, `--name-it` | Nombre en español y en italiano. `display_name` es la clave del texto, que es el nombre en inglés |

Si algo falla (id duplicado, una base que no es una unidad, un edificio que no existe), te dice por qué y no escribe nada. Tampoco sobrescribe archivos existentes.

Límites:

- Solo copia unidades que el juego recluta con un comando normal (`method="train"`). Quedan fuera las unidades que se contratan en grupo (gladiadores, vikingos…).
- El retrato y el botón son los de la base. Para poner los tuyos, mira [Imágenes](#3-images) y cambia las rutas en la clase y en el comando.
- La IA no reclutará la unidad.
- Pasa el resultado por el [validador](validating.md) con `--data`. Lo que genera es idéntico al ejemplo (salvo las imágenes).

## Qué hace por dentro (hacerlo a mano)

Si prefieres escribirlo tú, o necesitas algo que la herramienta no cubre, esto es lo que genera.

## 1. La clase

`data\classes\RVeteran.sc.xml`. Parte de una copia completa de una clase parecida del juego, como `RHastatus.sc.xml`. Para ver los
archivos del juego, extrae `data.pak` con [`extract-data.js`](tools/extract-data.js): `node extract-data.js "<game folder>"
<output folder>` los deja en `<output folder>\DATA`. Cambia el `id` y las estadísticas:

```xml
<class id="RVeteran" cpp_class="CVXUnit" parent="Melee" entity="Units/RHastatus/RHastatus.ent.xml">
	<properties race="RepublicanRome"/>
	<properties maxhealth="260"/>
	<properties damage="20" armor_slash="14" armor_pierce="14"/>
	<properties speed="60"/>
	<properties unit_specials="Deflection"/>
	<properties icon="gameres/icons/RVeteran.bmp"/>
	<properties display_name="Veteran" display_name_plural="Veterans"/>
	...
</class>
```

- Cópiala entera; no la hagas hija (`parent="RHastatus"`). El juego no hereda del padre la entidad (`entity`, el modelo) ni los sonidos, así que
  una hija sin `entity` propia aparece sin modelo y desaparece.
- `entity` apunta al modelo y a las animaciones. Aquí son los del hastato.
- `race` es la civilización: `RepublicanRome`, `Gaul`… o una de tu mod ([Civilizaciones](civilizations.md)).
- Las estadísticas habituales son `maxhealth`, `damage`, `armor_slash`, `armor_pierce`, `speed`, `sight` y `range`. Qué hace cada una, y
  cuáles no sirven para nada, está en [Estadísticas de unidades](stats.md). Una unidad copiada de una normal hereda `feeds=1` (come); las máquinas
  de asedio y los centinelas del juego lo ponen a 0.
- `unit_specials` son las [especialidades de unidad](specials.md), las del juego y las tuyas.
- No copies el `altid` del original. Es un alias que los scripts usan para encontrar el «soldado» de una civilización; dos clases con el
  mismo alias se confunden.
- `edittree_pos` (por ejemplo `Units/Roman/Veteran`) es donde aparece en el editor de mapas y en el menú de trucos: una clase con `entity`
  cuyo `edittree_pos` empieza por `Units/` aparece ahí, en el grupo de su civilización. La herramienta lo copia de la base y cambia el
  último nombre.
- Un archivo nuevo en `data\classes\` se carga solo. No hace falta registrarlo.

## 2. El comando de reclutamiento

`data\commands\Veteran.xml`. Es una copia del comando del juego (`trainRHastatus`, en `data\commands\RBARRACKS.XML`) con otra clase y
otro coste. El juego carga todos los `.xml` de `data\commands`.

```xml
<cmd name="trainRVeteran" priority="3"
	button="actions/train RVeteran.bmp" queueicon="gameres/icons/RVeteran.bmp"
	key="v" costgold="180" costfood="0" costpop="1" execdelay="9000"
	rollover="Equip Veteran" method="train" param="RVeteran" sclass="RVeteran" ...>
	<src obj="RBarracks"/>
</cmd>
```

- `<src obj="RBarracks"/>` es el edificio donde aparece el botón. Para otro edificio, otra clase (`RBlacksmith`, `RArena`…).
- `param` y `sclass` son la clase que se recluta. `costgold`, `costpop` y `execdelay` (milisegundos) son el precio y el tiempo.
- `key` es la tecla. Aparece en Controles → Contenido, y se cambia ahí ([Teclas de mod](keys.md)).
- Un edificio nuevo funciona igual: una copia completa de una clase de edificio, más sus comandos con `<src obj="MyBuilding"/>`.

## 3. Imágenes

El botón mide 153 x 51 y el retrato 65 x 76. Constrúyelos a partir de un PNG con `tools/convert-image.js` ([Imágenes personalizadas](images.md)). Sin
imágenes propias, usa las de la unidad del juego (`button="actions/train RHastatus.bmp"`, `icon="gameres/icons/RHastatus.bmp"`).

## 4. Textos

El nombre de la clase y el texto del botón se traducen con un `loc\<language>.loc.xml` ([Idiomas y textos](languages.md)):

```xml
<translationtableentry text="Veteran@RVeteran class name" result="Veterano"/>
<translationtableentry text="Veterans@RVeteran class name plural" result="Veteranos"/>
<translationtableentry text="Equip Veteran@trainRVeteran" result="Equipar veterano"/>
```

## Multijugador y límites

- Las clases y los comandos son jugabilidad: todos los jugadores necesitan el mismo mod.
- La IA no reclutará tu unidad a menos que incluyas tus propios scripts de IA. Mira [Civilizaciones](civilizations.md#the-ai).
- Una unidad de una civilización nueva necesita además sus edificios y sus comandos. La herramienta de clonado de [Civilizaciones](civilizations.md)
  los genera.
