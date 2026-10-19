# Statistiche di unità ed edifici

Tutto ciò che non ha un'etichetta viene direttamente dai dati del gioco. *(dedotto)* è un'ipotesi su come il gioco usa quel valore, e *(parziale)* è la meno affidabile.

Le statistiche sono attributi di `<properties>` nella classe (`data\classes\<Class>.sc.xml`). Per modificarle senza copiare l'intera classe usa una [patch](patches.md); per creare un'unità vedi [Nuove unità](units.md).

```xml
<patch>
  <!-- Legionaries run faster: speed 60 -> 75 -->
  <set select="/class/properties[@speed]" speed="75"/>
</patch>
```

Va in `patches\data\classes\RHastatus.sc.xml`. Un attributo che la classe non imposta viene ereditato dalla classe padre.

## Quale attributo fa cosa

| Voglio cambiare… | Attributo | Note |
|---|---|---|
| Velocità di movimento | `speed` | L'animazione della camminata si adatta da sola (dedotto) |
| Cadenza di attacco | nessun attributo | Durata dell'animazione di attacco, oppure `SetSpeedFactor` da uno script |
| Gittata degli arcieri | `range` | |
| Gittata minima (catapulte) | `min_range` | |
| Dimensione reale (hitbox) | `radius` | Collisioni, percorsi e gittata (dedotto) |
| Area di clic | `selection_radius` | Estetico (dedotto) |
| Danno | `damage` | |
| Armatura | `armor_slash` | `armor_pierce` non fa nulla (parziale) |
| Salute | `maxhealth` | |
| Vista | `sight` | |
| Cosa viene attaccato per primo | `target_factor` | |
| Proiettili | `projectile_class` | Con dei limiti, vedi *Gittata* |

### Velocità (`speed`)

- Unità di mappa al secondo. Nel gioco: fanteria 60-80, arcieri 60-160, cavalleria 130-190, eroi 120, arieti 40, navi 240.
- Il ciclo dell'animazione della camminata dura `step × 1000 / speed` millisecondi, con `step` preso dal `.ent.xml` (Hastatus: 42 × 1000 / 60 = 700 ms).
  Cambiare solo `speed` non sfasa lo sprite: l'animazione accelera o rallenta insieme al movimento. *(dedotto)*
- `speed="0"` su un'unità che cammina blocca il gioco con una divisione per zero. Lo stesso vale per una classe che non definisce `speed` e non lo eredita. *(dedotto)*

### Cadenza di attacco

Per le unità non esiste un attributo di "velocità di attacco". *(dedotto)*

- Un colpo dura quanto l'animazione di attacco, cioè la somma dei valori `<frame duration>` nel `.ent.xml`, e il danno arriva all'`action_time` dell'animazione. Nelle 118 animazioni del gioco i colpi durano da 594 a 1584 ms, con una mediana di 990 ms (Hastatus: 994 ms, `action_time` 426).
- `attack_delay` è inutile per le unità: lo impostano solo `Catapult` (500) e `FakeTower` (400), e nessun altro nei dati. *(dedotto)*
- Ci sono due modi per attaccare più in fretta. Uno: accorciare i frame dell'animazione di attacco e riscalare `action_time` nella stessa proporzione.
  L'altro: `Unit::SetSpeedFactor(150)` da uno script, che accelera del 50% sia la camminata sia l'attacco. `SetSpeedFactor(0)` blocca il gioco. *(dedotto)*
- Per modificare il `.ent.xml` da una mod dovrebbe funzionare una patch XML. Un `.ent.xml` sciolto non sostituisce quello del gioco ([Grafica personalizzata](graphics.md)).
- La cadenza di attacco e i tempi dei colpi fanno parte della simulazione: devono essere uguali per tutti i giocatori.

### Gittata (`range`, `min_range`)

