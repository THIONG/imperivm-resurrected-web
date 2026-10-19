# Civiltà

Parti dal [modello di civiltà](templates/civilization), una mod vuota con le cartelle usate in questa guida.

Il gioco include 8 civiltà, numerate da 0 a 7: Galli, Roma repubblicana, Cartagine, Iberia, Roma imperiale, Britannia, Egitto e Germania.

Imperivm Resurrected permette di dichiarare nuove civiltà, numerate da 10 in su. Ognuna eredita da una civiltà del gioco (la sua
*base*) tutto ciò che la tua mod non definisce. Gli strumenti richiedono Node.js.

Esempio pronto da copiare: [`examples/civilization-example`](examples/civilization-example).

## Dichiarare una civiltà

Un file `civs\<id>.json` nella tua mod:

```json
{
  "id": "dacia",
  "index": 10,
  "base": "Gaul",
  "name": {"spanish": "Dacia", "english": "Dacia", "italian": "Dacia"},
  "letter": "D"
}
```

| Campo | Che cos'è |
|---|---|
| `id` | Il nome: lettere, numeri e `_`, con una lettera iniziale, fino a 24 caratteri. Lo usi in `race="..."` e negli script. |
| `index` | Un numero da 10 a 99. Non cambiarlo dopo la pubblicazione: i salvataggi lo ricordano. Due mod non possono usare lo stesso. |
| `base` | La civiltà del gioco da cui eredita: `Gaul`, `RepublicanRome`, `Carthage`, `Iberia`, `ImperialRome`, `Britain`, `Egypt` o `Germany`. Se manca, vale `Gaul`. |
| `name` | Il nome in ogni lingua, oppure una sola stringa. |
| `letter` | La lettera che fa da prefisso a classi e ordini (`DSwordsman`, `trainDSwordsman`). Se la ometti, usa quella della base. Impostane una tua solo se hai classi e ordini con quella lettera: il gioco costruisce dei nomi a partire da essa, come quello dell'addestramento dei contadini. |
| `template` | (Facoltativo) Prefisso dei tuoi modelli di città e villaggio, così la mappa casuale non usa quelli della base. Vedi [Modelli](city-templates.md). |
| `internalName` | (Facoltativo) Il nome con cui il gioco cerca i file di interfaccia della civiltà; se manca, è quello della base. |
| `folder` | (Facoltativo) Il nome mostrato nei testi di selezione. |
| `random` | (Facoltativo, `true` per impostazione predefinita) Indica se rientra nel sorteggio della civiltà casuale, anche sulle mappe casuali. L'IA la sorteggia solo se ha anche `"ai": true`. Imposta `false` per escluderla. |
| `biome` | (Facoltativo) Una civiltà del gioco: terreno, alberi e oggetti che la mappa casuale piazza intorno alla sua partenza sono quelli di quella civiltà. Se manca, quelli della base. Vedi *Il bioma*. |
| `ai` | (Facoltativo) Con `true`, l'IA gioca con le tue classi e i tuoi ordini. Altrimenti gioca come la civiltà base. Lo strumento di clonazione lo imposta a `true`. Vedi *L'IA*. |
| `ownAi` | (Facoltativo, insieme a `ai`) Per le mod che includono tutti i propri script di IA e vogliono che la civiltà venga vista come se stessa (`Dacia`, non la sua base). |
| `alias` | (Facoltativo, scritto dallo strumento di clonazione) `classes` e `commands`: nome nella base e nome nella tua civiltà (`"GArcher": "DArcher"`, `"trainGSwordsman": "trainGSwordsman Dacia"`). L'IA li usa per tradurre. |
| `variant` | (Facoltativo) Con `true`, è una variante della sua base: gioca con le classi della base e gli script la vedono come la base. Vedi *Varianti*. |
| `replacesBase` | (Facoltativo) Con `true`, la base non compare più nella stanza e questa civiltà ne prende il posto. Vedi *Varianti*. |

Con i soli `id`, `index` e `base` ottieni una copia della base con un altro nome. Da lì in poi cambi quello che vuoi.

## Usarla nelle tue classi e nei tuoi script

Nel `.sc.xml` di ogni unità o edificio:

```xml
<properties race="Dacia"/>
```

Il gioco conosce solo i nomi delle sue 8 civiltà. La mod riconosce l'`id` delle tue civiltà (senza distinzione tra maiuscole e minuscole) e lo imposta
sulla classe. Se imposti `internalName` a mano, funziona lo stesso. Quello predefinito (della base) non conta, quindi `race="Gaul"` resta
Galli anche se hai una civiltà clonata da essa.

