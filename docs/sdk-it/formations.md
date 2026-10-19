# Nuove formazioni

Le formazioni degli eroi (Line, Front, Block, Cavalry) sono dati: un `formations.xml` con bonus e disposizione, e due ordini per formazione in `data\commands\Hero.xml`. Una mod aggiunge le sue con le [patch](patches.md), senza compilare nulla.

Esempio: [`examples/formation-example`](examples/formation-example) (il Cuneo).

## Metodo rapido

`create-formation.js` scrive tutti e tre i pezzi. Ti serve la cartella `DATA` del gioco ([Dati del gioco](README.md#game-data)):

```
node tools/create-formation.js <DATA> mods/my-mod Wedge --damage 3 --armor 1 --like "Cavalry core" --key i
```

| Opzione | Cosa fa |
|---|---|
| `<Name>` | Il `Name` della formazione: lettere e numeri, senza spazi. Deve essere nuovo |
| `--damage`, `--armor`, `--pierce-defense`, `--slash-defense`, `--range`, `--level` | I bonus (da -1000 a 1000). Se non ne indichi nessuno, la formazione cambia solo la disposizione |
| `--like` | La formazione del gioco da cui copiare elenco delle classi, dimensione, spaziatura e immagine del pulsante: `Front` (predefinita), `Line`, `Block`, `Cavalry core`, `Horse Wings`, `Ranged Wings` |
| `--classes "Unit=wings,Horse=front"` | Una disposizione tua, al posto di quella di `--like`. Gli slot sono `front`, `wings` e `center` |
| `--width`, `--height`, `--front`, `--wing-x`, `--wing-y` | `Width`, `Height` e le tre spaziature (`Offset…`) |
| `--key` | Il tasto che seleziona la formazione. Se manca, ne cerca uno libero |
| `--description`, `--button` | La `Description` (in inglese) e un pulsante diverso (`States/…`) |

Genera:

```
patches\data\formations.xml                     the formation
patches\data\commands\Hero.xml                  its two buttons, form-<name>-menu and form-<name>
patches\data\subai\hero_formation_verify.vs     the script patch
mod.json                                        only if the folder doesn't have one
```

Se la mod ha già un'altra formazione, la nuova viene aggiunta agli stessi file senza sovrascrivere la vecchia. Vale anche per la patch dello script: ogni formazione aggiunge il proprio `@replace`.

Controlla che il tasto sia libero per l'eroe, che eredita gli ordini di `Unit` e `Military`. Se c'è un conflitto, ti avvisa e genera comunque. Nel gioco è libera solo `i`, quindi la seconda formazione di una mod dovrà condividere un tasto: scegli una lettera e verifica che il conflitto non ti dia fastidio.

I pulsanti usano l'immagine della formazione di base. Per averne una tua, vedi [Immagini personalizzate](images.md) e passa `--button`.

## Cosa fa dentro (farlo a mano)

### I tre pezzi

**1. La formazione** (`patches\data\formations.xml`):

```xml
<patch>
  <add select="/Formations">
    <FormationClass Name="Wedge"
        Description="The warriors form a wedge with the cavalry at the point."
        Width="3" Height="1"
        BonusDamage="3" BonusArmor="1"
        OffsetFrontLineByY="40" OffsetWingsByX="30" OffsetWingsByY="0">
      <Class Name="Unit" Wings="1"/>
      <Class Name="Horse" FrontLine="1"/>
      <Class Name="BaseMage" CentralBlock="1"/>
      <Class Name="Peasant" CentralBlock="1"/>
    </FormationClass>
  </add>
</patch>
```

| Attributo | Cosa fa |
|---|---|
| `Name` | Il nome della formazione; gli ordini lo richiamano |
| `Description` | Non compare sul pulsante: il gioco mostra un testo fisso ("Army bonus during stand ground") con le icone dei bonus |
| `Width`, `Height` | Dimensione della griglia del gruppo in prima linea (`FrontLine`). Nel Cuneo, dove `Unit` va sulle ali, `Width=3` riguarda solo i cavalli |
| `BonusDamage`, `BonusArmor`, `BonusRange`, `BonusLevel` | Bonus all'esercito, solo mentre le truppe restano ferme ("stand ground"). Limitati a -1000..1000 |
| `BonusDefencePierce`, `BonusDefenceSlash` | Difesa contro perforazione e taglio, separate. `BonusArmor` le imposta entrambe insieme |
| `OffsetFrontLineByY`, `OffsetWingsByX`, `OffsetWingsByY` | A che distanza dall'eroe stanno la prima linea e le ali |
| `<Class Name="…" …/>` | Dove vanno le unità di quella classe: `FrontLine="1"` davanti, `Wings="1"` sui lati, `CentralBlock="1"` al centro, attorno all'eroe |

`BonusAttack` compare in una delle formazioni del gioco ma non fa nulla: non contarci.

**2. I pulsanti** (`patches\data\commands\Hero.xml`). Due ordini: `form-<name>-menu` (il pulsante che vedi quando quella è la formazione attuale) e `form-<name>` (quello che la seleziona). Entrambi hanno `param="<Name>"` e `menu="1"`. Copia `form-front-menu` e `form-front` e cambia `name`, `param`, `key` e `button` (l'immagine; vedi [Immagini](images.md)).

Il tasto non deve andare in conflitto con un altro ordine dell'eroe, e l'eroe eredita anche gli ordini di `Unit`. In `data\commands` (estrailo con `extract-data.js`, vedi [Patch](patches.md)) cerca `key="x"` in `HERO.XML` e `UNIT.XML`. L'esempio usa `i`, che non compare in nessuno dei due; `q`, per esempio, appartiene a `reveal`.

**3. Una patch per lo script che lascia passare i pulsanti** (`patches\data\subai\hero_formation_verify.vs`). Lo script del gioco ti lascia scegliere una formazione solo quando è aperto uno dei suoi quattro menu, indicati in un elenco. Aggiungi il tuo:

```
@replace if (cmd_name != "form-front-menu")
if (cmd_name != "form-front-menu")
	if (cmd_name != "form-wedge-menu")
@end
```

Se un'altra mod patcha la stessa riga per aggiungere un'altra formazione, le patch si sommano: ogni `@replace` riscrive la riga del gioco e lascia quella che hai aggiunto tu.

## Online

I bonus cambiano il gameplay: tutti i giocatori devono avere la stessa mod.
