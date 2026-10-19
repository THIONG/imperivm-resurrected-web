# Cambios

La versión del SDK y qué mods puedes hacer con cada una. La versión de la API de scripts (`Mod_ApiVersion()`) es aparte: ahora es la 7.

## 1.0

Necesita Imperivm Resurrected 1.0 o posterior.

La primera versión numerada del SDK. Está solo en inglés.

- **Plantillas** en [`templates/`](templates): un mod vacío para cada tipo de contenido (escenario, aventura, conquista, unidades, civilización, jugabilidad, audio, traducción, gráficos) y uno completo con todas las carpetas que lee el juego. Cada una tiene su `mod.json`, un README con los pasos y la estructura de carpetas, y una nota `PUT-YOUR-FILES-HERE.txt` en cada carpeta vacía. Pasan el validador.
- **Guías** para todo lo que puede hacer un mod: idiomas y textos, claves, parches, scripts, civilizaciones, plantillas de ciudad y aldea, unidades, estadísticas, especiales, habilidades, objetos, formaciones, fortines, modos de victoria, bonificaciones iniciales, opciones de partida, mapas aleatorios, imágenes, gráficos, [escenarios, aventuras y conquistas](maps.md) (con vídeos) y [música, sonidos y voces](audio.md), además del validador, la publicación en GameBanana y una referencia.
- **Herramientas** en `tools\`, escritas en inglés: `create-unit`, `create-item`, `create-ability`, `create-formation`, `create-option`, `create-outpost`, `create-random-map`, `create-template`, `clone-civilization`, `convert-image`, `convert-sprite`, `create-entity`, `read-rle`, `extract-data`, `validate-mod` y `shrink-mod`. Sus opciones están en inglés (`--name`, `--player`, `--output`). En `create-unit`, `create-ability` y `create-option`, `--name` es el texto en inglés y el español va en `--name-es`.
- **Ejemplos** en `examples\`, todos válidos, con ids en inglés (`example-unit`, `example-options`…). `draw-soldier.js`, que vuelve a dibujar los sprites de `unit-graphics-example`, está en `tools\`.
- El validador sigue leyendo las claves en español de un `mod.json` antiguo.
