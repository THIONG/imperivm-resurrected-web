# Nuove unità

Parti dal [modello delle unità](templates/units), una mod vuota con le cartelle usate in questa guida.

Una nuova unità si compone di tre cose: una classe (le statistiche), un ordine per reclutarla in un edificio, e le sue immagini e i suoi testi. Sono tutti file della mod; non serve programmare.

Per impostazione predefinita l'unità riutilizza il modello e le animazioni di un'unità del gioco. Se vuoi una grafica tua, vedi [Grafica personalizzata](graphics.md): converti i tuoi PNG in `.rle` e genera il `.ent.xml`.

Esempio pronto da copiare: [`examples/unit-example`](examples/unit-example), il Veterano romano: più forte dell'hastatus, reclutato nella caserma di Roma repubblicana. Con sprite personalizzati: `examples/unit-graphics-example` (vedi [Grafica personalizzata](graphics.md)).

## Via rapida

Ti serve la cartella `DATA` del gioco ([`extract-data.js`](tools/extract-data.js)). Il Veterano dell'esempio nasce da:

```
node tools/create-unit.js <DATA> <mod folder> RVeteran --base RHastatus --health 260 --damage 20 --armor 14 --building RBarracks --gold-cost 180 --time 9000 --key v --name Veteran --name-es Veterano
```

Dentro la cartella della mod genera:

- `data\classes\RVeteran.sc.xml`: una copia completa della classe base, con il tuo id e le tue statistiche.
- `data\commands\RVeteran.xml`: l'ordine di reclutamento, copiato da quello della base.
- `loc\english.loc.xml` (e `spanish.loc.xml` con `--name-es`, `italian.loc.xml` con `--name-it`): nome, plurale e testo del pulsante. Se il file esiste già, aggiunge le voci.
- `mod.json`, solo se non c'era.

| Opzione | Cosa fa |
|---|---|
| `--base` | L'unità del gioco da copiare (obbligatoria). Accetta il suo id o il suo `altid` |
| `--health`, `--damage`, `--armor`, `--speed` | Statistiche. `--armor` imposta `armor_slash` e `armor_pierce`. Senza di esse, quelle della base |
| `--building` | Dove viene reclutata. Senza, dove viene reclutata la base (se sono diversi, quello della sua stessa civiltà) |
| `--gold-cost`, `--food-cost`, `--time` | Prezzo e tempo di reclutamento (in millisecondi) |
| `--key` | Il tasto del pulsante. Senza, una lettera del nome libera in quell'edificio |
| `--name`, `--plural` | Nome inglese. Il plurale viene dedotto; correggilo con `--plural` se è sbagliato |
| `--name-es`, `--plural-es`, `--name-it` | Nome spagnolo e italiano. `display_name` è la chiave del testo, cioè il nome inglese |

