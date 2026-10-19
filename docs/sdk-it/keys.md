# Tasti delle mod

I giocatori cambiano i tasti del gioco in **Opzioni → Controlli**. I comandi della tua mod compaiono lì da soli, purché abbiano un nome: non devi registrare nulla.

Esempio da copiare: [`examples/custom-orders`](examples/custom-orders).

## Come compaiono i tuoi comandi

Un comando è un `<cmd>` in un file sotto `data\commands`. Il suo tasto predefinito è l'attributo `key` (`key="j"`; con `ctrl="1"` richiede Ctrl). Il giocatore può cambiarlo, e la modifica viene salvata in `controls.ini`, non nella tua mod.

Un comando ha bisogno di `rollover`: è il suo nome nell'elenco. Senza `rollover` non compare in Controlli.

- Se il comando si trova in un file del gioco che la tua mod modifica con una patch (per esempio `RBarracks.xml`), compare nella scheda di quell'edificio o di quell'unità, insieme agli altri. Eccezione: `Stonehenge.xml` non è nella tabella dei file noti, quindi un comando aggiunto lì compare sotto "Edifici" con il nome del file.
- Se la tua mod include un nuovo file di comandi (per esempio `data\commands\MyBarracks.xml`), compare nella scheda **Contenuti**, in una sezione che porta il nome della tua mod. Con più file di comandi, ognuno ha la propria sezione.

La scheda **Contenuti** compare solo se qualche mod attiva ha comandi nuovi.

## Dare un nome alla sezione

Per impostazione predefinita la sezione prende il nome della tua mod (più il nome del file, se ne includi diversi). Per dare nomi diversi per ogni lingua, usa `commands` in `mod.json`, con il nome del file senza estensione come chiave:

```json
"commands": {
  "MyBarracks": {
    "name": {"spanish": "Cuartel romano extra", "english": "Extra Roman barracks", "italian": "Caserma romana extra"}
  }
}
```

Mostra il nome nella lingua del gioco; se manca, quello inglese; se manca anche quello, il primo disponibile. Funziona anche una semplice stringa (`"name": "Extra barracks"`). Sullo schermo: `Mod name · Extra Roman barracks`.

Il nome di ogni comando è il suo `rollover`, e si traduce come qualsiasi altro testo: vedi [Lingue e testi](languages.md).

## Quali tasti puoi usare

Una lettera (A–Z) o un simbolo (punto e virgola, uguale, virgola, trattino, punto, barra, barra rovesciata, parentesi quadre, apice singolo e apice inverso), eventualmente con Ctrl. Le cifre non funzionano: i comandi accettano solo lettere e simboli, quindi `key="1"` non diventa mai un tasto in Controlli. Anche Maiusc e Alt non funzionano, solo Ctrl.

I giocatori possono anche usare la modalità **Per posizione sulla barra** (Q è il primo pulsante, W il secondo…). I tuoi comandi ci rientrano come tutti gli altri.

## Cosa non si può fare

- Un tasto che fa qualcosa di diverso da un comando di gioco (cambiare un'opzione della mod, avviare uno script isolato) non esiste. Ogni azione associata a un tasto deve essere un comando.
- Un file di comandi fuori da `data\commands` non viene caricato.
