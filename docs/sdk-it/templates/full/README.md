# Modello completo

Tutte le cartelle che il gioco legge da una mod, ciascuna con una nota su cosa ci va dentro. Usalo quando la tua mod fa più cose; per una cosa sola, gli altri modelli sono più brevi:

| Cosa realizzi | Modello |
|---|---|
| Una mappa per schermaglia e multigiocatore | [scenario](../scenario) |
| Un'avventura o una campagna, con o senza video | [avventura](../adventure) |
| Una conquista, con o senza video | [conquista](../conquest) |
| Un'unità o un eroe | [unità](../units) |
| Una civiltà | [civiltà](../civilization) |
| Regole, statistiche, IA, modalità di vittoria, opzioni | [gameplay](../gameplay) |
| Musica, suoni, voci | [audio](../audio) |
| Il gioco in un'altra lingua | [traduzione](../translation) |
| Texture, sprite, icone, menu | [grafica](../graphics) |

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. Scegli `category` dall'elenco in [Pubblicare su GameBanana](../../publishing.md). `tags` serve solo per una mappa (giocatori) o per un'avventura, una traduzione o un pacchetto audio (lingua).
4. **Elimina ogni cartella che non usi.** Una cartella vuota con la sua nota è innocua, ma una che resta sotto `scenarios\`, `data\` o `patches\` fa sì che il gioco consideri la mod come gameplay: tutti i giocatori online dovrebbero averla.
5. Nelle cartelle che tieni, elimina la nota `PUT-YOUR-FILES-HERE.txt` quando aggiungi i tuoi file.

## Cartelle

| Cartella | Cosa contiene | Conta come gameplay |
|---|---|---|
| `data\classes\` | Classi di unità, edifici ed eroi (.sc.xml): nuove o copie di quelle del gioco. [guida](../../units.md) | sì |
| `data\commands\` | Ordini e i loro pulsanti (.xml). [guida](../../units.md) | sì |
| `data\GameScripts\` | Modalità di vittoria: un .vs per modalità. [guida](../../victory-modes.md) | sì |
| `data\BonusScripts\` | Bonus iniziali: NNN NAME.vs. [guida](../../bonuses.md) | sì |
| `data\mod\` | I tuoi script, richiamati da eventi e classi. [guida](../../scripts.md) | sì |
| `patches\data\` | Patch sui file del gioco, con lo stesso percorso e lo stesso nome. [guida](../../patches.md) | dipende dal file |
| `events\` | Script di evento: OnGameStart.vs, OnObjectDie.vs e così via. [guida](../../scripts.md) | sì |
| `civs\` | Nuove civiltà: <id>.json, uno per civiltà (index da 10 a 99). Le sue unità e i suoi edifici vanno in data/classes e i suoi ordini in data/commands; clone-civilization.js scrive tutto questo. [guida](../../civilizations.md) | sì |
| `specials\` | Nuove specialità delle unità: *.json. [guida](../../specials.md) | sì |
| `options\` | Interruttori della stanza: *.json. [guida](../../options.md) | sì |
| `scenarios\` | Mappe per schermaglia e multigiocatore (.bfhp). | sì |
| `adventures\` | Avventure (.bfhp e il .bmp con lo stesso nome). | sì |
| `conquests\` | Conquiste (.bfhp), con la loro cartella in conquestmaps. | sì |
| `conquestmaps\` | La cartella di ogni mappa di conquista: territories.xml e le sue immagini. | sì |
| `movies\` | Filmati (.avi) che una mappa riproduce con PlayMovie. | no |
| `music\` | Musica (.ogg), con lo stesso nome di quella del gioco per sostituirla. | no |
| `sounds\` | Suoni (.wav), con lo stesso percorso di quelli del gioco. | no |
| `loc\` | Testi: <language>.loc.xml. [guida](../../languages.md) | no |
| `units\` | Sprite delle unità (.rle) e file delle entità. Contano gli .xml e i .pass. [guida](../../graphics.md) | solo .xml e .pass |
| `buildings\` | Sprite degli edifici e file delle entità. Contano gli .xml e i .pass. [guida](../../graphics.md) | solo .xml e .pass |
| `mapobjects\` | File degli oggetti della mappa. Contano gli .xml e i .pass. | solo .xml e .pass |
| `visuals\` | Effetti e proiettili. Conta solo l'.xml. | solo .xml |
| `gameres\` | Immagini sciolte dell'interfaccia: icone e pulsanti. [guida](../../images.md) | no |
| `packs\` | Mappe (.bfhp) e pacchetti (.pak) montati accanto a quelli del gioco. | dipende dal contenuto |
| `randommap\` | Forme delle mappe casuali. [guida](../../random-maps.md) | sì |
| `randommapsettlements\` | Modelli di città e villaggio. [guida](../../city-templates.md) | sì |

La cartella `patches\` non è nel modello (un file di note lì dentro verrebbe segnalato come patch errata): creala con il percorso del file del gioco che modifichi. I file non elencati vanno nello stesso percorso che hanno nel gioco. Eseguibili e script di sistema non sono ammessi (`.exe .dll .asi .bat .cmd .com .scr .ps1 .vbs .js .msi .sys .cpl .lnk .reg .jar .hta .wsf .pif`): una mod che ne contiene uno non viene caricata. Il riferimento completo è [Riferimento](../../reference.md).

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
