# Lingue e testi

Parti dal [modello di traduzione](templates/translation), una mod vuota con le cartelle usate in questa guida.

Una mod può cambiare o aggiungere testi del gioco senza sostituire l'intero file dei testi, e può aggiungere una nuova lingua (francese, tedesco, polacco…) che compare in **Options → Language**. Può anche includere file usati da una sola lingua: guida, suggerimenti, immagini dei menu, voci.

Esempi da copiare: [`examples/custom-texts`](examples/custom-texts) e [`examples/french-language`](examples/french-language).

## Come funziona la lingua del gioco

La lingua si sceglie in Options → Language e si applica dopo un riavvio. Viene salvata in `Settings.ini`, `[Language] Default=`.

I testi del gioco si trovano in `currentlang/game.loc.xml`, dentro `local\<language>.pak`. Ogni testo è una riga come questa:

```xml
<translationtableentry text="Single player@/Menu/mainmenu.ini:SinglePlayer:Text" justtext="Single player" result="Estrategia"/>
```

`text` è la chiave: il testo originale in inglese, a volte seguito da `@` e da un contesto (dove viene usato). `result` è ciò che vedi in quella lingua. Se un testo non ha traduzione, il gioco mostra la chiave, cioè l'inglese. Per questo l'inglese ha bisogno di ben pochi file.

L'interfaccia di Imperivm Resurrected (gestore dei contenuti, stanza, Controlli, partite salvate, pannello delle prestazioni) è disponibile in spagnolo, inglese e italiano. Con il gioco in italiano appare in italiano; con qualsiasi altra lingua, in inglese. I testi della tua mod (nome, descrizione, ordini) si traducono con i file `loc\` descritti sotto.

I filmati e la musica sono gli stessi in ogni lingua. Cambiano i testi, le voci delle unità, la guida, i suggerimenti e alcune immagini dei menu.

Per vedere il file dei testi, aggiungi questo a `imperivm-mod.ini` e apri il gioco:

```ini
[Debug]
Dump=currentlang/game.loc.xml
```

Viene copiato in `mod-dump\currentlang\game.loc.xml` con i testi delle tue mod già uniti. Per vedere l'originale, usa il profilo Original.

## Cambiare o aggiungere testi

Metti i testi in `loc\<language>.loc.xml` dentro la tua mod. Se sono molti, distribuiscili in più file `*.loc.xml` dentro `loc\<language>\`:

```
mods\my-mod\
  mod.json
  loc\spanish.loc.xml
  loc\italian.loc.xml
  loc\english\unidades.loc.xml
```

`<language>` è il nome inglese della lingua in minuscolo, come in `Settings.ini`: `spanish`, `english`, `italian`, `french`, `german`…

```xml
<translationtable>
  <!-- Changes the text everywhere it appears -->
  <translationtableentry text="Single player" result="Un jugador"/>

  <!-- One place only: the full key, copied from the game's game.loc.xml -->
  <translationtableentry text="Options@/Menu/endgamemenu.ini:Options:Text" result="Ajustes"/>

  <!-- The same, written with context -->
  <translationtableentry text="Options" context="/Menu/endgamemenu.ini:Options:Text" result="Ajustes"/>

  <!-- New text, e.g. the name of a unit in your mod (display_name in its .sc.xml) -->
  <translationtableentry text="Gladiator" result="Gladiador"/>
