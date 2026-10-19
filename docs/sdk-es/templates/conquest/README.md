# Plantilla de conquista

Una conquista: un mapa de territorios (el del propio juego es el Mediterráneo) con su propia carpeta de imágenes, que aparece en el menú del juego como conquista.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. Haz tu conquista en el editor y pon su `.bfhp` en `conquests\`.
4. El mapa de la conquista es una carpeta en `conquestmaps\`. Su nombre debe ser **exactamente** el que guarda dentro el `.bfhp` de tu conquista (la conquista del propio juego guarda `ConquestMaps/1 - GBR Europe`). Cambia `MY-CONQUEST-MAP` por ese nombre y pon el mismo en `data=` dentro de `territories.xml`.
5. Pon las imágenes en esa carpeta (lista más abajo) y edita `territories.xml`.
6. Los vídeos son opcionales, van en `movies\` y se reproducen desde el script del mapa con `PlayMovie(Translate("movies\\MyVideo.avi"))`.
7. Borra las notas y las carpetas que no uses. Activa el mod en tu perfil y busca la conquista en el menú del juego.

## Estructura de carpetas

```
my-conquest\
  mod.json
  README.md
  conquests\
    MyConquest.bfhp
  conquestmaps\
    MY-CONQUEST-MAP\
      territories.xml
      territories.bmp
      global.bmp
      ShieldArrow.bmp
      ShieldBritain.bmp
      ShieldCarthage.bmp
      ShieldEgypt.bmp
      ShieldGaul.bmp
      ShieldGermany.bmp
      ShieldItaly.bmp
      ShieldSpain.bmp
  movies\
    MyVideo.avi
```

## Los archivos del mapa de la conquista

Son los archivos de la conquista del propio juego (`ConquestMaps\1 - GBR europe\`), con los tamaños que usa:

| Archivo | Qué es |
|---|---|
| `territories.xml` | Los territorios. Cada uno tiene un `id`, un `index`, un `state` y sus `neighbours`. Los ids de la conquista del juego son `Spain`, `Britain`, `Gaul`, `Italy`, `Carthage`, `Egypt` y `Germany`. El archivo de esta plantilla trae tres de ellos como ejemplo; si dudas sobre `index` y `state`, copia el archivo del juego. |
| `territories.bmp` | 1024x768, 8 bits (256 colores). |
| `global.bmp` | 1024x768, 16 bits: la imagen del mapa. |
| `Shield<Name>.bmp` | 74x79, 16 bits: un escudo por territorio (`ShieldSpain.bmp` para `Spain`), más `ShieldArrow.bmp`. |

Los archivos del propio juego están en `<game folder>\ConquestMaps\1 - GBR europe`: ábrelos en un editor de imágenes para ver qué contiene cada uno.

## Notas

- El `.bfhp` de la conquista y todo lo que hay en `conquestmaps\` cuentan como contenido del juego: todos los jugadores de la sala necesitan el mismo mod.
- Los vídeos se buscan primero en los mods activos, por orden de carga.

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
