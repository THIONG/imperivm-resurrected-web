# Plantilla de aventura

Una aventura o campaña para un jugador: grandes batallas, desafíos y misiones con historia y objetivos.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. En `tags` escribe el idioma de los textos de tu aventura (`"Language: English"`, `Spanish`, `Italian`, `German`, `French`, `Polish` o `Multilingual`).
4. Guarda tu aventura en el editor y pon el `.bfhp` en `adventures\` junto con su imagen: un `.bmp` con exactamente el mismo nombre.
5. Los vídeos son opcionales. Pon cada `.avi` en `movies\` y reprodúcelo desde el script del mapa con `PlayMovie(Translate("movies\\MyVideo.avi"))`. Es la forma que usan las aventuras del propio juego.
6. Borra las notas y las carpetas que no uses. Activa el mod en tu perfil y busca la aventura en el menú del juego.

## Estructura de carpetas

```
my-adventure\
  mod.json
  README.md
  adventures\
    MyAdventure.bfhp
    MyAdventure.bmp
  movies\
    MyVideo.avi
```

Las campañas del propio juego siguen esta estructura: por ejemplo `Adventures\GreatBattles\1_Great_Battles_Zama.BFHP` y su `.bmp`, y los correspondientes `Movies\1_Intro_Great_B_Zama.avi` y `1_Extro_Great_B_Zama.avi` (introducción y cierre de cada misión).

## Notas

- Los vídeos se buscan primero en los mods activos, por orden de carga, así que un mod también puede reemplazar uno del juego.

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
