# Idiomas y textos

Empieza con la [plantilla de traducción](templates/translation), un mod vacío con las carpetas que usa esta guía.

Un mod puede cambiar o añadir textos del juego sin sustituir el archivo de textos entero, y puede añadir un idioma nuevo (francés, alemán, polaco…) que aparece en **Opciones → Idioma**. También puede incluir archivos que usa un solo idioma: ayuda, consejos, imágenes del menú, voces.

Ejemplos para copiar: [`examples/custom-texts`](examples/custom-texts) y [`examples/french-language`](examples/french-language).

## Cómo funciona el idioma del juego

El idioma se elige en Opciones → Idioma y se aplica tras reiniciar. Se guarda en `Settings.ini`, `[Language] Default=`.

Los textos del juego están en `currentlang/game.loc.xml`, dentro de `local\<language>.pak`. Cada texto es una línea como esta:

```xml
<translationtableentry text="Single player@/Menu/mainmenu.ini:SinglePlayer:Text" justtext="Single player" result="Estrategia"/>
```

`text` es la clave: el texto original en inglés, a veces seguido de `@` y un contexto (dónde se usa). `result` es lo que ves en ese idioma. Si un texto no tiene traducción, el juego muestra la clave, que es el inglés. Por eso el inglés casi no necesita archivo.

La interfaz propia de Imperivm Resurrected (gestor de contenido, sala, Controles, partidas guardadas, panel de rendimiento) viene en español, inglés e italiano. Con el juego en italiano se ve en italiano; con cualquier otro idioma, en inglés. Los textos de tu mod (nombre, descripción, comandos) se traducen con los archivos `loc\` de más abajo.

Los vídeos y la música son los mismos en todos los idiomas. Lo que cambia son los textos, las voces de las unidades, la ayuda, los consejos y algunas imágenes del menú.

Para ver el archivo de textos, añade esto a `imperivm-mod.ini` y abre el juego:

```ini
[Debug]
Dump=currentlang/game.loc.xml
```

Se copia a `mod-dump\currentlang\game.loc.xml` con los textos de tus mods ya combinados. Para ver el original, usa el perfil Original.

## Cambiar o añadir textos

Pon los textos en `loc\<language>.loc.xml` dentro de tu mod. Si son muchos, repártelos en varios archivos `*.loc.xml` dentro de `loc\<language>\`:

```
mods\my-mod\
  mod.json
  loc\spanish.loc.xml
  loc\italian.loc.xml
  loc\english\unidades.loc.xml
```

`<language>` es el nombre en inglés del idioma, en minúsculas, como en `Settings.ini`: `spanish`, `english`, `italian`, `french`, `german`…

```xml
<translationtable>
  <!-- Changes the text everywhere it appears -->
  <translationtableentry text="Single player" result="Un jugador"/>

  <!-- One place only: the full key, copied from the game's game.loc.xml -->
  <translationtableentry text="Options@/Menu/endgamemenu.ini:Options:Text" result="Ajustes"/>

  <!-- The same, written with context -->
  <translationtableentry text="Options" context="/Menu/endgamemenu.ini:Options:Text" result="Ajustes"/>

  <!-- New text, e.g. the name of a unit in your mod (display_name in its .sc.xml) -->
  <translationtableentry text="Gladiator" result="Gladiador"/>
</translationtable>
```

- Sin contexto (`text="Single player"`), el cambio se aplica en todos los sitios donde el juego usa ese texto. Con contexto (`text="…@…"` o el atributo `context`), solo en ese sitio.
- Salto de línea: `\n` dentro del texto, como en los archivos del juego.
- En un texto, escribe `&` como `&amp;`, `<` como `&lt;` y las comillas dobles como `&quot;` (o pon comillas simples alrededor del valor).
- Guarda en UTF-8. Si está en ANSI, el mod lo convierte, pero UTF-8 es lo seguro.
- Una línea mal formada se salta y se anota en `Logs\imperivm\imperivm-mod.log` con su número de línea. El resto del archivo se carga.
- `<game>\mod\loc\<language>.loc.xml` sirve para probar sin crear un mod, y gana a todos los mods.
- Si dos mods cambian el mismo texto, debería ganar el que va primero en el [orden de carga](reference.md#1-mod-structure), igual que con los archivos.
- Los textos se leen al arrancar: reinicia después de cambiarlos.

Los nombres de las unidades, edificios y comandos de tu mod están escritos en inglés en sus archivos (`display_name`, `rollover`…). Esa es la clave. Para traducirlos, añade la traducción a `loc\spanish.loc.xml`, `loc\italian.loc.xml`, etc.

## Añadir un idioma nuevo

1. Declara el idioma en `mod.json`:

   ```json
   "language": {"code": "french", "name": "Français", "base": "spanish"}
   ```

   - `code`: el nombre en inglés del idioma, en minúsculas. Es lo que se guarda en `Settings.ini`.
   - `name`: lo que se muestra en el selector.
   - `base` (opcional, `english` por defecto): el idioma del que se toma lo que tu mod no aporta. Lee el aviso de más abajo antes de dejarlo en inglés.

2. Traduce los textos en `loc\french.loc.xml` (o en varios archivos dentro de `loc\french\`). Lo que no traduzcas se muestra en inglés.

3. Opcional: archivos de idioma en `Local\french\`, con las rutas que tienen dentro de `currentlang\`. Los que pide el juego son:

   ```
   Local\french\help.xml              help (F1)
   Local\french\tips.xml              loading screen tips
   Local\french\credits.txt           credits
   Local\french\splash.ini            startup screens
   Local\french\menu_16_9.bmp         menu background (also menu_4_3.bmp, menubackground.bmp, logo.bmp)
   Local\french\voices\<unit>\1.wav unit voices (1.wav up to 5.wav depending on the unit)
   ```

   También puedes empaquetarlo todo en `Local\french.pak`.

4. Activa el mod en tu perfil, elige **Français** en Opciones → Idioma y reinicia.

**Qué aporta el idioma base.** Lo que tu idioma no aporte se toma del idioma `base`. El inglés no tiene ayuda (`help.xml`), consejos (`tips.xml`), `splash.ini` ni imágenes de menú. Un idioma nuevo con el inglés como base se queda sin esos archivos. El español y el italiano sí los tienen: con `"base": "spanish"` o `"italian"` los obtienes, o incluyes los tuyos en `Local\<language>\`.

Los mapas traen sus propios textos por idioma. Si un mapa no tiene los tuyos, se usan los del idioma base.

**Caracteres.** Las fuentes del juego deberían cubrir el alfabeto latino (con acentos europeos), el griego y el cirílico. El chino, el japonés y el coreano no se pueden mostrar sin fuentes nuevas.

En multijugador el idioma no importa: jugadores con idiomas distintos pueden jugar juntos.

## Archivos para un solo idioma

Cualquier archivo de `currentlang\` se puede cambiar para un solo idioma con la carpeta `Local\<language>\` de tu mod. `Local\spanish\help.xml` cambia la ayuda solo en español. Si pones el archivo en `currentlang\help.xml` (fuera de `Local\`), se aplica a todos los idiomas.

## Si algo sale mal

Busca en `Logs\imperivm\imperivm-mod.log` las líneas con la etiqueta `language`. Los avisos (`W`) señalan las líneas con errores. Para ver además qué archivos de texto se leyeron y qué archivos de `Local\<language>\` se están usando, pon `LogChannels=language:debug` bajo `[Debug]` en `imperivm-mod.ini`.
