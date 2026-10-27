# 🎮 Pink & Purple Adventure

Růžovo-fialová 2D plošinovka do prohlížeče, která jde hrát na počítači i na mobilu. Hráč skáče po platformách, sbírá mince, chroupe okurkové power-upy a může si popovídat s AI přítelkyní Lumi.

Hra je napsaná v čistém HTML5 Canvas, CSS a JavaScriptu. Nepotřebuje backend, knihovny ani obrázky, všechno se kreslí procedurálně a zvuky se syntetizují přes WebAudio.

## Spuštění

Stačí otevřít `index.html` v prohlížeči. Kvůli mobilu je lepší hru servírovat přes jednoduchý server, například:

```bash
python -m http.server 8000
```

a pak otevřít `http://localhost:8000` (případně z telefonu na IP adrese počítače ve stejné síti).

## Ovládání

| Klávesa | Akce |
|---|---|
| A / ← | doleva |
| D / → | doprava |
| Mezerník / W / ↑ | skok (delší podržení = vyšší skok) |
| E | interakce (promluvit si s Lumi) |
| Esc | pauza |

Na telefonu se ukáže dotykový ovladač: vlevo směrová plocha, vpravo tlačítko skoku a u Lumi tlačítko 💬. Směr a skok jdou držet současně. Hraje se na šířku.

## Co ve hře je

- **3 úrovně** s rostoucí obtížností: Levandulová louka, Růžové útesy a Okurková pevnost.
- **Nepřátelé** (fialové slizy) hlídkují a otáčejí se na konci trasy. Kdo jim skočí na hlavu, porazí je, kdo do nich vrazí ze strany, přijde o život.
- **Propasti a bodáky.** Po pádu se hráč vrací na poslední bezpečné místo nebo na checkpoint.
- **Okurky:** zelená dává super skok na 10 s, zlatá nezranitelnost na 8 s (postava bliká a slizy rozráží), růžová super rychlost na 10 s.
- **Body a mince se počítají zvlášť.** Mince = 10 bodů a 1 mince, poražený nepřítel 50, okurka 25 a dokončená úroveň 200 bodů.
- **AI přítelkyně Lumi** jede na lokálním dialogovém systému bez jazykového modelu. Dá se jí darovat 10, 25 nebo 50 mincí (+5 / +15 / +35 náklonnosti, nejvýš 100). Podle náklonnosti se mění vztah (Neznámí → Kamarádi → Dobří přátelé → Maximální náklonnost) i její hlášky a odměny: body, život navíc a nakonec kouzelný štít.
- **3 životy, Game Over, vítězná obrazovka** a nejlepší skóre uložené v `localStorage`.

## Struktura

```text
index.html   – kostra stránky, HUD, obrazovky a dotykové ovládání
style.css    – růžovo-fialový vzhled, overlaye a responzivita
game.js      – herní smyčka, fyzika, kolize, úrovně, nepřátelé, power-upy, Lumi, vykreslování
```

`game.js` je rozdělený do oddílů: konstanty, definice úrovní (stavějí se přes jednoduché API `ground`, `plat`, `enemy`, `coins`…), dialogy, zvuk, vstup, stavy hry, kolize, herní logika, efekty, vykreslování, HUD a smyčka. Fyzika běží s pevným krokem 1/120 s přes `requestAnimationFrame`, takže pohyb nezávisí na snímkové frekvenci.

Pro ladění jde otevřít `index.html#debug`. V konzoli je pak dostupný objekt `ppa` se stavem hry.
