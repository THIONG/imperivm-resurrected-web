# Tipi di mappa casuale personalizzati

Una mod può aggiungere un tipo di mappa casuale (come Coastal, Islands o Mountain passes) al menu a tendina "Map type" della stanza. Il tipo è una forma disegnata: terra, mare, montagne e i punti in cui parte ogni giocatore. Il gioco la deforma, la ruota e la riempie di terreno, alberi e oggetti secondo le sue regole abituali.

Esempio: [`examples/random-map-example`](examples/random-map-example) (un anello di terra con un mare al centro e montagne nel mezzo). Il repository include solo il disegno: i file che il gioco legge si generano con il comando del passo 2.

## Come si fa

1. **Disegna la forma** in un PNG quadrato, con il programma che preferisci e quattro colori:

   | Colore | Significato |
   |---|---|
   | nero `(0, 0, 0)` | mare |
   | bianco `(255, 255, 255)` | terra |
   | magenta `(255, 0, 255)` | montagne: linee sottili, di circa 3 pixel (facoltativo) |
   | rosso `(255, 0, 0)` | punti in cui il gioco può collocare i siti di partenza e le città neutrali (facoltativo) |

   Un colore che non è esatto viene ricondotto al più vicino. Il trasparente conta come mare. Se il PNG non è quadrato, viene stirato a 512 x 512 senza avvisi. Il gioco lo stira poi alle dimensioni della mappa, quindi usa tratti spessi: i dettagli fini si perdono.

   I disegni del gioco hanno centinaia di punti rossi sparsi sulla terra, e il gioco sceglie tra quelli. Di norma non dipingerne e lascia che li distribuisca lo strumento. Dipingi il rosso solo se vuoi i siti in zone precise.

2. **Trasformalo in un tipo di mappa**, dalla radice del repository:

   ```
   node tools\create-random-map.js <mod folder> Anillo dibujo.png --players 8
   ```

   Per l'esempio:

   ```
   node tools\create-random-map.js examples\random-map-example Anillo examples\random-map-example\drawings\ring.png --players 8
   ```

   Lo strumento scrive `data\randommap\Anillo.rm.xml` e `randommap\Anillo\010.bmp … 120.bmp` nella tua mod. Il nome (`Anillo`) usa solo lettere senza accenti, numeri e spazi, inizia con una lettera e ha da 2 a 31 caratteri. Non usare il nome di un tipo del gioco (`Coastal`…): lo strumento non avvisa e sovrascriveresti quello del gioco.

   | Opzione | Cosa fa |
   |---|---|
   | `--players N` | Massimo di giocatori su una mappa grande (da 2 a 8). Su una media, fino a 6 |
   | `--small N` | Massimo su una mappa piccola (0 = non compare tra le piccole; predefinito 2) |
   | `--distortion X` | Quanto viene deformata la forma durante la generazione, da 0 a 0,5 (0,1 appena, 0,25 molto; predefinito 0,2) |
   | `--no-rotate` | Non ruotarla né specchiarla a caso |

   Puoi passare più PNG (`dibujo1.png dibujo2.png …`) e il gioco ne sceglie uno a caso a ogni partita. Lo strumento arriva a 12 ripetendo i tuoi. Se 12 non è multiplo del numero di PNG, la ripartizione è disuguale (con 5, tre PNG compaiono 3 volte e due compaiono 2). Con uno solo, esce sempre quella forma.

3. Attiva la mod e riavvia. La stanza offre "Random: Anillo".

## Da tenere presente

- Cambia il gameplay: tutti i giocatori devono avere la stessa mod.
- "Find game" usa un elenco fisso di cinque tipi di partita del gioco: un tipo nuovo compare solo nelle partite che crei tu.
- Non puoi creare nuovi biomi: il gioco ha quattro zone fisse. Puoi cambiare ciò che contiene ciascuna con le [patch](patches.md) a `data\randommap\terrainmix.xml`, `placetrees.xml` e `placeobjects.xml`.
- Prova con il numero di giocatori che intendi consentire.
