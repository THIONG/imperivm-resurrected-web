# Pubblicare una mod su GameBanana

Le mod di Imperivm Resurrected si pubblicano su https://gamebanana.com/games/26069. La scheda **Sfoglia contenuti** del gestore dei contenuti legge quella pagina: cerca, filtra, apre la pagina di una mod e la installa con un clic. Perché la tua mod compaia nel tipo e nei filtri giusti, segui questi passi.

## Prima di caricare

1. Imposta la categoria nel tuo `mod.json` (una di quelle della tabella qui sotto) e, se serve, i suoi [tag](#tags): altre categorie se la mod fa più cose, i giocatori se è uno scenario e la lingua se è un'avventura, una traduzione o un pacchetto audio:

   ```json
   {
     "id": "duel-on-the-nile",
     "name": "Duel on the Nile",
     "version": "1.0",
     "authors": ["Your name"],
     "category": "Scenarios",
     "tags": ["Players: 2"]
   }
   ```

2. Passala dal [validatore](validating.md). Ti avvisa se la categoria non è una di quelle che il gioco riconosce o usa un nome vecchio, se un tag è scritto male, se uno scenario non ha il tag dei giocatori e se un'avventura, una traduzione o un pacchetto audio non ha il tag della lingua.

3. Comprimi in zip la cartella della mod, con il suo `mod.json` dentro. Non includere eseguibili né script di sistema (`.exe .dll .asi .bat .cmd .com .scr .ps1 .vbs .js .msi .sys .cpl .lnk .reg .jar .hta .wsf .pif`): una mod che ne contiene anche uno solo non viene caricata.

## Su GameBanana

1. Vai su **Add → Mod** dalla pagina del gioco (`https://gamebanana.com/mods/add?_idGameRow=26069`). L'audio fa eccezione: va in **Add → Sound** (`https://gamebanana.com/sounds/add?_idGameRow=26069`). Ciò che viene caricato come Tool o Script non compare nel gioco.
2. **Category**: la stessa del tuo `mod.json`.
3. **Tags**: gli stessi tag. Ognuno ha un titolo e un valore: in `Type: Civilizations` il titolo è `Type` e il valore `Civilizations`. Non devi crearli prima: si scrivono in ogni mod.
4. **Files**: il tuo `.zip` e, nel campo **Version**, la stessa versione di `mod.json`. Ogni nuova versione è un nuovo file: non sostituire il vecchio, perché chi gioca online con la versione precedente ne ha ancora bisogno.
5. **Requirements**: se la tua mod ne richiede un'altra, collega la sua pagina (`https://gamebanana.com/mods/...`, oppure `https://gamebanana.com/sounds/...` per l'audio). Il gioco la installa insieme alla tua.
6. Almeno una schermata. La prima è l'immagine mostrata nel gioco.
7. Per il changelog, pubblica un **Update** con la versione come titolo (per esempio `1.1`). Il gioco lo mostra accanto a quella versione.

Solo chi ha installato la mod da Sfoglia contenuti (che scrive `sources.gamebanana` nel suo `mod.json`, o `sources.gamebananaSound` se viene da Sounds) riceve l'avviso di nuova versione, oppure chi ha una mod con lo stesso `id` della scheda. Chi scarica lo zip a mano e lo decomprime non riceve alcun avviso.

## Categorie

**In breve:** su GameBanana scegli **una sola categoria**, quella che descrive meglio la mod nel suo insieme. Tutto il resto che la mod porta va nei **tag** `Type`, `Players` e `Language`: aggiungi tutti quelli che valgono, e solo quelli.

