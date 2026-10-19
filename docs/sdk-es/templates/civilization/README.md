# Plantilla de civilización

Una civilización nueva que se puede elegir en la sala, con sus unidades, edificios e IA.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. Extrae los datos del juego una sola vez: `node tools\extract-data.js "<game folder>" <output folder>`.
4. Clona una civilización del juego:

   ```
   node tools\clone-civilization.js <output folder>\DATA <your mod folder> MyCiv M Gaul 10
   ```

   Escribe `civs\`, las clases y los comandos. [Civilizaciones](../../civilizations.md) explica las opciones, el `index` (de 10 a 99, uno por civilización) y cómo cambiar unidades después.
5. Opcional: su propia ciudad y aldea para mapas aleatorios. `create-template.js` las escribe en `patches\randommapsettlements\` ([Plantillas de ciudad y aldea](../../city-templates.md)).
6. Borra las notas. Activa el mod en tu perfil y elige la civilización en la sala.

## Estructura de carpetas

```
my-civilization\
  mod.json
  README.md
  civs\
    myciv.json
  data\
    classes\
      MyCiv....sc.xml          one per unit and building
    commands\
      MyCiv.xml
  patches\
    randommapsettlements\     optional: city and village templates
  loc\
    spanish.loc.xml
```

## Notas

- Una civilización cambia lo que ocurre en la partida: todos los jugadores de la sala necesitan el mod.
- El ejemplo terminado es [civilization-example](../../examples/civilization-example).

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
