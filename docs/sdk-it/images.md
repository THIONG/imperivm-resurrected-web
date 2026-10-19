# Immagini personalizzate

Una mod può includere propri pulsanti dei comandi e ritratti delle unità, invece di riutilizzare quelli del gioco. Disegna con qualsiasi programma, salva un PNG e convertilo con uno strumento. Ti serve [Node.js](https://nodejs.org).

Esempio da copiare: [`examples/ability-example`](examples/ability-example) (il pulsante "Respiro").

## Convertire un PNG

```
node tools/convert-image.js <entrada.png> <salida.bmp> --type button
node tools/convert-image.js <entrada.png> <salida.bmp> --type icon
```

- `boton`: il pulsante di un comando (`button="..."` di un `<cmd>`). Nel gioco misura 153 x 51: tre fotogrammi da 51 x 51 (normale, con il mouse sopra e disabilitato). Fornisci un PNG da 51 x 51 e lo strumento crea gli altri due fotogrammi (uno più chiaro e uno grigio). Se hai già tutti e tre, un PNG da 153 x 51 viene usato così com'è. Qualsiasi altra dimensione viene scalata senza distorsione.
- `icon`: il ritratto di un'unità (`icon="..."`) o il suo ritratto nella coda di addestramento (`queueicon="..."`). Misura 65 x 76. Va bene un PNG di qualsiasi dimensione: viene scalato senza distorsione, e le aree trasparenti diventano il verde puro che il gioco tratta come trasparente.

Con `--background #RRGGBB` scegli il colore che riempie le aree trasparenti di un pulsante (per impostazione predefinita, un marrone scuro come quello dei pulsanti del gioco).

Il PNG deve essere a 8 bit per canale e non interlacciato, cosa normale quando si salva da qualsiasi programma. In caso contrario lo strumento lo segnala.

## Dove va il file

Con lo stesso percorso che usa il gioco, dentro la cartella della mod. La regola per i pulsanti è `gameres/cmdbar/<whatever button= says>`:

| Cosa | Nell'XML | File nella tua mod |
|---|---|---|
| Il pulsante di un comando | `button="Actions/Respiro.bmp"` | `gameres/cmdbar/Actions/Respiro.bmp` |
| Il pulsante di un potenziamento | `button="research/Mejora.bmp"` | `gameres/cmdbar/research/Mejora.bmp` |
| Il ritratto di un'unità | `<properties icon="gameres/icons/MyUnit.bmp"/>` | `gameres/icons/MyUnit.bmp` |
| Ritratto nella coda | `queueicon="gameres/icons/MyUnit.bmp"` | `gameres/icons/MyUnit.bmp` |

I comandi del gioco usano anche le cartelle `upgrades`, `skills`, `states` e `specials` dentro `cmdbar`. Funzionano allo stesso modo.

Le maiuscole nei percorsi non contano. Se il gioco non trova un'immagine, il pulsante appare come un semplice quadrato blu.

## Se non compare

1. Imposta `LogFiles=1` in `[Debug]` di `imperivm-mod.ini`. Il log annota ogni file che il gioco apre e segnala quelli che non esistono (`VFS: opens … -> does not exist`), così puoi vedere il nome esatto che il gioco richiede.

## Cosa non si può fare

- Le immagini della guida (`help/...`), le immagini della barra informativa di ogni civiltà e gli sfondi dei menu non hanno un convertitore.
- I modelli e le animazioni di unità ed edifici (`.rle` e `.ent.xml`) sono un altro discorso: vedi [Grafica personalizzata](graphics.md).
