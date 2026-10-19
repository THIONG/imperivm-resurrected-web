# Plantilla de unidades

Una unidad o un héroe nuevo: su clase, el comando que lo recluta, sus imágenes y sus textos.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. Crea la unidad a partir de una existente. Desde la carpeta del SDK:

   ```
   node tools\create-unit.js <DATA folder> <your mod folder> MyUnit --base RHastatus --health 260 --damage 20 --armor 14 --building RBarracks --gold-cost 180 --time 9000 --key v --name "My unit"
   ```

   Escribe la clase, el comando y los textos en las carpetas de abajo. [Unidades nuevas](../../units.md) explica cada opción y de dónde sale la carpeta DATA.
4. Haz el retrato y el botón a partir de archivos PNG con `tools\convert-image.js` ([Imágenes personalizadas](../../images.md)).
5. Borra las notas. Activa el mod en tu perfil y recluta la unidad.

## Estructura de carpetas

```
my-unit\
  mod.json
  README.md
  data\
    classes\
      MyUnit.sc.xml
    commands\
      MyUnit.xml
  gameres\
    icons\
      MyUnit.bmp
    cmdbar\Actions\
      train MyUnit.bmp
  loc\
    spanish.loc.xml
```

## Para ir más lejos

- Sprites propios en lugar de los de otra unidad: [Gráficos personalizados](../../graphics.md) y la [plantilla de gráficos](../graphics) (`units\MyUnit\`).
- Una habilidad, una especialidad o un objeto nuevo para ella: [habilidades](../../abilities.md), [especialidades](../../specials.md), [objetos](../../items.md).
- Los atributos que hacen algo y los que cuelgan el juego: [Estadísticas de unidades](../../stats.md).

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