Una classe con `parent=` eredita statistiche e comportamenti, ma non l'entità (`entity`, il modello) né i suoni: impostali di nuovo, altrimenti
l'unità compare senza modello e svanisce. Per questo lo strumento di clonazione copia le classi per intero.

Negli script, ogni civiltà dichiarata è una costante con il nome del suo `id` come l'hai scritto, con l'iniziale maiuscola (`dacia` dà
`Dacia`, `romeImperial` dà `RomeImperial`). Funziona anche il resto in minuscolo (`Romeimperial`):

```
if (GetPlayerRace(player) == Dacia)
	...
```

Gli script di IA del gioco confrontano con `Gaul`, `RepublicanRome`… e non conoscono le tue. Con `"ai": true` vedono la base. Per sapere con quale
civiltà gioca davvero un oggetto, usa `Mod_TrueRace(objeto)`.

## Nella stanza e sulla mappa

Le civiltà dichiarate compaiono nei menu a tendina della stanza multigiocatore, dopo quelle del gioco. Su una mappa casuale, la tua usa il terreno del suo bioma e parte con una città e un villaggio costruiti con le sue classi
(`DTownhall`, `DBarracks`…). Se non le dai dei modelli, la disposizione degli edifici è quella della base. L'interfaccia del giocatore (barre degli ordini, angoli, icone rapide e
schermata finale) è quella della base.

Se qualcosa non compare, controlla `Logs\imperivm\imperivm-mod.log`: le righe con l'etichetta `civilizations` dicono che cosa è stato registrato e che cosa è fallito (un `id` non valido,
un `index` mancante o duplicato, una `base` che non esiste). Gli errori compaiono anche sulla scheda della mod nel gestore.

## Varianti

Una variante è una civiltà del gioco con un altro nome nella stanza e qualcosa di proprio all'inizio della partita. Per esempio, una mod
in cui Roma sceglie all'inizio tra repubblicana, imperiale e punica può offrire tutte e tre nella stanza:

```json
{
  "id": "RomeImperial",
  "index": 21,
  "base": "RepublicanRome",
  "name": {"spanish": "Roma imperial", "english": "Roman Empire", "italian": "Roma imperiale"},
  "variant": true,
  "replacesBase": true
}
```

Con `"variant": true`:

