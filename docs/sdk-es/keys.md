# Teclas del mod

Los jugadores cambian las teclas del juego en **Opciones → Controles**. Los comandos de tu mod aparecen ahí solos, siempre que tengan nombre: no hay que registrar nada.

Ejemplo para copiar: [`examples/custom-orders`](examples/custom-orders).

## Cómo aparecen tus comandos

Un comando es un `<cmd>` en un archivo de `data\commands`. Su tecla por defecto es el atributo `key` (`key="j"`; con `ctrl="1"` necesita Ctrl). El jugador puede cambiarla, y su cambio se guarda en `controls.ini`, no en tu mod.

Un comando necesita `rollover`: es su nombre en la lista. Sin `rollover` no aparece en Controles.

- Si el comando está en un archivo del juego que tu mod parchea (por ejemplo `RBarracks.xml`), aparece en la pestaña de ese edificio o unidad, junto con los demás. Excepción: `Stonehenge.xml` no está en la tabla de archivos conocidos, así que un comando añadido ahí aparece en "Buildings" con el nombre del archivo.
- Si tu mod trae un archivo de comandos nuevo (por ejemplo `data\commands\MyBarracks.xml`), aparece en la pestaña **Content**, en una sección con el nombre de tu mod. Si hay varios archivos de comandos, cada uno tiene su propia sección.

La pestaña **Content** solo aparece si algún mod activo tiene comandos nuevos.

## Nombrar la sección

Por defecto, la sección se llama como tu mod (más el nombre del archivo si traes varios). Para dar nombres por idioma, usa `commands` en `mod.json`, con el nombre del archivo sin extensión como clave:

```json
"commands": {
  "MyBarracks": {
    "name": {"spanish": "Cuartel romano extra", "english": "Extra Roman barracks", "italian": "Caserma romana extra"}
  }
}
```

Muestra el nombre en el idioma del juego; si no hay, el inglés; si tampoco, el primero. También sirve una cadena simple (`"name": "Extra barracks"`). En pantalla: `Mod name · Extra Roman barracks`.

El nombre de cada comando es su `rollover`, y se traduce como cualquier otro texto: consulta [Idiomas y textos](languages.md).

## Qué teclas puedes usar

Una letra (A–Z) o un símbolo (punto y coma, igual, coma, guion, punto, barra, barra invertida, corchetes, comilla simple y el acento grave), opcionalmente con Ctrl. Los dígitos no funcionan: los comandos solo aceptan letras y símbolos, así que `key="1"` nunca llega a ser una tecla en Controles. Mayús y Alt tampoco funcionan, solo Ctrl.

Los jugadores también pueden usar el modo **By position on the bar** (Q es el primer botón, W el segundo…). Tus comandos entran ahí como todos los demás.

## Lo que no se puede hacer

- No existe una tecla que haga otra cosa que un comando del juego (cambiar una opción del mod, lanzar un script suelto). Toda acción con tecla tiene que ser un comando.
- Un archivo de comandos fuera de `data\commands` no se carga.
