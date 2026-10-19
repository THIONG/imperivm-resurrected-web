# Plantilla de gráficos

Texturas, aspecto de unidades, edificios, iconos e imágenes de menú. Cada jugador puede usar los suyos: los gráficos nunca tienen que coincidir entre jugadores.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. Pon tus archivos en la carpeta que corresponda a lo que cambias, con la misma ruta y el mismo nombre que el archivo del juego cuando reemplaces uno. Borra las demás carpetas.
4. Activa el mod en tu perfil y reinicia el juego.

## Estructura de carpetas

```
my-graphics\
  mod.json
  README.md
  units\
    MyUnit\                   sprites (.rle) and MyUnit.ent.xml
  buildings\
    MyBuilding\
  gameres\
    icons\                    unit portraits (.bmp)
    cmdbar\Actions\          command buttons (.bmp)
```

## Por dónde empezar

- Sprites de una unidad o un edificio a partir de archivos PNG: [Gráficos personalizados](../../graphics.md) (`convert-sprite.js`, `create-entity.js`).
- Botones e iconos a partir de un PNG: [Imágenes personalizadas](../../images.md) (`convert-image.js`).
- Una unidad nueva que los use: [Unidades nuevas](../../units.md) y la [plantilla de unidades](../units).

## Notas

- Los archivos `.rle` y las imágenes no cuentan como jugabilidad. Los archivos `.xml` y `.pass` de `units\`, `buildings\` y `mapobjects\` sí: si los cambias, todos los de la sala necesitan el mod.
- Un `.rle` con el mismo nombre que uno del juego se ignora; el validador lo avisa con `--game`.

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