Se qualcosa non va (id duplicato, una base che non è un'unità, un edificio che non esiste) dice perché e non scrive nulla. Non sovrascrive nemmeno i file esistenti.

Limiti:

- Copia solo le unità che il gioco recluta con un ordine normale (`method="train"`). Le unità assoldate in gruppo (gladiatori, vichinghi…) restano escluse.
- Ritratto e pulsante sono quelli della base. Per averne di tuoi, vedi [Immagini](#3-images) e cambia i percorsi nella classe e nell'ordine.
- L'IA non recluterà l'unità.
- Fai passare il risultato dal [validatore](validating.md) con `--data`. Ciò che viene generato è identico all'esempio (tranne le immagini).

## Cosa fa dietro le quinte (farlo a mano)

Se preferisci scriverla tu, o ti serve qualcosa che lo strumento non copre, ecco che cosa genera.

## 1. La classe

`data\classes\RVeteran.sc.xml`. Parti da una copia completa di una classe simile del gioco, come `RHastatus.sc.xml`. Per vedere i file del gioco, estrai `data.pak` con [`extract-data.js`](tools/extract-data.js): `node extract-data.js "<game folder>" <output folder>` li mette in `<output folder>\DATA`. Cambia l'`id` e le statistiche:

```xml
<class id="RVeteran" cpp_class="CVXUnit" parent="Melee" entity="Units/RHastatus/RHastatus.ent.xml">
	<properties race="RepublicanRome"/>
	<properties maxhealth="260"/>
	<properties damage="20" armor_slash="14" armor_pierce="14"/>
	<properties speed="60"/>
	<properties unit_specials="Deflection"/>
	<properties icon="gameres/icons/RVeteran.bmp"/>
	<properties display_name="Veteran" display_name_plural="Veterans"/>
	...
</class>
```

- Copiala per intero; non farne una classe figlia (`parent="RHastatus"`). Il gioco non eredita dal genitore l'entità (`entity`, il modello) né i suoni, quindi una figlia senza `entity` propria compare senza modello e sparisce.
- `entity` punta al modello e alle animazioni. Qui sono quelli dell'hastatus.
- `race` è la civiltà: `RepublicanRome`, `Gaul`… oppure una della tua mod ([Civiltà](civilizations.md)).
- Le statistiche più comuni sono `maxhealth`, `damage`, `armor_slash`, `armor_pierce`, `speed`, `sight` e `range`. Che cosa fa ciascuna, e quali non servono a nulla, è spiegato in [Statistiche delle unità](stats.md). Un'unità copiata da una normale eredita `feeds=1` (mangia); le macchine d'assedio e le sentinelle del gioco lo impostano a 0.
- `unit_specials` sono le [specialità delle unità](specials.md), quelle del gioco e le tue.
- Non copiare l'`altid` dell'originale. È un alias che gli script usano per trovare il "soldato" di una civiltà; due classi con lo stesso alias si confondono.
- `edittree_pos` (per esempio `Units/Roman/Veteran`) è il punto in cui compare nell'editor di mappe e nel menu dei trucchi: una classe con una `entity` il cui `edittree_pos` inizia con `Units/` compare lì, nel gruppo della sua civiltà. Lo strumento lo copia dalla base e cambia l'ultimo nome.
- Un nuovo file in `data\classes\` si carica da solo. Non serve registrarlo.

## 2. L'ordine di reclutamento

`data\commands\Veteran.xml`. È una copia dell'ordine del gioco (`trainRHastatus`, in `data\commands\RBARRACKS.XML`) con classe e costo diversi. Il gioco carica ogni `.xml` in `data\commands`.

```xml
<cmd name="trainRVeteran" priority="3"
	button="actions/train RVeteran.bmp" queueicon="gameres/icons/RVeteran.bmp"
	key="v" costgold="180" costfood="0" costpop="1" execdelay="9000"
	rollover="Equip Veteran" method="train" param="RVeteran" sclass="RVeteran" ...>
	<src obj="RBarracks"/>
</cmd>
```

- `<src obj="RBarracks"/>` è l'edificio in cui compare il pulsante. Per un altro edificio, un'altra classe (`RBlacksmith`, `RArena`…).
- `param` e `sclass` sono la classe che viene reclutata. `costgold`, `costpop` ed `execdelay` (millisecondi) sono prezzo e tempo.
- `key` è il tasto. Compare in Controlli → Contenuti e si cambia da lì ([Tasti delle mod](keys.md)).
- Un nuovo edificio funziona allo stesso modo: una copia completa di una classe di edificio, più i suoi ordini con `<src obj="MyBuilding"/>`.

## 3. Immagini

Il pulsante è 153 x 51 e il ritratto 65 x 76. Costruiscili da un PNG con `tools/convert-image.js` ([Immagini personalizzate](images.md)). Senza immagini personalizzate, usa quelle dell'unità del gioco (`button="actions/train RHastatus.bmp"`, `icon="gameres/icons/RHastatus.bmp"`).

## 4. Testi

Il nome della classe e il testo del pulsante si traducono con un `loc\<language>.loc.xml` ([Lingue e testi](languages.md)):

```xml
<translationtableentry text="Veteran@RVeteran class name" result="Veterano"/>
<translationtableentry text="Veterans@RVeteran class name plural" result="Veteranos"/>
<translationtableentry text="Equip Veteran@trainRVeteran" result="Equipar veterano"/>
```

## Multigiocatore e limiti

- Classi e ordini fanno parte del gameplay: tutti i giocatori devono avere la stessa mod.
- L'IA non recluterà la tua unità a meno che tu non includa i tuoi script IA. Vedi [Civiltà](civilizations.md#the-ai).
- Un'unità di una nuova civiltà richiede anche i suoi edifici e i suoi ordini. Lo strumento di clonazione descritto in [Civiltà](civilizations.md) li genera.
