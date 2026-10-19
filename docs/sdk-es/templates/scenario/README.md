# Plantilla de escenario

Un mapa para partidas de escaramuza y multijugador, hecho en el editor de mapas del juego.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. En `tags` escribe cuántos jugadores tiene el mapa: `"Players: 2"`, o un intervalo como `"Players: 2-4"`. Sin esa etiqueta, el mapa no aparece cuando se filtra por jugadores.
4. Guarda tu mapa en el editor como mapa de escaramuza y pon su `.bfhp` en `scenarios\`. Borra `PUT-YOUR-FILES-HERE.txt`.
5. Activa el mod en tu perfil (**Contenido adicional** en el menú principal), crea una sala y elige el mapa en la lista de escenarios. El juego dibuja la vista previa a partir del propio mapa: no hay que aportar ninguna imagen.

## Estructura de carpetas

```
my-scenario\
  mod.json
  README.md
  scenarios\
    MyMap.bfhp
```

## Notas

- Un mapa cambia lo que ocurre en la partida, así que todos los jugadores de la sala necesitan el mismo. Con `"redistributable": true`, el anfitrión puede enviarlo a quienes no lo tengan.
- Un mapa guardado en el editor como aventura o como conquista no aparece en la lista de escenarios, ni siquiera estando en esta carpeta. El validador lo avisa.
- Si el mapa trae su propia música o sus propios textos, añade `music\` o `loc\` como se muestra en la [plantilla completa](../full).

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
