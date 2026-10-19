# Formaciones nuevas

Las formaciones de héroe (Línea, Frente, Bloque, Caballería) son datos: un `formations.xml` con bonificaciones y colocación, y dos órdenes por formación en `data\commands\Hero.xml`. Un mod añade las suyas con [parches](patches.md), sin compilar nada.

Ejemplo: [`examples/formation-example`](examples/formation-example) (la Cuña).

## Camino rápido

`create-formation.js` escribe las tres piezas. Necesitas la carpeta `DATA` del juego ([Datos del juego](README.md#game-data)):

```
node tools/create-formation.js <DATA> mods/my-mod Wedge --damage 3 --armor 1 --like "Cavalry core" --key i
```

| Opción | Qué hace |
|---|---|
| `<Name>` | El `Name` de la formación: letras y números, sin espacios. Tiene que ser nuevo |
| `--damage`, `--armor`, `--pierce-defense`, `--slash-defense`, `--range`, `--level` | Las bonificaciones (de -1000 a 1000). Sin ninguna, la formación solo cambia la colocación |
| `--like` | La formación del juego de la que copiar la lista de clases, el tamaño, el espaciado y la imagen del botón: `Front` (predeterminada), `Line`, `Block`, `Cavalry core`, `Horse Wings`, `Ranged Wings` |
| `--classes "Unit=wings,Horse=front"` | Tu propia colocación, en lugar de la de `--like`. Los huecos son `front`, `wings` y `center` |
| `--width`, `--height`, `--front`, `--wing-x`, `--wing-y` | `Width`, `Height` y los tres espaciados (`Offset…`) |
| `--key` | La tecla que selecciona la formación. Sin ella, busca una libre |
| `--description`, `--button` | El `Description` (en inglés) y un botón distinto (`States/…`) |

Genera:

```
patches\data\formations.xml                     the formation
patches\data\commands\Hero.xml                  its two buttons, form-<name>-menu and form-<name>
patches\data\subai\hero_formation_verify.vs     the script patch
mod.json                                        only if the folder doesn't have one
```

Si el mod ya tiene otra formación, la nueva se añade a esos mismos archivos sin sobrescribir la anterior. Lo mismo vale para el parche del script: cada formación añade su propio `@replace`.

Comprueba que la tecla esté libre para el héroe, que hereda las órdenes de `Unit` y `Military`. Si choca, avisa y genera igualmente. En el juego solo `i` está libre, así que la segunda formación de un mod tendrá que compartir tecla: elige una letra y asegúrate de que el choque no te estorba.

Los botones usan la imagen de la formación base. Para tener la tuya, mira [Imágenes personalizadas](images.md) y pasa `--button`.

## Qué hace por dentro (hacerlo a mano)

### Las tres piezas

**1. La formación** (`patches\data\formations.xml`):

```xml
<patch>
  <add select="/Formations">
    <FormationClass Name="Wedge"
        Description="The warriors form a wedge with the cavalry at the point."
        Width="3" Height="1"
        BonusDamage="3" BonusArmor="1"
        OffsetFrontLineByY="40" OffsetWingsByX="30" OffsetWingsByY="0">
      <Class Name="Unit" Wings="1"/>
      <Class Name="Horse" FrontLine="1"/>
      <Class Name="BaseMage" CentralBlock="1"/>
      <Class Name="Peasant" CentralBlock="1"/>
    </FormationClass>
  </add>
</patch>
```

| Atributo | Qué hace |
|---|---|
| `Name` | El nombre de la formación; las órdenes se refieren a él |
| `Description` | No se muestra en el botón: el juego enseña un texto fijo ("Army bonus during stand ground") con los iconos de bonificación |
| `Width`, `Height` | Tamaño de la cuadrícula del grupo de primera línea (`FrontLine`). En la Cuña, donde `Unit` va a los flancos, `Width=3` solo afecta a los caballos |
| `BonusDamage`, `BonusArmor`, `BonusRange`, `BonusLevel` | Bonificaciones del ejército, solo mientras las tropas están quietas ("stand ground"). Se limitan a -1000..1000 |
| `BonusDefencePierce`, `BonusDefenceSlash` | Defensa contra perforación y contra corte por separado. `BonusArmor` fija las dos a la vez |
| `OffsetFrontLineByY`, `OffsetWingsByX`, `OffsetWingsByY` | A qué distancia del héroe se colocan la primera línea y los flancos |
| `<Class Name="…" …/>` | Dónde van las unidades de esa clase: `FrontLine="1"` delante, `Wings="1"` a los lados, `CentralBlock="1"` en el centro, alrededor del héroe |

`BonusAttack` aparece en una de las formaciones del juego pero no hace nada: no cuentes con él.

**2. Los botones** (`patches\data\commands\Hero.xml`). Dos órdenes: `form-<name>-menu` (el botón que ves cuando esa es la formación actual) y `form-<name>` (el que la selecciona). Las dos llevan `param="<Name>"` y `menu="1"`. Copia `form-front-menu` y `form-front` y cambia `name`, `param`, `key` y `button` (la imagen; mira [Imágenes](images.md)).

La tecla no debe chocar con otra orden del héroe, y el héroe además hereda las órdenes de `Unit`. En `data\commands` (extráelo con `extract-data.js`, mira [Parches](patches.md)) busca `key="x"` en `HERO.XML` y `UNIT.XML`. El ejemplo usa `i`, que no está en ninguno; `q`, por ejemplo, pertenece a `reveal`.

**3. Un parche para el script que deja pasar los botones** (`patches\data\subai\hero_formation_verify.vs`). El script del juego solo deja elegir una formación cuando está abierto uno de sus cuatro menús, nombrados en una lista. Añade el tuyo:

```
@replace if (cmd_name != "form-front-menu")
if (cmd_name != "form-front-menu")
	if (cmd_name != "form-wedge-menu")
@end
```

Si otro mod parchea esa misma línea para añadir otra formación, los parches se apilan: cada `@replace` reescribe la línea del juego y deja la tuya detrás.

## Online

Las bonificaciones cambian la jugabilidad: todos los jugadores deben tener el mismo mod.
