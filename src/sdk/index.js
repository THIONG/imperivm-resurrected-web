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
};
