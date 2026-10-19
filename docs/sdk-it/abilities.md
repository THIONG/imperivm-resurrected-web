# Abilità delle truppe

Qualsiasi unità, normale o eroe, può avere nuove abilità. Un'abilità è un ordine (il pulsante) più un metodo di classe (lo script che lo esegue), come quelle dei druidi e dei sacerdoti. Sono tutti file della mod.

Esempio pronto da copiare: [`examples/ability-example`](examples/ability-example), "Respiro" (tasto `Y`) per i soldati da mischia.

## Metodo rapido

`create-ability.js` scrive tutti e tre i pezzi. Ti serve la cartella `DATA` del gioco ([Dati del gioco](README.md#game-data)):

```
node tools/create-ability.js <DATA> mods/my-mod respiro --class Melee --key y --energy-cost 5 --name "Second wind" --name-es Respiro
```

| Opzione | Cosa fa |
|---|---|
| `--class` | La classe che riceve il pulsante. Va bene una classe base (`Melee`, `Military`, `Unit`) e le sue figlie la ereditano, oppure una specifica (`RHastatus`, `Hero`). Deve esistere nel gioco |
| `--key` | Una lettera |
| `--energy-cost` | Energia da 1 a 9. Se la indichi, lo script la scala già da solo |
| `--name`, `--name-es` | Il nome in inglese e in spagnolo. Senza `--name`, il pulsante mostra l'id |
| `--description`, `--description-es` | Il testo di aiuto in inglese e in spagnolo |
| `--button` | Un pulsante del gioco (`Actions/Mass Healing.bmp`, quello predefinito) o uno tuo ([Immagini personalizzate](images.md)) |

Genera:

```
data\commands\Respiro.xml              the command
patches\data\classes\Melee.sc.xml      the method on the class (added to an existing patch if there is one)
data\mod\respiro.vs                    the script, with the signature and energy charge; you write the body
loc\spanish.loc.xml                    the Spanish texts (added to any that exist)
mod.json                               only if the folder has none
```

Ti avvisa se il tasto è già usato da un altro ordine della stessa classe, di una classe madre o di una figlia, ed elenca quelli liberi. Genera comunque i file. Non sovrascrive nulla: se l'id esiste già nella tua mod o nel gioco, si ferma senza scrivere niente.

Poi scrivi il corpo di `data\mod\respiro.vs` ed esegui il [validatore](validating.md).

## Cosa fa dietro le quinte (farlo a mano)

### I tre pezzi

**1. L'ordine.** Un `<cmd>` in un nuovo file in `data\commands` (il gioco carica ogni `.xml` di quella cartella):

```xml
<cmd name="respiro" priority="10" offset="1"
	button="Actions/Mass Healing.bmp" key="y"
	rollover="Second wind" description="..."
	groupverifier="" groupdispatch="" voidgroupdispatch="1"
	coststamina="5">
	<src obj="Melee"/>
</cmd>
```

- `name` è il nome dell'ordine e anche il `sig` del metodo.
- `button` è l'immagine del pulsante: una del gioco o una tua ([Immagini personalizzate](images.md)).
- Gli `<src obj="…"/>` sono le classi che ricevono il pulsante. Una classe base va bene e le sue figlie la ereditano: `Melee` (mischia), `Military`, `Unit` (tutte) o una specifica (`RHastatus`). Attenzione a `Military`: include gli eroi, e il tasto `Y` è già usato dall'abilità `skill_battle_cry` dell'eroe. `Melee` non va in conflitto.
- `coststamina` è l'energia che costa. La barra `stamina` di un soldato del gioco è 10, quindi il 5 dell'esempio ne spende la metà. Il gioco non la scala da sé: lo fa il tuo script. Usa un valore da 1 a 9. Il tooltip mostra il costo come energia se è sotto 10 e come lealtà se è 10 o più.
- `key` è il tasto. Compare in Controlli → Contenuto e si cambia da lì ([Tasti delle mod](keys.md)).

**2. Il metodo.** Nella classe, con una [patch](patches.md) per non sostituire l'intero file. Va in `patches\data\classes\Melee.sc.xml`:

```xml
<patch>
  <add select="/class"><method sig="respiro" vs="data/mod/respiro.vs"/></add>
</patch>
```

Le classi figlie ereditano i metodi.

**3. Lo script.** `data\mod\respiro.vs`. Un ordine istantaneo riceve `// void, Obj me`, l'unità che lo esegue:

```
// void, Obj me

Unit this;
int cost;

this = me.AsUnit();
if (!.IsAlive)
	return;

cost = GetCmdStaminaCost("respiro");
if (.stamina < cost)
	return;
.SetStamina(.stamina - cost);
.Heal(60);
```

Gli ordini con bersaglio (un clic su un'altra unità) ricevono `// void, Obj This, Obj target`. Guarda come li gestisce il gioco in `data\subai\druid_*.vs` e `data\commands\DRUID.XML`. Tutte le funzioni sono elencate in [funciones-del-juego.txt](game-functions.txt).

### Nome e descrizione

L'ordine viene tradotto usando il suo nome come contesto. In un `loc\<language>.loc.xml` ([Lingue e testi](languages.md)):

```xml
<translationtableentry text="Second wind" context="respiro" result="Respiro"/>
<translationtableentry text="The soldier recovers 60 health (costs stamina)" context="respiro" result="El soldado recupera 60 de vida (gasta energía)"/>
```

Il `text` è il `rollover` e la `description` dell'ordine. [Nuove unità](units.md) mostra l'altra forma (`text="…@context"`); `languages.md` spiega che funzionano entrambe.

## Abilità passive

Un'abilità senza pulsante (cura quando uccidi, danno extra, un'aura…) non ha bisogno di un ordine. Usa un [evento](scripts.md) (`OnObjectKill`, `OnObjectDie`) o un `<behavior>` nella classe.

## Multigiocatore

Segui le regole di [Script](scripts.md#multiplayer): non leggere nulla di locale. Tutti i giocatori devono avere la stessa mod.

## Cosa non si può fare

- Creare nuove specialità native delle unità (`unit_specials`) o abilità degli eroi (`HeroSkills`) con un effetto proprio: l'effetto lo fornisce il gioco. Puoi usare e combinare le 25 che esistono. Gli ordini con script descritti sopra coprono quasi tutto il resto, e le specialità personalizzate delle unità seguono un'altra strada ([Specialità delle unità](specials.md)).
- Nuovi effetti visivi e suoni: riusa quelli del gioco.
