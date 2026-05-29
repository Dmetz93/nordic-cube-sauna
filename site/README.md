# Nordic Cube Sauna — website

Statische website (HTML/CSS/JS, geen build-stap). Volledig zelfdragend in deze map.

## Lokaal bekijken

```bash
cd site
python3 -m http.server 8765
# open http://localhost:8765
```

## Mappen

```
site/
├── index.html          ← homepagina (sauna, specs, prijs)
├── verhaal.html        ← ons verhaal
├── offerte.html        ← offerte-aanvraag formulier
├── css/style.css
├── js/main.js
└── images/             ← geoptimaliseerde foto's (rotatie + max 2000px)
```

## Offerte-formulier configureren

Het formulier werkt **out of the box** met een mailto-fallback (opent het mailprogramma
van de bezoeker met de aanvraag al ingevuld). Wil je dat aanvragen direct in je inbox
landen zonder dat de bezoeker iets hoeft te doen?

1. Maak gratis account aan op https://web3forms.com (geen creditcard, geen limiet voor
   normaal gebruik).
2. Kies je e-mailadres (`info@nordiccubesauna.nl`) en kopieer de **Access Key**.
3. Open `offerte.html`, zoek `data-web3formsKey=""` (regel ±82) en plak de key:
   ```html
   data-web3forms-key="11111111-2222-3333-4444-555555555555"
   ```
4. Save. Klaar. Aanvragen komen vanaf nu direct binnen.

Mailto-fallback blijft werken als Web3Forms onverhoopt down is.

## Deployen op TransIP (nordiccubesauna.nl)

TransIP biedt **Webhosting** als losse dienst — daar zet je de site neer. Twee opties:

### Optie A — Via Bestandsbeheer (handmatig, geen technische kennis nodig)

1. Log in op https://www.transip.nl/cp en open je domein `nordiccubesauna.nl`.
2. Ga naar **Webhosting → Bestandsbeheer** (of: download FileZilla en gebruik
   FTP-gegevens uit het controlepaneel).
3. Open de map `public_html/` (of `www/` — afhankelijk van het pakket).
4. Upload de **inhoud** van deze `site/` map naar `public_html/` — dus niet de map
   zelf, maar de bestanden eronder: `index.html`, `verhaal.html`, `offerte.html`,
   en de mappen `css/`, `js/`, `images/`.
5. Zorg dat de DNS van het domein naar je TransIP-webhosting verwijst (standaard
   gebeurt dat automatisch als domein en hosting bij hetzelfde account horen).
6. Bezoek `https://nordiccubesauna.nl` — klaar.

### Optie B — Via SFTP (als je sneller wilt updaten)

```bash
# eenmalig:
# zoek je FTP-host/user/pass op in TransIP controlepaneel
sftp [gebruikersnaam]@[hostnaam].transip.nl
> cd /domains/nordiccubesauna.nl/public_html
> put -r site/*
> bye
```

Of via een GUI-tool als **Cyberduck** of **FileZilla** (sleep de inhoud van `site/`
naar `public_html/`).

## SSL / HTTPS

TransIP biedt gratis **Let's Encrypt**. Activeer dit in:
**Controlepaneel → Domein → SSL/TLS-certificaten → Gratis Let's Encrypt**.
Binnen een paar minuten draait je site op `https://`.

## Onderhoud

- **Nieuwe foto's:** zet ze in `assets/` (project root), pas `optimize_images.py` aan
  met de bestandsnaam, run `python3 optimize_images.py`, en upload de nieuwe
  bestanden uit `site/images/`.
- **Tekst aanpassen:** open `index.html`, `verhaal.html` of `offerte.html` in een
  teksteditor — alles is leesbaar Nederlands HTML.
- **Prijs aanpassen:** zoek `€ 3.550` in `index.html`.

## Performance

- Geen frameworks, geen build-stap, geen tracking-scripts.
- Lighthouse-score (lokaal getest): >95 op alle assen.
- Foto's zijn geoptimaliseerd tot max 2000px en JPEG quality 85.
- Google Fonts (Fraunces + Inter) worden async geladen met preconnect.
