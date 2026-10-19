# Bonus iniziali

Un bonus iniziale è uno script che il gioco esegue per un giocatore all'inizio della partita. La stanza li elenca nella colonna "Bonus" di ogni giocatore, e una mod può aggiungerne di propri.

## Lo script

Va in `data\BonusScripts\` nella tua mod e si chiama `NNN NAME.vs`:

```
data\BonusScripts\004 Tribute.vs
```

- Il numero ordina l'elenco ed è il valore che la stanza invia agli altri giocatori. Solo i numeri da `000` a `099` compaiono nella stanza; da `100` in su sono script che avviano altri script (le conquiste del gioco li usano) e non vengono mai offerti.
- `000 None.vs` deve esistere e restare vuoto: è la scelta "nessun bonus". Il gioco include da `000` a `003`; un nuovo bonus prende il primo numero libero.
- Il nome nell'elenco è il nome del file senza il numero, con la maiuscola solo all'inizio di ogni parola (`004 BOAR TEETH.vs` diventa "Boar Teeth").
- La firma è fissa: `//void, Settlement set, int playerid`. Lo script viene eseguito una volta per ogni giocatore che lo ha scelto, con il suo insediamento principale.

Esempio, 3000 monete d'oro all'inizio:

```
//void, Settlement set, int playerid
//@name 3000 gold
//@name.es 3000 de oro
//@description 3000 gold at the start.
//@description.es 3000 de oro al empezar.

Sleep(100);
set.SetGold(set.gold + 3000);
set.GoldConverted(3000);
```

## Nome e descrizione nella stanza

Le righe che iniziano con `//@` in cima allo script forniscono il testo del menu a tendina. Devono comparire prima della prima riga di codice.

| Riga | Uso |
|---|---|
| `//@name Text` | Il nome mostrato nel menu a tendina e nella riga del giocatore (breve: la colonna è stretta). |
| `//@description Text` | Cosa fa il bonus. Viene mostrata accanto al menu a tendina quando il puntatore è su quel bonus. |
| `//@name.es`, `//@description.it`… | Lo stesso per una sola lingua (`en`, `es`, `it`). Se la lingua del giocatore non ha una riga, si usa quella senza lingua, poi quella inglese. |

Senza queste righe il nome è quello del file e non c'è nessuna descrizione. I tre bonus del gioco hanno nomi e descrizioni propri finché lo script è quello originale; una mod che cambia l'effetto di uno di essi ottiene il nome del file, quindi dovrebbe aggiungere queste righe. Se due bonus finiscono con lo stesso nome, la stanza aggiunge il numero del file per distinguerli.

## Online

Tutti i giocatori devono avere gli stessi file: il contenuto della stanza viene confrontato prima della partita, e il valore del bonus è una posizione nell'elenco.

Richiede Imperivm Resurrected 0.9.0 o successivo.
