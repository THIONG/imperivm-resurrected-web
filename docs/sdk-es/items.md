# Objetos nuevos

Los objetos que llevan los héroes (amuletos, hierbas, gemas…) son datos. El juego trae 42 en `data\items.xml`, y un mod puede añadir los suyos con un [parche](patches.md), sin compilar nada.

Ejemplo listo para copiar: [`examples/item-example`](examples/item-example).

## Camino rápido

El objeto de ejemplo, entregado a todos los héroes, sale de:

```
node tools/create-item.js <mod folder> "Example Amulet" --damage 10 --armor 5 --give-heroes
```

Genera, dentro de la carpeta del mod:

- `patches\data\items.xml`: el objeto con todos sus atributos. Si el parche ya existe, añade el objeto al final y deja los que hay.
- Con `--give-heroes`: `patches\data\classes\Hero.sc.xml` (un comportamiento más para la clase `Hero`) y `data\mod\dar_<id>.vs`, el script que da el objeto a cada héroe que aún no lo tiene. Si `Hero.sc.xml` ya existe, también añade ahí.
- `mod.json`, solo si no había uno.

| Opción | Qué hace |
|---|---|
| `--health`, `--damage`, `--armor`, `--level`, `--experience` | Lo que suma a quien lo lleva. `--armor` fija `armor_slash` y `armor_pierce` |
| `--icon` | Un icono del juego, por ejemplo `"gameres/icons/items/Belt of might.bmp"`. Sin ella, el icono de los dientes de oso |
| `--description` | El texto de la ventana del objeto. Sin ella, uno en inglés como `Adds 10 to damage and 5 to armor` |
| `--give-heroes` | Todos los héroes reciben el objeto al aparecer |
| `--data <DATA>` | Comprueba que ningún objeto del juego use ya ese id |

Si ejecutas el comando otra vez con otro id, añade otro objeto. Si el id ya existe en tu parche o en el juego, te lo dice y no escribe nada.

No genera `use_script`, `equip_script` ni `kill_script`, ni `usecount` ni `cursed`: añádelos a mano al `<item>` ([Un objeto con efecto propio](#an-item-with-its-own-effect)). Lo que genera coincide con el ejemplo.

## Qué hace por dentro (hacerlo a mano)

## Un objeto

Un parche de `data\items.xml`, en `patches\data\items.xml` dentro de tu mod:

```xml
<patch>
  <add select="/items">
    <item id="Example Amulet"
          image="gameres/icons/items/Bear Teeth.bmp"
          sound="data/sound entities/ItemUse.xml"
          level="0"
          name="Example Amulet"
          description="Adds 10 to damage and 5 to armor"
          important="no">
      <bonus health="0" damage="10" armor_slash="5" armor_pierce="5" level="0" experience="0"/>
    </item>
  </add>
</patch>
```

| Atributo | Qué hace |
|---|---|
| `id` | El nombre que usan los scripts (`AddItem("…")`). Único |
| `image` | El icono: uno del juego o uno tuyo dentro de `gameres/icons/items/` en tu mod (un BMP) |
| `name`, `description` | Lo que muestra la ventana del objeto |
| `level` | Nivel mínimo del héroe para llevarlo (ningún objeto del juego usa otro valor que 0) |
| `important` | `yes` o `no`. Si es un objeto especial (se muestra aparte) |
| `usecount` | Cuántas veces se puede usar: `1` para los de un solo uso, más para los que tienen cargas (`1000` de comida en el trigo) |
| `cursed` | `1` si no se puede quitar, `0` si se puede. Es un número, no `yes`: el juego lo lee como número y cualquier texto cuenta como 0, sin avisar. |

`<bonus>` suma a quien lleva el objeto: `health`, `damage`, `armor_slash`, `armor_pierce`, `level` y `experience`. Con `health_percent`, `damage_percent`, `armor_slash_percent` y `armor_pierce_percent` suma un porcentaje en lugar de una cantidad fija.

`items.xml` acepta algunos atributos más (`customdata`, `location_script`, `object_script`, `attacheddie_script`), sin documentar; mira cómo los usan los objetos del juego.

## Un objeto con efecto propio

Un script que se ejecuta cuando el héroe usa el objeto:

| Atributo | Cuándo se ejecuta | Firma |
|---|---|---|
| `use_script="file://data/mod/mi.vs"` | Cuando el jugador usa el objeto | `// void, Obj owner` |
| `equip_script` | Cuando se equipa | Mira los del juego |
| `kill_script` | Cuando quien lo lleva mata a alguien con él | Mira los del juego |

Escribe la ruta con `file://`, como los objetos del juego (`file://data/ItemScripts/….vs`).

Los scripts del juego están en `data\ItemScripts`; para verlos, extrae los datos con [`extract-data.js`](tools/extract-data.js). El de las hierbas curativas:

```
//void, Obj owner

CreateFeedback("Heal", owner.AsUnit());
owner.Heal(owner.maxhealth);
ItemUsed(1);
```

`ItemUsed(n)` gasta `n` usos del objeto. Con `usecount="1"` desaparece al usarlo.

## Cómo meterlo en una partida

- Dalo desde un script: `Obj::AddItem("id")` devuelve `true` si cabe en el inventario. El ejemplo lo hace en un comportamiento de la clase `Hero` (`patches\data\classes\Hero.sc.xml`), que se ejecuta con cada héroe que aparece. Comprueba antes que el héroe no lo tiene (`FindItem("id").IsValid`): al cargar una partida guardada el script se reinicia.
- Suéltalo al matar: un evento [`OnObjectKill`](scripts.md) que llame a `AddItem` sobre el asesino, o a `DropItem` en el suelo.
- En las ruinas y tesoros del mapa: mira `data\classes\BaseRuins.sc.xml`. Reparte objetos con líneas `itemtype` y `levelperitem`. En los datos del juego ninguna otra clase usa esto, ni tampoco las tiendas de las civilizaciones.

Los objetos cambian la jugabilidad: en una partida online todos los jugadores deben tener el mismo mod.
