# SDK di Imperivm Resurrected

Imperivm Resurrected è una mod per Imperivm HD (Great Battles of Rome) che apre il gioco a mod prima impossibili: nuove civiltà, abilità, oggetti, modalità di vittoria, lingue, script che reagiscono a ciò che succede in partita e altro. Qui trovi le guide e gli strumenti per crearle. Ogni guida ha una mod di esempio in [`examples/`](examples).

## Da dove iniziare

1. Installa Imperivm Resurrected: copia il suo contenuto nella cartella del gioco (`...\steamapps\common\Imperivm - Great Battles of Rome HD`) e avvia il gioco da Steam.
2. Copia una cartella di [`templates/`](templates) in `mods\`, dentro la cartella del gioco: ha la struttura esatta che il gioco si aspetta per quello che vuoi creare (vedi [Modelli](#templates)). Per vedere una mod finita, copiane una da [`examples/`](examples), per esempio `patches-example`.
3. Nel menu principale clicca **Contenuti aggiuntivi** e attiva la mod nel tuo profilo.
4. Riavvia il gioco se non si è riavviato da solo.
5. Apri `Logs\imperivm\imperivm-mod.log`, nella cartella del gioco. Elenca gli errori della tua mod e ciò che ha caricato.

Prima di avviare il gioco, passa la mod nel [validatore](validating.md).

## Com'è fatta una mod

Una cartella dentro `mods\` con un `mod.json` e i file che modifica o aggiunge, con gli stessi percorsi del gioco:

```
mods\
  my-mod\
    mod.json
    data\classes\MyUnit.sc.xml       <- new file, or one that replaces the game's
    loc\english.loc.xml              <- texts added to the game's
