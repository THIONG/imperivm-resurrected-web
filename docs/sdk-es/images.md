# Imágenes propias

Un mod puede traer sus propios botones de comando y retratos de unidad en lugar de reutilizar los del juego. Dibuja en cualquier programa, guarda un PNG y conviértelo con una herramienta. Necesitas [Node.js](https://nodejs.org).

Ejemplo para copiar: [`examples/ability-example`](examples/ability-example) (el botón "Respiro").

## Convertir un PNG

```
node tools/convert-image.js <entrada.png> <salida.bmp> --type button
node tools/convert-image.js <entrada.png> <salida.bmp> --type icon
```

- `boton`: el botón de un comando (`button="..."` de un `<cmd>`). En el juego mide 153 x 51: tres fotogramas de 51 x 51 (normal, con el ratón encima y deshabilitado). Tú aportas un PNG de 51 x 51 y la herramienta crea los otros dos fotogramas (uno más claro y uno gris). Si ya tienes los tres, se usa tal cual un PNG de 153 x 51. Cualquier otro tamaño se escala sin deformarlo.
- `icon`: el retrato de una unidad (`icon="..."`) o su retrato en la cola de entrenamiento (`queueicon="..."`). Mide 65 x 76. Sirve un PNG de cualquier tamaño: se escala sin deformarlo, y las zonas transparentes pasan a ser el verde puro que el juego trata como transparente.

Con `--background #RRGGBB` eliges el color que rellena las zonas transparentes de un botón (por defecto, un marrón oscuro como el de los botones del juego).

El PNG debe ser de 8 bits por canal y no entrelazado, que es lo habitual al guardar desde cualquier programa. Si no lo es, la herramienta lo avisa.

## Dónde va el archivo

Con la misma ruta que usa el juego, dentro de la carpeta del mod. La regla para los botones es `gameres/cmdbar/<whatever button= says>`:

| Qué | En el XML | Archivo en tu mod |
|---|---|---|
| El botón de un comando | `button="Actions/Respiro.bmp"` | `gameres/cmdbar/Actions/Respiro.bmp` |
| El botón de una mejora | `button="research/Mejora.bmp"` | `gameres/cmdbar/research/Mejora.bmp` |
| El retrato de una unidad | `<properties icon="gameres/icons/MyUnit.bmp"/>` | `gameres/icons/MyUnit.bmp` |
| Retrato de la cola | `queueicon="gameres/icons/MyUnit.bmp"` | `gameres/icons/MyUnit.bmp` |

Los comandos del juego también usan las carpetas `upgrades`, `skills`, `states` y `specials` dentro de `cmdbar`. Funcionan igual.

Las mayúsculas no importan en las rutas. Si el juego no encuentra una imagen, el botón se muestra como un cuadrado azul liso.

## Si no se ve

1. Pon `LogFiles=1` en `[Debug]` de `imperivm-mod.ini`. El registro anota cada archivo que abre el juego y marca los que no existen (`VFS: opens … -> does not exist`), de modo que puedes ver el nombre exacto que pide.

## Lo que no se puede hacer

- Las imágenes de ayuda (`help/...`), las imágenes de la barra de información de cada civilización y los fondos de menú no tienen conversor.
- Los modelos y animaciones de unidades y edificios (`.rle` y `.ent.xml`) son otro asunto: consulta [Gráficos personalizados](graphics.md).
