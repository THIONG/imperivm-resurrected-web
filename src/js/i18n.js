(function () {
  'use strict';

  var LANGUAGES = ['es', 'en', 'it'];
  var LABEL = { es: 'ES', en: 'EN', it: 'IT' };
  var NAME = { es: 'Español', en: 'English', it: 'Italiano' };

  var T = {
    en: {
      title_home: `Imperivm Resurrected: History never ends`,
      desc_home: `Unofficial mod for Imperivm III HD: online play over Steam, an additional-content manager, spectator mode and fixes. In testing (0.x versions).`,
      brand_aria: `Imperivm Resurrected, home`,
      nav_label: `Main`, nav_guide: `Guide and FAQ`, nav_modders: `For modders`, nav_content: `Mods`, nav_download: `Download`, nav_language: `Language`,
      notfound_title: `Nothing here.`,
      notfound_text: `The page you are looking for does not exist or has moved.`,
      notfound_link: `Back to the start`,
      title_notfound: `Page not found — Imperivm Resurrected`,
      hero_title: `History<br>never ends.`,
      hero_sub: `A mod for Imperivm III HD with online play over Steam, a mod manager and many quality-of-life improvements.`,
      btn_download_mod: `Download the mod`,
      panorama_aria: `Legionaries on the road to a coastal city`,
      panorama_alt: `Legionaries marching along a path towards a coastal city`,
      project_title: `The project,<br>in detail.`,
      row1_title: `Overview`, row2_title: `What it adds`, row3_title: `Installation`,
      overview_a: `Imperivm Resurrected is an unofficial mod for <strong>Imperivm III: Great Battles of Rome HD</strong>, the Steam version. It is a single file, <code>winmm.dll</code>, that the game loads at startup. It does not modify <code>gbr.exe</code> on disk and includes no game files: you need the original.`,
      overview_b: `Mostly it changes how the game is drawn and how it connects, and it adds tools. It also fixes unexpected crashes and some gameplay bugs, so not everything behaves exactly as in the original.`,
      overview_c: `<strong>Display.</strong> Resizable or borderless window, resolutions up to 2048x1536 and the Steam overlay.`,
      overview_d: `<strong>Online.</strong> Rooms over Steam, with no port forwarding and no VPN.`,
      overview_e: `<strong>Additional content.</strong> An in-game manager with profiles and a GameBanana catalogue.`,
      change1_title: `Display and sound`, change1_text: `Direct3D 11 instead of GDI, vsync, sharp, smooth or integer scaling, a resizable or borderless window, resolutions up to 2048x1536 and an extended view. The monitor does not change resolution. Audio runs on a modern engine and the game mutes in the background.`,
      change2_title: `Multiplayer`, change2_text: `A dedicated screen with a room list, chat, Steam friend invites and passwords. Everyone needs the same mod version and the same gameplay content; anything missing downloads from the host. If you drop, you can rejoin the game in progress, as long as the host allows it and you have not gone about 30 seconds without traffic. There are no ranked games or automatic matchmaking.`,
      change3_title: `Spectator mode`, change3_text: `You can watch a room in progress with a 30-second delay, with pause and 10-second jumps. Spectators need the mod too. There is no chat and you cannot switch player.`,
      change4_title: `Additional content`, change4_text: `Enable and disable packages, profiles, warnings about shared files and about values another package overrides, and a tab for searching GameBanana. Load order is automatic. The manager was rebuilt recently and has not been thoroughly checked; GameBanana has little content so far. It warns about conflicts between packages but does not resolve them.`,
      change5_title: `Cheats and map`, change5_text: `Ctrl+T opens a cheat panel (resources, healing, spawning troops and more) that also works online if everyone has the same version; it cannot be turned off per room. The M key opens a zoom map with fog.`,
      change6_title: `Updates`, change6_text: `At startup it checks GitHub. By default it only notifies; in <code>imperivm-mod.ini</code> you can make it install by itself or not check at all. Every update carries a signature the mod verifies. If the new version does not reach the menu in three startups, it goes back to the previous one.`,
      change7_title: `For modders`, change7_text: `An SDK to create civilizations, units, abilities, items, victory modes, random maps and more using only files (the tools need Node.js). Guides and examples in <a href="sdk.html">For modders</a>.`,
      current_version: `Versions are 0.x and things can change between them. The notes for each one are on the <a href="https://github.com/THIONG/imperivm-resurrected/releases" target="_blank" rel="noopener">releases page</a>.`,
      overview_f: `<strong>Project status.</strong> It has no connection to FX Interactive or Haemimont Games. Versions are 0.x and bugs are likely.`,
      change8_title: `Convenience`,
      change8_text: `Autosave with several slots, rebindable controls, adjustable scroll speed and a panel with FPS, CPU, memory and network. It does not promise better performance on slow machines.`,
      change9_title: `Bug report`,
      change9_text: `From the heart icon in the main menu, <em>Create report</em> builds a zip in <code>Logs\\imperivm\\reports</code> with the logs and system data, with your SteamID, IPs and Windows username redacted. It sends nothing: check the zip before sharing it.`,
      install_warning: `<strong>Windows warnings.</strong> <code>winmm.dll</code> has no Windows code signature, so SmartScreen or your antivirus may warn you. There is no installer.`,
      install_requirements: `<strong>You need:</strong> Windows, Steam running and Imperivm III: Great Battles of Rome HD installed from Steam.`,
      install_step1: `Download the <code>.zip</code> of the latest version from the <a href="https://github.com/THIONG/imperivm-resurrected/releases" target="_blank" rel="noopener">releases page</a>. It contains <code>winmm.dll</code> and a <code>mod</code> folder.`,
      install_step2: `Close the game.`,
      install_step3: `In Steam, right-click the game, then <em>Manage</em> and <em>Browse local files</em>. This opens the folder that contains <code>gbr.exe</code>.`,
      install_step4: `Unzip it into that folder. Accept replacing if asked.`,
      install_step5: `Open the game from Steam.`,
      install_online: `<strong>Playing online.</strong> Everyone needs the same mod version and the same gameplay content. In the main menu, <em>Multiplayer</em>: one player creates the room and the others join.`,
      install_settings: `<strong>Your settings</strong> are saved in <code>imperivm-mod.ini</code>, in the game folder. The zip doesn't include it, so installing a new version keeps them.`,
      install_remove: `<strong>Removing the mod.</strong> Delete <code>winmm.dll</code> from the game folder. The game goes back to the original.`,
      install_failure: `<strong>If something fails,</strong> use <em>Create report</em> or look at the logs in <code>Logs\\imperivm</code>, and report it on Discord or GitHub. More detail in the <a href="guide.html">guide and FAQ</a>.`,
      closing_title: `Download it<br>and play.`,
      closing_note: `If something breaks, report it on <a href="https://discord.gg/6kCatX3Zbc" target="_blank" rel="noopener">Discord</a> or <a href="https://github.com/THIONG/imperivm-resurrected/issues/new/choose" target="_blank" rel="noopener">GitHub</a>.`,
      footer_unofficial: `Unofficial community project.`,
      footer_back: `Back to home`,
      footer_links_label: `Links`,
      footer_credits: `Credits`,

    },

    it: {
      title_home: `Imperivm Resurrected: La storia non finisce`,
      desc_home: `Mod non ufficiale per Imperivm III HD: online tramite Steam, gestore di contenuti aggiuntivi, modalità spettatore e correzioni. In fase di test (versioni 0.x).`,
      brand_aria: `Imperivm Resurrected, home`,
      nav_label: `Principale`, nav_guide: `Guida e FAQ`, nav_modders: `Per i modder`, nav_content: `Mod`, nav_download: `Scarica`, nav_language: `Lingua`,
      notfound_title: `Qui non c'è niente.`,
      notfound_text: `La pagina che cerchi non esiste o è stata spostata.`,
      notfound_link: `Torna all'inizio`,
      title_notfound: `Pagina non trovata — Imperivm Resurrected`,
      hero_title: `La storia<br>non finisce.`,
      hero_sub: `Una mod per Imperivm III HD con l'online tramite Steam, un gestore di mod e numerosi miglioramenti di comodità.`,
      btn_download_mod: `Scarica la mod`,
      panorama_aria: `Legionari in marcia verso una città costiera`,
      panorama_alt: `Legionari che avanzano lungo un sentiero verso una città costiera`,
      project_title: `Il progetto,<br>nel dettaglio.`,
      row1_title: `Presentazione`, row2_title: `Cosa aggiunge`, row3_title: `Installazione`,
      overview_a: `Imperivm Resurrected è una mod non ufficiale per <strong>Imperivm III: Great Battles of Rome HD</strong>, la versione di Steam. È un file, <code>winmm.dll</code>, che il gioco carica all'avvio. Non modifica <code>gbr.exe</code> su disco e non include file del gioco: serve l'originale.`,
      overview_b: `Cambia soprattutto il modo in cui il gioco viene disegnato e si connette, e aggiunge strumenti. Corregge anche chiusure impreviste e qualche difetto di gioco, quindi non tutto si comporta esattamente come nell'originale.`,
      overview_c: `<strong>Schermo.</strong> Finestra ridimensionabile o senza bordi, risoluzioni fino a 2048x1536 e overlay di Steam.`,
      overview_d: `<strong>Online.</strong> Stanze tramite Steam, senza aprire porte né usare una VPN.`,
      overview_e: `<strong>Contenuti aggiuntivi.</strong> Un gestore nel gioco, con profili e un catalogo su GameBanana.`,
      change1_title: `Immagine e suono`, change1_text: `Direct3D 11 al posto di GDI, vsync, scalatura nitida, morbida o intera, finestra ridimensionabile o senza bordi, risoluzioni fino a 2048x1536 e vista estesa. Il monitor non cambia risoluzione. L'audio usa un motore moderno e il gioco va in muto in secondo piano.`,
      change2_title: `Multigiocatore`, change2_text: `Schermata dedicata con elenco delle stanze, chat, inviti agli amici di Steam e password. Tutti hanno bisogno della stessa versione della mod e degli stessi contenuti di gioco; ciò che manca viene scaricato dall'host. Se cadi, puoi rientrare nella partita in corso, purché l'host lo consenta e non passino circa 30 secondi senza traffico. Non ci sono partite classificate né matchmaking automatico.`,
      change3_title: `Modalità spettatore`, change3_text: `Puoi guardare una stanza in corso con 30 secondi di ritardo, con pausa e salti di 10 secondi. Anche gli spettatori hanno bisogno della mod. Non c'è chat e non si può cambiare giocatore.`,
      change4_title: `Contenuti aggiuntivi`, change4_text: `Attivare e disattivare i pacchetti, profili, avvisi sui file condivisi e sui valori sovrascritti da un altro pacchetto, e una scheda per cercare su GameBanana. L'ordine di caricamento è automatico. Il gestore è stato rifatto da poco e non è ancora stato controllato a fondo; su GameBanana per ora c'è poco contenuto. Segnala i conflitti tra pacchetti ma non li risolve.`,
      change5_title: `Trucchi e mappa`, change5_text: `Ctrl+T apre un pannello di trucchi (risorse, cura, comparsa di truppe e altro) che funziona anche online se tutti hanno la stessa versione; non si possono disattivare per stanza. Il tasto M apre una mappa con zoom e nebbia.`,
      change6_title: `Aggiornamenti`, change6_text: `All'avvio controlla GitHub. Per impostazione predefinita si limita ad avvisare; in <code>imperivm-mod.ini</code> puoi scegliere che installi da solo o che non cerchi. Ogni aggiornamento ha una firma che la mod verifica. Se la nuova versione non arriva al menu in tre avvii, si torna alla precedente.`,
      change7_title: `Per i modder`, change7_text: `Un SDK per creare civiltà, unità, abilità, oggetti, modalità di vittoria, mappe casuali e altro usando solo file (gli strumenti richiedono Node.js). Guide ed esempi in <a href="sdk.html">Per i modder</a>.`,
      current_version: `Le versioni sono 0.x e tra l'una e l'altra le cose possono cambiare. Le note di ciascuna sono nella <a href="https://github.com/THIONG/imperivm-resurrected/releases" target="_blank" rel="noopener">pagina delle release</a>.`,
      overview_f: `<strong>Stato del progetto.</strong> Non ha alcun legame con FX Interactive né con Haemimont Games. Le versioni sono 0.x e possono esserci errori.`,
      change8_title: `Comodità`,
      change8_text: `Salvataggio automatico con più slot, comandi riassegnabili, velocità di scorrimento regolabile e un pannello con FPS, CPU, memoria e rete. Non promette prestazioni migliori sui computer lenti.`,
      change9_title: `Segnalazione degli errori`,
      change9_text: `Dall'icona a forma di cuore nel menu principale, <em>Crea rapporto</em> genera uno zip in <code>Logs\\imperivm\\reports</code> con i log e i dati del computer, con SteamID, IP e nome utente di Windows oscurati. Non invia nulla: controlla lo zip prima di condividerlo.`,
      install_warning: `<strong>Avvisi di Windows.</strong> <code>winmm.dll</code> non ha una firma del codice di Windows, quindi SmartScreen o l'antivirus possono dare un avviso. Non c'è un installer.`,
      install_requirements: `<strong>Ti serve:</strong> Windows, Steam avviato e Imperivm III: Great Battles of Rome HD installato da Steam.`,
      install_step1: `Scarica lo <code>.zip</code> dell'ultima versione dalla <a href="https://github.com/THIONG/imperivm-resurrected/releases" target="_blank" rel="noopener">pagina delle release</a>. Contiene <code>winmm.dll</code> e una cartella <code>mod</code>.`,
      install_step2: `Chiudi il gioco.`,
      install_step3: `In Steam, clic destro sul gioco, poi <em>Gestisci</em> e <em>Sfoglia file locali</em>. Si apre la cartella in cui si trova <code>gbr.exe</code>.`,
      install_step4: `Estrai lo zip in quella cartella. Accetta di sostituire se te lo chiede.`,
      install_step5: `Apri il gioco da Steam.`,
      install_online: `<strong>Giocare online.</strong> Tutti hanno bisogno della stessa versione della mod e degli stessi contenuti di gioco. Nel menu principale, <em>Multigiocatore</em>: uno crea la stanza e gli altri entrano.`,
      install_settings: `<strong>Le tue impostazioni</strong> sono salvate in <code>imperivm-mod.ini</code>, nella cartella del gioco. Lo zip non lo include, quindi installando una nuova versione si conservano.`,
      install_remove: `<strong>Rimuovere la mod.</strong> Elimina <code>winmm.dll</code> dalla cartella del gioco. Il gioco torna quello originale.`,
      install_failure: `<strong>Se qualcosa non va,</strong> usa <em>Crea rapporto</em> o guarda i log in <code>Logs\\imperivm</code>, e segnalalo su Discord o su GitHub. Più dettagli nella <a href="guide.html">guida e FAQ</a>.`,
      closing_title: `Scaricalo<br>e gioca.`,
      closing_note: `Se qualcosa non va, segnalalo su <a href="https://discord.gg/6kCatX3Zbc" target="_blank" rel="noopener">Discord</a> o su <a href="https://github.com/THIONG/imperivm-resurrected/issues/new/choose" target="_blank" rel="noopener">GitHub</a>.`,
      footer_unofficial: `Progetto non ufficiale della community.`,
      footer_back: `Torna alla home`,
      footer_links_label: `Link`,
      footer_credits: `Crediti`,

    }
  };

  var extra = window.EXTRA_TRANSLATIONS || {};
  Object.keys(extra).forEach(function (id) {
    if (!T[id]) return;
    Object.keys(extra[id]).forEach(function (k) { T[id][k] = extra[id][k]; });
  });

  function saved() {
    try { var g = localStorage.getItem('language'); if (LANGUAGES.indexOf(g) >= 0) return g; } catch (e) { }
    return null;
  }
  function fromBrowser() {
    var l = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < l.length; i++) {
      var c = String(l[i]).slice(0, 2).toLowerCase();
      if (LANGUAGES.indexOf(c) >= 0) return c;
    }
    return 'en';
  }

  var nodes = [];
  function collect() {
    var list = document.querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-attr]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i], o = { el: el };
      if (el.hasAttribute('data-i18n')) { o.kt = el.getAttribute('data-i18n'); o.t = el.textContent; }
      if (el.hasAttribute('data-i18n-html')) { o.kh = el.getAttribute('data-i18n-html'); o.h = el.innerHTML; }
      if (el.hasAttribute('data-i18n-attr')) {
        o.a = [];
        el.getAttribute('data-i18n-attr').split(';').forEach(function (par) {
          var p = par.split(':');
          o.a.push({ name: p[0], key: p[1], es: el.getAttribute(p[0]) });
        });
      }
      nodes.push(o);
    }
  }
  function translate(id, key, original) {
    if (id === 'es' || !T[id] || T[id][key] === undefined) return original;
    return T[id][key];
  }
  function applyLanguage(id) {
    nodes.forEach(function (o) {
      if (o.kt) o.el.textContent = translate(id, o.kt, o.t);
      if (o.kh) o.el.innerHTML = translate(id, o.kh, o.h);
      if (o.a) o.a.forEach(function (x) { o.el.setAttribute(x.name, translate(id, x.key, x.es)); });
    });
    document.documentElement.lang = id;
    var boxes = document.querySelectorAll('.languages');
    for (var c = 0; c < boxes.length; c++) {
      var code = boxes[c].querySelector('.languages__code'), btn = boxes[c].querySelector('.languages__button'), ops = boxes[c].querySelectorAll('[role="option"]');
      if (code) code.textContent = LABEL[id];
      if (btn) btn.setAttribute('aria-label', LANGUAGE_LABEL[id] + ': ' + NAME[id]);
      for (var k = 0; k < ops.length; k++) ops[k].setAttribute('aria-selected', ops[k].getAttribute('data-lang') === id ? 'true' : 'false');
    }
    document.dispatchEvent(new CustomEvent('language-change', { detail: id }));
  }

  var LANGUAGE_LABEL = { es: 'Idioma', en: 'Language', it: 'Lingua' };
  var GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>';
  var CHEVRON = '<svg class="languages__arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';

  function build(box) {
    var uid = 'idi' + Math.random().toString(36).slice(2, 7);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'languages__button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', uid);
    button.innerHTML = GLOBE + '<span class="languages__code"></span>' + CHEVRON;
    var list = document.createElement('ul');
    list.id = uid;
    list.className = 'languages__list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    LANGUAGES.forEach(function (id) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('data-lang', id);
      li.setAttribute('lang', id);
      li.tabIndex = -1;
      li.innerHTML = '<span>' + NAME[id] + '</span><b>' + LABEL[id] + '</b>';
      list.appendChild(li);
    });
    box.appendChild(button);
    box.appendChild(list);

    function isOpen() { return !list.hidden; }
    function openList() { list.hidden = false; button.setAttribute('aria-expanded', 'true'); (list.querySelector('[aria-selected="true"]') || list.firstChild).focus(); }
    function closeList(returnFocus) { list.hidden = true; button.setAttribute('aria-expanded', 'false'); if (returnFocus) button.focus(); }
    function choose(li) {
      var id = li.getAttribute('data-lang');
      try { localStorage.setItem('language', id); } catch (e) { }
      closeList(true);
      applyLanguage(id);
    }
    button.addEventListener('click', function () { if (isOpen()) closeList(false); else openList(); });
    button.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList(); } });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) choose(li); });
    list.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(list.children), i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) choose(items[i]); }
      else if (e.key === 'Escape') { e.preventDefault(); closeList(true); }
      else if (e.key === 'Tab') { closeList(false); }
    });
    document.addEventListener('click', function (e) { if (isOpen() && !box.contains(e.target)) closeList(false); });
  }

  function selector() {
    var boxes = document.querySelectorAll('.languages');
    for (var i = 0; i < boxes.length; i++) build(boxes[i]);
  }

  collect();
  selector();
  applyLanguage(saved() || fromBrowser());
})();
