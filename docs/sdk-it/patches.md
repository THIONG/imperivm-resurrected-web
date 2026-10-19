# Patch

Parti dal [modello gameplay](templates/gameplay), una mod vuota con le cartelle usate in questa guida.

Una patch modifica una parte di un file del gioco senza sostituirlo per intero. Due mod possono applicare patch allo stesso file e le due modifiche si sommano. Se ognuna includesse la propria copia del file, la seconda sovrascriverebbe la prima.

Funzionano i file XML (ordini, oggetti, bonus, definizioni delle unità), i file INI (costanti, interfaccia) e gli script `.vs` (IA, comportamenti). Il file deve esistere nel gioco. Esempio da copiare: [`examples/patches-example`](examples/patches-example).


## Dove va

Nella tua mod, dentro `patches`, con lo stesso percorso che il file ha nel gioco:

```
mods\my-mod\
  mod.json
  patches\data\commands\RBarracks.xml     patches data\commands\RBarracks.xml
  patches\data\const.ini                  patches data\const.ini
```

- Ogni volta che il gioco apre quel file, le patch delle mod attive vengono applicate. Gli originali non vengono mai toccati.
- Con più mod, le patch si applicano dall'ultima mod dell'[ordine di caricamento](reference.md#1-mod-structure) alla prima: l'ultima parola spetta alla prima. L'ordine lo calcola il gioco ed è lo stesso su ogni computer con le stesse mod; il controllo del multigiocatore non ne dipende.
- Se la tua mod include anche una propria copia del file (senza `patches`), le patch delle altre mod vengono applicate sopra di essa.
- Per provare una patch senza creare una mod, mettila in `<game>\mod\patches\<path>`. Viene applicata per ultima, sopra a tutto.
- Una patch cambia il gameplay se lo cambia il file (`data\...`, mappe, unità). In quel caso tutti i giocatori devono usare la stessa mod.
- Le patch vengono lette quando il gioco apre ciascun file. Se ne modifichi una, riavvia il gioco.

## Vedere il risultato

Aggiungi questo a `imperivm-mod.ini` e apri il gioco:

```ini
[Debug]
Dump=data/commands/RBarracks.xml,data/const.ini
```

Ogni file viene copiato in `mod-dump\<path>` esattamente come lo legge il gioco, con le patch già applicate. Per vedere l'originale, usa il profilo Original. Indica il nome esatto di ogni file, separati da virgole; l'intera riga non può superare i 1.023 caratteri. Un solo `*` esporta tutti i file che il gioco apre: sono migliaia, quindi fai attenzione.

## Patch XML

Un `<patch>` con operazioni che vengono applicate in ordine:

```xml
<patch>
  <set select="/commands/cmd[@name='trainRHastatus']" costgold="60" execdelay="3000" unset="costpop"/>
  <add select="/commands"><cmd name="miOrden" method="train" .../></add>
  <remove select="//cmd[@name='otraOrden']"/>
  <replace select="/commands/cmd[@name='trainRArcher']/src"><src obj="RBarracks"/></replace>
</patch>
```

- `<set select="…" attribute="value" …/>`: modifica o aggiunge quegli attributi sugli elementi selezionati. `unset="a b"` rimuove degli attributi.
- `<add select="…">…</add>`: aggiunge il contenuto in coda all'elemento selezionato. Con `position="start"` va all'inizio; con `"before"` o `"after"`, accanto all'elemento selezionato anziché al suo interno.
- `<remove select="…"/>`: rimuove gli elementi selezionati.
- `<replace select="…">…</replace>`: sostituisce gli elementi selezionati con il contenuto.

Se ciò che cerchi potrebbe non esistere e non vuoi un errore, aggiungi `optional="yes"` all'operazione.

### Il selettore

Un percorso come quelli delle cartelle, con condizioni tra parentesi quadre. Iniziarlo sempre con `/` o `//`: il validatore segnala un errore se non lo fai.

| Selettore | Seleziona |
|---|---|
| `/commands` | la radice `<commands>` |
| `/commands/cmd` | tutti i `<cmd>` dentro `<commands>` |
| `/commands/cmd[@name='trainRHastatus']` | il `<cmd>` con quel `name` |
| `//cmd[@name='trainRHastatus']` | quel `<cmd>`, ovunque si trovi |
| `/commands/cmd[@key]` | gli elementi `<cmd>` che hanno un attributo `key` |
| `/commands/cmd[3]` | il terzo `<cmd>` |
| `/commands/cmd[@name='x']/src` | gli elementi `<src>` di quel `<cmd>` |
| `//*[@name='x']` | qualsiasi elemento con `name="x"` |

Esistono solo queste condizioni: `[@a='v']`, `[@a]` e `[n]`. Puoi concatenarne diverse (`[@a='v'][2]`). Non ci sono `and`, `contains`, `text()` né `..`. Maiuscole e minuscole non contano, e i valori vanno tra apici singoli o doppi.

### Regole

- La patch deve essere XML ben formato. Nei valori scrivi `&` come `&amp;` e `<` come `&lt;`. Se è malformata, l'intera patch viene saltata e l'errore compare nel log e nella scheda della mod.
- Un'operazione che fallisce (un selettore che non trova nulla) viene saltata con un avviso. Le altre vengono applicate.
- La patch non cambia la codifica: usa quella del file del gioco (quasi sempre ASCII).
- Nel risultato si perde l'indentazione degli attributi (finiscono tutti su una riga). Il contenuto è lo stesso.
- Se rimuovi o rinomini qualcosa che altri file usano, si rompe. Le IA del gioco richiamano gli ordini per nome (`trainRScout`): se rimuovi l'ordine, l'IA fallisce.

## Patch INI

Un INI con le sezioni e le chiavi che vuoi cambiare:

```ini
; Change gameplay constants
[GamePlay]
DamageAmplify = 250
-TeachingLevel2

; In lists of bare names (no =), + adds a line if it isn't there
[GameOptions Objects]
+MiBotonNuevo
-RSText
```

- `Key = value` modifica o aggiunge la chiave in quella sezione.
- `-Key` rimuove la chiave (o la riga che coincide esattamente con quel testo).
- `+Line` aggiunge una riga semplice alla sezione, se non c'è già.
- Se la sezione non esiste, viene creata in fondo al file.
- Rimuovere una chiave che non esiste produce un errore nel log.
- I commenti a fine riga nelle righe del file originale (`Key = 20 ;comment`) si perdono sulla riga che modifichi.

**Non mettere commenti dopo una riga della patch.** Il motore non li elimina: `-Key ; text` cerca una chiave con quel nome e fallisce, `[Section] ; text` non viene riconosciuta come sezione e `Key = 250 ; text` salva il commento dentro il valore. I commenti vanno su righe a sé che iniziano con `;`. Il validatore non segnala questo problema.

## Patch di script

Una patch per un `.vs` (per esempio `patches\data\ai\GetTacticScript.vs`) è un testo con direttive che iniziano con `@` nella prima colonna. Il codice che scrivi sotto ciascuna viene aggiunto allo script del gioco:

```
@before nRace = set.GetCentralBuilding.race;
// MOD: my civilization
if (Mod_TrueRace(set.GetCentralBuilding) == Dacia)
	return TS_GaulTactic2;

@after player = set.player;
Mod_Log("GetTacticScript: choosing a tactic");
```

`Dacia` non è una costante del gioco: esiste se c'è una civiltà attiva con quel nome (l'`id` del suo `civs\<id>.json`). Vedi [Civiltà](civilizations.md).

