# Plantilla de jugabilidad

Reglas, estadísticas, costes, IA, modos de victoria, bonificaciones iniciales y opciones de partida. Los parches cambian una parte de un archivo del juego sin reemplazarlo, así que dos mods pueden tocar el mismo archivo.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. Pon lo que necesites en las carpetas de abajo y borra el resto. La carpeta `patches\` no está en la plantilla (un archivo de notas ahí se marcaría como parche incorrecto): créala con la ruta del archivo del juego que parcheas, por ejemplo `patches\data\classes\RHastatus.sc.xml`.
4. Activa el mod en tu perfil y reinicia el juego.
5. Lee `Logs\imperivm\imperivm-mod.log`, en la carpeta del juego: lista lo que cargó tu mod y sus errores.

## Estructura de carpetas

```
my-gameplay-mod\
  mod.json
  README.md
  patches\
    data\
      classes\                a patch has the path and name of the game file it changes
      commands\
  events\                      OnGameStart.vs ...
  data\
    GameScripts\               victory modes
    BonusScripts\              starting bonuses
    mod\                       your own scripts
  options\                     lobby switches
```

## Qué va dónde

| Carpeta | Guía |
|---|---|
| `patches\` | [Parches](../../patches.md) |
| `events\`, `data\mod\` | [Scripts](../../scripts.md) |
| `data\GameScripts\` | [Modos de victoria](../../victory-modes.md) |
| `data\BonusScripts\` | [Bonificaciones iniciales](../../bonuses.md) |
| `options\` | [Opciones de partida](../../options.md) |

## Notas

- Esto es jugabilidad: todos los jugadores de la sala necesitan el mismo mod.
- Los ejemplos terminados están en [examples](../../examples): `patches-example`, `scripts-example`, `victory-example`, `options-example`.

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
