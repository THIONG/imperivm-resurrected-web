# Specialità delle unità personalizzate

Il gioco include 36 specialità delle unità fisse (Parry, Penetration, Deflection…). Non si possono estendere, ma una mod può dichiararne di nuove e tu ne programmi l'effetto con gli script.

Esempio pronto da copiare: [`examples/specialty-example`](examples/specialty-example), "Critical hit": il 25% dei colpi dell'hastatus infligge danno triplo.

## Come funziona

Ogni unità porta una maschera a 64 bit, un bit per specialità. I bit da 0 a 35 sono le 36 del gioco. I bit da 36 a 63 sono tuoi e vengono salvati con la partita. Una specialità di una mod occupa un bit.

I passi sono tre.

**1. Dichiararla.** Un file `specials\<id>.json` nella tua mod:

```json
{
  "id": "Critical",
  "bit": 36,
  "name": {"spanish": "Golpe crítico", "english": "Critical hit", "italian": "Colpo critico"},
  "description": {"spanish": "Uno de cada cuatro golpes hace el triple de daño.", "english": "One hit in four does triple damage.", "italian": "Un colpo su quattro fa il triplo del danno."}
}
```

| Campo | Cos'è |
|---|---|
| `id` | Il nome: lettere, numeri e `_`, deve iniziare con una lettera, fino a 24 caratteri. Lo scrivi in `unit_specials` ed è la costante dello script (`Critical`). Non può essere il nome di una delle 36 del gioco (`Triple strike`…). Evita anche gli id che, in minuscolo e con `_` al posto degli spazi, coincidono con costanti del gioco (`triple_strike`, `keen_sight`, `life_steal`…): il validatore non lo controlla e la costante andrebbe in conflitto con quella del gioco. |
| `bit` | Un numero da 36 a 63. Non cambiarlo dopo la pubblicazione: le partite salvate lo ricordano. Due mod non possono usare lo stesso. |
| `name` | Il suo nome in ogni lingua, oppure una sola stringa. |
| `description` | Viene letta ma per ora non compare da nessuna parte. Descrivila nel testo di aiuto dell'unità. |
| `icon` | (Facoltativo) Viene letta ma non usata. |

**2. Assegnarla alle classi.** Con il solito attributo `unit_specials`. Il gioco ignora i nomi che non conosce e la mod imposta il bit. Meglio farlo con una [patch](patches.md), così non sostituisci il file della classe:

```xml
<patch>
  <set select="/class/properties[@unit_specials='Deflection']" unit_specials="Deflection, Critical"/>
</patch>
```

L'ereditarietà funziona come nel gioco. Se una classe imposta `unit_specials`, il suo elenco sostituisce quello della madre; se non lo fa, eredita l'intero elenco della madre. Quando ne aggiungi una a una classe che ne ha già, ripeti quelle che aveva (`Deflection, Critical`). Nel gioco i nomi distinguono maiuscole e minuscole; quelli della tua mod no.

**3. Programmarne l'effetto.** Il gioco memorizza soltanto il bit. Ciò che fa lo scrivi tu in uno [script](scripts.md):

| Funzione | Cosa fa |
|---|---|
| `Mod_HasSpecial(Unit unidad, int bit)` : `bool` | L'unità ha questa specialità? Funziona per qualsiasi bit da 0 a 63, anche quelli del gioco. Prende una `Unit`; con un `Obj`, usa `objeto.AsUnit()` (se non è un'unità, restituisce `false`). |
| `Mod_SetSpecial(Unit unidad, int bit, bool puesta)` | Imposta o toglie la specialità su quell'unità, per esempio al passaggio di livello. Viene salvata con la partita. |

Il bit è la costante che ha il nome dell'`id`: `Mod_HasSpecial(attacker.AsUnit(), Critical)`.

Il posto naturale per l'effetto è l'evento `OnAttackResolved`, che può cambiare il danno di ogni colpo (`events\OnAttackResolved.vs`). Va bene anche qualsiasi altro script: un `<behavior>` che controlla le unità a intervalli, `OnObjectKill`, `OnObjectDie`…

```
// void, Obj attacker, Obj victim, int damage
if (!attacker.IsValid) return;
if (!Mod_HasSpecial(attacker.AsUnit(), Critical)) return;
if (rand(100) >= 25) return;
Mod_SetAttackDamage(damage * 3);
```

## Multigiocatore

`specials\`, `events\` e `civs\` contano come gameplay: tutti i giocatori devono avere la stessa mod.

## Errori

Compaiono in `Logs\imperivm\imperivm-mod.log` (righe con l'etichetta `specials`) e nella scheda della mod nel gestore dei contenuti: un `id` non valido, un `bit` mancante o duplicato, un nome che appartiene a una specialità del gioco.

Attenzione: se aggiungi una `[Section]` sconosciuta a `UNIT_SPECIALS.INI` (con una patch, per dare a una specialità un'icona e un testo), il gioco potrebbe andare in crash. Non farlo. Le specialità delle mod non usano quel file.

## Cosa manca

- La barra informativa dell'unità in alto, dove il gioco mostra fino a tre specialità di un'unità con la loro icona, non mostra le specialità delle mod.
- Il testo delle statistiche del pulsante di reclutamento dovrebbe elencarle sotto quelle del gioco, senza il titolo "Specials": un'unità con sole specialità di mod le mostrerebbe senza titolo.
- Icone personalizzate: non vengono mostrate.
- Non puoi aggiungere righe alla tabella delle 36 del gioco né creare nuove abilità native degli eroi. Quelle attive si fanno con [ordini e script](abilities.md).