- Gioca con le classi e gli ordini della base. Non ha classi proprie né `letter`, a meno che non sostituisca l'intera base (vedi sotto).
- `GetPlayerRace` restituisce la base, quindi gli script del gioco e delle altre mod la trattano come la base (navi, sentinelle, IA).
- `Mod_PlayerCiv(player)` restituisce la civiltà scelta nella stanza (21 nell'esempio). Ciò che la distingue va in una
  [patch di script](patches.md), per esempio ricercare la Roma giusta all'inizio:

```
@before while (EnvReadInt(set, "ChooseRomanRace") != 1)
	if (Mod_PlayerCiv(.player) == RomeImperial && set.CanResearch("ChooseImperialRome"))
		set.Research("ChooseImperialRome");
```

- Gioca anche l'IA: `ai` vale `true`, salvo indicazione contraria.
- Con `"replacesBase": true` la base non compare più nella stanza e le sue varianti ne prendono il posto. Nel sorteggio casuale, la quota
  della base viene divisa tra loro. Un giocatore che aveva scelto la base passa alla prima variante. Le mappe e i salvataggi che fissano la base
  continuano a usarla.
- Una variante con `"replacesBase": true` può anche cambiare la lettera e i modelli della sua base per tutta la partita. Con `letter`, il gioco
  costruisce i nomi delle classi e degli ordini della base con quella lettera (`GetRaceStrPref`, addestramento dei contadini, caserme, sentinelle, ingaggio
  degli eroi). Con `template`, le città e i villaggi della base, compresi quelli neutrali della mappa casuale, vengono dai tuoi
  modelli `<template> Town N` e `<template> Village N`. È questo che serve per sostituire un'intera civiltà. Per esempio, la Grecia prende
  il posto di Roma imperiale con `"base": "ImperialRome"`, `"letter": "H"` e `"template": "Greek"`, e le sue classi hanno
  `race="ImperialRome"` e la lettera `H` (`HTownhall`, `HHoplite`). Se due varianti attive danno alla stessa base lettere o
  modelli diversi, conta la prima e il gestore avvisa per l'altra.

## Clonare una civiltà

Scrivere a mano decine di classi e ordini di una civiltà non è un bel lavoro. `tools/clone-civilization.js` ne clona una dal gioco.
Richiede la cartella `DATA` del gioco, che ottieni con [`extract-data.js`](tools/extract-data.js):

```
node extract-data.js "<game folder>" <output folder>
node clone-civilization.js <output folder>\DATA <mod folder> Dacia D Gaul 10
```

Genera `civs\dacia.json`, una copia di ciascuna classe della base (`DSwordsman` è una copia di `GSwordsman`, con `race="Dacia"`), gli ordini che
nominano classi della base (`trainGSwordsman Dacia`, `trainpeasantd`, `hireheroD`…) e le patch che aggiungono le nuove classi agli
ordini condivisi. Clona anche gli eroi `GHero1`…`GHero7`, che dipendono da `GaulHero` e non hanno `race`: senza eroi dotati di modello, ingaggiarne uno
manda in crash il gioco. Da lì modifichi quello che vuoi. Il risultato di esempio è in
[`examples/civilization-example`](examples/civilization-example).

Lo strumento non scrive il campo `template`. Se vuoi i tuoi modelli, aggiungilo tu ([Modelli](city-templates.md)).

Le copie non portano con sé l'`altid` degli originali. L'`altid` è un alias univoco (`Barrack`, `Village`) che gli script e l'IA usano per cercare le
"caserme" di una civiltà. Se due classi ne condividono uno, l'IA di una civiltà smette di vedere i propri edifici. Se scrivi le classi a mano, non copiarlo.

## L'IA

Per impostazione predefinita, l'IA che sceglie una civiltà di una mod gioca come la sua base. Con `"ai": true` gioca con le tue classi e i tuoi ordini. Gli script di IA
del gioco decidono in base alla civiltà dell'edificio centrale e costruiscono i nomi a partire da essa, quindi il gioco fa in modo che vedano la base e
traduce ciò che chiedono:

- Gli ordini e le ricerche che chiedono per nome (`trainGSwordsman`, `Gaul Axeman`, `hireheroG`…) vengono mappati su quelli della tua civiltà, secondo
  `alias.ordenes`, solo sugli oggetti di un'IA della tua civiltà.
- Le tue classi contano come quelle della base: `DArcher` è un `GArcher` per i conteggi, le caserme, i templi e le unità contro.

Lo strumento di clonazione compila entrambe le tabelle. Se scrivi le classi a mano, compilale tu. Per il giocatore umano non cambia nulla.

Limiti dell'IA:

- La tua IA si comporta come quella della base, a meno che tu non le dia un'altra tattica.
- Un'unità che non rientra nei sei slot della base non verrà reclutata.
- Le nuove ricerche (non clonate da una della base) le sono sconosciute.
- I costi che legge prima di pagare sono quelli della base, anche se l'ordine addebita i tuoi valori.

**Una tattica diversa per la tua civiltà.** Il gioco sceglie la tattica di ogni IA all'avvio, in `data\ai\GetTacticScript.vs`. Una
[patch di script](patches.md) può aggiungervi un pezzo per la tua civiltà. Poiché l'IA vede la base, chiedi la civiltà reale con
`Mod_TrueRace(set.GetCentralBuilding)`. L'esempio [`examples/ai-tactic-example`](examples/ai-tactic-example) fa usare alla Dacia una tattica del gioco
che nessuna IA usa. Le patch di più mod si sommano, quindi due civiltà possono scegliere la propria tattica nello stesso momento.

Con `"ownAi": true` la mod deve includere tutti gli script di IA, perché quelli del gioco vedono la civiltà 10 e le loro tabelle non la conoscono.
Di norma lasci `"ai": true` e cambi solo la tattica.

## Il bioma

Su una mappa casuale, ciò che circonda la partenza di ogni giocatore (erba, sabbia, alberi, decorazioni) dipende dalla sua civiltà. La tua usa quello della
`base`, oppure quello che imposti in `biome`:

```json
{ "id": "dacia", "index": 10, "base": "Gaul", "biome": "Britain" }
```

Il gioco ha solo quattro biomi di terreno e alberi, quindi le civiltà li condividono a coppie:

| Terreno e alberi | Usato da |
|---|---|
| 1º | Galli e Roma imperiale |
| 2º | Roma repubblicana e Britannia |
| 3º | Cartagine ed Egitto |
| 4º | Iberia e Germania |

Gli oggetti della mappa (rovine, palme, rocce) distinguono invece tutte e otto le civiltà; Cartagine ed Egitto fanno da interruttore tra "deserto" e "temperato".
La città di partenza resta quella della base, a meno che tu non usi `template`. Un bioma del tutto personalizzato, con terreno nuovo, non è possibile.

## Cosa non puoi fare

- Partite contro l'IA fuori dalla stanza multigiocatore (scenari e campagne) con civiltà di una mod.
- Editor di mappe: le classi della tua civiltà compaiono mescolate a quelle delle cartelle della base.
- Nuovi script di IA senza includerli tutti (vedi *L'IA*).