- Valori del gioco: fanteria 15-40, arcieri 300-500 (le navi arrivano a 700), sentinelle 600, cavalleria 15-40, catapulte 700-800, torri 600-800. `RCatapult` ha `min_range=201`.
- Si misura da bordo a bordo: la distanza tra i centri meno il `radius` di entrambe le unità. Per questo conta anche `radius`. *(dedotto)*
- Un'unità da mischia diventa a distanza con `range` più una `projectile_class` (Arrow, Javelin, Axe, Slingstone) e un'animazione di attacco con `action_time`.
- Con `range` inferiore a `min_range` non attacca mai. Con `range="0"` su un'unità da mischia, nemmeno. *(dedotto)*
- Un proiettile impiega quanto la sua animazione, qualunque sia la distanza (freccia 495 ms, ascia e giavellotto 561, sasso di fionda 300). Non esiste un attributo per la velocità del proiettile. Un attaccante con proiettile infligge metà del danno agli edifici. *(dedotto)*
- Catapulte: l'arco deriva da `shot_tan` e `shot_height`. Non cambiarli su un solo computer.

### Hitbox e dimensione

| Attributo | Cosa fa | Valori del gioco |
|---|---|---|
| `radius` | Dimensione fisica: collisioni, percorsi, spaziatura e gittata (dedotto). Simulazione | Fanteria 10, cavalleria 20, eroi 20-30, arieti 80, catapulte 50 |
| `selection_radius` | Anello di selezione e area di clic. Estetico finché l'unità ha un `formation_radius` (dedotto) | |
| `formation_radius` | Spaziatura tra gli slot di una formazione. Simulazione | Fanteria 26, cavalleria 35, eroi 45 |

Imposta sempre `radius` su un nuovo edificio. Quello ereditato (`Building`: 600) è enorme e gli attaccanti "raggiungono" l'edificio da molto lontano. Gli edifici veri usano 160-250 per le caserme, 47 per le torri, 80-110 per le mura e 333-345 per gli avamposti.

### Danno e armatura

Costanti di `data\const.ini`, sezione `[GamePlay]`: `MinDamage=3`, `MinPercentOfAttackersDamage=20`, `DamageAmplify=200` e `LevelDifferenceDamageTable`. Come vengono usate è *(dedotto)*:

- Un colpo infligge `damage − armor_slash` del difensore, con un minimo del 20% del danno dell'attaccante e mai meno di 3. Poi si applica la differenza di livello tra i due: va da −90% a +90%, e se il difensore ha il livello più alto, sottrae.
- `armor_pierce` non entra nel calcolo: puoi scriverlo e non fa nulla *(parziale: uno script può usarlo)*. Per dare armatura usa `armor_slash`.
- `damage_type` (`slash`, `pierce`, `siege`, `none`) non cambia il danno: decide cosa può attaccare l'unità. `slash` e `pierce` attaccano le unità (e gli edifici se c'è un proiettile), `siege` attacca anche gli edifici, `none` non attacca.
- Gli edifici non hanno armatura: il danno passa per intero.
- `DamageAmplify` è il danno alla guarnigione di un edificio. Puoi ritoccare queste costanti con le [patch INI](patches.md).

### Altri attributi