| Direttiva | Dove mette il codice |
|---|---|
| `@top` | Subito dopo la prima riga dello script (la firma). Va bene solo per dichiarare variabili o scrivere commenti. |
| `@bottom` | In fondo allo script. |
| `@before TEXT` | Prima della prima riga dello script che contiene `TEXT`. |
| `@after TEXT` | Dopo quella riga. |
| `@replace TEXT` | Al posto di quella riga. |
| `@end` | Chiude il blocco precedente. Facoltativa: tutto ciò che la segue fino alla direttiva successiva viene ignorato. |

- `TEXT` è un frammento di riga dello script, esattamente come è scritta (non un'espressione regolare). Si ancora alla prima riga che lo contiene, quindi scegli un testo che compaia una sola volta; altrimenti il tuo codice finisce dove non te lo aspetti. Se nessuna riga lo contiene, l'errore compare nel log e la direttiva viene saltata.
- Negli script le variabili si dichiarano tutte in cima e il codice viene dopo. Un `if` o un `return` messo con `@top` finisce prima delle dichiarazioni e non compila (`Unexpected starting token`). Usa `@before` con la prima riga di codice dello script.
- Le patch di più mod si sommano, quindi due mod possono modificare lo stesso script (per esempio due civiltà che scelgono la propria tattica in `GetTacticScript.vs`).
- Lo script risultante deve compilare. Se non compila, l'errore compare in `Logs\imperivm\imperivm-mod.log` come `script: compilation error`.
- Il validatore non controlla il codice di queste patch, né le funzioni `Mod_*`, né la firma.

## Se qualcosa va storto

Cerca in `Logs\imperivm\imperivm-mod.log` le righe con l'etichetta `patch`: indicano quale file è stato modificato e quale operazione è fallita. Gli errori compaiono anche nella scheda della mod. Gli errori di compilazione di una patch di script compaiono come `script: compilation error`.
