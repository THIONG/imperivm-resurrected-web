# Fortines y edificios defensivos

"Fortín" abarca dos cosas distintas:

- Los fortines neutrales del mapa: los puestos repartidos por el mapa que se capturan ("Trade outpost", "Recruitment outpost"…). Un mod puede
  añadir tipos nuevos con una herramienta, y aparecen solos en los mapas aleatorios.
- Los edificios defensivos de las ciudades: torres, murallas y puertas.

## Un fortín neutral nuevo

`tools/create-outpost.js` copia un fortín del juego con un id y un nombre nuevos y lo añade a los mapas aleatorios. Necesita la carpeta `DATA`, que
obtienes con [`extract-data.js`](tools/extract-data.js) (`node extract-data.js "<game folder>" <output folder>`):

```
node create-outpost.js <output folder>\DATA <mod folder> ArcherFort IOutpost "Archer fort"
```

Escribe la clase (`data\classes\ArcherFort.sc.xml`), el parche `data\randommap\placeobjects.xml` que lo añade a los tres tamaños de mapa (con las
cantidades de la base) y el nombre en español. Con `GOutpost`, `TOutpost` o `ROutpost` como base escribe además `patches\data\commands\*.xml`, de modo que
el fortín nuevo reciba los comandos del puesto (vender comida, intereses).

Las bases posibles:

| Base | Tipo |
|---|---|
| `GOutpost`, `TOutpost` | Fortín comercial |
| `ROutpost`, `EOutpost` | Fortín de oro (intereses) |
| `IOutpost`, `BOutpost` | Fortín de entrenamiento |
| `COutpost` | Fortín de reclutamiento |

Después edita la clase como quieras: `maxhealth`, la guarnición (`defender_cls_1`, `defenders_max_1`, `start_level_1`…), su comportamiento
(`<behavior script=…>`), lo que cuesta capturarlo. Ejemplo: [`examples/outpost-example`](examples/outpost-example).

Para cambiar cuántos aparecen, edita `min` y `max` en las líneas del parche (cuántos coloca el generador por mapa). `mindist` es la distancia mínima
entre fortines, en píxeles. Los demás números son los del juego.

El modelo (`entity`) y el icono son los de la base. Para un modelo con sprites propios mira [Gráficos personalizados](graphics.md): tiene una sección sobre
edificios.

## Torres, murallas, puertas y puestos

Son clases de edificio como cualquier otra. Lo que conviene saber antes de añadir las tuyas:

- Un asentamiento (ciudad, aldea, puesto) es un grupo de edificios con un dueño, población, oro y comida. Su tipo sale de la clase del edificio
  central: `BaseTownhall` es una ciudad, `BaseVillage` una aldea y `Outpost` un puesto.
- El juego base no permite construir edificios. No hay comando de construcción (solo para barcos y máquinas de asedio). Las torres, murallas, puertas y puestos
  vienen del mapa: la plantilla de ciudad, los puestos del mapa aleatorio, los escenarios y el editor.
- Las plantillas de ciudad nombran clases concretas (`GTownhall`, `GTower01`, `GWallsN`, `GGateNW`…). Una civilización nueva usa las suyas si clonas las del juego
  con la herramienta de [Civilizaciones](civilizations.md).

| Clase base | Qué es |
|---|---|
| `Tower` (`CVXBuilding`) | Torre. Sus comandos (`Tower Attack`, reparar) cuelgan de `Tower`, y las hijas los heredan |
| `Wall` (`CVXBuilding`) | Muralla. `num_sentry_slots` y `sentry_class_name` fijan cuántos centinelas la patrullan y de qué clase |
| `Gate` (`CVXGate`) | Puerta: abrir, cerrar, permanente, reparar |
| `Outpost` (`CVXTownHall`) | Base de los puestos avanzados. Los concretos (`GOutpost`, `GGuardPost`…) usan `CVXOutpost` y cuelgan de `Outpost`: son independientes hasta que se capturan y cada uno hace algo mediante un script (vender comida, intereses, experiencia…) |
| `GGuardPost` | Puesto de guardia, solo galo: 12 centinelas por script. No está en `placeobjects.xml`, y `create-outpost.js` lo advierte |

Para una clase nueva: un `.sc.xml` en `data\classes\` con `parent=` una de las anteriores, un `cpp_class` que ya exista (`CVXBuilding`, `CVXGate`,
`CVXOutpost`, `CVXTownHall`) y su `entity`. Copia el `entity` de la clase base, porque el juego no lo hereda del padre. El comportamiento
propio va en `<behavior>` y `<method sig="…" vs="…">`, y los comandos en `<cmd>`, igual que en [Habilidades](abilities.md). Un tipo de edificio
con un `cpp_class` nuevo no es posible.

## Dónde colocarlo

| Lugar | Cómo |
|---|---|
| Mapa aleatorio | Añádelo a `placeobjects.xml`, que es lo que hace `create-outpost.js` |
| Ciudad o aldea inicial de una civilización | Las clases clonadas aparecen solas en la ciudad inicial. Para cambiar la disposición, mira [Plantillas](city-templates.md) |
| El editor de mapas | Con `edittree_pos` en la clase. El editor tiene carpetas fijas por civilización: las de una civilización nueva aparecen mezcladas con las de su base |
| Un mapa hecho a mano | Colócalo con el editor y el mapa nombra la clase (necesita el mod) |

## Multijugador y límites

Cambia la jugabilidad: todos los jugadores necesitan el mismo mod.

- El editor no tiene carpetas propias ni juegos de murallas personalizados.
