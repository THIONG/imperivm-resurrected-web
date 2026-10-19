# Modelli personalizzati di città e villaggio

Una civiltà di una mod inizia la partita con una città e un villaggio che la mappa casuale sceglie da un elenco di modelli del gioco. Per impostazione predefinita usa quelli della sua civiltà base: una Dacia clonata dai Galli parte in una "Gaul Town". Con i tuoi modelli cambi la disposizione, per esempio una città più larga, quasi quadrata, con una diversa sistemazione degli edifici dentro le mura.

`--straight` non funziona bene (vedi sotto).

## Cosa puoi e non puoi fare

- Puoi spostare e ripetere i pezzi del gioco: mura (`?WallsN/S/E/W/NE/NW/SE/SW`), torri, porte ed edifici.
- Non puoi creare nuovi pezzi di mura. Gli angoli e le porte sono disegnati per la cinta ottagonale del gioco, quindi la forma "quadrata" è un ottagono con i lati lunghi più lunghi.
- Nessun terreno personalizzato: il suolo viene dal bioma (erba o sabbia). La città del gioco ha una strada sterrata al centro, la tua no.
- I modelli compaiono solo per i giocatori di quella civiltà. I villaggi e le città indipendenti della mappa non li usano.

## Come procedere

1. Ottieni i modelli del gioco. In `imperivm-mod.ini` (cartella del gioco), sezione `[Debug]`, imposta
   `Dump=randommapsettlements/maps/1/map.obj.xml`. Apri il gioco, avvia una schermaglia su una mappa casuale ed esci. Compare il file
   `mod-dump\randommapsettlements\maps\1\map.obj.xml`. Poi rimuovi quella riga.
2. Genera i modelli della tua civiltà:

   ```
   node tools\create-template.js "<game folder>" "<your mod folder>" Dacian --base Gaul --width 1
   ```

   - `Dacian` è il prefisso. Crea "Dacian Town 1", "Dacian Town 2" e "Dacian Village 1..5".
   - `--base` è la civiltà da cui copia: Gaul, Republican Roman, Carthaginian, Iberian, Imperial Roman, Briton, Egyptian o German.
   - `--width N` (da 0 a 4) allarga le città di N campate da 220 unità. Con i Galli, `--width 1` dà 1760 x 1760 e allarga solo "Town 1": "Town 2"
     non ha la forma richiesta, quindi lo script ti avvisa e la lascia com'è.
   - `--no-villages` genera solo le città.
   - `--straight` (sperimentale, con `--side N`, da 6 a 9 campate da 220 per lato, 8 per impostazione predefinita) crea una cinta davvero rettangolare, senza
     gli angoli tagliati, con le porte N, S ed E al centro di ogni lato. La porta viene storta, perché il gioco ha solo
     porte disegnate per gli angoli tagliati. Non usarlo se non per sperimentare.

   Scrive `patches\randommapsettlements\maps\1\map.obj.xml` nella tua mod.
3. Indicalo alla civiltà: in `civs\<id>.json` aggiungi `"template": "Dacian"` ([Civiltà](civilizations.md)).
4. Valida: `node tools\validate-mod.js <mod folder>`. Avvisa se manca la patch, se non ci sono città o villaggi con quel prefisso e se
   qualche classe dei modelli non esiste.

Se la civiltà non ha un modello di un certo tipo (per esempio un villaggio), per quel tipo usa quello della sua base.

## Modifica a mano

Ogni `<settlement name="Dacian Town 1">` nell'XML è un elenco di pezzi con la loro classe e la loro posizione (x, y). Regole da rispettare:

- Tieni ogni lato sotto circa 1900 unità. Il villaggio satellite viene piazzato a circa 2000 dal centro della città, e una città più grande
  lo sovrapporrebbe.
- Ogni classe nell'XML deve esistere, altrimenti la mappa casuale non si genera e il gioco non te lo dice. Usa solo classi del gioco o della tua mod. Il validatore
  lo controlla.
- Le torri vanno ogni 220 unità, e ogni pezzo di muro nel punto medio tra due torri. Una porta occupa due posizioni.
- Lascia i modelli nell'area libera del piano (y tra 24192 e 27904) e ad almeno 3000 unità l'uno dall'altro.
- Le patch sotto `randommapsettlements/` contano come gameplay: in una stanza online tutti devono avere la stessa mod.
