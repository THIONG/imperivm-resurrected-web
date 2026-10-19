# Script

Parti dal [modello gameplay](templates/gameplay), una mod vuota con le cartelle che usa questa guida.

Gli script (`.vs`) sono il linguaggio con cui il gioco programma l'IA, le abilità, le condizioni di vittoria e il comportamento di edifici e unità. Una mod può includere i propri e usare le nuove funzioni di Imperivm Resurrected (`Mod_...`).

Esempio da copiare: [`examples/scripts-example`](examples/scripts-example). Attenzione: l'esempio cambia il bilanciamento (gli hastati infliggono il doppio del danno e si curano quando uccidono), quindi non attivarlo in una partita seria.

## Com'è fatto uno script

Un file di testo `.vs`. La prima riga è un commento con la firma: cosa restituisce e quali parametri riceve. Ogni punto in cui si usa uno script si aspetta una firma precisa. Ci sono tre eccezioni, che il gioco carica sempre con la loro firma, con la riga o senza: i comportamenti di una classe (`<behavior script="...">`), come `void, Obj This`; le modalità di vittoria (`data/GameScripts`), come `void, int player, str param`; e gli script degli oggetti (vedi [Oggetti](items.md)), con la firma del loro attributo.

```
// void, Obj This

Sleep(rand(500) + 100);
Mod_Log("A Roman hastatus entered the map");
while(true) Sleep(50000);
```

Per vedere come il gioco scrive i suoi, esportali con `Dump=` (vedi [Patch](patches.md); devi indicare ogni file per nome, senza caratteri jolly) oppure guarda nella cartella `DATA` che estrae `extract-data.js`: `data/subai/*.vs` (comportamenti e abilità), `data/ai/*.vs` (IA) e `data/GameScripts/*.vs` (vittoria). Tutte le funzioni del linguaggio, con le loro firme, sono in [funciones-del-juego.txt](game-functions.txt).

## Dove si aggancia uno script

| Dove | Come | Firma |
|---|---|---|
| Comportamento di una classe | `<behavior script="data/mod/mi.vs"/>` nel `.sc.xml` della classe (con una [patch](patches.md) se è una classe del gioco). Viene eseguito per ogni oggetto della classe finché esiste. | `// void, Obj This` |
| Ordine o abilità | `<method sig="miOrden" vs="data/mod/mi.vs"/>` nella classe e un `<cmd name="miOrden">` in `data\commands` | dipende dall'ordine: guarda quelli del gioco |
| Quando muore un'unità | `<method sig="ondie" vs="data/mod/mi.vs"/>` nella classe (e `sig="onkill"` per quando uccide) | vedi `data/subai/unit_on_kill.vs` |
| Condizione di vittoria | un `.vs` in `data/GameScripts` (vedi [Modalità di vittoria](victory-modes.md)) | `// void, int player, str param` |
| Oggetti di `items.xml` | attributi come `use_script` o `equip_script` (vedi [Oggetti](items.md)) | dipende dall'attributo |

`ondie` e `onkill` sono metodi (`<method sig=...>`), non attributi. Se scrivi `ondie="..."` sulla classe, non succede nulla e il gioco non ti avvisa.

Uno script di comportamento non deve terminare: chiudilo con `while(true) Sleep(50000);`.

Una classe accetta solo 8 elementi `<behavior>`.

## Eventi

Metti uno script in `events\<Event>.vs` dentro la tua mod e il gioco lo esegue quando l'evento si verifica, su tutti i PC nello stesso momento. Se più mod definiscono lo stesso evento, vengono eseguiti tutti. Per provare senza creare una mod, mettilo in `<game>\mod\events\<Event>.vs`.

