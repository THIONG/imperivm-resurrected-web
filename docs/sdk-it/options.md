# Opzioni di partita personalizzate

Una mod può aggiungere **interruttori** (sì / no) e **elenchi di valori** (un menu a tendina) all'elenco REGOLE della stanza, accanto a "Fog of war" o "Lock diplomacy". L'host della stanza li sceglie, tutti li vedono e i tuoi script leggono la scelta con `Mod_GetOption("id")` (interruttore) o `Mod_GetOptionValue("id")` (elenco). Entrambe fanno parte dell'API degli script 6.

Esempio: [`examples/options-example`](examples/options-example) (l'interruttore "Fast heroes" e l'elenco "Hero speed").

## Metodo rapido

`create-option.js` scrive il JSON e, se vuoi, uno scheletro di script. Non ha bisogno della cartella `DATA`.

```
node tools/create-option.js mods/my-mod fast-heroes --name "Fast heroes" --description "All heroes move 50% faster."
node tools/create-option.js mods/my-mod hero-speed --name "Hero speed" --values "Normal,Fast,Very fast" --default Normal --script
```

Il primo crea un interruttore; con `--values` (da 2 a 16, separati da virgole) crea un elenco.

| Opzione | Cosa fa |
|---|---|
| `--name` | Obbligatoria. Il nome mostrato nella stanza |
| `--name-es`, `--name-it` | Il nome in spagnolo e in italiano |
| `--description`, `--description-es`, `--description-it` | Il testo di aiuto nella stanza |
| `--values`, `--values-es`, `--values-it` | I valori di un elenco, nello stesso ordine e nello stesso numero. L'id di ogni valore deriva dal suo testo in `--values` |
| `--default` | Interruttore: `true` o `false`. Elenco: il numero del valore (da 0), il suo id o il suo testo. Se manca: `false`, oppure il primo valore |
| `--script` | Crea anche `data\mod\<id>.vs`, un behavior con l'`if (Mod_GetOption("<id>"))` (o `Mod_GetOptionValue`) già pronto da completare. Collegalo a una classe con una patch, come fa l'esempio |

Genera `options\<id>.json` e, con `--script`, `data\mod\<id>.vs`. Ti dice quanti degli 8 bit usa e quanti ne usa già la mod. Non sovrascrive mai nulla: se la mod ha già quell'id, si ferma senza scrivere.

## Farlo a mano

1. Un file `options\<id>.json` nella tua mod.

   Un interruttore:

   ```json
   {
     "id": "fast-heroes",
     "name": "Fast heroes",
     "description": "All heroes move 50% faster.",
     "default": false
   }
   ```

   Un elenco (da 2 a 16 valori):

   ```json
   {
     "id": "hero-speed",
     "name": "Hero speed",
     "values": [
       { "id": "normal", "name": "Normal" },
       { "id": "fast", "name": "Fast (+25%)" },
       "Very fast"
     ],
     "default": "normal"
   }
   ```

   - `id`: lettere, numeri, `_` e `-`, fino a 32. Lo usano gli script; non distingue maiuscole e minuscole. Se manca, si usa il nome del file.
   - `name` e `description`: un solo testo, oppure uno per lingua: `{"english": "Fast heroes", "spanish": "Héroes veloces"}` (la lingua del gioco, con l'inglese come ripiego). [L'esempio](examples/options-example) fa così.
   - `values`: ognuno è un testo o un oggetto con `id` e `name`. Il primo è 0.
   - `default`: per un interruttore, `true` o `false`; per un elenco, il numero del valore (da 0) o il suo `id`. Un `id` che non esiste ripiega in silenzio su 0; `validate-mod.js` lo segnala.

2. Uno script che la legge (un behavior di classe, un evento o uno script di vittoria):

   ```
   if (Mod_GetOption("fast-heroes")) {
       This.AsUnit().SetSpeedFactor(150);
   }
   if (Mod_GetOptionValue("hero-speed") == 1) {
       This.AsUnit().SetSpeedFactor(125);
   }
   ```

   `Mod_GetOption` restituisce `true` se il valore non è 0 (anche per gli elenchi). `Mod_GetOptionValue` restituisce il numero del valore scelto.

## Limiti

- **Ci sono 8 bit per tutte le opzioni di tutte le mod attive.** Un interruttore ne usa 1; un elenco ne usa 1 per 2 valori, 2 per 3 o 4, 3 da 5 a 8 e 4 da 9 a 16. Vengono assegnati in ordine alfabetico di `id`; ciò che non entra viene ignorato e il log lo segnala. Se due opzioni hanno lo stesso `id`, il gioco usa la prima che trova quando assembla le mod.
- **Funzionano solo con una stanza.** Le opzioni si fissano quando una partita parte dalla stanza (o quando rientri in una partita online). Avventure, campagne e tutorial non hanno stanza: `Mod_GetOption` restituisce sempre 0 e un elenco vale 0, anche con `"default": true`.
- I preset della stanza (Classic, Competitive) non toccano le opzioni delle mod.

## Regole fisse di una mod

Alcune regole del motore non sono opzioni della stanza: la mod le fissa per tutte le sue partite in `rules\game.json`:

```json
{
  "armyStaysWithHero": true,
  "sentriesUnselectable": true,
  "protectedClasses": ["Peasant", "PeasantAmbient", "Trader", "Tradecar_Donkey", "Camel", "CartTrader"]
}
```

| Campo | Cosa fa |
|---|---|
| `armyStaysWithHero` | Con `true`, le unità di un esercito non lasciano il loro eroe quando uno è dentro le mura e l'altro fuori. Il percorso viene comunque ricalcolato. |
| `sentriesUnselectable` | Con `true`, le sentinelle delle mura non si possono selezionare (cliccandone una si seleziona la porta) e non si uniscono agli eserciti dell'IA. |
| `protectedClasses` | Classi che non subiscono danni e non possono essere attaccate, insieme a tutte quelle che ne ereditano. Sono nomi di classe (`Peasant`), non nomi di unità. |

Cambiano il gioco, quindi in multigiocatore tutti devono usare la mod. Se più mod attive portano delle regole, queste si sommano.

## Online

È gameplay: tutti i giocatori devono avere la stessa mod. L'opzione viaggia insieme alle altre regole della stanza e viene salvata con la partita.
