# 🎮 Pink & Purple Adventure – specifikace hry

## 1. Základní koncept
Vytvoř kompletní, hratelnou **2D plošinovou hru** inspirovanou klasickými plošinovkami typu Super Mario. Hra musí fungovat na **počítači i mobilním telefonu** přímo ve webovém prohlížeči.

Hráč ovládá postavičku, překonává překážky, skáče mezi platformami, vyhýbá se nepřátelům, sbírá mince a speciální okurky poskytující dočasné schopnosti. Součástí hry je interaktivní postava **AI přítelkyně**, se kterou lze komunikovat a darovat jí mince.

### Technické požadavky
- HTML5, CSS3 a JavaScript; preferovaně HTML5 Canvas.
- Bez backendu, placených služeb a API klíčů.
- Responzivní zobrazení a podpora klávesnice i dotyku.
- Spuštění otevřením `index.html`.
- Kompletně funkční hra, nikoliv pouze vizuální demonstrace.

## 2. Vizuální styl
- **Růžovo-fialové barevné téma.**
- Fialové vícevrstvé pozadí, růžová hlavní postava, fialové platformy a neonově růžové detaily.
- Hravý kreslený styl, animace při sbírání předmětů a přehledné UI.
- Vlastní jednoduché či procedurálně kreslené objekty bez nutnosti externích obrázků.

## 3. Hlavní postava a ovládání
Postava se pohybuje doleva/doprava, skáče, dopadá na platformy, sbírá předměty a interaguje s NPC.

Implementuj gravitaci, rychlost pohybu, sílu skoku, detekci kolizí a neprůchodnost pevných překážek. Pohyb musí být plynulý.

| Klávesa | Akce |
|---|---|
| A / šipka vlevo | Pohyb doleva |
| D / šipka vpravo | Pohyb doprava |
| Mezerník / W / šipka nahoru | Skok |
| E | Interakce |
| Escape | Pauza |

Na telefonu zobraz velká dotyková tlačítka doleva, doprava, skok a kontextovou interakci. Musí fungovat současné držení směru a skoku.

## 4. Herní svět a překážky
- Pevná zem, vyvýšené platformy, mezery a různě vysoké překážky.
- Propasti, nepřátelé a překážky k přeskočení.
- Při pádu hráč ztrácí život a vrací se na poslední bezpečný bod.
- Alespoň **3 hratelné úrovně** s postupně rostoucí obtížností.
- Na konci úrovně cíl, například portál či vlajka.

## 5. Nepřátelé
Základní nepřítel automaticky hlídkuje doleva a doprava na platformě a otáčí se na konci trasy. Kontakt ze strany způsobí poškození; hráč jej může přeskočit nebo porazit skokem na hlavu. Poražený nepřítel zmizí a přidá body. Po zásahu má hráč krátkou nezranitelnost.

## 6. Mince a bodování
Mince jsou rozmístěné po mapě, při kontaktu se seberou s animací a přičtou do zůstatku. Lze je utrácet u AI přítelkyně. **Body a mince jsou oddělené hodnoty.**

| Akce | Odměna |
|---|---|
| Sebrání mince | 10 bodů a 1 mince |
| Poražení nepřítele | 50 bodů |
| Sebrání okurky | 25 bodů |
| Dokončení úrovně | 200 bodů |

## 7. 🥒 Okurkové power-upy
Po mapě rozmísti okurky různých barev. Sebrání aktivuje dočasnou schopnost:

| Okurka | Efekt | Trvání |
|---|---|---|
| Zelená | Super skok | 10 sekund |
| Zlatá | Nezranitelnost | 8 sekund |
| Růžová | Super rychlost | 10 sekund |

Při sebrání zobraz název schopnosti a odpočet. Zlatá okurka způsobí blikání postavy. Po vypršení se parametry vrátí do normálu.

## 8. 💗 AI přítelkyně
Na bezpečném místě umísti interaktivní NPC. Po přiblížení nabídni akci **„Promluvit si“**, která otevře dialogové okno. Hráč může mluvit, darovat mince, zobrazit náklonnost a získat herní odměnu.

