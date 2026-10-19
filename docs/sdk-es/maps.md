# Escenarios, aventuras y conquistas

Los tres tipos de mapa que tiene el juego. Se hacen en el editor de mapas del juego y se guardan como archivo `.bfhp`; un mod solo tiene que dejar ese archivo, y los pocos que lo acompañan, en la carpeta correcta.

| Tipo | Carpeta en el mod | Archivos | Plantilla |
|---|---|---|---|
| Escenario (mapa de escaramuza y multijugador) | `scenarios\` | `MyMap.bfhp` | [escenario](templates/scenario) |
| Aventura (misiones y campañas para un jugador) | `adventures\` | `MyAdventure.bfhp` y `MyAdventure.bmp` | [aventura](templates/adventure) |
| Conquista | `conquests\` y `conquestmaps\` | `MyConquest.bfhp` y una carpeta de imágenes | [conquista](templates/conquest) |

El tipo no lo decide la carpeta: lo declara el propio mapa, según lo que eligió su autor en el editor. La carpeta tiene que coincidir. Una aventura o una conquista en `scenarios\` no aparece en la lista de escenarios, y el [validador](validating.md) lo avisa.

## Escenarios

Pon el `.bfhp` en `scenarios\`. Cuando alguien lo elige en la sala, el juego dibuja la vista previa a partir del terreno del propio mapa, con sus jugadores y sus civilizaciones: no hay que aportar ninguna imagen. Los colores salen de las teselas del minimapa del juego, así que un terreno nuevo se ve bien si trae su tesela en `minimapzoom8\terrain`.

En `mod.json` usa `"category": "Scenarios"` e indica cuántos jugadores tiene el mapa con una etiqueta `Players` (`"Players: 2"`, `"Players: 2-4"`). Consulta [Publicar en GameBanana](publishing.md#tags).

## Aventuras

Cada aventura son dos archivos con el mismo nombre, en `adventures\`: el `.bfhp` y un `.bmp` (`The Punic Wars.BFHP` y `The Punic Wars.bmp`). Las campañas del propio juego guardan cada serie en una subcarpeta: `Adventures\GreatBattles\` y `Adventures\GreatChallenges\`, con las misiones numeradas.

En `mod.json` usa `"category": "Adventures"` y una etiqueta `Language` con el idioma de sus textos.

## Conquistas

Una conquista es un `.bfhp` en `conquests\` y una carpeta en `conquestmaps\` con las imágenes y la lista de territorios. La conquista del propio juego, `Conquests\mediterranean.BFHP`, guarda dentro el nombre de su carpeta: `ConquestMaps/1 - GBR Europe`. La tuya debe hacer lo mismo, así que **la carpeta de `conquestmaps\` tiene que llamarse exactamente como dice el mapa**.

La carpeta de la conquista del juego contiene estos archivos:

| Archivo | Qué es |
|---|---|
| `territories.xml` | Los territorios (`id`, `index`, `state`, `neighbours`) y los colores que usa el mapa para los territorios propios, enemigos y deshabilitados. `data=` repite el nombre de la carpeta. |
| `territories.bmp` | 1024x768, 8 bits (256 colores). |
| `global.bmp` | 1024x768, 16 bits. |
| `Shield<Name>.bmp` | 74x79, 16 bits, uno por territorio (`ShieldSpain.bmp` para `Spain`), y `ShieldArrow.bmp`. |

Los territorios de la conquista del juego son `Spain`, `Britain`, `Gaul`, `Italy`, `Carthage`, `Egypt` y `Germany`. Para hacer la tuya, copia la carpeta del juego (`<game folder>\ConquestMaps\1 - GBR europe`) y modifícala: es la forma más rápida de acertar con `index` y `state`. La [plantilla de conquista](templates/conquest) tiene la estructura y un `territories.xml` reducido.

## Vídeos

Una aventura o una conquista puede reproducir vídeos. Pon cada `.avi` en `movies\` dentro del mod y reprodúcelo desde el script del mapa, en el editor:

```
PlayMovie(Translate("movies\\MyVideo.avi"));
```

Así llaman a los suyos las aventuras del propio juego (`movies\\1_Intro_Great_B_Zama.avi`). El juego busca el archivo primero en los mods activos, según el [orden de carga](reference.md#1-mod-structure), y después en su propia carpeta `Movies\`, de modo que un mod también puede reemplazar uno de los vídeos del juego.

El juego reproduce los vídeos a través de Windows (DirectShow), así que el ordenador tiene que poder decodificar el formato. Los vídeos del propio juego son archivos AVI con vídeo Xvid (1920x1080, 25 fotogramas por segundo) y audio PCM: usa el mismo formato.

Los vídeos son iguales en todos los idiomas y no cuentan como jugabilidad.

## En multijugador

Los mapas, las aventuras y las conquistas son archivos de jugabilidad: todos los de la sala necesitan el mismo. Con `"redistributable": true` en `mod.json`, el anfitrión puede enviar el mod a los jugadores que no lo tengan.

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

Después sigue [Publicar en GameBanana](publishing.md). Un `.zip` que solo contenga el `.bfhp`, sin carpetas, lo coloca el propio juego al instalarlo, según el tipo que declara el mapa.
