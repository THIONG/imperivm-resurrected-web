# Modalità di vittoria personalizzate

Le condizioni di vittoria del gioco (Elimination, Score limit…) sono script `.vs`. Una mod può portare le sue, che compaiono da sole nel menu "Mode" della stanza.

Esempio: [`examples/victory-example`](examples/victory-example) (la modalità "Dominio": vince chi controlla N insediamenti).

## Lo script

Va in `data\GameScripts\` nella tua mod:

```
data\GameScripts\6 Dominio.vs
```

- **Il nome del file è l'id della modalità**, numero compreso. La stanza elenca le modalità per nome completo del file. Due mod vanno in conflitto solo se usano esattamente lo stesso nome (`6 Dominio.vs` in entrambe). Le modalità del gioco sono da 1 a 5.
- La stanza lo mostra senza il numero iniziale e lo passa per la traduzione: se il testo "Dominio" ha una voce nel tuo `loc`, compare tradotto ([Lingue](languages.md)).
- La firma è `//void, int player, str param`. Il gioco carica sempre lo script con quella firma, quindi la prima riga è facoltativa, ma conviene scriverla. `player` è il giocatore (da 1 a 8). `param` è il valore del limite scelto nella stanza (vedi sotto).
- Il gioco lancia 8 copie dello script, una per giocatore, ciascuna in un proprio thread, anche con meno giocatori. Scrivilo dal punto di vista di un solo giocatore, che guarda gli altri. Deve reggere gli slot vuoti: l'esempio li tratta come eliminati perché non hanno insediamenti né truppe.

## Funzioni che userai

| Funzione | Cosa fa |
|---|---|
| `EndGame(player, false)` / `EndGame(player, true)` | Il giocatore vince / perde. Fai seguire un `return` |
| `SetPlayerStatus(player, linea, texto, important)` | Testo di stato in alto: la riga 0 è il nome della modalità, la riga 1 l'avviso. Esiste anche `SetPlayerStatus(player, linea, bool)`; gli script del gioco usano entrambe |
| `ClassPlayerObjs("BaseTownhall", player)` | Gli oggetti di un giocatore appartenenti a una classe; `.count` li conta, `.IsEmpty()` dice se non ce ne sono |
| `MilUnits(player)` | Quante truppe ha |
| `DiplAreAllied(a, b)` | Se due giocatori sono alleati |
| `Str2Int(param)` | Converte `param` in un numero |
| `EnvReadInt` / `EnvWriteInt` | Variabili condivise tra script. Con un giocatore (`EnvWriteInt(player, "clave", n)`) o senza (`EnvWriteInt("modo", 1)`) |
| `GetConst("…")` | Costanti di `CONST.INI` |
| `Translate("…")` / `Translatef("…", a, b)` | Testo localizzato |

Per vedere come lo fa il gioco, estrai i suoi script con `extract-data.js` (`node tools\extract-data.js "<game folder>" <output folder>`) e leggi `GAMESCRIPTS\1 ELIMINATION.VS` e `2 SCORE LIMIT.VS`. Puoi usare anche il dump descritto in [Patch](patches.md), con il percorso completo: `Dump=data/GameScripts/1 ELIMINATION.VS`.

## Il menu "Limit"

Il gioco lo riempie con le voci di `CONST.INI`, sezione `[GamePlay]`. La chiave è il nome del file con `_` al posto degli spazi, più un numero a partire da 0. Il valore ha due parti separate da una virgola: il testo che vedi e ciò che lo script riceve come `param`.

L'esempio lo fa con una patch INI in `patches\data\const.ini`:

```ini
[GamePlay]
6_Dominio0 = 2 asentamientos, 2
6_Dominio1 = 3 asentamientos, 3
6_Dominio2 = 4 asentamientos, 4
6_Dominio3 = 5 asentamientos, 5
```

Senza voci, il menu resta vuoto e non c'è nessun limite da scegliere. Cosa riceva `param` in quel caso non è stato osservato in partita: l'esempio ripiega su 3 se `Str2Int(param)` dà meno di 2.

## Impostazioni fisse e civiltà di una modalità

Una modalità può fissare impostazioni della stanza e le civiltà che si possono scegliere con essa. Va in `modes\<name>.json`:

```json
{
  "mode": "2 LIGA",
  "gold": 5000,
  "population": 100,
  "noFog": false,
  "explored": false,
  "bonus": 1,
  "civilizations": ["RomeImperial", "Gaul", "Iberia", "CarthageNumidian"]
}
```

| Campo | Cos'è |
|---|---|
| `mode` | Il nome dello script della modalità in `data\GameScripts`, senza `.vs` (`2 LIGA` per `2 LIGA.vs`), fino a 31 caratteri. Se lo ometti, vale il nome del file json. Funziona anche per le modalità del gioco. |
| `gold` | (Facoltativo) L'oro iniziale: uno dei valori del menu (`5000`, `10000`…). |
| `population` | (Facoltativo) La popolazione: `50`, `100` o `150` (`LowPop`, `NormalPop` e `HighPop` di `CONST.INI`). |
| `noFog` | (Facoltativo) `true` toglie la nebbia, `false` la mantiene. |
| `explored` | (Facoltativo) `true` fa partire con la mappa esplorata. |
| `bonus` | (Facoltativo) Il bonus di ogni giocatore, da 0 (nessuno) a 3, lo stesso numero del pulsante dei bonus della stanza. Disable bonuses non si può più selezionare. |
| `civilizations` | (Facoltativo) Le civiltà che si possono giocare in quella modalità: quelle del gioco (`Gaul`, `RepublicanRome`…) o l'`id` di una della mod. Una base del gioco ammette tutte le sue varianti; una variante, solo se stessa. |

Finché quella modalità è selezionata, la stanza non permette a nessuno di cambiare ciò che essa fissa: l'host vede quelle righe ma non può modificarle. Un giocatore con una civiltà non ammessa dalla modalità passa alla prima dell'elenco, e la civiltà casuale viene estratta solo tra quelle ammesse. L'host lo applica alla creazione della partita, così tutti giocano con le stesse impostazioni. Le partite salvate e gli scenari con civiltà fissate non cambiano.

## Online

Una nuova modalità cambia il gameplay: tutti i giocatori devono avere la stessa mod.