```

## Modelli

Un modello è una mod vuota con le cartelle che il gioco legge, un `mod.json` valido e un README con i passaggi. Copia quello che corrisponde a ciò che crei, rinominalo, compila `mod.json` e metti i tuoi file dove indicano le note. Ogni cartella vuota contiene una nota `PUT-YOUR-FILES-HERE.txt`: eliminala quando aggiungi i tuoi file.

| Cosa crei | Modello | Guida |
|---|---|---|
| Una mappa per schermaglia e multigiocatore | [`scenario`](templates/scenario) | [Mappe](maps.md) |
| Un'avventura o una campagna, con o senza video | [`adventure`](templates/adventure) | [Mappe](maps.md) |
| Una conquista, con o senza video | [`conquest`](templates/conquest) | [Mappe](maps.md) |
| Un'unità o un eroe | [`units`](templates/units) | [Nuove unità](units.md) |
| Una civiltà | [`civilization`](templates/civilization) | [Civiltà](civilizations.md) |
| Regole, statistiche, IA, modalità di vittoria, opzioni | [`gameplay`](templates/gameplay) | [Patch](patches.md), [Script](scripts.md) |
| Musica, suoni, voci | [`audio`](templates/audio) | [Audio](audio.md) |
| Il gioco in un'altra lingua | [`translation`](templates/translation) | [Lingue](languages.md) |
| Texture, sprite, icone, menu | [`graphics`](templates/graphics) | [Grafica personalizzata](graphics.md) |
| Più di una delle precedenti | [`full`](templates/full) | [Riferimento](reference.md) |

Non includere eseguibili né script di sistema (`.exe .dll .asi .bat .cmd .com .scr .ps1 .vbs .js .msi .sys .cpl .lnk .reg .jar .hta .wsf .pif`). Se ce n'è uno, la mod non viene caricata. Conta anche un `.js` dimenticato, per esempio un generatore tuo.

## `mod.json`

```json
{
  "id": "my-mod",
  "name": "My mod",
  "version": "1.0",
  "authors": ["Me"],
  "description": "What my mod does.",
  "category": "Gameplay & Balance",
  "redistributable": true
}
```

| Campo | A cosa serve |
|---|---|
| `id`, `name`, `version`, `authors`, `description` | La scheda della mod nel gestore dei contenuti. `name` e `description` accettano un solo testo oppure un oggetto con un testo per lingua (si mostra quello della lingua del gioco; se manca, l'inglese; se manca anche quello, il primo). |
| `category`, `tags` | La categoria principale di GameBanana e i tag: altre categorie (`Type`), giocatori (`Players`) e lingua (`Language`). Vedi [Pubblicare su GameBanana](publishing.md). |
| `redistributable` | Con `true`, l'host della stanza può inviare la mod ai giocatori che non ce l'hanno. Il valore predefinito è `false`. |
| `license` | Testo libero con la licenza. |
| `requires` | Le mod di cui ha bisogno: un elenco di id, oppure di oggetti `{"id": "...", "version": "..."}`. |
| `incompatibleWith` | Elenco di id di mod con cui non può essere attivata. |
| `loadAfter`, `loadBefore` | Cosa chiedi all'[ordine di caricamento](reference.md#1-mod-structure), per id; il resto lo decide il gioco. Con `loadAfter`, la tua mod va sopra quella indicata: vincono i suoi file, le sue patch e i suoi testi (tranne quando l'altra mod fornisce un file sciolto e il tuo sta dentro un `.pak`: vince quello sciolto). |
| `sources` | `{"url": "...", "gamebanana": 123456}`. Lo scrive il gioco quando installi da Sfoglia contenuti; serve a segnalare le nuove versioni. Se arriva dalla sezione Sounds, il numero è in `gamebananaSound`. |
| `language` | Dichiara una nuova lingua. Vedi [Lingue](languages.md). |
| `commands` | Nome di ciascun file di ordini nella schermata Controlli. Vedi [Tasti delle mod](keys.md). |

> Fino alla 0.31.50 i nomi di questi campi erano in spagnolo (`nombre`, `autores`, `descripcion`, `etiquetas`, `categoria`, `redistribuible`, `licencia`, `requiere`, `incompatibleCon`, `cargarDespuesDe`, `cargarAntesDe`, `fuentes`, `idioma`, `ordenes`…). Quelli vecchi vengono ancora letti, ma scrivi quelli nuovi.

## Guide

- [Lingue e testi](languages.md): modifica i testi del gioco o aggiungi una lingua senza sostituire l'intero file.
- [Tasti delle mod](keys.md): come compaiono gli ordini della tua mod in Controlli e come darne il nome.
- [Patch](patches.md): modifica una parte di un XML, INI o script del gioco senza sostituirlo; due mod possono toccare lo stesso file.
- [Script](scripts.md): script `.vs`, eventi e funzioni `Mod_...`.
- [Civiltà](civilizations.md): dichiara una nuova civiltà o clona una del gioco, con la sua IA, e giocala nella stanza.
- [Modelli di città e villaggio](city-templates.md): la città e il villaggio iniziali propri di una civiltà della mod (`create-template.js`).
- [Nuove unità](units.md): classe, ordine di reclutamento, immagini e testi, riuso del modello di un'altra unità.
- [Statistiche delle unità](stats.md): quale attributo fa cosa, quali non fanno nulla e quali bloccano il gioco.
- [Specialità delle unità](specials.md): nuove specialità delle unità e il loro effetto tramite script.
- [Abilità delle truppe](abilities.md): nuove abilità per unità o eroi (un ordine con pulsante e tasto, più un metodo di script).
- [Nuovi oggetti](items.md): amuleti, erbe e gemme degli eroi.
- [Nuove formazioni](formations.md): formazioni degli eroi con i loro bonus e il pulsante.
- [Avamposti ed edifici](outposts.md): nuovi avamposti neutrali nelle mappe casuali (`create-outpost.js`) e classi di torri, mura e porte.
- [Modalità di vittoria](victory-modes.md): uno script in `data\GameScripts` aggiunge una modalità al menu a tendina "Mode" della stanza.
- [Bonus iniziali](bonuses.md): gli script in `data\BonusScripts` aggiungono scelte alla colonna "Bonus" della stanza.
- [Opzioni di partita personalizzate](options.md): nuovi interruttori nelle regole della stanza, che gli script leggono con `Mod_GetOption`.
- [Scenari, avventure e conquiste](maps.md): i tre tipi di mappa, i file che servono a ciascuno e i filmati.
- [Musica, suoni e voci](audio.md): sostituisci o aggiungi audio.
- [Tipi di mappa casuale](random-maps.md): un disegno a quattro colori diventa un nuovo tipo di mappa (`create-random-map.js`).
- [Immagini personalizzate](images.md): pulsanti degli ordini e icone delle unità a partire da un PNG.
- [Grafica personalizzata](graphics.md): sprite personalizzati per unità ed edifici (`convert-sprite.js`, `create-entity.js`, `read-rle.js`).
- [Validare una mod](validating.md): controlla una mod senza aprire il gioco, con file e riga di ogni problema.
- [Pubblicare su GameBanana](publishing.md): categorie, tag, caricamento e mod create prima dell'SDK.
- [Riferimento](reference.md): l'elenco completo di ciò che una mod può dichiarare (file, campi, patch, eventi, funzioni e limiti).

## Strumenti

Si trovano in `tools\` e richiedono [Node.js](https://nodejs.org). Apri un terminale in questa cartella ed eseguili da qui (`node tools\validate-mod.js ...`). Ognuno spiega come si usa se lo lanci senza argomenti, e la guida dell'argomento ha degli esempi.

| Vuoi... | Usa |
|---|---|
| Una nuova unità | `create-unit.js` ([guida](units.md)) |
| Un nuovo oggetto | `create-item.js` ([guida](items.md)) |
| Una nuova abilità | `create-ability.js` ([guida](abilities.md)) |
| Una nuova formazione | `create-formation.js` ([guida](formations.md)) |
| Un'opzione di partita | `create-option.js` ([guida](options.md)) |
| Una nuova civiltà | `clone-civilization.js` ([guida](civilizations.md)) |
| La città e il villaggio propri di una civiltà | `create-template.js` ([guida](city-templates.md)) |
| Un avamposto neutrale | `create-outpost.js` ([guida](outposts.md)) |
| Un tipo di mappa casuale | `create-random-map.js` ([guida](random-maps.md)) |
| Pulsanti e icone da un PNG | `convert-image.js` ([guida](images.md)) |
| Sprite da PNG e il file entity di un'unità o di un edificio | `convert-sprite.js`, `create-entity.js`, `read-rle.js` ([guida](graphics.md)) |
| Ridisegnare gli sprite di `unit-graphics-example` | `draw-soldier.js` ([esempio](examples/unit-graphics-example)) |
| Controllare una mod senza aprire il gioco | `validate-mod.js` ([guida](validating.md)) |
| Adattare una mod creata prima dell'SDK | `shrink-mod.js` ([guida](publishing.md)) |
| Estrarre i dati del gioco | `extract-data.js` (sotto) |

## Dati del gioco

Vari strumenti chiedono la cartella `DATA` del gioco. `extract-data.js` la estrae (serve [Node.js](https://nodejs.org)):

```
node tools/extract-data.js "<game folder>" <output folder>
```

Lascia `data.pak` in `<output folder>\DATA`. È la cartella che chiedono `clone-civilization.js`, `create-outpost.js` e `validate-mod.js --data`.

## Cosa conta come gameplay?

In multigiocatore tutti devono usare le stesse mod se queste cambiano ciò che succede in partita. Il gioco lo deduce dalle cartelle che la tua mod tocca: `data/`, `scenarios/`, `adventures/`, `conquests/`, `civs/`, `specials/`, `events/`, `options/`, `rules/`, `modes/`, `randommap/`, `randommapsettlements/`, i file `.xml` e `.pass` in `units/`, `buildings/` e `mapobjects/`, i file `.xml` in `visuals/`, le mappe `.bfhp` in `packs/` e le patch (a seconda del file che modificano).

Grafica, suoni, testi (`loc/`) e lingue non contano: ogni giocatore può usare i propri.

## Se qualcosa non funziona

Gli errori della tua mod compaiono sulla sua scheda nel gestore dei contenuti e in `Logs\imperivm\imperivm-mod.log`. Ogni riga del log ha l'ora, un livello (`I` informazione, `W` avviso, `E` errore) e un tag che indica la parte della mod da cui proviene: `patch`, `language`, `civilizations`, `specials`, `script`, `event`. Guarda prima le righe `W` ed `E` dei tag della tua mod.

Il log conserva le ultime cinque sessioni (da `imperivm-mod.1.log` a `imperivm-mod.4.log`) e, se il gioco si è chiuso in modo anomalo, `imperivm-mod.crashed.log`. Per avere più dettagli su una parte, metti il suo tag e un livello sotto `[Debug]` in `imperivm-mod.ini`, per esempio `LogChannels=patch:debug`; `LogLevel=debug` lo fa per tutto.

Per chiedere aiuto, clicca il cuore in basso a sinistra nel menu principale e poi **Crea report**. Genera uno zip con i log e i dati del tuo sistema, senza il nome utente di Windows, gli ID di Steam né gli indirizzi IP, e non invia nulla: decidi tu se condividerlo.

## Versione e licenza

La versione dell'SDK e le modifiche di ciascuna sono in [Modifiche](CHANGELOG.md). La licenza è in [Licenza](LICENSE.md).
