# Plantilla de traducción

El juego, u otro mod, en otro idioma; o textos modificados en un idioma que el juego ya tiene.

## Pasos

1. Copia esta carpeta en `<game folder>\mods\` y cámbiale el nombre.
2. En `mod.json` cambia `id` (letras minúsculas, números y guiones: identifica tu mod), `name`, `authors` y `description`.
3. En `mod.json`, `language` declara un idioma nuevo: `code` es su nombre en inglés en minúsculas (`french`), `name` es cómo aparece en el menú y `base` es el idioma que se usa para todo lo que no traduzcas. Borra `language` si solo cambias textos de un idioma que ya existe. En `tags`, pon el idioma: `"Language: French"`.
4. Traduce los textos en `loc\french.loc.xml` (cámbiale el nombre por el código de tu idioma). Lo que dejes sin traducir se muestra en el idioma `base`.
5. Opcional: archivos solo para ese idioma, en `local\<language>\`: `help.xml`, `tips.xml`, `credits.txt`, `splash.ini`, imágenes de menú y `voices\`. Consulta [Idiomas y textos](../../languages.md).
6. Activa el mod en tu perfil, elige el idioma en Opciones → Idioma y reinicia.

## Estructura de carpetas

```
my-translation\
  mod.json
  README.md
  loc\
    french.loc.xml
  local\
    french\
      help.xml                 optional
      tips.xml                 optional
```

## Comprobar y publicar

```
node tools\validate-mod.js <your mod folder>
```

El validador informa de los problemas con archivo y línea sin abrir el juego ([Validar un mod](../../validating.md)). Comprime la carpeta del mod en un zip, con su `mod.json` dentro, y publícalo como se describe en [Publicar en GameBanana](../../publishing.md).