| Evento | Quando | Firma |
|---|---|---|
| `OnGameStart` | All'inizio di una schermaglia, di uno scenario o di una partita multigiocatore, subito dopo l'avvio degli script di vittoria. Può usare `Sleep` e viene salvato con la partita. | `// void` |
| `OnObjectDie` | Quando muore un qualsiasi oggetto della mappa (unità, eroi, edifici, decorazioni…), poco prima che il gioco ne elabori la morte: l'oggetto esiste ancora. Stesso momento dell'`ondie` della sua classe. | `// void, Obj victim` |
| `OnObjectKill` | Quando un colpo uccide un oggetto. `killer` ha inferto il colpo, `victim` è morto. Stesso momento dell'`onkill` della classe dell'attaccante. | `// void, Obj killer, Obj victim` |
| `OnSettlementCaptured` | Quando un insediamento cambia proprietario durante la partita (conquista, oppure uno script che lo assegna a un altro). Non scatta mentre la mappa viene preparata. `building` è il suo edificio centrale. Giocatori da 1 a 16: gli insediamenti senza proprietario partono sotto i giocatori 15 e 16; lo 0 compare solo se non c'è un proprietario. | `// void, Obj building, int oldPlayer, int newPlayer` |
| `OnAttackResolved` | A ogni colpo che infligge danno, poco prima che venga applicato: armatura, specialità delle unità e bonus sono già conteggiati. `damage` è ciò che la vittima sta per subire; `Mod_SetAttackDamage(n)` lo modifica (0 lo annulla). Non scatta se il colpo non infligge danno (deviazioni, parata). | `// void, Obj attacker, Obj victim, int damage` |
| `OnPlayerDefeated` | Quando il gioco dichiara sconfitto un giocatore (da 1 a 8), subito dopo averlo segnato. Una volta per giocatore. | `// void, int player` |

Tranne `OnGameStart`, gli eventi vengono eseguiti subito e non possono attendere: niente `Sleep`. `OnAttackResolved` e `OnObjectDie` scattano molte volte al secondo in una battaglia. Scarta subito ciò che non ti interessa (`if (!victim.IsValid) return;`, `victim.IsMilitary`, `victim.player`, `victim.IsHeirOf("RHastatus")`…) e non fare lavori pesanti.

In `OnSettlementCaptured`, `building` è un `Obj`. Per arrivare al suo insediamento passa da `AsBuilding`: `building.AsBuilding.settlement`.

`OnObjectKill` permette di creare abilità passive. Un hastatus che si cura quando uccide:

```
// void, Obj killer, Obj victim
if (!killer.IsValid) return;
if (!killer.IsHeirOf("RHastatus")) return;
if (!victim.IsMilitary) return;
killer.Heal(25);
```

Con più mod su `OnAttackResolved`, `damage` è sempre il danno originale: viene calcolato una sola volta. Due mod che fanno entrambe `Mod_SetAttackDamage(damage * 2)` non si sommano. Per partire da ciò che un'altra mod ha già cambiato, usa `Mod_AttackDamage()`.

### Reagire alla comparsa di un oggetto

Per questo non esiste un evento (gli oggetti vengono creati in decine di punti, anche quando si carica una mappa o una partita). Usa un comportamento: un `<behavior>` aggiunto con una patch a una classe di base (`Military` per tutti i soldati, `Unit` per tutte le unità) viene ereditato da ogni classe sottostante e viene eseguito una volta per ogni oggetto quando compare. Vedi `patches\data\classes\Military.sc.xml` e `data\mod\soldier.vs` nell'esempio.

## Funzioni `Mod_`

La versione attuale dell'API è la 7. `Mod_ApiVersion()` la restituisce e una mod può richiederne una minima.

