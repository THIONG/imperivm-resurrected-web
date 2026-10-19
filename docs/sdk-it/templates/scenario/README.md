# Modello di scenario

Una mappa per schermaglia e partite multigiocatore, creata nell'editor di mappe del gioco.

## Passi

1. Copia questa cartella in `<game folder>\mods\` e rinominala.
2. In `mod.json` modifica `id` (lettere minuscole, numeri e trattini: identifica la tua mod), `name`, `authors` e `description`.
3. In `tags` indica quanti giocatori ha la mappa: `"Players: 2"`, oppure un intervallo come `"Players: 2-4"`. Senza questo tag la mappa non compare quando si filtra per numero di giocatori.
4. Salva la mappa nell'editor come mappa per schermaglia e metti il suo `.bfhp` in `scenarios\`. Elimina `PUT-YOUR-FILES-HERE.txt`.
5. Attiva la mod nel tuo profilo (**Contenuti aggiuntivi** nel menu principale), crea una stanza e scegli la mappa nell'elenco degli scenari. Il gioco disegna l'anteprima a partire dalla mappa stessa: non c'è nessuna immagine da fornire.

## Struttura delle cartelle

```
my-scenario\
  mod.json
  README.md
  scenarios\
    MyMap.bfhp
```

## Note

- Una mappa cambia ciò che accade nel gioco, quindi tutti i giocatori della stanza devono avere la stessa. Con `"redistributable": true` l'host della stanza può inviarla ai giocatori che non la hanno.
- Una mappa salvata nell'editor come avventura o come conquista non compare nell'elenco degli scenari, nemmeno se si trova in questa cartella. Il validatore lo segnala.
- Se la mappa include musica o testi propri, aggiungi `music\` o `loc\` come mostrato nel [modello completo](../full).

## Verifica e pubblicazione

```
node tools\validate-mod.js <your mod folder>
```

Il validatore segnala i problemi indicando file e riga, senza aprire il gioco ([Validare una mod](../../validating.md)). Comprimi in uno zip la cartella della mod con il suo `mod.json` all'interno e pubblicala come descritto in [Pubblicare su GameBanana](../../publishing.md).