</translationtable>
```

- Senza contesto (`text="Single player"`), la modifica vale ovunque il gioco usi quel testo. Con un contesto (`text="…@…"` o l'attributo `context`), solo in quel punto.
- A capo: `\n` dentro il testo, come nei file del gioco.
- In un testo, scrivi `&` come `&amp;`, `<` come `&lt;` e le virgolette doppie come `&quot;` (oppure racchiudi il valore tra apici singoli).
- Salva in UTF-8. Se è ANSI, la mod lo converte, ma UTF-8 è la scelta sicura.
- Una riga malformata viene saltata e registrata in `Logs\imperivm\imperivm-mod.log` con il suo numero di riga. Il resto del file si carica.
- `<game>\mod\loc\<language>.loc.xml` serve per provare senza creare una mod, e ha la precedenza su tutte le mod.
- Se due mod cambiano lo stesso testo, dovrebbe prevalere quella che viene prima nell'[ordine di caricamento](reference.md#1-mod-structure), come per i file.
- I testi si leggono all'avvio: riavvia dopo averli cambiati.

I nomi di unità, edifici e ordini della tua mod sono scritti in inglese nei rispettivi file (`display_name`, `rollover`…). Quella è la chiave. Per tradurli, aggiungi la traduzione a `loc\spanish.loc.xml`, `loc\italian.loc.xml`, ecc.

## Aggiungere una nuova lingua

1. Dichiara la lingua in `mod.json`:

   ```json
   "language": {"code": "french", "name": "Français", "base": "spanish"}
   ```

   - `code`: il nome inglese della lingua in minuscolo. È ciò che viene salvato in `Settings.ini`.
   - `name`: ciò che compare nel selettore.
   - `base` (facoltativo, `english` per impostazione predefinita): la lingua da cui prendere tutto ciò che la tua mod non fornisce. Leggi l'avviso qui sotto prima di lasciare l'inglese.

2. Traduci i testi in `loc\french.loc.xml` (o in più file dentro `loc\french\`). Tutto ciò che non traduci compare in inglese.

3. Facoltativo: file di lingua in `Local\french\`, con i percorsi che hanno dentro `currentlang\`. Quelli che il gioco richiede sono:

   ```
   Local\french\help.xml              help (F1)
   Local\french\tips.xml              loading screen tips
   Local\french\credits.txt           credits
   Local\french\splash.ini            startup screens
   Local\french\menu_16_9.bmp         menu background (also menu_4_3.bmp, menubackground.bmp, logo.bmp)
   Local\french\voices\<unit>\1.wav unit voices (1.wav up to 5.wav depending on the unit)
   ```

   Puoi anche raccogliere tutto in `Local\french.pak`.

4. Attiva la mod nel tuo profilo, scegli **Français** in Options → Language e riavvia.

**Che cosa fornisce la lingua di base.** Tutto ciò che la tua lingua non fornisce viene preso dalla lingua `base`. L'inglese non ha guida (`help.xml`), suggerimenti (`tips.xml`), `splash.ini` né immagini dei menu. Una nuova lingua con l'inglese come base resta quindi senza quei file. Lo spagnolo e l'italiano li hanno: con `"base": "spanish"` o `"italian"` li ottieni, oppure includi i tuoi in `Local\<language>\`.

Le mappe includono i propri testi per ogni lingua. Se una mappa non ha la tua, si usano quelli della lingua di base.

**Caratteri.** I font del gioco dovrebbero coprire il latino (con gli accenti europei), il greco e il cirillico. Cinese, giapponese e coreano non si possono visualizzare senza nuovi font.

Nel multigiocatore la lingua non ha importanza: giocatori con lingue diverse possono giocare insieme.

## File per una sola lingua

Qualsiasi file in `currentlang\` si può cambiare per una sola lingua con la cartella `Local\<language>\` della tua mod. `Local\spanish\help.xml` cambia la guida solo in spagnolo. Se metti il file in `currentlang\help.xml` (fuori da `Local\`), vale per tutte le lingue.

## Se qualcosa va storto

Cerca in `Logs\imperivm\imperivm-mod.log` le righe con l'etichetta `language`. Gli avvisi (`W`) indicano le righe con errori. Per vedere anche quali file di testo sono stati letti e quali file di `Local\<language>\` sono in uso, aggiungi `LogChannels=language:debug` sotto `[Debug]` in `imperivm-mod.ini`.