| Funzione | Cosa fa |
|---|---|
| `Mod_Log(str texto)` | Scrive `script: texto` in `Logs\imperivm\imperivm-mod.log` (livello `I`). Fino a 2.000 righe per sessione. |
| `Mod_LogInt(str texto, int valor)` | Scrive `script: texto: valor`. |
| `Mod_IsActive(str id)` : `bool` | La mod con quell'`id` (quello del suo `mod.json`) è attiva nel profilo? |
| `Mod_ApiVersion()` : `int` | La versione dell'API. |
| `Mod_SetInt(str nombre, int valor)` | Memorizza una variabile (API 2). |
| `Mod_GetInt(str nombre)` : `int` | Legge una variabile; 0 se non esiste (API 2). |
| `Mod_AddInt(str nombre, int suma)` : `int` | Somma a una variabile e restituisce il nuovo valore (API 2). |
| `Mod_HasKey(str nombre)` : `bool` | La variabile esiste? (API 2). |
| `Mod_AttackDamage()` : `int` | Solo in `OnAttackResolved`: il danno del colpo in corso di risoluzione. Fuori da lì restituisce 0 (API 3). |
| `Mod_SetAttackDamage(int damage)` | Solo in `OnAttackResolved`: modifica il danno prima che venga applicato. Fuori da lì non fa nulla (API 3). |
| `Mod_HasSpecial(Unit unidad, int bit)` : `bool` | L'unità ha quella specialità (bit da 0 a 63)? (API 4). Vedi [Specialità delle unità](specials.md). |
| `Mod_SetSpecial(Unit unidad, int bit, bool puesta)` | Imposta o toglie una specialità dell'unità (API 4). |
| `Mod_TrueRace(Obj objeto)` : `int` | La vera civiltà di un oggetto (10 o superiore se viene da una mod), anche se per l'IA la sua razza è quella della sua base (API 5). Vedi [Civiltà](civilizations.md). |
| `Mod_GetOption(str id)` : `bool` | L'opzione `id` (quella di `options\<id>.json`) è spuntata nella stanza? Uguale su tutti i PC (API 6). Vedi [Opzioni di partita](options.md). |
| `Mod_GetOptionValue(str id)` : `int` | Il valore scelto dell'opzione `id`: 0 o 1 per un interruttore, e il numero della voce scelta (da 0) per una lista (API 6). |
| `Mod_PlayerCiv(int player)` : `int` | La civiltà che il giocatore ha scelto nella stanza (10 o superiore se viene da una mod), anche se è una variante e `GetPlayerRace` restituisce la sua base. -1 se il giocatore non esiste (API 7). Vedi [Civiltà](civilizations.md). |
| `Mod_CanExecCmd(Obj objeto, str orden)` : `bool` | Il giocatore potrebbe premere ora il pulsante di quell'ordine su quell'oggetto? È il controllo del gioco stesso: l'oggetto ha l'ordine, non è disabilitato (`CmdDisable`) e il suo verificatore (`groupverifier` o quello del giocatore) lo accetta. Non guarda il costo (API 7). |

Le nuove funzioni si aggiungono in fondo e quelle esistenti non cambiano. Se la tua mod ne usa una, richiede una versione di Imperivm Resurrected che la includa. La versione dell'API fa parte del controllo multigiocatore quando ci sono mod di gameplay: tutti devono avere la stessa.

### Variabili della mod

Una tabella nome → numero intero, così la tua mod può ricordare dati (contatori, flag, tempi):

```
Mod_AddInt("captures", 1);
if (Mod_GetInt("captures") >= 3) ...
```

- Vengono salvate con la partita (anche nei salvataggi automatici) e tornano quando la carichi. Una nuova partita inizia senza variabili.
- Sono uguali su tutti i PC perché gli script di gioco vengono eseguiti allo stesso modo ovunque. Modificale solo da script di gioco, mai in base a qualcosa di locale.
- Nomi fino a 64 caratteri, fino a 1.024 variabili, interi a 32 bit.
- Appartengono all'intera partita, non a un giocatore. Per averne una per giocatore, aggiungi il giocatore al nome (`"oro1"`, `"oro2"`).
- Sono condivise tra tutte le mod attive: usa un prefisso tuo (`"mymod_captures"`).

## Multigiocatore

Gli script fanno parte della simulazione: vengono eseguiti su tutti i PC, nello stesso momento, e devono fare la stessa cosa ovunque.

- Leggi solo ciò che è uguale per tutti: oggetti della mappa, tempo di gioco, il `rand()` del gioco.
- Non leggere nulla di locale: la telecamera, il giocatore che sta guardando, la musica, il mouse, l'orologio di sistema. Se lo script cambia il gioco in base a qualcosa di locale, il gioco va in desync.
- Se qualcosa arriva da un tasto o dall'interfaccia, deve passare come ordine di gioco, che viaggia in rete. Vedi [Tasti delle mod](keys.md).

## Partite salvate

Un salvataggio contiene il codice degli script che erano in esecuzione. Per questo le funzioni dell'SDK non cambiano mai numero e si aggiungono solo in fondo: ciò che è salvato continua a caricarsi. Non riutilizzare come tuoi i nomi delle funzioni del gioco (`Run`, `Write`…).

## Errori

- Uno script che non compila lascia l'errore (file, riga e colonna) in `Logs\imperivm\imperivm-mod.log`, come `script: compilation error: …` (livello `E`), e anche in `Logs\comp_out.txt` e `Logs\vxlog.log`. Il gioco continua, ma quello script non viene eseguito.
- Gli errori in esecuzione quasi mai vengono registrati. Negli eventi sì: il log riporta `Event X (…): the script ended with an error`, fino a 5 volte per script. Per tutto il resto usa `Mod_Log` e controlla il log.
