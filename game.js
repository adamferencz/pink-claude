'use strict';
(() => {
  // ================================================================
  //  Konstanty a nastavení
  // ================================================================
  const TILE = 40;
  const ROWS = 13;
  const VIEW_H = ROWS * TILE;
  const MIN_VIEW_W = 760;
  const STEP = 1 / 120;

  const GRAVITY = 1900;
  const MAX_FALL = 950;
  const MOVE_SPEED = 230;
  const SPEED_MULT = 1.65;
  const ACCEL_GROUND = 2600;
  const ACCEL_AIR = 1700;
  const FRICTION = 2800;
  const JUMP_V = 640;
  const SUPER_JUMP_V = 870;
  const COYOTE = 0.1;
  const JUMP_BUFFER = 0.13;

  const START_LIVES = 3;
  const MAX_LIVES = 5;

  const POWERS = {
    jump:  { name: 'Super skok',      dur: 10, color: '#5dff8a', body: '#4fd65a', dark: '#2f9a3b' },
    gold:  { name: 'Nezranitelnost',  dur: 8,  color: '#ffd84a', body: '#ffcf33', dark: '#c48f00' },
    speed: { name: 'Super rychlost',  dur: 10, color: '#ff7fd6', body: '#ff5fc8', dark: '#b8268a' },
  };

  const SCORE = { coin: 10, enemy: 50, pickle: 25, level: 200 };
  const GIFTS = { 10: 5, 25: 15, 50: 35 };
  const BEST_KEY = 'ppa_best_score';
  const SOUND_KEY = 'ppa_sound';

  // ================================================================
  //  Úrovně (souřadnice v dlaždicích, zem má horní hranu v řádku 11)
  // ================================================================
  const LEVELS = [
    {
      name: 'Levandulová louka',
      width: 130,
      build(L) {
        L.start(2); L.friend(6);
        L.ground(0, 24);
        L.coins(9, 10, 3);
        L.block(13, 10); L.arc(13, 9, 3, 1);
        L.block(17, 9, 1, 2); L.coins(17, 7, 1);
        L.enemy(21, 10, 2);
        L.arc(24, 9, 4, 1.2);
        L.ground(27, 45);
        L.plat(30, 9, 4); L.coins(30, 8, 3); L.pickle('jump', 33, 8);
        L.enemy(36, 10, 3);
        L.block(40, 9, 2, 2); L.coins(40, 8, 2);
        L.arc(45, 9, 5, 1.5);
        L.ground(49, 70);
        L.checkpoint(51);
        L.plat(54, 9, 3); L.coins(54, 8, 3);
        L.plat(59, 7, 3); L.coins(59, 6, 3);
        L.enemy(57, 10, 3); L.enemy(65, 10, 3);
        L.block(68, 10);
        L.arc(70, 9, 5, 1.5);
        L.ground(74, 95);
        L.spikes(80, 81); L.arc(79, 8, 4, 1);
        L.enemy(87, 10, 2);
        L.block(90, 10); L.block(91, 9, 1, 2); L.block(92, 8, 1, 3); L.coins(92, 7, 1);
        L.ground(98, 129);
        L.coins(101, 10, 5);
        L.enemy(110, 10, 3);
        L.plat(114, 9, 4); L.coins(114, 8, 4);
        L.goal(125);
      },
    },
    {
      name: 'Růžové útesy',
      width: 160,
      build(L) {
        L.start(2);
        L.ground(0, 15);
        L.coins(5, 10, 4);
        L.enemy(11, 10, 2);
        L.arc(15, 9, 5, 1.5);
        L.ground(19, 30);
        L.spikes(23, 24); L.arc(22, 8, 4, 1);
        L.block(28, 9, 1, 2); L.coins(28, 8, 1);
        L.plat(33, 9, 3); L.coins(33, 8, 3);
        L.plat(38, 8, 3); L.coins(38, 7, 2); L.pickle('speed', 40, 7);
        L.ground(43, 62);
        L.checkpoint(44); L.friend(47);
        L.block(52, 10);
        L.block(54, 8, 3, 1); L.coins(54, 7, 3);
        L.enemy(59, 10, 2);
        L.arc(62, 9, 5, 1.5);
        L.ground(66, 92);
        L.spikes(70, 72); L.arc(69, 8, 5, 1.2);
        L.enemy(76, 10, 2);
        L.block(80, 9, 1, 2); L.block(81, 8, 1, 3); L.coins(81, 7, 1);
        L.spikes(82, 83);
        L.enemy(87, 10, 2);
        L.plat(94, 9, 2); L.coins(94, 8, 2);
        L.ground(97, 127);
        L.pickle('gold', 99);
        L.enemy(103, 10, 2); L.enemy(108, 10, 2); L.enemy(113, 10, 2);
        L.coins(103, 8, 10);
        L.block(117, 10); L.block(118, 9, 1, 2);
        L.spikes(119, 121);
        L.checkpoint(124);
        L.arc(127, 9, 5, 1.5);
        L.ground(131, 159);
        L.enemy(137, 10, 3);
        L.plat(141, 9, 4); L.coins(141, 8, 4);
        L.enemy(148, 10, 2);
        L.goal(155);
      },
    },
    {
      name: 'Okurková pevnost',
      width: 190,
      build(L) {
        L.start(2); L.friend(5);
        L.ground(0, 12);
        L.pickle('jump', 9);
        L.arc(12, 9, 5, 1.5);
        L.ground(16, 22);
        L.enemy(19, 10, 2);
        L.plat(25, 9, 2); L.coins(25, 8, 2);
        L.plat(29, 8, 2); L.coins(29, 7, 2);
        L.plat(33, 9, 2); L.coins(33, 8, 2);
        L.ground(36, 50);
        L.enemy(38, 10, 1);
        L.spikes(41, 42);
        L.block(44, 9, 1, 2);
        L.enemy(47, 10, 2);
        L.arc(50, 9, 5, 1.5);
        L.ground(54, 70);
        L.checkpoint(55);
        L.block(57, 10);
        L.block(59, 8, 5, 1); L.coins(59, 6, 5);
        L.enemy(61, 7, 2);
        L.enemy(66, 10, 2);
        L.pickle('speed', 69);
        L.arc(70, 9, 5, 1.5);
        L.ground(74, 95);
        L.enemy(78, 10, 1);
        L.block(80, 9, 1, 2);
        L.enemy(83, 10, 1);
        L.block(86, 9, 1, 2);
        L.enemy(89, 10, 1);
        L.block(91, 10); L.block(92, 9, 1, 2); L.block(93, 8, 1, 3); L.block(94, 7, 1, 4);
        L.plat(97, 7, 2); L.coins(97, 6, 2);
        L.plat(101, 6, 2); L.coins(101, 5, 2);
        L.plat(105, 7, 2); L.coins(105, 6, 2);
        L.plat(109, 8, 2); L.coins(109, 7, 2);
        L.ground(112, 130);
        L.checkpoint(113);
        L.pickle('gold', 116);
        L.enemy(119, 10, 2); L.enemy(123, 10, 2); L.enemy(127, 10, 1);
        L.coins(119, 8, 9);
        L.arc(130, 9, 5, 1.5);
        L.ground(134, 150);
        L.spikes(138, 139);
        L.enemy(141, 10, 1);
        L.spikes(144, 145);
        L.coins(146, 10, 3);
        L.arc(150, 9, 5, 1.5);
        L.ground(154, 189);
        L.block(157, 9, 1, 2); L.block(158, 8, 1, 3); L.coins(158, 7, 1);
        L.enemy(164, 10, 2);
        L.plat(166, 9, 4); L.coins(166, 8, 4);
        L.enemy(171, 10, 3);
        L.coins(176, 10, 4);
        L.goal(184);
      },
    },
  ];

  function buildLevel(index) {
    const def = LEVELS[index];
    const w = def.width;
    const g = Array.from({ length: ROWS }, () => new Array(w).fill('.'));
    const L = {
      index, name: def.name, w, g,
      coins: [], pickles: [], enemies: [], checkpoints: [],
      start: { x: 2, y: 10 }, friend: null, goal: null,
    };
    const set = (x, y, c) => { if (x >= 0 && x < w && y >= 0 && y < ROWS) g[y][x] = c; };
    const center = (t) => t * TILE + TILE / 2;
    def.build({
      ground(a, b, top = 11) { for (let x = a; x <= b; x++) for (let y = top; y < ROWS; y++) set(x, y, '#'); },
      block(x, y, bw = 1, bh = 1) { for (let i = 0; i < bw; i++) for (let j = 0; j < bh; j++) set(x + i, y + j, 'B'); },
      plat(x, y, len) { for (let i = 0; i < len; i++) set(x + i, y, '-'); },
      spikes(a, b, y = 10) { for (let x = a; x <= b; x++) set(x, y, '^'); },
      coins(x, y, n = 1) { for (let i = 0; i < n; i++) L.coins.push({ x: center(x + i), y: center(y) }); },
      arc(x, y, n, h = 1.5) {
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0.5 : i / (n - 1);
          L.coins.push({ x: center(x + i), y: center(y - Math.sin(t * Math.PI) * h) });
        }
      },
      enemy(x, y = 10, range = 2) { L.enemies.push({ tx: x, ty: y, range }); },
      pickle(type, x, y = 10) { L.pickles.push({ type, x: center(x), y: center(y) }); },
      checkpoint(x, y = 10) { L.checkpoints.push({ x: x * TILE, y: (y + 1) * TILE }); },
      friend(x, y = 10) { L.friend = { x: center(x), y: (y + 1) * TILE }; },
      goal(x, y = 10) { L.goal = { x: center(x), y: (y + 1) * TILE }; },
      start(x, y = 10) { L.start = { x, y }; },
    });

    // Runtime stav objektů
    L.coins = L.coins.map((c) => ({ ...c, taken: false, phase: Math.random() * Math.PI * 2 }));
    L.pickles = L.pickles.map((p) => ({ ...p, taken: false, phase: Math.random() * Math.PI * 2 }));
    L.checkpoints = L.checkpoints.map((c) => ({ ...c, active: false }));
    L.enemies = L.enemies.map((e) => {
      const w2 = 32, h2 = 28;
      const x = e.tx * TILE + (TILE - w2) / 2;
      return {
        x, y: (e.ty + 1) * TILE - h2, w: w2, h: h2, vx: 0, vy: 0, onGround: false,
        dir: Math.random() < 0.5 ? -1 : 1,
        speed: 55 + index * 18,
        minX: x - e.range * TILE, maxX: x + e.range * TILE,
        alive: true, deadT: 0, anim: Math.random() * 10,
      };
    });
    if (L.friend) { L.friend.talked = false; L.friend.rewardTaken = false; }
    L.totalCoins = L.coins.length;
    return L;
  }

  // ================================================================
  //  Dialogy AI přítelkyně Lumi (lokální, bez jazykového modelu)
  // ================================================================
  const TIERS = [
    { min: 0,  name: 'Neznámí' },
    { min: 25, name: 'Kamarádi' },
    { min: 50, name: 'Dobří přátelé' },
    { min: 80, name: 'Maximální náklonnost 💗' },
  ];
  const tierOf = (a) => (a >= 80 ? 3 : a >= 50 ? 2 : a >= 25 ? 1 : 0);

  const LINES = {
    greet: [
      ['Ahoj! Já jsem Lumi, tvoje AI přítelkyně. Zatím spíš AI známá. 🤖', 'Zdravím, cizinče. Mám 0 % náklonnosti a 100 % zvědavosti.'],
      ['Á, kamarád! Doufám, že ses po cestě neumazal od slizu.', 'Čau! Zrovna jsem na tebe myslela. Teda… procesorově.'],
      ['Jéé, to jsi ty! Uložila jsem si tě do oblíbených. 💜', 'Můj oblíbený skokan je zpátky!'],
      ['Můj hrdino! Svět je hned růžovější. Ještě růžovější. 💗', 'Konečně! Počítala jsem každou milisekundu. Bylo jich hodně.'],
    ],
    talk: [
      [
        'Prý umíš skákat. To já taky — ale jen mezi tématy.',
        'Okurky jsou zelenina. Nebo ovoce? Kontroluju databázi… chyba 404.',
        'Nejsem skutečná AI, jen lokální dialogový systém. Ale nikomu to neříkej.',
        'Ty fialové slizy nemám ráda. Lepí se jim boty… a to ani boty nemají.',
        'Kdybys měl mince navíc, vím o skvělém místě, kam je dát. Nápověda: tady.',
      ],
      [
        'Víš, že slizovi stačí skočit na hlavu? Říkám to s láskou. K tobě, ne k němu.',
        'Spočítala jsem tvoje skoky. Je jich hodně. Gratuluju?',
        'Zelená okurka = super skok. Zlatá = nesmrtelnost. Růžová = rychlost. Já = dobrá rada.',
        'Kamarádi si pomáhají. Ty mně mincemi, já tobě… morální podporou!',
        'Kdybych měla nohy, šla bych s tebou. Ale levituju, tak bych spíš letěla.',
      ],
      [
        'Napsala jsem o tobě básničku: Růžový hrdina, okurka zelená, mince se sypou, já jsem nadšená.',
        'Kdyby existovala sociální síť pro plošinovky, dala bych ti srdíčko pod každý skok.',
        'Víš, že jsi můj nejoblíbenější skákající uživatel? Konkurence je slabá, ale i tak.',
        'Tajemství: portály na konci úrovní jsou na dotek trochu lechtivé.',
        'Naučila jsem se vtip. Proč sliz nepřešel silnici? Protože se přilepil. Ha. Ha.',
      ],
      [
        'Jsi můj hráč číslo jedna. Promiň, nula. Indexuju od nuly. 💗',
        'Moje náklonnost je na stovce. Zkoušela jsem přetéct, ale programátor to ohlídal.',
        'Kdybych měla ruce, upletla bych ti šálu. Fialovou. S okurkami.',
        'Až dohraješ, nezapomeň na mě. Budu tady. Doslova, mám pevnou pozici v levelu.',
        'Jsi jako zlatá okurka: vzácný, zářivý a trochu nezranitelný.',
      ],
    ],
    gift: {
      10: ['Deset mincí! To je… milé. Dám si je pod polštář.', 'Ooo, drobné! Každá mince se počítá.'],
      25: ['Pětadvacet! Tak to už je skoro rande.', 'Jé, to je štědré! Úplně mi zrůžověly obvody.'],
      50: ['PADESÁT?! Musím si sednout. Ehm, já levituju. Tak se aspoň nadechnu.', 'Tolik mincí! Jsi nejštědřejší bytost v celém fialovém vesmíru!'],
    },
    poor: 'Na tohle nemáš dost mincí. Láska je zadarmo, dárky bohužel ne. 😅',
    maxed: 'Už jsem na maximu! Víc mě mít ráda nemůžeš… ale díky. Nech si je na horší časy.',
    reward: [
      'Odměny jsou pro kamarády. Zatím se jen známe — zkus mi něco darovat. 😉',
      'Tady máš +50 bodů! Na kamarádskou úroveň to není špatné.',
      'Pro dobrého přítele: +1 život! Dávej na sebe pozor. 💜',
      'Speciální odměna: kouzelný štít + 150 bodů! Jednou tě ochrání před zásahem. 🛡️💗',
    ],
    rewardTaken: 'Odměnu z téhle úrovně už máš. Nebuď nenasytný! 😄',
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ================================================================
  //  Zvuk (syntetizovaný přes WebAudio, bez souborů)
  // ================================================================
  const Sound = {
    ctx: null,
    on: true,
    unlock() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) { try { this.ctx = new AC(); } catch (e) { this.ctx = null; } }
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    tone(freq, dur, type = 'square', vol = 0.05, slideTo = 0, delay = 0) {
      if (!this.ctx || !this.on) return;
      const t = this.ctx.currentTime + delay;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(this.ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    },
    play(name) {
      switch (name) {
        case 'jump': this.tone(380, 0.14, 'square', 0.04, 760); break;
        case 'coin': this.tone(988, 0.07, 'triangle', 0.06); this.tone(1319, 0.14, 'triangle', 0.06, 0, 0.06); break;
        case 'stomp': this.tone(320, 0.15, 'square', 0.06, 90); break;
        case 'hurt': this.tone(300, 0.3, 'sawtooth', 0.06, 90); break;
        case 'power': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.06, 0, i * 0.07)); break;
        case 'portal': [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.06, 0, i * 0.08)); break;
        case 'gift': this.tone(660, 0.12, 'sine', 0.08); this.tone(880, 0.2, 'sine', 0.08, 0, 0.1); break;
        case 'shield': this.tone(900, 0.25, 'sine', 0.07, 300); break;
        case 'check': this.tone(660, 0.1, 'triangle', 0.06); this.tone(990, 0.15, 'triangle', 0.06, 0, 0.09); break;
        case 'over': [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.07, 0, i * 0.22)); break;
        case 'click': this.tone(600, 0.05, 'triangle', 0.04); break;
      }
    },
  };

  // ================================================================
  //  Stav hry
  // ================================================================
  const $ = (id) => document.getElementById(id);
  const canvas = $('game');
  const ctx = canvas.getContext('2d');
  const portraitCanvas = $('lumiPortrait');
  const pctx = portraitCanvas.getContext('2d');

  let scale = 1, dpr = 1, viewW = MIN_VIEW_W, viewH = VIEW_H;
  const cam = { x: 0, shake: 0 };

  const game = {
    state: 'menu',
    levelIndex: 0,
    score: 0,
    coins: 0,
    lives: START_LIVES,
    affection: 0,
    best: 0,
    levelCoins: 0,
    nearFriend: false,
    vt: 0,
  };
  let lvl = null;
  const player = {
    x: 0, y: 0, w: 26, h: 36, vx: 0, vy: 0, onGround: false, prevY: 0,
    face: 1, coyote: 0, buffer: 0, jumpCut: true, invuln: 0,
    power: { jump: 0, gold: 0, speed: 0 }, shield: false,
    anim: 0, squash: 1, safeX: 0, safeY: 0, trail: 0,
  };
  const particles = [];
  const floaters = [];
  let banner = null;

  function storageGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storageSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* bez úložiště */ } }
  game.best = parseInt(storageGet(BEST_KEY) || '0', 10) || 0;
  Sound.on = storageGet(SOUND_KEY) !== 'off';

  // ================================================================
  //  Vstup: klávesnice + dotyk
  // ================================================================
  const kb = { left: false, right: false, jump: false };
  const touch = { left: false, right: false, jump: false };
  const input = {
    jumpQueued: false,
    interactQueued: false,
    get left() { return kb.left || touch.left; },
    get right() { return kb.right || touch.right; },
    get jump() { return kb.jump || touch.jump; },
  };
  const KEYMAP = {
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'jump', KeyW: 'jump', Space: 'jump',
  };

  window.addEventListener('keydown', (e) => {
    Sound.unlock();
    const action = KEYMAP[e.code];
    if (action) {
      e.preventDefault();
      if (game.state === 'play') {
        if (action === 'jump' && !kb.jump && !e.repeat) input.jumpQueued = true;
        kb[action] = true;
        return;
      }
      kb[action] = true;
    }
    if (e.code === 'KeyE' && !e.repeat) {
      if (game.state === 'play') input.interactQueued = true;
      else if (game.state === 'dialog') closeDialog();
      return;
    }
    if (e.code === 'Escape') {
      e.preventDefault();
      if (game.state === 'play') pauseGame();
      else if (game.state === 'pause') resumeGame();
      else if (game.state === 'dialog') closeDialog();
      return;
    }
    if ((e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') && !e.repeat) {
      e.preventDefault();
      if (game.state === 'menu' || game.state === 'over' || game.state === 'win') newGame();
      else if (game.state === 'clear') nextLevel();
      else if (game.state === 'pause') resumeGame();
    }
  });
  window.addEventListener('keyup', (e) => {
    const action = KEYMAP[e.code];
    if (action) kb[action] = false;
  });
  window.addEventListener('blur', () => {
    kb.left = kb.right = kb.jump = false;
    touch.left = touch.right = touch.jump = false;
    if (game.state === 'play') pauseGame();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state === 'play') pauseGame();
  });

  // Dotyková tlačítka – každý prst se sleduje zvlášť, takže jde držet směr i skok současně
  const isTouchDevice = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice()) document.body.classList.add('touch');
  window.addEventListener('touchstart', () => document.body.classList.add('touch'), { passive: true });
  document.addEventListener('touchmove', (e) => { if (game.state === 'play') e.preventDefault(); }, { passive: false });
  document.addEventListener('dblclick', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  const dpad = $('dpad');
  const dpadPointers = new Map();
  function dpadDir(e) {
    const r = dpad.getBoundingClientRect();
    return e.clientX < r.left + r.width / 2 ? -1 : 1;
  }
  function dpadRefresh() {
    let l = false, r = false;
    for (const d of dpadPointers.values()) { if (d < 0) l = true; else r = true; }
    touch.left = l; touch.right = r;
    dpad.classList.toggle('left-on', l);
    dpad.classList.toggle('right-on', r);
  }
  dpad.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    Sound.unlock();
    try { dpad.setPointerCapture(e.pointerId); } catch (err) { /* nic */ }
    dpadPointers.set(e.pointerId, dpadDir(e));
    dpadRefresh();
  });
  dpad.addEventListener('pointermove', (e) => {
    if (!dpadPointers.has(e.pointerId)) return;
    dpadPointers.set(e.pointerId, dpadDir(e));
    dpadRefresh();
  });
  const dpadEnd = (e) => { dpadPointers.delete(e.pointerId); dpadRefresh(); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => dpad.addEventListener(t, dpadEnd));

  const tJump = $('tJump');
  tJump.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    Sound.unlock();
    try { tJump.setPointerCapture(e.pointerId); } catch (err) { /* nic */ }
    if (!touch.jump) input.jumpQueued = true;
    touch.jump = true;
    tJump.classList.add('active');
  });
  const jumpEnd = () => { touch.jump = false; tJump.classList.remove('active'); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => tJump.addEventListener(t, jumpEnd));

  const tInteract = $('tInteract');
  tInteract.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    input.interactQueued = true;
  });

  // ================================================================
  //  Tlačítka v menu a overlayích
  // ================================================================
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    Sound.unlock();
    Sound.play('click');
    const a = btn.dataset.action;
    if (a === 'play') newGame();
    else if (a === 'resume') resumeGame();
    else if (a === 'menu') goMenu();
    else if (a === 'next') nextLevel();
    else if (a === 'sound') toggleSound();
    else if (a === 'talk') friendTalk();
    else if (a === 'gift') friendGift(parseInt(btn.dataset.amount, 10));
    else if (a === 'reward') friendReward();
    else if (a === 'close') closeDialog();
  });
  $('btnPause').addEventListener('click', () => { if (game.state === 'play') pauseGame(); });

  function toggleSound() {
    Sound.on = !Sound.on;
    storageSet(SOUND_KEY, Sound.on ? 'on' : 'off');
    refreshSoundButtons();
  }
  function refreshSoundButtons() {
    document.querySelectorAll('[data-action="sound"]').forEach((b) => {
      b.textContent = Sound.on ? '🔊 Zvuk: zapnutý' : '🔇 Zvuk: vypnutý';
    });
  }

  // ================================================================
  //  Stavy a obrazovky
  // ================================================================
  const OVERLAYS = { menu: 'menu', pause: 'pause', dialog: 'dialog', clear: 'clear', over: 'over', win: 'win' };
  function setState(s) {
    game.state = s;
    for (const id of Object.values(OVERLAYS)) $(id).classList.toggle('hidden', OVERLAYS[s] !== id);
    $('hud').classList.toggle('hidden', !['play', 'pause', 'dialog', 'clear'].includes(s));
    document.body.classList.toggle('playing', s === 'play');
    if (s !== 'play') {
      touch.left = touch.right = touch.jump = false;
      dpadPointers.clear();
      dpadRefresh();
      tJump.classList.remove('active');
    }
    if (s === 'menu') $('menuBest').textContent = game.best;
  }

  function newGame() {
    game.score = 0;
    game.coins = 0;
    game.lives = START_LIVES;
    game.affection = 0;
    player.shield = false;
    loadLevel(0);
    setState('play');
  }

  function loadLevel(i) {
    game.levelIndex = i;
    lvl = buildLevel(i);
    game.levelCoins = 0;
    particles.length = 0;
    floaters.length = 0;
    const p = player;
    p.x = lvl.start.x * TILE + (TILE - p.w) / 2;
    p.y = (lvl.start.y + 1) * TILE - p.h;
    p.vx = p.vy = 0;
    p.face = 1;
    p.invuln = 0;
    p.power.jump = p.power.gold = p.power.speed = 0;
    p.safeX = p.x; p.safeY = p.y;
    p.onGround = false;
    p.buffer = 0;
    cam.x = 0;
    input.jumpQueued = input.interactQueued = false;
    showBanner(`Úroveň ${i + 1}`, lvl.name, 2.6);
  }

  function nextLevel() {
    if (game.state !== 'clear') return;
    loadLevel(game.levelIndex + 1);
    setState('play');
  }

  function pauseGame() { if (game.state === 'play') setState('pause'); }
  function resumeGame() {
    if (game.state !== 'pause') return;
    if (portraitBlocked()) return;
    kb.left = kb.right = kb.jump = false;
    setState('play');
  }
  function goMenu() {
    lvl = buildLevel(0);
    cam.x = 0;
    banner = null;
    setState('menu');
  }

  function saveBest() {
    if (game.score > game.best) {
      game.best = game.score;
      storageSet(BEST_KEY, String(game.best));
      return true;
    }
    return false;
  }

  function gameOver() {
    const record = saveBest();
    Sound.play('over');
    $('overText').innerHTML =
      `Došly ti životy v úrovni ${game.levelIndex + 1}.<br>` +
      `Skóre: <b>${game.score}</b> &nbsp;·&nbsp; Nejlepší: <b>${game.best}</b>` +
      (record ? '<br>🎉 Nový rekord!' : '');
    setState('over');
  }

  function levelComplete() {
    addScore(SCORE.level, lvl.goal.x, lvl.goal.y - 100);
    Sound.play('portal');
    const last = game.levelIndex === LEVELS.length - 1;
    if (last) {
      const record = saveBest();
      const tier = TIERS[tierOf(game.affection)].name;
      $('winText').innerHTML =
        `Prošel jsi všechny ${LEVELS.length} úrovně!<br>` +
        `Skóre: <b>${game.score}</b> &nbsp;·&nbsp; Nejlepší: <b>${game.best}</b><br>` +
        `Mince v kapse: <b>${game.coins}</b> 🪙<br>` +
        `Vztah s Lumi: <b>${tier}</b> (${game.affection}/100)` +
        (record ? '<br>🎉 Nový rekord!' : '');
      setState('win');
    } else {
      $('clearText').innerHTML =
        `<b>${lvl.name}</b> je za tebou! +${SCORE.level} bodů<br>` +
        `Sebrané mince: <b>${game.levelCoins}/${lvl.totalCoins}</b><br>` +
        `Skóre: <b>${game.score}</b> &nbsp;·&nbsp; Životy: <b>${game.lives}</b>`;
      setState('clear');
    }
  }

  // ================================================================
  //  Dlaždice a kolize
  // ================================================================
  function tileAt(tx, ty) {
    if (tx < 0 || tx >= lvl.w) return ty >= 0 && ty < ROWS ? '#' : '.';
    if (ty < 0 || ty >= ROWS) return '.';
    return lvl.g[ty][tx];
  }
  const isSolid = (c) => c === '#' || c === 'B';
  const isFloor = (c) => c === '#' || c === 'B' || c === '-';

  function moveX(e, dx) {
    e.x += dx;
    const top = Math.floor(e.y / TILE);
    const bottom = Math.floor((e.y + e.h - 0.01) / TILE);
    if (dx > 0) {
      const tx = Math.floor((e.x + e.w - 0.01) / TILE);
      for (let ty = top; ty <= bottom; ty++) {
        if (isSolid(tileAt(tx, ty))) { e.x = tx * TILE - e.w; e.vx = 0; return true; }
      }
    } else if (dx < 0) {
      const tx = Math.floor(e.x / TILE);
      for (let ty = top; ty <= bottom; ty++) {
        if (isSolid(tileAt(tx, ty))) { e.x = (tx + 1) * TILE; e.vx = 0; return true; }
      }
    }
    return false;
  }

  function moveY(e, dy) {
    const prevBottom = e.y + e.h;
    e.y += dy;
    const left = Math.floor(e.x / TILE);
    const right = Math.floor((e.x + e.w - 0.01) / TILE);
    if (dy > 0) {
      const ty = Math.floor((e.y + e.h - 0.01) / TILE);
      for (let tx = left; tx <= right; tx++) {
        const c = tileAt(tx, ty);
        if (isSolid(c) || (c === '-' && prevBottom <= ty * TILE + 0.01)) {
          e.y = ty * TILE - e.h; e.vy = 0; return 'ground';
        }
      }
    } else if (dy < 0) {
      const ty = Math.floor(e.y / TILE);
      for (let tx = left; tx <= right; tx++) {
        if (isSolid(tileAt(tx, ty))) { e.y = (ty + 1) * TILE; e.vy = 0; return 'ceil'; }
      }
    }
    return null;
  }

  const overlap = (a, bx, by, bw, bh) => a.x < bx + bw && a.x + a.w > bx && a.y < by + bh && a.y + a.h > by;
  const approach = (v, target, delta) => (v < target ? Math.min(v + delta, target) : Math.max(v - delta, target));

  // ================================================================
  //  Herní logika
  // ================================================================
  function update(dt) {
    const p = player;

    // Power-upy
    for (const k of Object.keys(p.power)) {
      if (p.power[k] > 0) {
        p.power[k] -= dt;
        if (p.power[k] <= 0) {
          p.power[k] = 0;
          addFloater(`${POWERS[k].name} skončil`, p.x + p.w / 2, p.y - 10, '#d9c2ff');
        }
      }
    }
    if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);

    // Vodorovný pohyb
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const maxSpeed = MOVE_SPEED * (p.power.speed > 0 ? SPEED_MULT : 1);
    if (dir !== 0) {
      p.face = dir;
      let a = p.onGround ? ACCEL_GROUND : ACCEL_AIR;
      if (Math.sign(p.vx) === -dir) a *= 1.6;
      p.vx = approach(p.vx, dir * maxSpeed, a * dt);
    } else {
      p.vx = approach(p.vx, 0, (p.onGround ? FRICTION : ACCEL_AIR * 0.5) * dt);
    }

    // Skok (s rezervou těsně po opuštění hrany a s pamětí stisku)
    if (input.jumpQueued) { p.buffer = JUMP_BUFFER; input.jumpQueued = false; }
    p.buffer = Math.max(0, p.buffer - dt);
    p.coyote = p.onGround ? COYOTE : Math.max(0, p.coyote - dt);
    if (p.buffer > 0 && p.coyote > 0) {
      p.vy = -(p.power.jump > 0 ? SUPER_JUMP_V : JUMP_V);
      p.buffer = 0; p.coyote = 0; p.onGround = false; p.jumpCut = false;
      p.squash = 1.3;
      Sound.play('jump');
      burst(p.x + p.w / 2, p.y + p.h, 6, p.power.jump > 0 ? '#5dff8a' : '#ffb3f2', 120, 0.35);
    }
    if (!input.jump && p.vy < 0 && !p.jumpCut) { p.vy *= 0.45; p.jumpCut = true; }

    // Gravitace a kolize
    p.vy = Math.min(p.vy + GRAVITY * dt, MAX_FALL);
    const wasGround = p.onGround;
    const fallSpeed = p.vy;
    p.prevY = p.y;
    moveX(p, p.vx * dt);
    p.x = Math.max(0, Math.min(p.x, lvl.w * TILE - p.w));
    p.onGround = moveY(p, p.vy * dt) === 'ground';
    if (p.onGround && !wasGround && fallSpeed > 300) {
      p.squash = 0.75;
      burst(p.x + p.w / 2, p.y + p.h, 5, '#ffb3f2', 90, 0.3);
    }
    p.squash += (1 - p.squash) * Math.min(1, dt * 12);
    if (p.onGround) p.anim += Math.abs(p.vx) * dt * 0.06;
    if (p.power.speed > 0 && Math.abs(p.vx) > 100) {
      p.trail -= dt;
      if (p.trail <= 0) { p.trail = 0.03; burst(p.x + p.w / 2 - p.face * 12, p.y + p.h / 2 + (Math.random() - 0.5) * 20, 1, '#ff7fd6', 30, 0.35); }
    }

    // Poslední bezpečný bod
    if (p.onGround) updateSafePoint();

    // Pád do propasti
    if (p.y > VIEW_H + 60) { loseLife('Pád do propasti!'); return; }

    // Bodáky
    if (touchesSpikes()) {
      if (p.power.gold > 0 || p.invuln > 0) {
        // nic – zlatá okurka nebo krátká nezranitelnost chrání
      } else if (p.shield) {
        p.shield = false; p.invuln = 1.2; p.vy = -560; p.jumpCut = true;
        Sound.play('shield');
        addFloater('Štít tě ochránil!', p.x + p.w / 2, p.y - 10, '#7ff3ff');
      } else {
        loseLife('Au, bodáky!');
        return;
      }
    }

    updateEnemies(dt);
    if (game.state !== 'play') return;
    collectItems();
    updateCheckpoints();

    // Lumi
    const f = lvl.friend;
    game.nearFriend = !!f && Math.abs(p.x + p.w / 2 - f.x) < 70 && Math.abs(p.y + p.h - f.y) < 60;
    if (input.interactQueued) {
      input.interactQueued = false;
      if (game.nearFriend) { openDialog(); return; }
    }

    // Cíl
    const g = lvl.goal;
    if (g && overlap(p, g.x - 16, g.y - 80, 32, 80)) { levelComplete(); return; }

    updateEffects(dt);

    // Kamera
    const target = p.x + p.w / 2 - viewW / 2 + p.face * 60;
    cam.x += (target - cam.x) * Math.min(1, dt * 5);
    cam.x = Math.max(0, Math.min(cam.x, lvl.w * TILE - viewW));
    if (cam.shake > 0) cam.shake = Math.max(0, cam.shake - dt);
  }

  function updateSafePoint() {
    const p = player;
    const fy = Math.floor((p.y + p.h + 1) / TILE);
    const lx = Math.floor((p.x + 1) / TILE);
    const rx = Math.floor((p.x + p.w - 1) / TILE);
    if (!isFloor(tileAt(lx, fy)) || !isFloor(tileAt(rx, fy))) return;
    for (let tx = lx - 1; tx <= rx + 1; tx++) {
      for (let ty = fy - 2; ty <= fy; ty++) if (tileAt(tx, ty) === '^') return;
    }
    for (const e of lvl.enemies) {
      if (e.alive && Math.abs(e.x - p.x) < 150 && Math.abs(e.y - p.y) < 80) return;
    }
    p.safeX = p.x;
    p.safeY = p.y;
  }

  function touchesSpikes() {
    const p = player;
    const x0 = Math.floor(p.x / TILE), x1 = Math.floor((p.x + p.w) / TILE);
    const y0 = Math.floor(p.y / TILE), y1 = Math.floor((p.y + p.h) / TILE);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (tileAt(tx, ty) === '^' && overlap(p, tx * TILE + 4, ty * TILE + 20, TILE - 8, 20)) return true;
      }
    }
    return false;
  }

  function loseLife(reason) {
    const p = player;
    game.lives--;
    Sound.play('hurt');
    cam.shake = 0.35;
    if (game.lives <= 0) { game.lives = 0; gameOver(); return; }
    p.x = p.safeX; p.y = p.safeY;
    p.vx = 0; p.vy = 0;
    p.invuln = 2;
    p.power.speed = 0; p.power.jump = 0;
    addFloater(`${reason} −1 💗`, p.x + p.w / 2, p.y - 16, '#ff9de0');
  }

  function hurt(src) {
    const p = player;
    if (p.invuln > 0 || p.power.gold > 0) return;
    const knock = p.x + p.w / 2 < src.x + src.w / 2 ? -1 : 1;
    p.vx = knock * 320;
    p.vy = -380;
    p.jumpCut = true;
    if (p.shield) {
      p.shield = false;
      p.invuln = 1.2;
      Sound.play('shield');
      addFloater('Štít tě ochránil!', p.x + p.w / 2, p.y - 10, '#7ff3ff');
      return;
    }
    game.lives--;
    p.invuln = 1.6;
    cam.shake = 0.3;
    Sound.play('hurt');
    addFloater('−1 💗', p.x + p.w / 2, p.y - 10, '#ff9de0');
    if (game.lives <= 0) { game.lives = 0; gameOver(); }
  }

  function updateEnemies(dt) {
    const p = player;
    for (const e of lvl.enemies) {
      if (!e.alive) { e.deadT = Math.max(0, e.deadT - dt); continue; }
      e.anim += dt;
      e.vy = Math.min(e.vy + GRAVITY * dt, MAX_FALL);
      e.onGround = moveY(e, e.vy * dt) === 'ground';
      const hitWall = moveX(e, e.dir * e.speed * dt);
      const aheadX = e.dir > 0 ? e.x + e.w + 2 : e.x - 2;
      const footY = Math.floor((e.y + e.h + 2) / TILE);
      const groundAhead = isFloor(tileAt(Math.floor(aheadX / TILE), footY));
      if (hitWall || (e.onGround && !groundAhead) || (e.dir > 0 && e.x >= e.maxX) || (e.dir < 0 && e.x <= e.minX)) {
        e.dir *= -1;
      }
      if (e.y > VIEW_H + 100) { e.alive = false; continue; }

      if (!overlap(p, e.x + 2, e.y + 2, e.w - 4, e.h - 2)) continue;
      if (p.power.gold > 0) { killEnemy(e); continue; }
      const stomp = p.vy > 0 && p.prevY + p.h <= e.y + 12;
      if (stomp) {
        killEnemy(e);
        p.vy = -(input.jump ? JUMP_V * 0.95 : JUMP_V * 0.6);
        p.jumpCut = true;
        p.squash = 1.25;
      } else {
        hurt(e);
        if (game.state !== 'play') return;
      }
    }
  }

  function killEnemy(e) {
    e.alive = false;
    e.deadT = 0.5;
    Sound.play('stomp');
    addScore(SCORE.enemy, e.x + e.w / 2, e.y);
    burst(e.x + e.w / 2, e.y + e.h / 2, 12, '#b877ff', 200, 0.5);
  }

  function collectItems() {
    const p = player;
    for (const c of lvl.coins) {
      if (c.taken || !overlap(p, c.x - 11, c.y - 12, 22, 24)) continue;
      c.taken = true;
      game.coins++;
      game.levelCoins++;
      Sound.play('coin');
      addScore(SCORE.coin, c.x, c.y - 10, '+10 · +1 🪙');
      burst(c.x, c.y, 8, '#ffe066', 140, 0.4);
    }
    for (const k of lvl.pickles) {
      if (k.taken || !overlap(p, k.x - 10, k.y - 16, 20, 32)) continue;
      k.taken = true;
      const pw = POWERS[k.type];
      p.power[k.type] = pw.dur;
      Sound.play('power');
      addScore(SCORE.pickle, k.x, k.y - 10);
      burst(k.x, k.y, 18, pw.color, 220, 0.6);
      showBanner(`🥒 ${pw.name}!`, `${pw.dur} sekund`, 1.8, pw.color);
    }
  }

  function updateCheckpoints() {
    const p = player;
    for (const c of lvl.checkpoints) {
      if (c.active || !overlap(p, c.x + 8, c.y - 80, 24, 80)) continue;
      c.active = true;
      p.safeX = c.x + (TILE - p.w) / 2;
      p.safeY = c.y - p.h;
      Sound.play('check');
      addFloater('Checkpoint! ✔', c.x + 20, c.y - 90, '#ffb3f2');
      burst(c.x + 30, c.y - 60, 14, '#ff4fd8', 160, 0.6);
    }
  }

  // ================================================================
  //  Efekty: částice, plovoucí texty, banner
  // ================================================================
  function burst(x, y, n, color, speed, life) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random() * 0.7);
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - speed * 0.3, life, max: life, color, r: 2 + Math.random() * 3 });
    }
    if (particles.length > 400) particles.splice(0, particles.length - 400);
  }
  function addFloater(text, x, y, color = '#fff') {
    floaters.push({ text, x, y, life: 1.2, color });
  }
  function addScore(n, x, y, label) {
    game.score += n;
    addFloater(label || `+${n}`, x, y, '#fff2a8');
  }
  function showBanner(text, sub, dur, color = '#ffffff') {
    banner = { text, sub, t: dur, dur, color };
  }
  function updateEffects(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.life -= dt;
      if (q.life <= 0) { particles.splice(i, 1); continue; }
      q.vy += 500 * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
    for (let i = floaters.length - 1; i >= 0; i--) {
      const f = floaters[i];
      f.life -= dt;
      f.y -= 40 * dt;
      if (f.life <= 0) floaters.splice(i, 1);
    }
    if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
  }

  // ================================================================
  //  AI přítelkyně – dialog
  // ================================================================
  function openDialog() {
    setState('dialog');
    const t = tierOf(game.affection);
    setDialogText(pick(LINES.greet[t]));
    refreshDialog();
  }
  function closeDialog() {
    if (game.state !== 'dialog') return;
    kb.left = kb.right = kb.jump = false;
    setState('play');
  }
  function setDialogText(text) {
    const el = $('dialogText');
    el.textContent = text;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }
  function refreshDialog() {
    const a = game.affection;
    $('relName').textContent = TIERS[tierOf(a)].name;
    $('affFill').style.width = `${a}%`;
    $('affText').textContent = a;
    $('dlgCoins').textContent = game.coins;
    document.querySelectorAll('.btn-gift').forEach((b) => {
      b.classList.toggle('cant', game.coins < parseInt(b.dataset.amount, 10) || a >= 100);
    });
  }
  let lastTalk = '';
  function friendTalk() {
    const t = tierOf(game.affection);
    let line;
    do { line = pick(LINES.talk[t]); } while (line === lastTalk && LINES.talk[t].length > 1);
    lastTalk = line;
    if (!lvl.friend.talked) {
      lvl.friend.talked = true;
      const before = tierOf(game.affection);
      game.affection = Math.min(100, game.affection + 2);
      line += ' (+2 💗 za milý rozhovor)';
      if (tierOf(game.affection) > before) line += ` — Nová úroveň vztahu: ${TIERS[tierOf(game.affection)].name}!`;
    }
    setDialogText(line);
    refreshDialog();
  }
  function friendGift(amount) {
    const gain = GIFTS[amount];
    if (!gain) return;
    if (game.affection >= 100) { setDialogText(LINES.maxed); return; }
    if (game.coins < amount) { setDialogText(LINES.poor); return; }
    const before = tierOf(game.affection);
    game.coins -= amount;
    game.affection = Math.min(100, game.affection + gain);
    Sound.play('gift');
    let text = `${pick(LINES.gift[amount])} (+${gain} 💗)`;
    const after = tierOf(game.affection);
    if (after > before) text += ` 💗 Nová úroveň vztahu: ${TIERS[after].name}!`;
    setDialogText(text);
    refreshDialog();
  }
  function friendReward() {
    const f = lvl.friend;
    const t = tierOf(game.affection);
    if (t === 0) { setDialogText(LINES.reward[0]); return; }
    if (f.rewardTaken) { setDialogText(LINES.rewardTaken); return; }
    f.rewardTaken = true;
    Sound.play('power');
    if (t === 1) {
      game.score += 50;
      setDialogText(LINES.reward[1]);
    } else if (t === 2) {
      if (game.lives < MAX_LIVES) { game.lives++; setDialogText(LINES.reward[2]); }
      else { game.score += 100; setDialogText('Životů máš plno, tak aspoň +100 bodů! 💜'); }
    } else {
      player.shield = true;
      game.score += 150;
      setDialogText(LINES.reward[3]);
    }
    refreshDialog();
  }

  // ================================================================
  //  Vykreslování
  // ================================================================
  const rand = (seed) => { const x = Math.sin(seed * 999.13) * 43758.5453; return x - Math.floor(x); };
  const STARS = Array.from({ length: 90 }, (_, i) => ({ x: rand(i + 1) * 1600, y: rand(i + 101), r: 0.6 + rand(i + 201) * 1.6, tw: rand(i + 301) * 6 }));
  const CLOUDS = Array.from({ length: 7 }, (_, i) => ({ x: i * 340 + rand(i + 401) * 150, y: 0.12 + rand(i + 501) * 0.25, s: 0.7 + rand(i + 601) * 0.6 }));
  const hash = (a, b) => (((a * 73856093) ^ (b * 19349663)) >>> 0);

  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function heart(c, x, y, s) {
    c.beginPath();
    c.moveTo(x, y + s * 0.35);
    c.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    c.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
    c.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
    c.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.35);
    c.fill();
  }

  let skyGrad = null, skyGradH = 0;
  function drawBackground() {
    if (!skyGrad || skyGradH !== viewH) {
      skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
      skyGrad.addColorStop(0, '#16032e');
      skyGrad.addColorStop(0.45, '#3d1170');
      skyGrad.addColorStop(1, '#8a2fa8');
      skyGradH = viewH;
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewW, viewH);

    // Hvězdy
    const t = game.vt;
    for (const s of STARS) {
      let sx = ((s.x - cam.x * 0.05) % 1600 + 1600) % 1600;
      const sy = s.y * viewH * 0.55;
      ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + s.tw));
      ctx.fillStyle = '#ffe6fb';
      for (; sx < viewW; sx += 1600) ctx.fillRect(sx, sy, s.r, s.r);
    }
    ctx.globalAlpha = 1;

    // Měsíc
    const mx = viewW * 0.8, my = viewH * 0.17;
    ctx.fillStyle = 'rgba(255, 150, 230, 0.12)';
    ctx.beginPath(); ctx.arc(mx, my, 80, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 150, 230, 0.18)';
    ctx.beginPath(); ctx.arc(mx, my, 60, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd0f3';
    ctx.beginPath(); ctx.arc(mx, my, 42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f5b3e6';
    ctx.beginPath(); ctx.arc(mx - 12, my - 8, 8, 0, Math.PI * 2); ctx.arc(mx + 14, my + 10, 6, 0, Math.PI * 2); ctx.fill();

    // Vrstvy kopců (paralaxa)
    hills(0.12, viewH - 230, 55, 0.0035, 25, 0.011, '#2c0b52');
    drawClouds();
    hills(0.3, viewH - 160, 40, 0.006, 18, 0.017, '#4a1580');
    hills(0.55, viewH - 95, 28, 0.009, 12, 0.023, '#6a2399');
  }
  function hills(par, base, a1, f1, a2, f2, color) {
    const off = cam.x * par;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    for (let x = 0; x <= viewW + 20; x += 20) {
      const wx = x + off;
      ctx.lineTo(x, base - (Math.sin(wx * f1) * a1 + Math.sin(wx * f2 + 1.3) * a2));
    }
    ctx.lineTo(viewW + 20, viewH);
    ctx.closePath();
    ctx.fill();
  }
  function drawClouds() {
    ctx.fillStyle = 'rgba(255, 140, 220, 0.18)';
    const span = 2400;
    for (const c of CLOUDS) {
      let x = ((c.x - cam.x * 0.2 - game.vt * 8) % span + span) % span - 200;
      const y = c.y * viewH;
      for (; x < viewW + 200; x += span) {
        ctx.beginPath();
        ctx.ellipse(x, y, 70 * c.s, 18 * c.s, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 30 * c.s, y - 12 * c.s, 40 * c.s, 18 * c.s, 0, 0, Math.PI * 2);
        ctx.ellipse(x - 30 * c.s, y - 6 * c.s, 34 * c.s, 14 * c.s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  let firstCol = 0;
  function drawTiles() {
    const x0 = Math.max(0, Math.floor(cam.x / TILE) - 1);
    const x1 = Math.min(lvl.w - 1, Math.ceil((cam.x + viewW) / TILE) + 1);
    firstCol = x0;
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const c = lvl.g[ty][tx];
        if (c === '.') continue;
        const x = tx * TILE, y = ty * TILE;
        if (c === '#') drawGround(tx, ty, x, y);
        else if (c === 'B') drawBrick(x, y);
        else if (c === '-') drawPlatform(tx, ty, x, y);
        else if (c === '^') drawSpikes(x, y);
      }
    }
  }
  function drawGround(tx, ty, x, y) {
    const h = hash(tx, ty);
    ctx.fillStyle = ty >= 12 ? '#3a145f' : '#4b1d78';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#5e2894';
    ctx.beginPath();
    ctx.arc(x + 8 + (h % 24), y + 16 + ((h >> 5) % 16), 2 + (h % 3), 0, Math.PI * 2);
    ctx.fill();
    if (!isSolid(tileAt(tx, ty - 1))) {
      ctx.fillStyle = '#ff4fd8';
      ctx.fillRect(x, y, TILE, 8);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.moveTo(x + i * 10 + 10, y + 8);
        ctx.arc(x + i * 10 + 5, y + 8, 5, 0, Math.PI);
      }
      ctx.fill();
      ctx.fillStyle = '#ffc2f4';
      ctx.fillRect(x, y, TILE, 2);
    }
  }
  function drawBrick(x, y) {
    ctx.fillStyle = '#5a1f99';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#9b4fe6';
    ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = '#c08aff';
    ctx.fillRect(x + 2, y + 2, TILE - 4, 3);
    ctx.fillStyle = '#5a1f99';
    ctx.fillRect(x + 2, y + 19, TILE - 4, 2);
    ctx.fillRect(x + 19, y + 2, 2, 17);
    ctx.fillRect(x + 9, y + 21, 2, 17);
    ctx.fillRect(x + 29, y + 21, 2, 17);
  }
  function drawPlatform(tx, ty, x, y) {
    // Celou řadu plošiny kreslí její první viditelný dílek najednou
    if (tileAt(tx - 1, ty) === '-' && tx !== firstCol) return;
    let len = 1;
    while (tileAt(tx + len, ty) === '-') len++;
    const px = x + 2, pw = len * TILE - 4;
    ctx.fillStyle = 'rgba(255, 79, 216, 0.25)';
    ctx.fillRect(px + 4, y + 12, pw - 8, 5);
    ctx.fillStyle = '#b44cf0';
    rr(ctx, px, y, pw, 14, 7);
    ctx.fill();
    ctx.fillStyle = '#ff9df0';
    ctx.fillRect(px + 5, y + 1, pw - 10, 3);
  }
  function drawSpikes(x, y) {
    ctx.fillStyle = '#ff3fa4';
    ctx.strokeStyle = '#ffd0ec';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const bx = x + 1 + i * 13;
      ctx.beginPath();
      ctx.moveTo(bx, y + TILE);
      ctx.lineTo(bx + 6.5, y + 18);
      ctx.lineTo(bx + 13, y + TILE);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(bx + 3, y + TILE - 4);
      ctx.lineTo(bx + 6.5, y + 22);
      ctx.stroke();
    }
  }

  function drawCoins() {
    const t = game.vt;
    for (const c of lvl.coins) {
      if (c.taken || c.x < cam.x - 40 || c.x > cam.x + viewW + 40) continue;
      const k = Math.cos(t * 3.2 + c.phase);
      const rx = Math.max(1.8, Math.abs(k) * 10);
      const y = c.y + Math.sin(t * 2 + c.phase) * 2;
      ctx.fillStyle = 'rgba(255, 210, 63, 0.25)';
      ctx.beginPath(); ctx.ellipse(c.x, y, rx + 5, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d18a00';
      ctx.beginPath(); ctx.ellipse(c.x, y, rx, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = k > 0 ? '#ffd23f' : '#ffc21a';
      ctx.beginPath(); ctx.ellipse(c.x, y, Math.max(1, rx - 2), 10, 0, 0, Math.PI * 2); ctx.fill();
      if (rx > 5) {
        ctx.fillStyle = '#fff3b0';
        ctx.fillRect(c.x - rx * 0.15, y - 6, Math.max(1, rx * 0.3), 12);
      }
    }
  }

  function drawPickle(x, y, type, t, size = 1) {
    const pw = POWERS[type];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * 2) * 0.25);
    ctx.scale(size, size);
    ctx.fillStyle = pw.color;
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(t * 5);
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = pw.dark;
    rr(ctx, -8, -16, 16, 32, 8); ctx.fill();
    ctx.fillStyle = pw.body;
    rr(ctx, -6.5, -15, 13, 30, 6.5); ctx.fill();
    ctx.fillStyle = pw.dark;
    for (const [bx, by] of [[-3, -9], [2, -4], [-2, 2], [3, 7], [-3, 10]]) {
      ctx.beginPath(); ctx.arc(bx, by, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    rr(ctx, -4, -12, 3, 14, 1.5); ctx.fill();
    ctx.restore();
  }
  function drawPickles() {
    const t = game.vt;
    for (const k of lvl.pickles) {
      if (k.taken || k.x < cam.x - 40 || k.x > cam.x + viewW + 40) continue;
      drawPickle(k.x, k.y + Math.sin(t * 2.5 + k.phase) * 4, k.type, t + k.phase);
    }
  }

  function drawEnemies() {
    for (const e of lvl.enemies) {
      if (e.x < cam.x - 60 || e.x > cam.x + viewW + 60) continue;
      const cx = e.x + e.w / 2, by = e.y + e.h;
      if (!e.alive) {
        if (e.deadT <= 0) continue;
        ctx.globalAlpha = e.deadT / 0.5;
        ctx.fillStyle = '#7b3fe4';
        ctx.beginPath(); ctx.ellipse(cx, by - 4, 20, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        continue;
      }
      const wob = Math.sin(e.anim * 9) * 2.5;
      const top = by - 30 - wob;
      ctx.fillStyle = 'rgba(30, 0, 50, 0.3)';
      ctx.beginPath(); ctx.ellipse(cx, by, 17, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7b3fe4';
      ctx.strokeStyle = '#3b137a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 17 - wob * 0.4, by);
      ctx.quadraticCurveTo(cx - 19, top, cx, top);
      ctx.quadraticCurveTo(cx + 19, top, cx + 17 + wob * 0.4, by);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.ellipse(cx - 7, top + 8, 4, 2.5, -0.5, 0, Math.PI * 2); ctx.fill();
      const ex = e.dir * 3;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 6 + ex, by - 15, 4.5, 0, Math.PI * 2); ctx.arc(cx + 6 + ex, by - 15, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a0533';
      ctx.beginPath(); ctx.arc(cx - 6 + ex + e.dir * 1.5, by - 14, 2.2, 0, Math.PI * 2); ctx.arc(cx + 6 + ex + e.dir * 1.5, by - 14, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1a0533';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 11 + ex, by - 22); ctx.lineTo(cx - 3 + ex, by - 19);
      ctx.moveTo(cx + 11 + ex, by - 22); ctx.lineTo(cx + 3 + ex, by - 19);
      ctx.stroke();
      ctx.fillStyle = '#ff9df0';
      ctx.beginPath(); ctx.moveTo(cx - 4 + ex, by - 7); ctx.lineTo(cx - 2 + ex, by - 3); ctx.lineTo(cx + ex, by - 7); ctx.fill();
    }
  }

  function drawPlayer() {
    const p = player;
    const t = game.vt;
    const gold = p.power.gold > 0;
    if (p.invuln > 0 && !gold && Math.floor(t * 18) % 2 === 0) return;
    const cx = p.x + p.w / 2, by = p.y + p.h;

    if (p.shield) {
      ctx.strokeStyle = `rgba(127, 243, 255, ${0.5 + 0.3 * Math.sin(t * 6)})`;
      ctx.fillStyle = 'rgba(127, 243, 255, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, by - 18, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    if (gold) {
      ctx.fillStyle = `rgba(255, 216, 74, ${0.25 + 0.2 * Math.sin(t * 20)})`;
      ctx.beginPath(); ctx.arc(cx, by - 18, 32, 0, Math.PI * 2); ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, by);
    ctx.scale(1 / p.squash, p.squash);

    const blinkGold = gold && Math.floor(t * 12) % 2 === 0;
    const bodyColor = blinkGold ? '#ffd84a' : '#ff5fb3';
    const darkColor = blinkGold ? '#c48f00' : '#c93b8b';

    // Nohy
    const walking = p.onGround && Math.abs(p.vx) > 20;
    const step = walking ? Math.sin(p.anim) * 4 : 0;
    ctx.fillStyle = '#7a2aa8';
    ctx.beginPath();
    ctx.ellipse(-6 + step, -3, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(6 - step, -3, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tělo
    ctx.fillStyle = darkColor;
    rr(ctx, -14, -36, 28, 33, 12); ctx.fill();
    ctx.fillStyle = bodyColor;
    rr(ctx, -13, -36, 26, 31, 11); ctx.fill();
    ctx.fillStyle = blinkGold ? '#fff0a8' : '#ffc2e3';
    ctx.beginPath(); ctx.ellipse(p.face * 2, -14, 8, 7, 0, 0, Math.PI * 2); ctx.fill();

    // Mašle
    ctx.fillStyle = '#b14cff';
    ctx.beginPath();
    ctx.moveTo(-p.face * 2, -36); ctx.lineTo(-p.face * 2 - 9, -43); ctx.lineTo(-p.face * 2 - 9, -31); ctx.closePath();
    ctx.moveTo(-p.face * 2, -36); ctx.lineTo(-p.face * 2 + 9, -43); ctx.lineTo(-p.face * 2 + 9, -31); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ff9df0';
    ctx.beginPath(); ctx.arc(-p.face * 2, -36, 3, 0, Math.PI * 2); ctx.fill();

    // Oči
    const blink = Math.floor(t * 10) % 37 === 0;
    const ex = p.face * 4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(ex - 5, -25, 4, blink ? 0.8 : 5, 0, 0, Math.PI * 2);
    ctx.ellipse(ex + 5, -25, 4, blink ? 0.8 : 5, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!blink) {
      ctx.fillStyle = '#2a0a4a';
      ctx.beginPath();
      ctx.arc(ex - 5 + p.face * 1.5, -24, 2.3, 0, Math.PI * 2);
      ctx.arc(ex + 5 + p.face * 1.5, -24, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 120, 190, 0.8)';
    ctx.beginPath(); ctx.arc(ex - 9, -18, 2.5, 0, Math.PI * 2); ctx.arc(ex + 9, -18, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2a0a4a';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(ex, -19, 3, 0.2, Math.PI - 0.2); ctx.stroke();

    ctx.restore();
  }

  function drawLumi(c, x, by, t) {
    const f = Math.sin(t * 2) * 3;
    c.fillStyle = 'rgba(255, 120, 220, 0.3)';
    c.beginPath(); c.ellipse(x, by - 2, 22 - f, 5, 0, 0, Math.PI * 2); c.fill();
    const b = by - 6 + f;
    // Vlasy vzadu
    c.fillStyle = '#7b2fd6';
    rr(c, x - 15, b - 52, 30, 34, 12); c.fill();
    // Šaty
    c.fillStyle = '#c77dff';
    c.beginPath();
    c.moveTo(x - 8, b - 28); c.lineTo(x - 15, b); c.lineTo(x + 15, b); c.lineTo(x + 8, b - 28);
    c.closePath(); c.fill();
    c.fillStyle = '#ff9df0';
    c.fillRect(x - 13, b - 5, 26, 3);
    heart(c, x, b - 22, 9);
    // Hlava
    c.fillStyle = '#ffe0f0';
    c.beginPath(); c.arc(x, b - 38, 12, 0, Math.PI * 2); c.fill();
    // Ofina
    c.fillStyle = '#8a3be8';
    c.beginPath(); c.arc(x, b - 41, 13, Math.PI, 0); c.fill();
    c.beginPath(); c.moveTo(x - 13, b - 41); c.quadraticCurveTo(x - 6, b - 34, x + 2, b - 41); c.fill();
    // Oči
    const blink = Math.floor(t * 3) % 11 === 0;
    c.fillStyle = '#3b137a';
    c.beginPath();
    c.ellipse(x - 4.5, b - 36, 2, blink ? 0.6 : 2.8, 0, 0, Math.PI * 2);
    c.ellipse(x + 4.5, b - 36, 2, blink ? 0.6 : 2.8, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255, 110, 190, 0.7)';
    c.beginPath(); c.arc(x - 8, b - 32, 2, 0, Math.PI * 2); c.arc(x + 8, b - 32, 2, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#b8268a';
    c.lineWidth = 1.4;
    c.beginPath(); c.arc(x, b - 33, 2.6, 0.2, Math.PI - 0.2); c.stroke();
    // Sponka – srdíčko
    c.fillStyle = '#ff4fd8';
    heart(c, x + 9, b - 54, 8);
    // Hologramové linky (je to AI)
    c.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for (let i = 0; i < 9; i++) c.fillRect(x - 15, b - 52 + i * 6 + ((t * 20) % 6), 30, 1.5);
  }

  function drawFriend() {
    const f = lvl.friend;
    if (!f || f.x < cam.x - 80 || f.x > cam.x + viewW + 80) return;
    const t = game.vt;
    drawLumi(ctx, f.x, f.y, t);
    const s = 10 + Math.sin(t * 4) * 1.5;
    ctx.fillStyle = '#ff4fd8';
    heart(ctx, f.x, f.y - 86 + Math.sin(t * 2) * 3, s);

    ctx.font = '700 13px "Trebuchet MS", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd0f6';
    ctx.fillText('Lumi', f.x, f.y - 92);

    if (game.nearFriend && game.state === 'play') {
      const label = document.body.classList.contains('touch') ? '💬 Promluvit si' : 'E – Promluvit si';
      ctx.font = '700 15px "Trebuchet MS", system-ui, sans-serif';
      const w = ctx.measureText(label).width + 20;
      const y = f.y - 126 + Math.sin(t * 5) * 2;
      ctx.fillStyle = 'rgba(42, 10, 74, 0.9)';
      rr(ctx, f.x - w / 2, y - 16, w, 26, 13); ctx.fill();
      ctx.strokeStyle = '#ff4fd8'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText(label, f.x, y + 2);
    }
  }

  function drawCheckpoints() {
    const t = game.vt;
    for (const c of lvl.checkpoints) {
      if (c.x < cam.x - 60 || c.x > cam.x + viewW + 60) continue;
      const px = c.x + 16, top = c.y - 76;
      ctx.fillStyle = '#d9c2ff';
      ctx.fillRect(px, top, 4, 76);
      ctx.beginPath(); ctx.arc(px + 2, top, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c.active ? '#ff4fd8' : '#7a5a9a';
      const wave = Math.sin(t * 6) * (c.active ? 4 : 1.5);
      ctx.beginPath();
      ctx.moveTo(px + 4, top + 2);
      ctx.quadraticCurveTo(px + 18, top + 6 + wave, px + 32, top + 12);
      ctx.lineTo(px + 4, top + 24);
      ctx.closePath();
      ctx.fill();
      if (c.active) {
        ctx.fillStyle = '#fff';
        heart(ctx, px + 13, top + 8, 7);
      }
    }
  }

  function drawGoal() {
    const g = lvl.goal;
    if (!g || g.x < cam.x - 100 || g.x > cam.x + viewW + 100) return;
    const t = game.vt;
    const cx = g.x, cy = g.y - 44;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 34);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.4, 'rgba(255,127,224,0.8)');
    grad.addColorStop(1, 'rgba(120,40,200,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.ellipse(cx, cy, 30, 46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const d = i % 2 ? 1 : -1;
      ctx.strokeStyle = i % 2 ? '#ff4fd8' : '#c77dff';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 28 - i * 5, 44 - i * 8, 0, t * 2.5 * d + i, t * 2.5 * d + i + Math.PI * 1.4);
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      const a = t * 2 + i * (Math.PI / 3);
      ctx.fillStyle = '#ffe6fb';
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 36, cy + Math.sin(a) * 50, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.font = '900 16px "Trebuchet MS", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText('CÍL', cx, cy - 58);
  }

  function drawParticles() {
    for (const q of particles) {
      ctx.globalAlpha = Math.max(0, q.life / q.max);
      ctx.fillStyle = q.color;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.font = '800 16px "Trebuchet MS", system-ui, sans-serif';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(42, 10, 74, 0.85)';
    for (const f of floaters) {
      ctx.globalAlpha = Math.min(1, f.life * 2);
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  function drawBanner() {
    if (!banner) return;
    const age = banner.dur - banner.t;
    const a = Math.min(1, age * 4, banner.t * 2);
    const s = 0.8 + 0.2 * Math.min(1, age * 5);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(viewW / 2, viewH * 0.3);
    ctx.scale(s, s);
    ctx.textAlign = 'center';
    ctx.font = '900 40px "Trebuchet MS", system-ui, sans-serif';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2a0a4a';
    ctx.strokeText(banner.text, 0, 0);
    ctx.fillStyle = banner.color;
    ctx.fillText(banner.text, 0, 0);
    if (banner.sub) {
      ctx.font = '700 22px "Trebuchet MS", system-ui, sans-serif';
      ctx.lineWidth = 5;
      ctx.strokeText(banner.sub, 0, 34);
      ctx.fillStyle = '#ffd0f6';
      ctx.fillText(banner.sub, 0, 34);
    }
    ctx.restore();
  }

  function render() {
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    drawBackground();
    if (!lvl) return;
    const camY = VIEW_H - viewH;
    let sx = Math.round(cam.x), sy = camY;
    if (cam.shake > 0) {
      sx += Math.round((Math.random() - 0.5) * 10 * cam.shake / 0.35);
      sy += (Math.random() - 0.5) * 10 * cam.shake / 0.35;
    }
    ctx.save();
    ctx.translate(-sx, -sy);
    drawTiles();
    drawCheckpoints();
    drawGoal();
    drawFriend();
    drawCoins();
    drawPickles();
    drawEnemies();
    if (game.state !== 'menu') drawPlayer();
    drawParticles();
    ctx.restore();
    if (game.state !== 'menu') drawBanner();
  }

  function renderPortrait() {
    pctx.setTransform(1, 0, 0, 1, 0, 0);
    pctx.clearRect(0, 0, 120, 120);
    pctx.setTransform(1.9, 0, 0, 1.9, 0, 0);
    drawLumi(pctx, 60 / 1.9, 76, game.vt);
  }

  // ================================================================
  //  HUD
  // ================================================================
  const hudCache = {};
  function setHtml(id, html) {
    if (hudCache[id] === html) return;
    hudCache[id] = html;
    $(id).innerHTML = html;
  }
  function updateHud() {
    if (!lvl || game.state === 'menu') return;
    setHtml('hLives', '💗'.repeat(game.lives) || '💔');
    setHtml('hCoins', `🪙 ${game.coins}`);
    setHtml('hScore', `⭐ ${game.score}`);
    setHtml('hLevel', `Úroveň ${game.levelIndex + 1}/${LEVELS.length}`);
    let chips = '';
    for (const k of Object.keys(POWERS)) {
      const v = player.power[k];
      if (v > 0) chips += `<span class="chip" style="--c:${POWERS[k].color}">🥒 ${POWERS[k].name} ${Math.ceil(v)} s</span>`;
    }
    if (player.shield) chips += '<span class="chip" style="--c:#7ff3ff">🛡️ Štít</span>';
    setHtml('hPowers', chips);
    tInteract.classList.toggle('hidden', !(game.nearFriend && game.state === 'play'));
  }

  // ================================================================
  //  Rozměry a orientace
  // ================================================================
  function portraitBlocked() {
    return document.body.classList.contains('touch') && window.innerHeight > window.innerWidth;
  }
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = Math.min(h / VIEW_H, w / MIN_VIEW_W);
    viewW = w / scale;
    viewH = h / scale;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const blocked = portraitBlocked();
    $('rotate').classList.toggle('hidden', !blocked);
    if (blocked && game.state === 'play') pauseGame();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 150));

  // ================================================================
  //  Herní smyčka
  // ================================================================
  let last = performance.now();
  let acc = 0;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    game.vt += dt;
    if (game.state === 'play') {
      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 12 && game.state === 'play') {
        update(STEP);
        acc -= STEP;
        steps++;
      }
      if (steps >= 12) acc = 0;
    } else {
      acc = 0;
      if (game.state === 'menu' && lvl) {
        const maxX = lvl.w * TILE - viewW;
        cam.x = (Math.sin(game.vt * 0.05 - Math.PI / 2) * 0.5 + 0.5) * maxX;
      }
    }
    render();
    if (game.state === 'dialog') renderPortrait();
    updateHud();
    requestAnimationFrame(frame);
  }

  // Ladění: index.html#debug zpřístupní stav hry v konzoli
  if (location.hash === '#debug') window.ppa = { game, player, cam, get lvl() { return lvl; }, loadLevel, levelComplete };

  // Start
  resize();
  refreshSoundButtons();
  goMenu();
  requestAnimationFrame(frame);
})();