| Attributo | Cosa fa |
|---|---|
| `maxhealth` | Salute. Fanteria 160-3000, eroi 1000-1300, avamposti 10000. `0` blocca un edificio o fa comparire l'unità già morta *(dedotto)* |
| `maxstamina` | L'energia che consumano le specialità delle unità e le [abilità](abilities.md). Ogni soldato del gioco ne ha 10. Con meno del costo, la specialità non si attiva *(dedotto)* |
| `sight` | Vista: rivela la nebbia (dedotto). Fanteria 500, sentinelle 600, civili 150 |
| `target_factor` | Cosa viene attaccato per primo: più basso significa prima. Predefinito 100, eroi 200, civili 1000. Negativo = mai scelto da solo (la fauna usa -1) *(dedotto)* |
| `unit_specials` | [Specialità delle unità](specials.md), quelle del gioco e le tue |
| `feeds`, `max_food` | `Unit` eredita `feeds=1` e `max_food=20`: ogni unità normale mangia. A 0 di cibo perde salute *(dedotto; quando esattamente, non è chiaro)*. `RamUnit`, `Sentry`, `GGhost` e gli animali hanno `feeds=0`; impostalo su macchine e creature magiche |
| `does_not_regenerate` | `1`: niente cibo e niente rigenerazione. Utile per evocazioni e macchine *(dedotto)* |
| `stamina_dec_time` | Sulle unità evocate: millisecondi tra una perdita di 1 energia e la successiva. La durata di vita è circa `(maxstamina+1) × this value`, dove this value è questo attributo; con `0` o meno muoiono subito *(dedotto)* |
| `water_unit` | Navi e pesci: percorsi e bersagli in acqua |
| `desync_hash` | `1`: il movimento di questo oggetto entra nel controllo di sincronizzazione. Imposta `0` sui nuovi effetti visivi *(dedotto)* |

## Cosa non fa nulla

`armor_pierce` *(parziale)*, `speed_modify` e `taunt` (come proprietà è il nome di un suono) vengono letti e mai usati. *(dedotto)* `attack_delay` è inutile sulle unità. `target_priority` conta solo per torri e catapulte; per le unità usa `target_factor`.

## Cambiare le cose durante la partita (da uno script)

| Cosa | Come |
|---|---|
| Salute, salute massima, stamina, stamina massima | `SetHealth`, `SetMaxHealth`, `SetStamina`, `SetMaxStamina`. Il gioco ricalcola i massimi quando si equipaggia un oggetto o si sale di livello, e sovrascrive il tuo valore |
| Vista | `SetSight(n)`, da 100 a 2048 |
| Velocità e cadenza di attacco | `Unit::SetSpeedFactor(n)`, in percentuale (100 = normale). `0` blocca il gioco |
| Livello, esperienza, specialità delle unità | `SetLevel`, `SetExperience`, `Mod_SetSpecial` |
| Danno, armatura, gittata o raggio di una sola unità | Nessuna funzione. Crea un'altra classe con quei valori e converti l'unità con `Unit::Mutate("OtraClase")`, che mantiene salute, esperienza e ordini |

Le funzioni sono elencate in [funciones-del-juego.txt](game-functions.txt). Per cambiare il danno di un singolo colpo, usa l'evento `OnAttackResolved` con `Mod_SetAttackDamage` ([Specialità delle unità](specials.md)).

## Cosa l'XML non può fare

- La formula di combattimento (armatura fissa, minimi, tabella dei livelli). Puoi solo regolare le costanti di `const.ini`.
- Velocità e portata di volo dei proiettili: il colpo va a segno se la distanza è inferiore a `range + 150`. *(dedotto)*
- Nuovi comportamenti nel codice: i valori di `cpp_class` sono solo quelli che il gioco già include.
- La logica delle formazioni, oltre ciò che consentono le [Formazioni](formations.md).

## Multigiocatore

Quasi tutto quanto sopra fa parte della simulazione. Ogni giocatore deve avere la stessa mod e il gioco lo verifica quando si entra in una stanza; una differenza tra due giocatori manda il gioco in desync e la partita viene interrotta. Estetici: `selection_radius`, `healthbar_*`, `icon`, `display_name`, `help` e gli sprite.

Gli sprite (`.rle`) non fanno parte del controllo. L'elenco completo di ciò che viene controllato è nel [README](README.md).

## Cosa non sappiamo

- La conversione esatta tra unità di mappa e pixel dello schermo.
- Se `sight` limiti anche fino a dove un'unità cerca bersagli. Rivela la nebbia e gli script lo usano per cercare, ma il calcolo esatto non è noto.
- Quale `formation_priority` va davanti in una formazione.
- Cosa succede con un `action_time` più lungo dell'animazione. Evitalo.