GameBanana ne consente una sola per mod: scegli quella a cui la mod contribuisce di più. Se la tua fa di più, per esempio una mod grande che porta civiltà e mappe, aggiungi le altre con i tag `Type` (vedi [Tag](#tags)) e comparirà in tutte. Sono nove, divise nei tre tipi che il gioco distingue. Il tipo non lo decide la categoria ma i file della mod (vedi [Che cosa conta come gameplay?](README.md#what-counts-as-gameplay)); la categoria è il modo in cui la gente la trova in Sfoglia contenuti.

| Categoria | Nel gioco | Cosa ci va | Dove vanno i file | Esempio |
|---|---|---|---|---|
| **Cambiano il gameplay** | | *Devono averle tutti online* | | |
| **Gameplay & Balance** | Gameplay & Balance | Regole, statistiche, costi, IA; anche mod grandi che cambiano tutto il gioco | `data\`, patch | [patches-example](examples/patches-example), [scripts-example](examples/scripts-example), [custom-orders](examples/custom-orders) |
| **Units & Heroes** | Units & Heroes | Unità ed eroi nuovi o modificati | `data\classes\`, `specials\` | [ability-example](examples/ability-example), [specialty-example](examples/specialty-example) |
| **Civilizations** | Civilizations | Civiltà nuove o rielaborate | `civs\`, `data\` | [civilization-example](examples/civilization-example) |
| **Contenuti da giocare** | | *Servono solo a chi li gioca* | | |
| **Scenarios** | Scenarios | Mappe per schermaglia e multigiocatore | `scenarios\MyMap.bfhp` | [random-map-example](examples/random-map-example) |
| **Adventures** | Adventures | Grandi battaglie, sfide e campagne per giocatore singolo, con una storia e degli obiettivi | `adventures\` | |
| **Conquests** | Conquests | Mappe e partite di conquista | `conquests\` | |
| **Estetiche** | | *Ogni giocatore ha le sue* | | |
| **Graphics** | Graphics | Texture, aspetto delle unità, terreno, menu, icone, caratteri | i percorsi dei pacchetti del gioco, `menuini\` | |
| **Audio & Voices** | Audio & Voices | Musica, suoni e voci. Si pubblica nella sezione **Sounds** di GameBanana, non in Mods | `sounds\`, `currentlang\voices\` | |
| **Translations** | Translations | Il gioco o una mod in un'altra lingua, testi modificati | `loc\` | [french-language](examples/french-language), [custom-texts](examples/custom-texts) |

Ogni categoria ha un [modello](templates) con la sua struttura di cartelle. Per [scenari, avventure e conquiste](maps.md) e per l'[audio](audio.md) ci sono anche brevi guide.

**Mappe sciolte.** Se lo `.zip` contiene solo il `.bfhp`, senza cartelle, il gioco lo colloca da sé durante l'installazione, in base al tipo che la mappa stessa dichiara (quello scelto dal suo autore nell'editor): un'avventura va in `adventures\` (con il suo `.bmp` dello stesso nome), una conquista in `conquests\` e una mappa di schermaglia in `scenarios\`, oppure in `adventures\` se la categoria è Adventures (missioni per giocatore singolo fatte come mappa normale). Meglio comunque caricarla già dentro la sua cartella; il [validatore](validating.md) avvisa quando una mappa è in quella sbagliata, per esempio un'avventura in `scenarios\`, che l'elenco degli scenari non mostra.

**Anteprima dello scenario.** Quando si sceglie uno scenario nella stanza, il gioco disegna un'anteprima a partire dal terreno della mappa, con i suoi giocatori e le loro civiltà, e da dove proviene: non devi caricare nessuna immagine. I colori vengono dalle tessere della minimappa del gioco, quindi un terreno nuovo appare corretto se porta la sua tessera in `minimapzoom8\terrain`.

**Nomi vecchi.** Scenarios, Adventures e Conquests prendono il nome dalle cartelle del gioco (`scenarios\`, `adventures\`, `conquests\`). Prima si chiamavano **Maps**, **Campaigns** e **Conquest**: un `mod.json` con quei nomi, o con `Interface` o `Total Conversions`, funziona ancora, ma il validatore chiede il nome nuovo.

## Tags

Ogni tag ha un titolo e un valore. Il gioco ne usa tre:

| Tag | A cosa serve | Esempio |
|---|---|---|
| `Type: <category>` | Altre categorie, oltre a quella principale. Un tag per categoria | `Type: Civilizations`, `Type: Scenarios` |
| `Players: <players>` | Giocatori di uno scenario, da 2 a 8. Puoi aggiungerne più di uno | `Players: 4`, `Players: 2-4` |
| `Language: <language>` | Lingua di un'avventura, di una traduzione o di un pacchetto audio: `Spanish`, `English`, `Italian`, `German`, `French`, `Polish` o `Multilingual`. Puoi aggiungerne più di una | `Language: English` |

Scrivili esattamente come indicato, in inglese, nei `tags` del tuo `mod.json` (per esempio `"tags": ["Type: Scenarios", "Players: 2-4"]`) e nel campo **Tags** di GameBanana: il gioco li mostra nella lingua di ciascun giocatore. Usa solo questi tre: il gioco non ne usa altri e il validatore ti avvisa se ce n'è qualcun altro.

Uno scenario senza `Players` non compare quando si filtra per giocatori, e un'avventura, una traduzione o un pacchetto audio senza `Language` non compare quando si filtra per lingua. Lo stesso vale per le categorie in `Type`: una mod con `Type: Scenarios` ha bisogno di `Players` per comparire quando si filtra per giocatori.

Le forme senza titolo delle versioni precedenti (`4 players`, `Spanish`) funzionano ancora, ma il validatore chiede quella nuova. I tag `Gameplay`, `Cosmetic` e `Online tested` non servono più: se una mod cambia il gameplay, il gioco lo capisce dai suoi file.

## Mod create prima di Imperivm Resurrected

Le vecchie mod si installavano copiandole sopra il gioco: contengono interi pacchetti `.pak` che sostituiscono quelli del gioco, e la maggior parte del contenuto sono file del gioco intatti. Convertile in modo che contengano solo ciò che cambiano o aggiungono:

```
node tools/shrink-mod.js <old mod> <game folder> <new folder> --id my-mod --name "My mod" --version 1.0 --category "Gameplay & Balance"
```

Lo strumento calcola ciò che il gioco vede con la mod copiata sopra e ciò che vede senza, e conserva solo la differenza:

- Dei pacchetti, i file che differiscono da quelli del gioco, mantenendone l'ordine (in una cartella vince il pacchetto con il nome maggiore, come `zzMod.pak` su `Data.pak`).
- I testi e i suoni di ogni lingua in `Local\<language>\` (o in `currentlang\` se sono uguali in tutte), e il resto di un pacchetto di lingua in `Local\<language>.pak`.
- Ciò che la vecchia mod ha tolto al gioco sostituendone i pacchetti, in `hidden.txt`, così che il gioco non lo veda nemmeno.
- `data\const.ini` come patch e senza la sezione `[Resolutions]`: la risoluzione la sceglie il giocatore nelle opzioni.
- Se la mod include un proprio `rle.mmp`, solo ciò che cambia o aggiunge rispetto a quello del gioco, in `rle.mmp.tail`; quello del gioco resta com'è.
- Lascia fuori le copie `.bak`, `Config.ini` e `Settings.ini` (impostazioni di installazione) e gli eseguibili, con i quali la mod non verrebbe caricata.

Opzioni:

- `--exclude <patterns>` lascia fuori altri file della vecchia mod, come le guide all'installazione (percorsi con `*` e `?`, separati da virgole).
- `--hide <patterns>` nasconde file sciolti del gioco che il readme della vecchia mod diceva di eliminare (per esempio `currentlang/*,units/*`).
- `--paths`, al posto della cartella di output, mostra soltanto quali cartelle ci sono dentro i pacchetti, senza scrivere nulla.

La cartella di output deve essere vuota. Se la vecchia mod ha già un `mod.json`, lo strumento lo conserva, tranne `sources` (da dove si scarica la mod originale), così che gli avvisi di versione non puntino alla pagina di qualcun altro. Alla fine indica cosa ha lasciato fuori e cosa nasconde.

Provala nel gioco prima di caricarla.
