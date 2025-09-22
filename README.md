# Tietovisa

### Johdanto
Projektin tavoitteena on toteuttaa selainpohjainen tietovisapeli, joka hyödyntää Open Trivia Database -rajapintaa (https://opentdb.com/). Käyttäjä voi pelata tietovisaa valitsemalla aihepiirin, vaikeustason ja kysymysten määrän. Sovellus arpoo kysymykset rajapinnasta ja tarjoaa käyttäjälle monivalintatehtäviä, joista pisteet lasketaan automaattisesti. Projekti toteutetaan Reactilla.

### Käsitteet
- **React** - JavaScript-kirjasto käyttöliittymien rakentamiseen.
- **API (Application Programming interface)** - rajapinta, jonka kautta sovellus saa tietoja ulkoisesta lähteestä.
- **Open Trivia Database (OTDB)** - ilmainen tietokantapalvelu, josta saa kysymyksiä eri aihealueista.
- **Komponentti** – React-sovelluksen rakennuspalikka, joka vastaa tietystä toiminnallisuudesta tai näkymästä.

### Tavoite
- Toteuttaa interaktiivinen ja helppokäyttöinen tietovisapeli.
- Käyttäjä voi valita kysymyksiä eri aiheista ja vaikeustasoista.
- Pisteytys näkyy reaaliaikaisesti pelin lopussa.
- Sovellus toimii selaimessa ja sitä voi laajentaa myöhemmin.

### Resurssit
- Ohjelmistot: Node.js, npm/yarn, React, mahdollinen UI-kirjasto (esim. TailwindCSS / Material UI).
- Rajapinta: Open Trivia Database API.
- Työkalut: Git ja GitHub versionhallintaan, Visual Studio Code kehitykseen.
- Henkilöresurssit: 2 hengen tiimi.
- AI työkaluja, kuten Copilot tai ChatGPT vian hallintaan jne.

### Käytänteet
- Versionhallinta GitHubissa (branch-strategia: main/dev/feature).
- Koodikatselmoinnit tiimissä.
- Viikoittainen tilannepalaveri.
- Kanban/Trello taululla tehtävien seuranta.
- Testaus yksikkötestein (esim. Jest/React Testing Library).
- Tehtävät, työmäärät ja työnjako

### Tehtävät, työmäärät ja työnjako*
- Projektin alustus: React-projektin perustaminen, GitHub-repo.
- Käyttöliittymä: Aloitusnäkymä, pelinäkymä, lopputulosnäkymä.
- API-integraatio: Kysymysten haku OTDB:stä, tietojen esittäminen.
- Pelin logiikka: Kysymysten arvonta, vastausten tarkistus, pisteytys.
- Tyylittely ja UX: Responsiivinen käyttöliittymä, visuaalinen viimeistely.
- Testaus ja korjaukset: Toiminnallisuuksien ja rajapinnan testaus.
- Dokumentointi: Projektin ja koodin dokumentaatio.

### Aikataulu
Kokonaisprojekti kestää noin 7-8 viikkoa:

Viikot 1-2 – projektin alustus, API-kokeilut, käyttöliittymän runko. 
Viikot 3-4 – API-integraatio, pelilogiikka.
Viikot 5-6 – käyttöliittymän viimeistely, testaus.
Viikot 7-8 – virheiden korjaus, dokumentointi ja palautus/esitys.

### Riskit ja niiden hallinta
- API:n kaatuminen tai muutokset: toteutetaan varmistus, että peli toimii myös offline-tilassa rajatulla kysymyspaketilla.
- Aikataulun venyminen: pilkotaan tehtävät pieniksi ja seurataan edistymistä viikoittain.
- Osaamispuutteet Reactissa: varataan aikaa oppimiseen ja pariohjelmointiin.
- Yhteistyön haasteet: selkeä kommunikointi, viikkopalaverit ja versionhallinnan säännöt.

### Yhteenveto
Projektissa toteutetaan selainpohjainen tietovisapeli Reactilla hyödyntäen Open Trivia Database -rajapintaa. Työ jakautuu käyttöliittymän, API-integraation ja pelilogiikan toteuttamiseen. Projekti arvioidaan onnistuneeksi, kun käyttäjä voi pelata tietovisaa alusta loppuun, pisteet lasketaan oikein ja käyttöliittymä on selkeä.
