# Avamposti ed edifici difensivi

"Avamposto" indica due cose diverse:

- Gli avamposti neutrali della mappa: i presidi sparsi sulla mappa che si conquistano ("Trade outpost", "Recruitment outpost"…). Una mod può aggiungerne di nuovi tipi con uno strumento, e compaiono da soli sulle mappe casuali.
- Gli edifici difensivi delle città: torri, mura e porte.

## Un nuovo avamposto neutrale

`tools/create-outpost.js` copia un avamposto del gioco con un nuovo id e nome e lo aggiunge alle mappe casuali. Ha bisogno della cartella `DATA`, che si ottiene con [`extract-data.js`](tools/extract-data.js) (`node extract-data.js "<game folder>" <output folder>`):

```
node create-outpost.js <output folder>\DATA <mod folder> ArcherFort IOutpost "Archer fort"
```

Scrive la classe (`data\classes\ArcherFort.sc.xml`), la patch `data\randommap\placeobjects.xml` che lo aggiunge a tutte e tre le dimensioni di mappa (con le quantità della base) e il nome in spagnolo. Con `GOutpost`, `TOutpost` o `ROutpost` come base scrive anche `patches\data\commands\*.xml`, così il nuovo avamposto riceve gli ordini del presidio (vendere cibo, interessi).

Le basi possibili:

| Base | Tipo |
|---|---|
| `GOutpost`, `TOutpost` | Avamposto commerciale |
| `ROutpost`, `EOutpost` | Avamposto dell'oro (interessi) |
| `IOutpost`, `BOutpost` | Avamposto di addestramento |
| `COutpost` | Avamposto di reclutamento |

Poi modifica la classe come preferisci: `maxhealth`, la guarnigione (`defender_cls_1`, `defenders_max_1`, `start_level_1`…), il suo comportamento (`<behavior script=…>`), quanto costa conquistarlo. Esempio: [`examples/outpost-example`](examples/outpost-example).

Per cambiare quanti ne compaiono, modifica `min` e `max` nelle righe della patch (quanti ne piazza il generatore per mappa). `mindist` è la distanza minima tra avamposti, in pixel. Gli altri numeri sono quelli del gioco.

Il modello (`entity`) e l'icona sono quelli della base. Per un modello con sprite personalizzati vedi [Grafica personalizzata](graphics.md): ha una sezione sugli edifici.

## Torri, mura, porte e presidi

Sono classi di edifici come le altre. Cosa conviene sapere prima di aggiungerne di tuoi:

- Un insediamento (città, villaggio, presidio) è un gruppo di edifici con un proprietario, popolazione, oro e cibo. Il suo tipo dipende dalla classe dell'edificio centrale: `BaseTownhall` è una città, `BaseVillage` un villaggio, `Outpost` un presidio.
- Il gioco base non permette di costruire edifici. Non c'è un ordine di costruzione (solo per navi e macchine d'assedio). Torri, mura, porte e presidi vengono dalla mappa: il modello di città, i presidi della mappa casuale, gli scenari e l'editor.
- I modelli di città nominano classi specifiche (`GTownhall`, `GTower01`, `GWallsN`, `GGateNW`…). Una nuova civiltà usa le proprie se cloni quelle con lo strumento descritto in [Civiltà](civilizations.md).

| Classe base | Cos'è |
|---|---|
| `Tower` (`CVXBuilding`) | Torre. I suoi ordini (`Tower Attack`, riparazione) dipendono da `Tower`, e una figlia li eredita |
| `Wall` (`CVXBuilding`) | Muro. `num_sentry_slots` e `sentry_class_name` stabiliscono quante sentinelle lo pattugliano e di quale classe |
| `Gate` (`CVXGate`) | Porta: apri, chiudi, permanente, ripara |
| `Outpost` (`CVXTownHall`) | Base dei presidi avanzati. Quelli specifici (`GOutpost`, `GGuardPost`…) usano `CVXOutpost` e dipendono da `Outpost`: sono indipendenti finché non vengono conquistati e ognuno fa qualcosa tramite uno script (vendere cibo, interessi, esperienza…) |
| `GGuardPost` | Posto di guardia, solo dei Galli: 12 sentinelle tramite script. Non è in `placeobjects.xml`, e `create-outpost.js` lo segnala |

Per una nuova classe: un `.sc.xml` in `data\classes\` con `parent=` una di quelle sopra, un `cpp_class` che esista già (`CVXBuilding`, `CVXGate`, `CVXOutpost`, `CVXTownHall`) e la sua `entity`. Copia l'`entity` dalla classe della base, perché il gioco non la eredita dalla madre. Il comportamento personalizzato va in `<behavior>` e `<method sig="…" vs="…">`, e gli ordini in `<cmd>`, come in [Abilità](abilities.md). Un tipo di edificio con un nuovo `cpp_class` non è possibile.

## Dove piazzarlo

| Posto | Come |
|---|---|
| Mappa casuale | Aggiungilo a `placeobjects.xml`, che è ciò che fa `create-outpost.js` |
| Città o villaggio iniziale di una civiltà | Le classi clonate compaiono da sole nella città iniziale. Per cambiare la disposizione, vedi [Modelli](city-templates.md) |
| L'editor di mappe | Con `edittree_pos` nella classe. L'editor ha cartelle fisse per civiltà: quelle di una nuova civiltà compaiono mescolate con quelle della sua base |
| Una mappa fatta a mano | Piazzalo con l'editor e la mappa indica la classe (serve la mod) |

## Multigiocatore e limiti

Cambia il gameplay: tutti i giocatori devono avere la stessa mod.

- L'editor non ha cartelle personalizzate né set di mura.
