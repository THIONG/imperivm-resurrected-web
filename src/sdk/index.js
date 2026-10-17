window.SDK_INDEX = {
 "version": "1.2",
 "requires": "0.32.10",
 "zip": "imperivm-resurrected-sdk-1.2.zip",
 "languages": {
  "es": {
   "guides": {
    "languages": {
     "title": "Idiomas y textos",
     "file": "idiomas.html",
     "desc": "cambiar textos del juego o añadir un idioma sin sustituir el archivo entero."
    },
    "keys": {
     "title": "Teclas de los mods",
     "file": "controles.html",
     "desc": "cómo salen las órdenes de tu mod en Controles y cómo nombrarlas."
    },
    "patches": {
     "title": "Parches",
     "file": "parches.html",
     "desc": "cambiar parte de un XML, INI o script del juego sin sustituirlo; dos mods pueden tocar el mismo archivo."
    },
    "scripts": {
     "title": "Scripts",
     "file": "scripts.html",
     "desc": "scripts <code>.vs</code>, eventos y las funciones <code>Mod_...</code>."
    },
    "civilizations": {
     "title": "Civilizaciones",
     "file": "civilizaciones.html",
     "desc": "declarar una civilización nueva o clonar una del juego, con su IA, y jugar con ella en la sala."
    },
    "city-templates": {
     "title": "Plantillas de ciudad y aldea",
     "file": "plantillas.html",
     "desc": "ciudad y aldea iniciales propias de una civilización de mod (<code>crear-plantilla.js</code>)."
    },
    "units": {
     "title": "Unidades nuevas",
     "file": "unidades.html",
     "desc": "clase, orden de reclutarla, imágenes y textos, reutilizando el modelo de otra unidad."
    },
    "stats": {
     "title": "Estadísticas de unidades",
     "file": "estadisticas.html",
     "desc": "qué atributo toca cada cosa, cuáles no hacen nada y cuáles cuelgan el juego."
    },
    "specials": {
     "title": "Especialidades de unidad",
     "file": "especialidades.html",
     "desc": "especialidades nuevas y su efecto con scripts."
    },
    "abilities": {
     "title": "Habilidades de tropas",
     "file": "habilidades.html",
     "desc": "habilidades nuevas para unidades o héroes (orden con botón y tecla, más un método con script)."
    },
    "items": {
     "title": "Objetos nuevos",
     "file": "objetos.html",
     "desc": "amuletos, hierbas y gemas de los héroes."
    },
    "formations": {
     "title": "Formaciones nuevas",
     "file": "formaciones.html",
     "desc": "formaciones de héroe con sus bonos y su botón."
    },
    "outposts": {
     "title": "Fortines y edificios",
     "file": "fortines.html",
     "desc": "fortines neutrales nuevos en los mapas aleatorios (<code>crear-fortin.js</code>) y clases de torres, muros y puertas."
    },
    "victory-modes": {
     "title": "Modos de victoria",
     "file": "victoria.html",
     "desc": "un script en <code>data\\GameScripts</code> añade un modo al desplegable &quot;Modo&quot; de la sala."
    },
    "options": {
     "title": "Opciones de partida propias",
     "file": "opciones.html",
     "desc": "interruptores nuevos en las reglas de la sala, que los scripts leen con <code>Mod_GetOption</code>."
    },
    "random-maps": {
     "title": "Tipos de mapa aleatorio",
     "file": "mapas-aleatorios.html",
     "desc": "un dibujo de cuatro colores se convierte en un tipo nuevo de mapa (<code>crear-mapa-aleatorio.js</code>)."
    },
    "images": {
     "title": "Imágenes propias",
     "file": "imagenes.html",
     "desc": "botones de órdenes e iconos de unidades a partir de un PNG."
    },
    "graphics": {
     "title": "Gráficos propios",
     "file": "graficos.html",
     "desc": "sprites propios para unidades y edificios (<code>convertir-sprite.js</code>, <code>crear-entidad.js</code>, <code>leer-rle.js</code>)."
    },
    "validating": {
     "title": "Validar un mod",
     "file": "validar.html",
     "desc": "revisar un mod sin abrir el juego, con archivo y línea de cada fallo."
    },
    "publishing": {
     "title": "Publicar en GameBanana",
     "file": "publicar.html",
     "desc": "categorías, etiquetas, subida y mods hechos antes del SDK."
    },
    "reference": {
     "title": "Referencia",
     "file": "referencia.html",
     "desc": "la lista completa de lo que un mod puede declarar (archivos, campos, parches, eventos, funciones y límites)."
    }
   },
   "tools": [
    {
     "want": "Una unidad nueva",
     "use": "<code>crear-unidad.js</code>",
     "guide": "unidades.html"
    },
    {
     "want": "Un objeto nuevo",
     "use": "<code>crear-objeto.js</code>",
     "guide": "objetos.html"
    },
    {
     "want": "Una habilidad nueva",
     "use": "<code>crear-habilidad.js</code>",
     "guide": "habilidades.html"
    },
    {
     "want": "Una formación nueva",
     "use": "<code>crear-formacion.js</code>",
     "guide": "formaciones.html"
    },
    {
     "want": "Una opción de partida",
     "use": "<code>crear-opcion.js</code>",
     "guide": "opciones.html"
    },
    {
     "want": "Una civilización nueva",
     "use": "<code>clonar-civilizacion.js</code>",
     "guide": "civilizaciones.html"
    },
    {
     "want": "Ciudad y aldea propias de una civilización",
     "use": "<code>crear-plantilla.js</code>",
     "guide": "plantillas.html"
    },
    {
     "want": "Un fortín neutral",
     "use": "<code>crear-fortin.js</code>",
     "guide": "fortines.html"
    },
    {
     "want": "Un tipo de mapa aleatorio",
     "use": "<code>crear-mapa-aleatorio.js</code>",
     "guide": "mapas-aleatorios.html"
    },
    {
     "want": "Botones e iconos desde un PNG",
     "use": "<code>convertir-imagen.js</code>",
     "guide": "imagenes.html"
    },
    {
     "want": "Sprites desde PNG, y la ficha de una unidad o edificio",
     "use": "<code>convertir-sprite.js</code>, <code>crear-entidad.js</code>, <code>leer-rle.js</code>",
     "guide": "graficos.html"
    },
    {
     "want": "Revisar un mod sin abrir el juego",
     "use": "<code>validar-mod.js</code>",
     "guide": "validar.html"
    },
    {
     "want": "Adaptar un mod hecho antes del SDK",
     "use": "<code>reducir-mod.js</code>",
     "guide": "publicar.html"
    },
    {
     "want": "Sacar los datos del juego",
     "use": "<code>extraer-datos.js</code>",
     "guide": null
    }
   ],
   "readme": "README.html",
   "extra": {
    "changes": "CAMBIOS.html",
    "license": "LICENCIA.html"
   },
   "anchors": {
    "start": "empieza-aquí",
    "mod": "cómo-es-un-mod"
   }
  },
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
    "options": {
     "title": "Custom game options",
     "file": "options.html",
     "desc": "new switches in the lobby rules, which scripts read with <code>Mod_GetOption</code>."
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
   ],
   "readme": "README.html",
   "extra": {
    "changes": "CHANGELOG.html",
    "license": "LICENSE.html"
   },
   "anchors": {
    "start": "start-here",
    "mod": "what-a-mod-looks-like"
   }
  },
  "it": {
   "guides": {
    "languages": {
     "title": "Lingue e testi",
     "file": "lingue.html",
     "desc": "cambiare i testi del gioco o aggiungere una lingua senza sostituire l&#39;intero file."
    },
    "keys": {
     "title": "Tasti delle mod",
     "file": "tasti.html",
     "desc": "come compaiono i comandi della tua mod in Controlli e come chiamarli."
    },
    "patches": {
     "title": "Patch",
     "file": "patch.html",
     "desc": "cambiare una parte di un XML, INI o script del gioco senza sostituirlo; due mod possono toccare lo stesso file."
    },
    "scripts": {
     "title": "Script",
     "file": "script.html",
     "desc": "script <code>.vs</code>, eventi e funzioni <code>Mod_...</code>."
    },
    "civilizations": {
     "title": "Civiltà",
     "file": "civilta.html",
     "desc": "dichiarare una civiltà nuova o clonarne una del gioco, con la sua IA, e giocarci nella stanza."
    },
    "city-templates": {
     "title": "Modelli di città e villaggio",
     "file": "modelli-citta.html",
     "desc": "città e villaggio iniziali propri per una civiltà di mod (<code>crea-modello.js</code>)."
    },
    "units": {
     "title": "Unità nuove",
     "file": "unita.html",
     "desc": "classe, comando per reclutarla, immagini e testi, riusando il modello di un&#39;altra unità."
    },
    "stats": {
     "title": "Statistiche delle unità",
     "file": "statistiche.html",
     "desc": "cosa tocca ogni attributo, quali non fanno nulla e quali bloccano il gioco."
    },
    "specials": {
     "title": "Specialità delle unità",
     "file": "specialita.html",
     "desc": "specialità nuove e il loro effetto con gli script."
    },
    "abilities": {
     "title": "Abilità delle truppe",
     "file": "abilita.html",
     "desc": "abilità nuove per unità o eroi (comando con pulsante e tasto, più un metodo con script)."
    },
    "items": {
     "title": "Oggetti nuovi",
     "file": "oggetti.html",
     "desc": "amuleti, erbe e gemme degli eroi."
    },
    "formations": {
     "title": "Formazioni nuove",
     "file": "formazioni.html",
     "desc": "formazioni da eroe con i loro bonus e il loro pulsante."
    },
    "outposts": {
     "title": "Avamposti ed edifici",
     "file": "avamposti.html",
     "desc": "avamposti neutrali nuovi nelle mappe casuali (<code>crea-avamposto.js</code>) e classi di torri, mura e porte."
    },
    "victory-modes": {
     "title": "Modalità di vittoria",
     "file": "modalita-vittoria.html",
     "desc": "uno script in <code>data\\GameScripts</code> aggiunge una modalità al menu a tendina &quot;Modalità&quot; della stanza."
    },
    "options": {
     "title": "Opzioni di partita proprie",
     "file": "opzioni.html",
     "desc": "interruttori nuovi nelle regole della stanza, che gli script leggono con <code>Mod_GetOption</code>."
    },
    "random-maps": {
     "title": "Tipi di mappa casuale",
     "file": "mappe-casuali.html",
     "desc": "un disegno a quattro colori diventa un nuovo tipo di mappa (<code>crea-mappa-casuale.js</code>)."
    },
    "images": {
     "title": "Immagini proprie",
     "file": "immagini.html",
     "desc": "pulsanti dei comandi e icone delle unità a partire da un PNG."
    },
    "graphics": {
     "title": "Grafica propria",
     "file": "grafica.html",
     "desc": "sprite propri per unità ed edifici (<code>converti-sprite.js</code>, <code>crea-entita.js</code>, <code>leggi-rle.js</code>)."
    },
    "validating": {
     "title": "Validare una mod",
     "file": "validare.html",
     "desc": "controllare una mod senza aprire il gioco, con file e riga di ogni errore."
    },
    "publishing": {
     "title": "Pubblicare su GameBanana",
     "file": "pubblicare.html",
     "desc": "categorie, tag, caricamento e mod fatte prima dell&#39;SDK."
    },
    "reference": {
     "title": "Riferimento",
     "file": "riferimento.html",
     "desc": "l&#39;elenco completo di ciò che una mod può dichiarare (file, campi, patch, eventi, funzioni e limiti)."
    }
   },
   "tools": [
    {
     "want": "Un&#39;unità nuova",
     "use": "<code>crea-unita.js</code>",
     "guide": "unita.html"
    },
    {
     "want": "Un oggetto nuovo",
     "use": "<code>crea-oggetto.js</code>",
     "guide": "oggetti.html"
    },
    {
     "want": "Un&#39;abilità nuova",
     "use": "<code>crea-abilita.js</code>",
     "guide": "abilita.html"
    },
    {
     "want": "Una formazione nuova",
     "use": "<code>crea-formazione.js</code>",
     "guide": "formazioni.html"
    },
    {
     "want": "Un&#39;opzione di partita",
     "use": "<code>crea-opzione.js</code>",
     "guide": "opzioni.html"
    },
    {
     "want": "Una civiltà nuova",
     "use": "<code>clona-civilta.js</code>",
     "guide": "civilta.html"
    },
    {
     "want": "Città e villaggio propri di una civiltà",
     "use": "<code>crea-modello.js</code>",
     "guide": "modelli-citta.html"
    },
    {
     "want": "Un avamposto neutrale",
     "use": "<code>crea-avamposto.js</code>",
     "guide": "avamposti.html"
    },
    {
     "want": "Un tipo di mappa casuale",
     "use": "<code>crea-mappa-casuale.js</code>",
     "guide": "mappe-casuali.html"
    },
    {
     "want": "Pulsanti e icone da un PNG",
     "use": "<code>converti-immagine.js</code>",
     "guide": "immagini.html"
    },
    {
     "want": "Sprite da PNG, e la scheda di un&#39;unità o edificio",
     "use": "<code>converti-sprite.js</code>, <code>crea-entita.js</code>, <code>leggi-rle.js</code>",
     "guide": "grafica.html"
    },
    {
     "want": "Controllare una mod senza aprire il gioco",
     "use": "<code>valida-mod.js</code>",
     "guide": "validare.html"
    },
    {
     "want": "Adattare una mod fatta prima dell&#39;SDK",
     "use": "<code>riduci-mod.js</code>",
     "guide": "pubblicare.html"
    },
    {
     "want": "Estrarre i dati del gioco",
     "use": "<code>estrai-dati.js</code>",
     "guide": null
    }
   ],
   "readme": "README.html",
   "extra": {
    "changes": "CAMBIAMENTI.html",
    "license": "LICENZA.html"
   },
   "anchors": {
    "start": "parti-da-qui",
    "mod": "comè-fatta-una-mod"
   }
  }
 }
};
