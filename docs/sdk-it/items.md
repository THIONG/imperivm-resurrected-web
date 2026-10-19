# Nuovi oggetti

Gli oggetti che gli eroi portano (amuleti, erbe, gemme…) sono dati. Il gioco ne include 42 in `data\items.xml` e una mod può aggiungerne di propri con una [patch](patches.md), senza compilare nulla.

Esempio pronto da copiare: [`examples/item-example`](examples/item-example).

## Metodo rapido

L'oggetto d'esempio, consegnato a ogni eroe, si ottiene con:

```
node tools/create-item.js <mod folder> "Example Amulet" --damage 10 --armor 5 --give-heroes
```

Dentro la cartella della mod genera:

- `patches\data\items.xml`: l'oggetto con tutti i suoi attributi. Se la patch esiste già, aggiunge l'oggetto in coda e lascia stare quelli presenti.
- Con `--give-heroes`: `patches\data\classes\Hero.sc.xml` (un behavior in più per la classe `Hero`) e `data\mod\dar_<id>.vs`, lo script che dà l'oggetto a ogni eroe che non lo ha ancora. Se `Hero.sc.xml` esiste già, ci aggiunge il suo contenuto.
- `mod.json`, solo se non ce n'era uno.

| Opzione | Cosa fa |
|---|---|
| `--health`, `--damage`, `--armor`, `--level`, `--experience` | Cosa aggiunge a chi lo porta. `--armor` imposta `armor_slash` e `armor_pierce` |
| `--icon` | Un'icona del gioco, per esempio `"gameres/icons/items/Belt of might.bmp"`. Se manca, l'icona dei denti d'orso |
| `--description` | Il testo nella finestra dell'oggetto. Se manca, uno in inglese come `Adds 10 to damage and 5 to armor` |
| `--give-heroes` | Ogni eroe riceve l'oggetto quando compare |
| `--data <DATA>` | Controlla che nessun oggetto del gioco usi già quell'id |

Se esegui di nuovo il comando con un altro id, aggiunge un altro oggetto. Se l'id esiste già nella tua patch o nel gioco, lo dice e non scrive nulla.

Non genera `use_script`, `equip_script` né `kill_script`, e nemmeno `usecount` o `cursed`: aggiungili a mano all'`<item>` ([Un oggetto con un effetto proprio](#an-item-with-its-own-effect)). Ciò che genera coincide con l'esempio.

## Cosa fa dentro (farlo a mano)

## Un oggetto

Una patch di `data\items.xml`, in `patches\data\items.xml` nella tua mod:

```xml
<patch>
  <add select="/items">
    <item id="Example Amulet"
          image="gameres/icons/items/Bear Teeth.bmp"
          sound="data/sound entities/ItemUse.xml"
          level="0"
          name="Example Amulet"
          description="Adds 10 to damage and 5 to armor"
          important="no">
      <bonus health="0" damage="10" armor_slash="5" armor_pierce="5" level="0" experience="0"/>
    </item>
  </add>
</patch>
```

| Attributo | Cosa fa |
|---|---|
| `id` | Il nome che usano gli script (`AddItem("…")`). Univoco |
| `image` | L'icona: una del gioco o una tua dentro `gameres/icons/items/` nella tua mod (un BMP) |
| `name`, `description` | Ciò che mostra la finestra dell'oggetto |
| `level` | Livello minimo dell'eroe per portarlo (nessun oggetto del gioco usa un valore diverso da 0) |
| `important` | `yes` o `no`. Indica se è un oggetto speciale (mostrato a parte) |
| `usecount` | Quante volte si può usare: `1` per gli oggetti monouso, di più per quelli a cariche (`1000` di cibo nel grano) |
| `cursed` | `1` se non si può rimuovere, `0` se si può. È un numero, non `yes`: il gioco lo legge come numero e qualsiasi testo vale 0, senza alcun avviso. |

`<bonus>` aggiunge a chi porta l'oggetto: `health`, `damage`, `armor_slash`, `armor_pierce`, `level` ed `experience`. Con `health_percent`, `damage_percent`, `armor_slash_percent` e `armor_pierce_percent` aggiunge una percentuale invece di un valore fisso.

`items.xml` accetta qualche altro attributo (`customdata`, `location_script`, `object_script`, `attacheddie_script`), non documentato; guarda come lo usano gli oggetti del gioco.

## Un oggetto con un effetto proprio

Uno script che parte quando l'eroe usa l'oggetto:

| Attributo | Quando parte | Firma |
|---|---|---|
| `use_script="file://data/mod/mi.vs"` | Quando il giocatore usa l'oggetto | `// void, Obj owner` |
| `equip_script` | Quando viene equipaggiato | Vedi quelli del gioco |
| `kill_script` | Quando chi lo porta uccide qualcuno con esso | Vedi quelli del gioco |

Scrivi il percorso con `file://`, come gli oggetti del gioco (`file://data/ItemScripts/….vs`).

Gli script del gioco sono in `data\ItemScripts`; per vederli, estrai i dati con [`extract-data.js`](tools/extract-data.js). Quello delle erbe curative:

```
//void, Obj owner

CreateFeedback("Heal", owner.AsUnit());
owner.Heal(owner.maxhealth);
ItemUsed(1);
```

`ItemUsed(n)` consuma `n` usi dell'oggetto. Con `usecount="1"` sparisce quando viene usato.

## Metterlo in una partita

- Dallo da uno script: `Obj::AddItem("id")` restituisce `true` se l'oggetto entra nell'inventario. L'esempio lo fa in un behavior sulla classe `Hero` (`patches\data\classes\Hero.sc.xml`), che parte per ogni eroe che compare. Controlla prima che l'eroe non lo abbia già (`FindItem("id").IsValid`): caricare una partita salvata fa ripartire lo script.
- Fallo cadere a ogni uccisione: un evento [`OnObjectKill`](scripts.md) che chiama `AddItem` sull'uccisore, oppure `DropItem` a terra.
- Nelle rovine e nei tesori della mappa: guarda `data\classes\BaseRuins.sc.xml`. Distribuisce oggetti con le righe `itemtype` e `levelperitem`. Nei dati del gioco nessun'altra classe lo usa, e nemmeno i negozi delle civiltà.

Gli oggetti cambiano il gameplay: in una partita online tutti i giocatori devono avere la stessa mod.
