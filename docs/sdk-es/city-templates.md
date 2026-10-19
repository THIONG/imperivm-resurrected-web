# Plantillas de ciudad y aldea propias

Una civilización de mod empieza la partida con una ciudad y una aldea que el mapa aleatorio elige de una lista de plantillas del juego. Por defecto usa las de su civilización base: una Dacia clonada de la Galia empieza en un "Gaul Town". Con tus propias plantillas cambias la distribución, por ejemplo una ciudad más ancha, casi cuadrada, con otra disposición de edificios dentro de las murallas.

`--straight` no funciona bien (mira más abajo).

## Qué puedes hacer y qué no

- Puedes mover y repetir las piezas del juego: murallas (`?WallsN/S/E/W/NE/NW/SE/SW`), torres, puertas y edificios.
- No puedes crear piezas de muralla nuevas. Las esquinas y las puertas están dibujadas para el recinto octogonal del juego, así que la forma «cuadrada» es un octógono con los lados largos más largos.
- Sin terreno propio: el suelo viene del bioma (hierba o arena). La ciudad del juego tiene un camino de tierra en el centro y la tuya no.
- Las plantillas solo aparecen para los jugadores de esa civilización. Las aldeas y ciudades independientes del mapa no las usan.

## Cómo hacerlo

1. Obtén las plantillas del juego. En `imperivm-mod.ini` (carpeta del juego), sección `[Debug]`, pon
   `Dump=randommapsettlements/maps/1/map.obj.xml`. Abre el juego, empieza una escaramuza en un mapa aleatorio y sal. Aparece el archivo
   `mod-dump\randommapsettlements\maps\1\map.obj.xml`. Después quita esa línea.
2. Genera las plantillas de tu civilización:

   ```
   node tools\create-template.js "<game folder>" "<your mod folder>" Dacian --base Gaul --width 1
   ```

   - `Dacian` es el prefijo. Crea "Dacian Town 1", "Dacian Town 2" y "Dacian Village 1..5".
   - `--base` es la civilización de la que copia: Gaul, Republican Roman, Carthaginian, Iberian, Imperial Roman, Briton, Egyptian o German.
   - `--width N` (0 a 4) ensancha las ciudades en N tramos de 220 unidades. Con la Galia, `--width 1` da 1760 x 1760 y solo ensancha "Town 1": "Town 2"
     no tiene la forma necesaria, así que el script avisa y la deja como está.
   - `--no-villages` genera solo las ciudades.
   - `--straight` (experimental, con `--side N`, de 6 a 9 tramos de 220 por lado, 8 por defecto) crea un recinto realmente rectangular, sin las
     esquinas cortadas, con las puertas N, S y E en el centro de cada lado. La puerta sale torcida, porque el juego solo tiene
     puertas dibujadas para las esquinas cortadas. No lo uses salvo para experimentar.

   Escribe `patches\randommapsettlements\maps\1\map.obj.xml` en tu mod.
3. Díselo a la civilización: en `civs\<id>.json` añade `"template": "Dacian"` ([Civilizaciones](civilizations.md)).
4. Valida: `node tools\validate-mod.js <mod folder>`. Avisa si falta el parche, si no hay ciudades o aldeas con ese prefijo y si
   alguna clase de las plantillas no existe.

Si la civilización no tiene plantilla de un tipo (por ejemplo, ninguna aldea), usa las de su base para ese tipo.

## Editar a mano

Cada `<settlement name="Dacian Town 1">` del XML es una lista de piezas con su clase y posición (x, y). Reglas que conviene seguir:

- Mantén cada lado por debajo de unas 1900 unidades. La aldea satélite se coloca a unas 2000 del centro de la ciudad, y una ciudad más grande
  se solaparía con ella.
- Todas las clases del XML tienen que existir, o el mapa aleatorio no se genera y el juego no te avisa. Usa solo clases del juego o de tu mod. El validador
  lo comprueba.
- Las torres van cada 220 unidades, y cada pieza de muralla en el punto medio entre dos torres. Una puerta ocupa dos huecos.
- Deja las plantillas en la zona libre del plano (y entre 24192 y 27904) y al menos a 3000 unidades unas de otras.
- Los parches bajo `randommapsettlements/` cuentan como jugabilidad: en una sala online, todos deben tener el mismo mod.
