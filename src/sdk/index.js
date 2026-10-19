window.SDK_INDEX = {
 "version": "1.0",
 "requires": "0.9.0",
 "zip": "imperivm-resurrected-sdk-1.0.zip",
 "readme": "README.html",
 "extra": {
  "changes": "CHANGELOG.html",
  "license": "LICENSE.html"
 },
 "anchors": {
  "start": "start-here",
  "mod": "what-a-mod-looks-like",
  "templates": "templates"
 },
 "languages": {
  "en": {
   "guides": {
    "languages": {
     "title": "Languages and texts",
     "file": "languages.html",
     "desc": "change game texts or add a language without replacing the whole file."
    },
    "keys": {
     "title": "Mod keys",
     "file": "keys.html",
     "desc": "how your mod&#39;s commands show up in Controls and how to name them."
    },
    "patches": {
     "title": "Patches",
     "file": "patches.html",
     "desc": "change part of a game XML, INI or script without replacing it; two mods can touch the same file."
    },
    "scripts": {
     "title": "Scripts",
     "file": "scripts.html",
     "desc": "<code>.vs</code> scripts, events and the <code>Mod_...</code> functions."
    },
    "civilizations": {
     "title": "Civilizations",
     "file": "civilizations.html",
     "desc": "declare a new civilization or clone one from the game, with its AI, and play it in the lobby."
    },
    "city-templates": {
     "title": "City and village templates",
     "file": "city-templates.html",
     "desc": "a mod civilization&#39;s own starting city and village (<code>create-template.js</code>)."
    },
    "units": {
     "title": "New units",
     "file": "units.html",
     "desc": "class, recruit command, images and texts, reusing another unit&#39;s model."
    },
    "stats": {
     "title": "Unit stats",
     "file": "stats.html",
     "desc": "which attribute does what, which ones do nothing and which ones crash the game."
    },
    "specials": {
     "title": "Unit specials",
     "file": "specials.html",
     "desc": "new unit specials and their effect through scripts."
    },
    "abilities": {
     "title": "Troop abilities",
     "file": "abilities.html",
     "desc": "new abilities for units or heroes (a command with button and key, plus a script method)."
    },
    "items": {
     "title": "New items",
     "file": "items.html",
     "desc": "hero amulets, herbs and gems."
    },
    "formations": {
     "title": "New formations",
     "file": "formations.html",
     "desc": "hero formations with their bonuses and button."
    },
    "outposts": {
     "title": "Outposts and buildings",
     "file": "outposts.html",
     "desc": "new neutral outposts on random maps (<code>create-outpost.js</code>) and tower, wall and gate classes."
    },
    "victory-modes": {
     "title": "Victory modes",
     "file": "victory-modes.html",
     "desc": "a script in <code>data\\GameScripts</code> adds a mode to the lobby&#39;s &quot;Mode&quot; dropdown."
    },
    "bonuses": {
     "title": "Starting bonuses",
     "file": "bonuses.html",
     "desc": "scripts in <code>data\\BonusScripts</code> add choices to the &quot;Bonus&quot; column of the lobby."
    },
    "options": {
     "title": "Custom game options",
     "file": "options.html",
     "desc": "new switches in the lobby rules, which scripts read with <code>Mod_GetOption</code>."
    },
    "maps": {
     "title": "Scenarios, adventures and conquests",
     "file": "maps.html",
     "desc": "the three kinds of map, the files each needs and cutscenes."
    },
    "audio": {
     "title": "Music, sounds and voices",
     "file": "audio.html",
     "desc": "replace or add audio."
    },
    "random-maps": {
     "title": "Random map types",
     "file": "random-maps.html",
     "desc": "a four-color drawing becomes a new map type (<code>create-random-map.js</code>)."
    },
    "images": {
     "title": "Custom images",
     "file": "images.html",
     "desc": "command buttons and unit icons from a PNG."
    },
    "graphics": {
     "title": "Custom graphics",
     "file": "graphics.html",
     "desc": "custom sprites for units and buildings (<code>convert-sprite.js</code>, <code>create-entity.js</code>, <code>read-rle.js</code>)."
    },
    "validating": {
     "title": "Validating a mod",
     "file": "validating.html",
     "desc": "check a mod without opening the game, with the file and line of each problem."
    },
    "publishing": {
     "title": "Publishing on GameBanana",
     "file": "publishing.html",
     "desc": "categories, tags, uploading, and mods made before the SDK."
    },
    "reference": {
     "title": "Reference",
     "file": "reference.html",
     "desc": "the full list of what a mod can declare (files, fields, patches, events, functions and limits)."
    }
   },
   "templates": [
    {
     "id": "scenario",
     "title": "Scenario template",
     "file": "templates/scenario.html",
     "desc": "A map for skirmish and multiplayer"
    },
    {
     "id": "adventure",
     "title": "Adventure template",
     "file": "templates/adventure.html",
     "desc": "An adventure or campaign, with or without videos"
    },
    {
     "id": "conquest",
     "title": "Conquest template",
     "file": "templates/conquest.html",
     "desc": "A conquest, with or without videos"
    },
    {
     "id": "units",
     "title": "Units template",
     "file": "templates/units.html",
     "desc": "A unit or hero"
    },
    {
     "id": "civilization",
     "title": "Civilization template",
     "file": "templates/civilization.html",
     "desc": "A civilization"
    },
    {
     "id": "gameplay",
     "title": "Gameplay template",
     "file": "templates/gameplay.html",
     "desc": "Rules, stats, AI, victory modes, options"
    },
    {
     "id": "audio",
     "title": "Audio pack template",
     "file": "templates/audio.html",
     "desc": "Music, sounds, voices"
    },
    {
     "id": "translation",
     "title": "Translation template",
     "file": "templates/translation.html",
     "desc": "The game in another language"
    },
    {
     "id": "graphics",
     "title": "Graphics template",
     "file": "templates/graphics.html",
     "desc": "Textures, sprites, icons, menus"
    },
    {
     "id": "full",
     "title": "Full template",
     "file": "templates/full.html",
     "desc": "Several of the above"
    }
   ],
   "tools": [
    {
     "want": "A new unit",
     "use": "<code>create-unit.js</code>",
     "guide": "units.html"
    },
    {
     "want": "A new item",
     "use": "<code>create-item.js</code>",
     "guide": "items.html"
    },
    {
     "want": "A new ability",
     "use": "<code>create-ability.js</code>",
     "guide": "abilities.html"
    },
    {
     "want": "A new formation",
     "use": "<code>create-formation.js</code>",
     "guide": "formations.html"
    },
    {
     "want": "A game option",
     "use": "<code>create-option.js</code>",
     "guide": "options.html"
    },
    {
     "want": "A new civilization",
     "use": "<code>clone-civilization.js</code>",
     "guide": "civilizations.html"
    },
    {
     "want": "A civilization&#39;s own city and village",
     "use": "<code>create-template.js</code>",
     "guide": "city-templates.html"
    },
    {
     "want": "A neutral outpost",
     "use": "<code>create-outpost.js</code>",
     "guide": "outposts.html"
    },
    {
     "want": "A random map type",
     "use": "<code>create-random-map.js</code>",
     "guide": "random-maps.html"
    },
    {
     "want": "Buttons and icons from a PNG",
     "use": "<code>convert-image.js</code>",
     "guide": "images.html"
    },
    {
     "want": "Sprites from PNG, and a unit or building&#39;s entity file",
     "use": "<code>convert-sprite.js</code>, <code>create-entity.js</code>, <code>read-rle.js</code>",
     "guide": "graphics.html"
    },
    {
     "want": "Redraw the sprites of <code>unit-graphics-example</code>",
     "use": "<code>draw-soldier.js</code>",
     "guide": null
    },
    {
     "want": "Check a mod without opening the game",
     "use": "<code>validate-mod.js</code>",
     "guide": "validating.html"
    },
    {
     "want": "Adapt a mod made before the SDK",
     "use": "<code>shrink-mod.js</code>",
     "guide": "publishing.html"
    },
    {
     "want": "Extract the game data",
     "use": "<code>extract-data.js</code>",
     "guide": null
    }
   ]
  },
  "es": {
   "guides": {
    "languages": {
     "title": "Idiomas y textos",
     "file": "languages.html",
     "desc": "cambia textos del juego o añade un idioma sin reemplazar el archivo entero."
    },
    "keys": {
     "title": "Teclas de mod",
     "file": "keys.html",
     "desc": "cómo aparecen los comandos de tu mod en Controles y cómo nombrarlos."
    },
    "patches": {
     "title": "Parches",
     "file": "patches.html",
     "desc": "cambia una parte de un XML, INI o script del juego sin reemplazarlo; dos mods pueden tocar el mismo archivo."
    },
    "scripts": {
     "title": "Scripts",
     "file": "scripts.html",
     "desc": "scripts <code>.vs</code>, eventos y las funciones <code>Mod_...</code>."
    },
    "civilizations": {
     "title": "Civilizaciones",
     "file": "civilizations.html",
     "desc": "declara una civilización nueva o clona una del juego, con su IA, y juégala en la sala."
    },
    "city-templates": {
     "title": "Plantillas de ciudad y aldea",
     "file": "city-templates.html",
     "desc": "la ciudad y la aldea iniciales propias de una civilización de mod (<code>create-template.js</code>)."
    },
    "units": {
     "title": "Unidades nuevas",
     "file": "units.html",
     "desc": "clase, comando de reclutamiento, imágenes y textos, y cómo reutilizar el modelo de otra unidad."
    },
    "stats": {
     "title": "Estadísticas de unidades",
     "file": "stats.html",
     "desc": "qué hace cada atributo, cuáles no hacen nada y cuáles cuelgan el juego."
    },
    "specials": {
     "title": "Especialidades de unidad",
     "file": "specials.html",
     "desc": "especialidades de unidad nuevos y su efecto mediante scripts."
    },
    "abilities": {
     "title": "Habilidades de tropa",
     "file": "abilities.html",
     "desc": "habilidades nuevas para unidades o héroes (un comando con botón y tecla, más un método de script)."
    },
    "items": {
     "title": "Objetos nuevos",
     "file": "items.html",
     "desc": "amuletos, hierbas y gemas de héroe."
    },
    "formations": {
     "title": "Formaciones nuevas",
     "file": "formations.html",
     "desc": "formaciones de héroe con sus bonificaciones y su botón."
    },
    "outposts": {
     "title": "Fortines y edificios",
     "file": "outposts.html",
     "desc": "fortines neutrales nuevos en mapas aleatorios (<code>create-outpost.js</code>) y clases de torre, muralla y puerta."
    },
    "victory-modes": {
     "title": "Modos de victoria",
     "file": "victory-modes.html",
     "desc": "un script en <code>data\\GameScripts</code> añade un modo al desplegable &quot;Mode&quot; de la sala."
    },
    "bonuses": {
     "title": "Bonificaciones iniciales",
     "file": "bonuses.html",
     "desc": "los scripts de <code>data\\BonusScripts</code> añaden opciones a la columna &quot;Bonus&quot; de la sala."
    },
    "options": {
     "title": "Opciones de partida personalizadas",
     "file": "options.html",
     "desc": "interruptores nuevos en las reglas de la sala, que los scripts leen con <code>Mod_GetOption</code>."
    },
    "maps": {
     "title": "Escenarios, aventuras y conquistas",
     "file": "maps.html",
     "desc": "los tres tipos de mapa, los archivos que necesita cada uno y los vídeos."
    },
    "audio": {
     "title": "Música, sonidos y voces",
     "file": "audio.html",
     "desc": "reemplaza o añade audio."
    },
    "random-maps": {
     "title": "Tipos de mapa aleatorio",
     "file": "random-maps.html",
     "desc": "un dibujo de cuatro colores se convierte en un tipo de mapa nuevo (<code>create-random-map.js</code>)."
    },
    "images": {
     "title": "Imágenes personalizadas",
     "file": "images.html",
     "desc": "botones de comando e iconos de unidad a partir de un PNG."
    },
    "graphics": {
     "title": "Gráficos personalizados",
     "file": "graphics.html",
     "desc": "sprites propios para unidades y edificios (<code>convert-sprite.js</code>, <code>create-entity.js</code>, <code>read-rle.js</code>)."
    },
    "validating": {
     "title": "Validar un mod",
     "file": "validating.html",
     "desc": "comprueba un mod sin abrir el juego, con el archivo y la línea de cada problema."
    },
    "publishing": {
     "title": "Publicar en GameBanana",
     "file": "publishing.html",
     "desc": "categorías, etiquetas, subida y mods hechos antes del SDK."
    },
    "reference": {
     "title": "Referencia",
     "file": "reference.html",
     "desc": "la lista completa de lo que puede declarar un mod (archivos, campos, parches, eventos, funciones y límites)."
    }
   },
   "templates": [
    {
     "id": "scenario",
     "title": "Plantilla de escenario",
     "file": "templates/scenario.html",
     "desc": "Un mapa para escaramuza y multijugador"
    },
    {
     "id": "adventure",
     "title": "Plantilla de aventura",
     "file": "templates/adventure.html",
     "desc": "Una aventura o campaña, con o sin vídeos"
    },
    {
     "id": "conquest",
     "title": "Plantilla de conquista",
     "file": "templates/conquest.html",
     "desc": "Una conquista, con o sin vídeos"
    },
    {
     "id": "units",
     "title": "Plantilla de unidades",
     "file": "templates/units.html",
     "desc": "Una unidad o un héroe"
    },
    {
     "id": "civilization",
     "title": "Plantilla de civilización",
     "file": "templates/civilization.html",
     "desc": "Una civilización"
    },
    {
     "id": "gameplay",
     "title": "Plantilla de jugabilidad",
     "file": "templates/gameplay.html",
     "desc": "Reglas, estadísticas, IA, modos de victoria, opciones"
    },
    {
     "id": "audio",
     "title": "Plantilla de audio",
     "file": "templates/audio.html",
     "desc": "Música, sonidos, voces"
    },
    {
     "id": "translation",
     "title": "Plantilla de traducción",
     "file": "templates/translation.html",
     "desc": "El juego en otro idioma"
    },
    {
     "id": "graphics",
     "title": "Plantilla de gráficos",
     "file": "templates/graphics.html",
     "desc": "Texturas, sprites, iconos, menús"
    },
    {
     "id": "full",
     "title": "Plantilla completa",
     "file": "templates/full.html",
     "desc": "Varias de las anteriores"
    }
   ],
   "tools": [
    {
     "want": "Una unidad nueva",
     "use": "<code>create-unit.js</code>",
     "guide": "units.html"
    },
    {
     "want": "Un objeto nuevo",
     "use": "<code>create-item.js</code>",
     "guide": "items.html"
    },
    {
     "want": "Una habilidad nueva",
     "use": "<code>create-ability.js</code>",
     "guide": "abilities.html"
    },
    {
     "want": "Una formación nueva",
     "use": "<code>create-formation.js</code>",
     "guide": "formations.html"
    },
    {
     "want": "Una opción de partida",
     "use": "<code>create-option.js</code>",
     "guide": "options.html"
    },
    {
     "want": "Una civilización nueva",
     "use": "<code>clone-civilization.js</code>",
     "guide": "civilizations.html"
    },
    {
     "want": "La ciudad y la aldea propias de una civilización",
     "use": "<code>create-template.js</code>",
     "guide": "city-templates.html"
    },
    {
     "want": "Un fortín neutral",
     "use": "<code>create-outpost.js</code>",
     "guide": "outposts.html"
    },
    {
     "want": "Un tipo de mapa aleatorio",
     "use": "<code>create-random-map.js</code>",
     "guide": "random-maps.html"
    },
    {
     "want": "Botones e iconos a partir de un PNG",
     "use": "<code>convert-image.js</code>",
     "guide": "images.html"
    },
    {
     "want": "Sprites a partir de PNG, y el archivo de entidad de una unidad o un edificio",
     "use": "<code>convert-sprite.js</code>, <code>create-entity.js</code>, <code>read-rle.js</code>",
     "guide": "graphics.html"
    },
    {
     "want": "Redibujar los sprites de <code>unit-graphics-example</code>",
     "use": "<code>draw-soldier.js</code>",
     "guide": null
    },
    {
     "want": "Comprobar un mod sin abrir el juego",
     "use": "<code>validate-mod.js</code>",
     "guide": "validating.html"
    },
    {
     "want": "Adaptar un mod hecho antes del SDK",
     "use": "<code>shrink-mod.js</code>",
     "guide": "publishing.html"
    },
    {
     "want": "Extraer los datos del juego",
     "use": "<code>extract-data.js</code>",
     "guide": null
    }
   ]
  }
 }
};