Náklonnost je číslo od 0 do 100:

| Dar | Zvýšení náklonnosti |
|---|---|
| 10 mincí | +5 |
| 25 mincí | +15 |
| 50 mincí | +35 |

Mince se odečtou ze zůstatku; nelze darovat více, než hráč vlastní. Náklonnost nepřekročí 100.

| Náklonnost | Úroveň vztahu | Reakce |
|---|---|---|
| 0–24 | Neznámí | Neutrální komunikace |
| 25–49 | Kamarádi | Přátelštější reakce |
| 50–79 | Dobří přátelé | Speciální dialogy a menší bonusy |
| 80–100 | Maximální náklonnost | Speciální odměna, například bonusový štít |

Pro první verzi **nepoužívej skutečné jazykové AI**. Vytvoř lokální dialogový systém s několika humornými odpověďmi podle úrovně náklonnosti.

## 9. Životy a konec hry
Hráč začíná se **3 životy**. Život ztrácí při kontaktu s nepřítelem ze strany, pádu do propasti nebo kontaktu s nebezpečnou překážkou. Při vyčerpání životů zobraz **GAME OVER** s možností restartu. Po dokončení všech úrovní zobraz vítěznou obrazovku a skóre.

## 10. Uživatelské rozhraní
Za hry zobraz počet životů, mince, skóre, aktivní power-up s odpočtem a číslo úrovně.

Obrazovky: hlavní menu, hra, pauza, dialog s AI přítelkyní, Game Over a vítězná obrazovka.

## 11. Mobilní optimalizace
- Responzivní Canvas pro různá rozlišení.
- Velká dotyková tlačítka a současný pohyb se skokem.
- Zamezení nechtěnému scrollování stránky během hry.
- Plynulé animace a čitelné rozhraní na malých displejích.
- Preferuj telefon na šířku; při orientaci na výšku zobraz doporučení otočit zařízení.

## 12. Technická implementace
Doporučená struktura:

```text
pink-purple-adventure/
├── index.html
├── style.css
├── game.js
└── README.md
```

Logicky odděl herní smyčku, vykreslování, pohyb, fyziku, kolize, nepřátele, sběratelské předměty, power-upy, mince, NPC, úrovně, UI a dotykové ovládání.

Použij `requestAnimationFrame` a časově nezávislý výpočet pohybu. Nejlepší skóre ukládej pomocí `localStorage`.

## 13. Kritéria dokončení
- Hru lze dohrát od začátku do konce.
- Postava nepropadává platformami; kolize fungují.
- Nepřátelé hlídkují a reagují na skok na hlavu.
- Okurkové efekty se správně zapínají a vypínají.
- Mince se přičítají a při darování odečítají.
- NPC mění dialogy podle náklonnosti.
- Hra je ovladatelná na počítači i telefonu.
- JavaScript konzole neobsahuje chyby.
- Hra má jasný začátek, konec a restart.

## 14. Postup implementace
1. **Hratelný základ:** postava, platformy, gravitace, skoky a kolize.
2. **Herní mechaniky:** nepřátelé, mince, skóre, životy a úrovně.
3. **Speciální funkce:** okurkové power-upy a NPC s náklonností.
4. **Vizuální zpracování:** růžovo-fialový design, animace, UI.
5. **Mobilní verze:** dotykové ovládání a responzivita.
6. **Testování:** ověř mechaniky, oprav chyby a projdi hru až do konce.

## 15. Finální instrukce pro coding agenta
**Vytvoř kompletní funkční hru podle této specifikace.** Neomezuj se na návrh architektury ani ukázky kódu. Implementuj hratelnou webovou plošinovku se všemi popsanými funkcemi.

Priority: (1) funkční a zábavná hratelnost, (2) spolehlivé ovládání na PC a mobilu, (3) všechny studentské nápady, (4) atraktivní růžovo-fialový design, (5) snadné spuštění bez instalace.

Pokud některý detail není určen, zvol rozumné řešení odpovídající charakteru hry. **Výsledkem musí být hotová hra, kterou lze okamžitě otevřít v prohlížeči a hrát.**
