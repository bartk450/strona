let gameLoopId;

// ==========================================
// SYSTEM POSTĘPÓW
// ==========================================
const TOTAL_GAMES_TO_WIN = 13;
let completedGames = new Set(); 

function markGameWon(gameId) {
    if (!completedGames.has(gameId)) {
        completedGames.add(gameId); 
        
        const block = document.getElementById('block-' + gameId);
        if (block) block.classList.add('won');
        
        const n = completedGames.size;
        const gwt = document.getElementById('gamesWonText');
        const gwt2 = document.getElementById('gamesWonText2');
        if (gwt) gwt.textContent = n;
        if (gwt2) gwt2.textContent = n;
        
        // Update progress bar pill
        const pillFill = document.getElementById('pillFill');
        if (pillFill) pillFill.style.width = (n / TOTAL_GAMES_TO_WIN * 100) + '%';
        
        if (n >= TOTAL_GAMES_TO_WIN) {
            const btn = document.getElementById('finalButton');
            btn.disabled = false;
            btn.classList.add('unlocked');
            document.getElementById('finalBtnText').textContent = "🏆 WEJDŹ DALEJ!";
        }
    }
}

// ==========================================
// SYSTEM KART POWITALNYCH
// ==========================================

const GAME_INTROS = {
    shooter: {
        emoji: '🚀',
        title: 'Space Shooter',
        subtitle: 'Obroń kosmos przed inwazją',
        color1: '#050B14',
        color2: '#1A0B2E',
        accent: '#00ffff',
        accentGlow: 'rgba(0,255,255,0.3)',
        border: '#00ffff',
        howToPlay: [
            { icon: '🖱️', text: 'Poruszaj myszką — statek lecisz za kursorem' },
            { icon: '🖱️', text: 'Kliknij lewym przyciskiem — strzał!' },
            { icon: '💚', text: 'Złap zielony power-up — rapid fire przez 5 sekund' },
            { icon: '🎯', text: 'Przejdź 10 fal, by wygrać. Boss co 5. falę!' },
        ],
        tip: 'Nie strzelaj na ślepo — liczy się celność!'
    },
    tictactoe: {
        emoji: '⭕',
        title: 'Kółko i Krzyżyk',
        subtitle: 'Pojedynek z nieomylnym AI',
        color1: '#0d0d0d',
        color2: '#1a0033',
        accent: '#ff00ff',
        accentGlow: 'rgba(255,0,255,0.3)',
        border: '#ff00ff',
        howToPlay: [
            { icon: '✖️', text: 'Ty grasz jako X — zacznij pierwszy' },
            { icon: '⭕', text: 'AI gra jako O — używa algorytmu Minimax' },
            { icon: '🧠', text: 'AI jest niemal niepokonane — spróbuj je zaskoczyć' },
            { icon: '🏆', text: 'Ułóż 3 w rzędzie (poziom, pion lub skos) by wygrać!' },
        ],
        tip: 'Zacznij od środka lub narożnika — to najsilniejsze pola!'
    },
    pingpong: {
        emoji: '🏓',
        title: 'Ping Pong AI',
        subtitle: 'Klasyka stołu, nowoczesny rywal',
        color1: '#0f2027',
        color2: '#2c5364',
        accent: '#74b9ff',
        accentGlow: 'rgba(116,185,255,0.3)',
        border: '#74b9ff',
        howToPlay: [
            { icon: '🖱️', text: 'Ruszaj myszką w górę i dół — sterowanie paletką' },
            { icon: '⚡', text: 'Piłka przyspiesza po każdym odbiciu' },
            { icon: '🎯', text: 'Zdobądź 5 punktów przed AI — wtedy wygrywasz' },
            { icon: '🤖', text: 'AI śledzi piłkę płynnie, ale nie jest idealne!' },
        ],
        tip: 'Odbijaj piłkę krawędzią paletki, by zmienić jej trajektorię!'
    },
    solitaire: {
        emoji: '🃏',
        title: 'Pasjans',
        subtitle: 'Klasyczna gra karcianka dla jednego',
        color1: '#0f5a25',
        color2: '#04210c',
        accent: '#2ecc71',
        accentGlow: 'rgba(46,204,113,0.3)',
        border: '#2ecc71',
        howToPlay: [
            { icon: '🃏', text: 'Kliknij zakryty stos — odkryj kartę na odrzucone' },
            { icon: '♦️', text: 'Kliknij kartę na odrzuconych — przenosi się do kolumny lub bazy' },
            { icon: '🏰', text: 'Bazy (4 kwadraty po prawej) — układaj od Asa do Króla' },
            { icon: '🏆', text: 'Zbierz wszystkie 52 karty do baz — wygrywasz!' },
        ],
        tip: 'Odkrywaj zakryte karty jak najszybciej — to klucz do wygranej!'
    },
    dino: {
        emoji: '🦖',
        title: 'Dino Run',
        subtitle: 'Przebiegnij minutę, zbierz skarby',
        color1: '#2c3e50',
        color2: '#3498db',
        accent: '#00d2d3',
        accentGlow: 'rgba(0,210,211,0.3)',
        border: '#00d2d3',
        howToPlay: [
            { icon: '⌨️', text: 'SPACJA lub klik — dinozaur skacze!' },
            { icon: '💰', text: 'Zbieraj złote monety latające w powietrzu' },
            { icon: '🌵', text: 'Unikaj przeszkód — dotknięcie = koniec gry' },
            { icon: '⏱️', text: 'Przetrwaj 60 sekund bez kolizji — to Twój cel!' },
        ],
        tip: 'Monety są wyżej niż myślisz — skacz śmiało!'
    },
    tomus: {
        emoji: '💉',
        title: 'Tomuś Strzykawa',
        subtitle: 'Jeden strzał. Jeden cel. Czas ucieka.',
        color1: '#4a0e1c',
        color2: '#0a0204',
        accent: '#ff0055',
        accentGlow: 'rgba(255,0,85,0.3)',
        border: '#e74c3c',
        howToPlay: [
            { icon: '👁️', text: 'Obserwuj ekran — Tomuś ciągle się teleportuje' },
            { icon: '🖱️', text: 'Kliknij na Tomusia — jeden celny klik wystarczy!' },
            { icon: '⏱️', text: 'Masz tylko 10 sekund — potem ucieka na zawsze' },
            { icon: '🏅', text: 'Jeden klik = ocena S. Im więcej pudeł, tym gorsza nota' },
        ],
        tip: 'Poczekaj aż się zatrzyma — potem celuj spokojnie!'
    },
    krol_kibla: {
        emoji: '👑',
        title: 'Król Kibla',
        subtitle: 'Przetrwaj 60 sekund. Godnie.',
        color1: '#1a1a2e',
        color2: '#16213e',
        accent: '#f1c40f',
        accentGlow: 'rgba(241,196,15,0.3)',
        border: '#f1c40f',
        howToPlay: [
            { icon: '⌨️', text: 'SPACJA — obniż ciśnienie (ulga!)' },
            { icon: '🖱️', text: 'Kliknij drżące drzwi — wycisz dobijającego się sąsiada' },
            { icon: '🧻', text: 'Kliknij lecące rolki — zanim trafią w kibelek' },
            { icon: '⏱️', text: 'Przetrwaj 60 sekund z ciśnieniem poniżej 100% — wygrywasz!' },
        ],
        tip: 'Drzwi i rolki rosną z czasem — reaguj szybko!'
    },
    wisielec: {
        emoji: '😵',
        title: 'Wisielec',
        subtitle: 'Odgadnij słowo. Uratuj wisielca.',
        color1: '#1f2224',
        color2: '#3e4245',
        accent: '#f1c40f',
        accentGlow: 'rgba(241,196,15,0.3)',
        border: '#8d6e63',
        howToPlay: [
            { icon: '🔡', text: 'Klikaj litery na klawiaturze — zgaduj słowo' },
            { icon: '❌', text: 'Zła litera = kolejna część wisielca (max 7 błędów)' },
            { icon: '💡', text: 'Raz na grę możesz użyć podpowiedzi — odkryje losową literę' },
            { icon: '🏆', text: 'Odgadnij całe słowo przed 7. błędem — wygrywasz!' },
        ],
        tip: 'Definicja pod tytułem to klucz — czytaj uważnie!'
    },
    blockbuster: {
        emoji: '🧩',
        title: 'Block Buster',
        subtitle: 'Układaj, czyść linie, zbieraj punkty',
        color1: '#0f0c29',
        color2: '#24243e',
        accent: '#f39c12',
        accentGlow: 'rgba(243,156,18,0.3)',
        border: '#9b59b6',
        howToPlay: [
            { icon: '🖱️', text: 'Przeciągnij klocek z dołu na planszę' },
            { icon: '✨', text: 'Wypełnij cały rząd lub kolumnę — zniknie i da punkty!' },
            { icon: '🎯', text: 'Zdobądź 1000 punktów żeby wygrać' },
            { icon: '🚫', text: 'Jeśli żaden klocek nie pasuje — koniec gry!' },
        ],
        tip: 'Planuj z wyprzedzeniem — kasuj wiele linii naraz dla premii!'
    },
    whack: {
        emoji: '🔨',
        title: 'Uderz Chińczyka',
        subtitle: 'Bijemy, ile wlezie. Czas leci.',
        color1: '#2b0000',
        color2: '#5e0000',
        accent: '#d4ac0d',
        accentGlow: 'rgba(212,172,13,0.3)',
        border: '#d4ac0d',
        howToPlay: [
            { icon: '🖱️', text: 'Klikaj na wyskakujące głowy Chińczyków' },
            { icon: '⏱️', text: 'Masz 30 sekund — uderz jak najwięcej!' },
            { icon: '🐢', text: 'Chowają się szybciej z biegiem czasu' },
            { icon: '🏆', text: 'Zdobądź 15+ punktów by zaliczyć grę jako wygraną' },
        ],
        tip: 'Mierz wzrokiem — klikaj dopiero jak pełna głowa wyskoczy!'
    },
    slide: {
        emoji: '🟥',
        title: 'Slide Puzzle',
        subtitle: 'Ułóż cyfry od 1 do 15 w kolejności',
        color1: '#1a1a1a',
        color2: '#2d2d2d',
        accent: '#e74c3c',
        accentGlow: 'rgba(231,76,60,0.3)',
        border: '#e74c3c',
        howToPlay: [
            { icon: '🖱️', text: 'Kliknij kafelek sąsiadujący z pustym polem — przesunie się!' },
            { icon: '🔢', text: 'Ułóż cyfry 1–15 od lewej do prawej, góra–dół' },
            { icon: '⬜', text: 'Puste pole musi znaleźć się w prawym dolnym rogu' },
            { icon: '🏆', text: 'Im mniej ruchów — tym lepsza ocena. Cel: poniżej 50!' },
        ],
        tip: 'Planuj 2–3 ruchy naprzód — nie blokuj sam siebie!'
    },
    factory: {
        emoji: '🏭',
        title: 'Fabryka',
        subtitle: 'Celuj. Strzelaj. Nie daj im uciec.',
        color1: '#2c3e50',
        color2: '#1a252f',
        accent: '#8e44ad',
        accentGlow: 'rgba(142,68,173,0.3)',
        border: '#8e44ad',
        howToPlay: [
            { icon: '🖱️', text: 'Klikaj na uciekające sylwetki — trafiasz je!' },
            { icon: '🎯', text: 'Zestrzel 30 uciekinierów by wygrać' },
            { icon: '🚪', text: 'Wylatują z bramy po prawej i biegną w lewo' },
            { icon: '⚠️', text: 'Jeśli 15 ucieknie poza ekran — przegrywasz!' },
        ],
        tip: 'Klikaj szybko — im więcej na ekranie, tym trudniej!'
    },
    flappy: {
        emoji: '🐦',
        title: 'Flappy Bird',
        subtitle: 'Leć przez rury. Nie wpadaj w ściany.',
        color1: '#74b9ff',
        color2: '#81ecec',
        accent: '#f1c40f',
        accentGlow: 'rgba(241,196,15,0.4)',
        border: '#f1c40f',
        howToPlay: [
            { icon: '⌨️', text: 'SPACJA lub klik — ptak fruwa do góry' },
            { icon: '🌿', text: 'Przelec między zielonymi rurami — nie dotykaj ich!' },
            { icon: '🎯', text: 'Każda przeleciana para rur = 1 punkt' },
            { icon: '🏆', text: 'Zdobądź 15 punktów by wygrać grę!' },
        ],
        tip: 'Małe, rytmiczne kliknięcia działają lepiej niż długie serie!'
    },
    quiz: {
        emoji: '🧠',
        title: 'Quiz',
        subtitle: 'Sprawdź swoją wiedzę ze wszystkich dziedzin',
        color1: '#0a0500',
        color2: '#2a1800',
        accent: '#f39c12',
        accentGlow: 'rgba(243,156,18,0.3)',
        border: '#f39c12',
        howToPlay: [
            { icon: '🎯', text: 'Wybierz kategorię lub zagraj mix wszystkich dziedzin' },
            { icon: '✅', text: 'Za dobrą odpowiedź awansuj o jeden krok do przodu' },
            { icon: '❌', text: 'Za złą odpowiedź wracasz na start — seria przerywana!' },
            { icon: '🔥', text: 'Budujesz serię — każda kolejna dobra odpowiedź = bonus pkt!' },
        ],
        tip: 'Odpowiedz dobrze na 10 pytań z rzędu — to cel!'
    },
};

function showIntroCard(gameId) {
    const intro = GAME_INTROS[gameId];
    if (!intro) {
        actuallyStartGame(gameId);
        return;
    }

    // Remove any existing intro card
    const existing = document.getElementById('introCard');
    if (existing) existing.remove();

    document.getElementById("menu").style.display = "none";
    document.querySelectorAll('.game').forEach(g => g.style.display = "none");

    const card = document.createElement('div');
    card.id = 'introCard';
    card.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.92);
        font-family: 'Segoe UI', Arial, sans-serif;
        animation: introFadeIn 0.4s ease;
    `;

    const stepsHtml = intro.howToPlay.map((step, i) => `
        <div style="
            display: flex; align-items: flex-start; gap: 14px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px; padding: 13px 16px;
            animation: introSlideIn 0.4s ease ${0.1 + i * 0.07}s both;
        ">
            <span style="font-size: 24px; flex-shrink: 0; line-height: 1.3;">${step.icon}</span>
            <span style="color: #ecf0f1; font-size: 15px; line-height: 1.5;">${step.text}</span>
        </div>
    `).join('');

    card.innerHTML = `
        <style>
            @keyframes introFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes introSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes introPulse { 0%,100% { box-shadow: 0 0 20px ${intro.accentGlow}; } 50% { box-shadow: 0 0 45px ${intro.accentGlow}, 0 0 80px ${intro.accentGlow}; } }
            @keyframes emojiFloat { 0%,100% { transform: translateY(0px) rotate(-3deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
            #introStartBtn:hover { transform: scale(1.06) !important; background: ${intro.accent} !important; color: #000 !important; }
            #introBackBtn:hover { border-color: ${intro.accent} !important; color: ${intro.accent} !important; background: rgba(255,255,255,0.05) !important; }
        </style>
        <div style="
            width: min(600px, 92vw);
            background: linear-gradient(145deg, ${intro.color1}, ${intro.color2});
            border: 2px solid ${intro.border};
            border-radius: 24px;
            padding: 40px 36px 32px;
            box-shadow: 0 0 60px ${intro.accentGlow}, 0 30px 60px rgba(0,0,0,0.8);
            animation: introPulse 3s ease-in-out infinite;
            position: relative;
            overflow: hidden;
        ">
            <!-- Decorative grid bg -->
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,0.02) 40px,rgba(255,255,255,0.02) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.02) 40px,rgba(255,255,255,0.02) 41px);border-radius:24px;pointer-events:none;"></div>
            
            <!-- Header -->
            <div style="text-align:center; margin-bottom: 28px; position:relative;">
                <div style="font-size: 72px; animation: emojiFloat 3s ease-in-out infinite; display: inline-block; margin-bottom: 12px; filter: drop-shadow(0 0 20px ${intro.accentGlow});">${intro.emoji}</div>
                <h1 style="margin:0; font-size: 32px; font-weight: 900; color: ${intro.accent}; text-shadow: 0 0 20px ${intro.accentGlow}; letter-spacing: -0.5px;">${intro.title}</h1>
                <p style="margin: 6px 0 0; color: rgba(255,255,255,0.5); font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">${intro.subtitle}</p>
            </div>

            <!-- How to play -->
            <div style="margin-bottom: 20px;">
                <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${intro.accent}; font-weight: 700; margin-bottom: 12px; opacity: 0.8;">JAK GRAĆ</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">${stepsHtml}</div>
            </div>

            <!-- Tip -->
            <div style="
                background: linear-gradient(90deg, ${intro.accentGlow}, transparent);
                border-left: 3px solid ${intro.accent};
                border-radius: 0 10px 10px 0;
                padding: 12px 16px;
                margin-bottom: 28px;
                font-size: 14px;
                color: rgba(255,255,255,0.7);
            ">
                <span style="color: ${intro.accent}; font-weight: 700;">💡 TIP: </span>${intro.tip}
            </div>

            <!-- Buttons -->
            <div style="display: flex; gap: 12px;">
                <button id="introBackBtn" onclick="closeIntroCard()" style="
                    flex: 1; padding: 14px; font-size: 15px; font-weight: 600;
                    background: transparent; color: rgba(255,255,255,0.6);
                    border: 2px solid rgba(255,255,255,0.2); border-radius: 12px;
                    cursor: pointer; transition: all 0.2s; font-family: inherit;
                ">← Menu</button>
                <button id="introStartBtn" onclick="closeIntroAndStart('${gameId}')" style="
                    flex: 3; padding: 14px; font-size: 18px; font-weight: 800;
                    background: transparent; color: ${intro.accent};
                    border: 2px solid ${intro.accent}; border-radius: 12px;
                    cursor: pointer; transition: all 0.2s; font-family: inherit;
                    letter-spacing: 1px;
                ">GRAJ TERAZ →</button>
            </div>
        </div>
    `;

    document.body.appendChild(card);
}

function closeIntroCard() {
    const card = document.getElementById('introCard');
    if (card) card.remove();
    document.getElementById("menu").style.display = "grid";
}

function closeIntroAndStart(gameId) {
    const card = document.getElementById('introCard');
    if (card) card.remove();
    actuallyStartGame(gameId);
}

function startGame(id) {
    showIntroCard(id);
}

// ==========================================
// SYSTEM KART ZAKOŃCZENIA GRY
// ==========================================

const GAME_OUTROS = {
    shooter: { emoji: '🚀', grade: 'S', gradeColor: '#00ffff', title: 'Obrońca Kosmosu', quote: 'Nawet gwiazdy się nie kryją przed Twoim celownikiem.' },
    tictactoe: { emoji: '⭕', grade: 'S', gradeColor: '#ff00ff', title: 'Taktyk Planszy', quote: 'Minimax nie ma szans tam, gdzie intuicja gracza rządzi.' },
    pingpong: { emoji: '🏓', grade: 'S', gradeColor: '#74b9ff', title: 'Mistrz Stołu', quote: 'AI nie nadążyło za Twoją szybkością reakcji.' },
    solitaire: { emoji: '🃏', grade: 'A', gradeColor: '#2ecc71', title: 'Karciany Strateg', quote: 'Każda karta znalazła swoje miejsce dzięki Twojej cierpliwości.' },
    dino: { emoji: '🦖', grade: 'S', gradeColor: '#00d2d3', title: 'Dinozaur Przetrwał', quote: 'Biegłeś jak przez kredowy krajobraz — i dałeś radę!' },
    tomus: { emoji: '💉', grade: 'S', gradeColor: '#ff0055', title: 'Jeden Strzał', quote: 'Tomuś nie miał szans. Refleks absolutny.' },
    krol_kibla: { emoji: '👑', grade: 'S', gradeColor: '#f1c40f', title: 'Król Kibla', quote: 'Sześćdziesiąt sekund godności. Nie każdemu dane.' },
    wisielec: { emoji: '😵', grade: 'A', gradeColor: '#f1c40f', title: 'Słowny Mistrz', quote: 'Litera po literze — szubienica została pusta.' },
    blockbuster: { emoji: '🧩', grade: 'S', gradeColor: '#f39c12', title: 'Burzyciel Bloków', quote: '1000 punktów — plansza nie wiedziała co ją uderzyło.' },
    whack: { emoji: '🔨', grade: 'S', gradeColor: '#d4ac0d', title: 'Mistrz Młotka', quote: 'Żaden Chińczyk nie zdążył się ukryć.' },
    slide: { emoji: '🟥', grade: 'S', gradeColor: '#e74c3c', title: 'Układankowy Geniusz', quote: 'Czerwony blok dotarł na miejsce. Plan idealny.' },
    factory: { emoji: '🏭', grade: 'S', gradeColor: '#8e44ad', title: 'Nieomylny Strzelec', quote: 'Nikt nie uciekł z zasięgu Twojej strzelby.' },
    flappy: { emoji: '🐦', grade: 'S', gradeColor: '#f1c40f', title: 'Mistrz Przestworzy', quote: 'Piętnaście rur i ani jednego zderzenia. Legenda.' },
    quiz:   { emoji: '🧠', grade: 'S', gradeColor: '#f39c12', title: 'Mistrz Wiedzy', quote: 'Dziesięć pytań, dziesięć poprawnych odpowiedzi. Niesamowite.' },
};

function showOutroCard(gameId, customTitle, customQuote, customGrade, isWin) {
    // isWin: true=wygrana (zielone), false=przegrana (czerwone), undefined=kolory gry
    const defaults = GAME_OUTROS[gameId] || {
        emoji: '🏆', grade: 'S', gradeColor: '#f1c40f',
        title: 'Wygrana!', quote: 'Znakomita gra!'
    };
    const introBase = GAME_INTROS[gameId] || {
        color1: '#0a0a0a', color2: '#1a1a1a', accent: '#f1c40f',
        accentGlow: 'rgba(241,196,15,0.3)', border: '#f1c40f'
    };

    const title = customTitle || defaults.title;
    const quote = customQuote || defaults.quote;
    const grade = customGrade || defaults.grade;

    let intro = Object.assign({}, introBase);
    let gradeColor = defaults.gradeColor;
    let bannerLabel = '&#10022; MISJA UKONCZONA &#10022;';
    let bannerEmoji = defaults.emoji;

    if (isWin === false) {
        intro.color1 = '#1a0505'; intro.color2 = '#2d0a0a';
        intro.accent = '#e74c3c'; intro.accentGlow = 'rgba(231,76,60,0.35)';
        intro.border = '#e74c3c'; gradeColor = '#e74c3c';
        bannerLabel = '&#10007; MISJA NIEUDANA &#10007;';
        bannerEmoji = '💀';
    } else if (isWin === true) {
        intro.color1 = '#051a0a'; intro.color2 = '#0a2d12';
        intro.accent = '#2ecc71'; intro.accentGlow = 'rgba(46,204,113,0.35)';
        intro.border = '#2ecc71'; gradeColor = '#2ecc71';
        bannerLabel = '&#10022; WYGRANA! &#10022;';
        bannerEmoji = defaults.emoji;
    }

    // Usuń ewentualną poprzednią kartę
    const existing = document.getElementById('outroCard');
    if (existing) existing.remove();

    // Ukryj grę
    document.querySelectorAll('.game').forEach(g => g.style.display = "none");
    document.getElementById("menu").style.display = "none";

    const card = document.createElement('div');
    card.id = 'outroCard';
    card.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.95);
        font-family: 'Segoe UI', Arial, sans-serif;
        animation: outroFadeIn 0.5s ease;
    `;

    // Gwiazdki w tle (canvas)
    const starsHtml = Array.from({length: 30}, () => {
        const x = Math.random()*100, y = Math.random()*100;
        const s = 1 + Math.random()*2;
        const d = Math.random()*3;
        return `<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:white;border-radius:50%;opacity:${0.3+Math.random()*0.7};animation:outroBlink ${1+d}s ${d}s infinite alternate;"></div>`;
    }).join('');

    // Statystyki
    const statsHtml = `
        <div style="display:flex;gap:20px;justify-content:center;margin-bottom:24px;flex-wrap:wrap;">
            <div style="text-align:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 24px;">
                <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:6px;">OCENA</div>
                <div style="font-size:48px;font-weight:900;color:${gradeColor};text-shadow:0 0 30px ${gradeColor};line-height:1;">${grade}</div>
            </div>
            <div style="text-align:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 24px;min-width:140px;display:flex;flex-direction:column;justify-content:center;">
                <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:6px;">TYTUŁ</div>
                <div style="font-size:18px;font-weight:700;color:#fff;line-height:1.3;">${title}</div>
            </div>
        </div>
    `;

    card.innerHTML = `
        <style>
            @keyframes outroFadeIn { from { opacity:0; } to { opacity:1; } }
            @keyframes outroBlink { from { opacity:0.2; } to { opacity:1; } }
            @keyframes outroPopIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
            @keyframes outroEmojiSpin { 0% { transform: rotate(-10deg) scale(1); } 50% { transform: rotate(10deg) scale(1.15); } 100% { transform: rotate(-10deg) scale(1); } }
            @keyframes outroGlow { 0%,100% { box-shadow: 0 0 30px ${intro.accentGlow}; } 50% { box-shadow: 0 0 70px ${intro.accentGlow}, 0 0 120px ${intro.accentGlow}; } }
            @keyframes outroShine { 0% { left:-100%; } 100% { left:200%; } }
            #outroMenuBtn:hover { transform:scale(1.04) !important; background:${intro.accent} !important; color:#000 !important; }
            #outroNextBtn:hover { background:rgba(255,255,255,0.08) !important; border-color:${intro.accent} !important; color:${intro.accent} !important; transform:scale(1.04) !important; }
        </style>

        <!-- Gwiazdy w tle -->
        <div style="position:fixed;inset:0;pointer-events:none;overflow:hidden;">${starsHtml}</div>

        <!-- Karta -->
        <div style="
            width:min(560px,92vw);
            background:linear-gradient(145deg,${intro.color1},${intro.color2});
            border:2px solid ${intro.border};
            border-radius:28px;
            padding:44px 40px 36px;
            position:relative;
            overflow:hidden;
            animation:outroPopIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both, outroGlow 3s ease-in-out infinite;
            box-shadow:0 0 80px ${intro.accentGlow}, 0 40px 80px rgba(0,0,0,0.9);
        ">
            <!-- Siatka dekoracyjna -->
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,0.015) 40px,rgba(255,255,255,0.015) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.015) 40px,rgba(255,255,255,0.015) 41px);border-radius:28px;pointer-events:none;"></div>
            <!-- Shine efekt -->
            <div style="position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);animation:outroShine 3s 0.8s ease-in-out;pointer-events:none;"></div>

            <!-- Header -->
            <div style="text-align:center;margin-bottom:30px;position:relative;">
                <div style="margin-bottom:6px;">
                    <span style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${intro.accent};font-weight:700;opacity:0.8;">${bannerLabel}</span>
                </div>
                <div style="font-size:80px;animation:outroEmojiSpin 3s ease-in-out infinite;display:inline-block;filter:drop-shadow(0 0 30px ${intro.accentGlow});margin-bottom:10px;">${bannerEmoji}</div>
                <h1 style="margin:0;font-size:28px;font-weight:900;color:${intro.accent};text-shadow:0 0 25px ${intro.accentGlow};letter-spacing:-0.5px;">${GAME_INTROS[gameId]?.title || gameId}</h1>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:12px;letter-spacing:2px;text-transform:uppercase;">${GAME_INTROS[gameId]?.subtitle || ''}</p>
            </div>

            <!-- Statystyki -->
            ${statsHtml}

            <!-- Cytat -->
            <div style="
                background:linear-gradient(90deg,${intro.accentGlow},transparent);
                border-left:3px solid ${intro.accent};
                border-radius:0 10px 10px 0;
                padding:14px 18px;
                margin-bottom:30px;
                font-size:14px;
                color:rgba(255,255,255,0.65);
                font-style:italic;
                line-height:1.6;
            ">"${quote}"</div>

            <!-- Przyciski -->
            <div style="display:flex;gap:12px;">
                <button id="outroNextBtn" onclick="closeOutroCard()" style="
                    flex:1;padding:14px;font-size:15px;font-weight:600;
                    background:transparent;color:rgba(255,255,255,0.55);
                    border:2px solid rgba(255,255,255,0.18);border-radius:12px;
                    cursor:pointer;transition:all 0.2s;font-family:inherit;
                ">← Wróć do Menu</button>
                <button id="outroMenuBtn" onclick="closeOutroCard()" style="
                    flex:2;padding:14px;font-size:18px;font-weight:800;
                    background:transparent;color:${intro.accent};
                    border:2px solid ${intro.accent};border-radius:12px;
                    cursor:pointer;transition:all 0.2s;font-family:inherit;
                    letter-spacing:1px;
                ">🏆 Dalej!</button>
            </div>
        </div>
    `;

    document.body.appendChild(card);
}

function closeOutroCard() {
    const card = document.getElementById('outroCard');
    if (card) card.remove();
    document.getElementById("menu").style.display = "grid";
    cancelAnimationFrame(gameLoopId);
}

function actuallyStartGame(id) {
    document.getElementById("menu").style.display = "none";
    document.querySelectorAll('.game').forEach(g => g.style.display = "none");
    document.getElementById(id).style.display = "flex";
    
    document.body.style.userSelect = "none";
    document.body.style.cursor = "default"; 
    
    const canvas = document.getElementById('canvas');
    const pongCanvas = document.getElementById('pongCanvas');
    const ticBoardDiv = document.getElementById('ticTacToeBoard');
    const solCanvas = document.getElementById('solitaireCanvas');
    const dinoCanvas = document.getElementById('dinoCanvas'); 
    const tomusCanvas = document.getElementById('tomusCanvas');
    const kibelCanvas = document.getElementById('kibelCanvas');
    const blockCanvas = document.getElementById('blockCanvas');
    
    if (id === 'shooter') canvas.style.cursor = 'crosshair';
    else if (id === 'pingpong') pongCanvas.style.cursor = 'n-resize';
    else if (id === 'tictactoe') ticBoardDiv.style.cursor = 'cell';
    else if (id === 'solitaire') solCanvas.style.cursor = 'pointer';
    else if (id === 'dino') { document.body.style.cursor = 'none'; dinoCanvas.style.cursor = 'none'; } 
    else if (id === 'tomus') tomusCanvas.style.cursor = 'crosshair';
    else if (id === 'krol_kibla') kibelCanvas.style.cursor = 'crosshair';
    else if (id === 'blockbuster') blockCanvas.style.cursor = 'pointer';
    else if (id === 'flappy') document.getElementById('flappyCanvas').style.cursor = 'pointer';

    cancelAnimationFrame(gameLoopId);

    if(id === 'shooter') { resetGame(); loop(); } 
    else if(id === 'tictactoe') { resetTic(); } 
    else if(id === 'pingpong') { resetPong(); } 
    else if(id === 'solitaire') { resetSolitaire(); solitaireLoop(); } 
    else if(id === 'dino') { resetDino(); dinoLoop(); } 
    else if(id === 'tomus') { resetTomus(); tomusLoop(); } 
    else if(id === 'blockbuster') { resetBlockbuster(); blockbusterLoop(); } 
    else if(id === 'krol_kibla') { resetKibel(); kibelLoop(); }
    else if(id === 'wisielec') { resetHangman().then(() => hangmanLoop()); }
    else if(id === 'whack') { startWhack(); } 
    else if(id === 'slide') { initSlide(); }
    else if(id === 'factory') { resetFactory(); factoryLoop(); } 
    else if(id === 'flappy') { resetFlappy(); flappyLoop(); }
    else if(id === 'quiz') { initQuizCategoryScreen(); document.getElementById('quizCategoryScreen').style.display='flex'; document.getElementById('quizGameScreen').style.display='none'; }
}

function goToMenu() {
    const introCard = document.getElementById('introCard');
    if (introCard) introCard.remove();
    document.querySelectorAll('.game').forEach(g => g.style.display = "none");
    document.getElementById("menu").style.display = "grid";
    
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "default";
    
    cancelAnimationFrame(gameLoopId);

    if (typeof whackGameInterval !== 'undefined') clearTimeout(whackGameInterval);
    if (typeof whackTimerInterval !== 'undefined') clearInterval(whackTimerInterval);
}

// ==========================================
// LOGIKA: PING PONG
// ==========================================
const pongCanvas = document.getElementById("pongCanvas");
const pongCtx = pongCanvas.getContext("2d");
const scorePlayerSpan = document.getElementById("scorePlayer");
const scoreAiSpan = document.getElementById("scoreAi");

const paddle = { w: 12, h: 80, speed: 4 };
const playerPong = { x: 20, y: 160, score: 0 };
const aiPong = { x: 568, y: 160, score: 0 };
const ball = { x: 300, y: 200, r: 8, dx: 4, dy: 4, baseSpeed: 4 };

function resetPong() {
    playerPong.score = 0;
    aiPong.score = 0;
    updatePongScore();
    resetBall();
    pongLoop();
}

function resetBall() {
    ball.x = pongCanvas.width / 2;
    ball.y = pongCanvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.baseSpeed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.baseSpeed;
}

function updatePongScore() {
    scorePlayerSpan.textContent = playerPong.score;
    scoreAiSpan.textContent = aiPong.score;
}

document.addEventListener("mousemove", e => {
    if (document.getElementById("pingpong").style.display !== "none") {
        const rect = pongCanvas.getBoundingClientRect();
        let mouseY = e.clientY - rect.top;
        playerPong.y = mouseY - (paddle.h / 2);
        if(playerPong.y < 0) playerPong.y = 0;
        if(playerPong.y + paddle.h > pongCanvas.height) playerPong.y = pongCanvas.height - paddle.h;
    }
});

function pongLoop() {
    if (document.getElementById("pingpong").style.display === "none") return;

    // === TŁO - głęboki niebieski stół ===
    let ppGrad = pongCtx.createLinearGradient(0, 0, 0, 400);
    ppGrad.addColorStop(0, "#0a1628");
    ppGrad.addColorStop(0.5, "#0d2137");
    ppGrad.addColorStop(1, "#0a1628");
    pongCtx.fillStyle = ppGrad;
    pongCtx.fillRect(0, 0, 600, 400);

    // Ramka stołu
    pongCtx.strokeStyle = "rgba(100,180,255,0.25)";
    pongCtx.lineWidth = 3;
    pongCtx.strokeRect(4, 4, 592, 392);

    // Środkowe kółko
    pongCtx.beginPath();
    pongCtx.arc(300, 200, 50, 0, Math.PI * 2);
    pongCtx.strokeStyle = "rgba(255,255,255,0.07)";
    pongCtx.lineWidth = 2;
    pongCtx.stroke();

    // Linia środkowa
    pongCtx.setLineDash([12, 10]);
    pongCtx.beginPath();
    pongCtx.moveTo(300, 0);
    pongCtx.lineTo(300, 400);
    pongCtx.strokeStyle = "rgba(255,255,255,0.18)";
    pongCtx.lineWidth = 2;
    pongCtx.stroke();
    pongCtx.setLineDash([]);

    let aiCenter = aiPong.y + (paddle.h / 2);
    if (aiCenter < ball.y - 15) aiPong.y += paddle.speed;
    else if (aiCenter > ball.y + 15) aiPong.y -= paddle.speed;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.r < 0 || ball.y + ball.r > pongCanvas.height) ball.dy *= -1;

    let hitPlayer = ball.x - ball.r < playerPong.x + paddle.w && ball.y > playerPong.y && ball.y < playerPong.y + paddle.h;
    let hitAi = ball.x + ball.r > aiPong.x && ball.y > aiPong.y && ball.y < aiPong.y + paddle.h;

    if (hitPlayer || hitAi) {
        ball.dx *= -1.05; 
        ball.dy *= 1.02;
        if (hitPlayer) ball.x = playerPong.x + paddle.w + ball.r;
        if (hitAi) ball.x = aiPong.x - ball.r;
    }

    if (ball.x < 0) { 
        aiPong.score++; updatePongScore(); 
        if (aiPong.score >= 5) { 
            cancelAnimationFrame(gameLoopId);
            setTimeout(() => {
                showOutroCard('pingpong', 'AI Wygrało', `AI pokonało Cię ${aiPong.score}:${playerPong.score}. Trenuj refleks i spróbuj ponownie.`, 'C', false);
            }, 100);
            return; 
        }
        resetBall(); 
    }
    else if (ball.x > pongCanvas.width) { 
        playerPong.score++; updatePongScore(); 
        if (playerPong.score >= 5) { 
            markGameWon('pingpong'); 
            let grade = aiPong.score === 0 ? "S" : (aiPong.score <= 2 ? "A" : "B");
            let title = aiPong.score === 0 ? "Dominacja Totalna" : (aiPong.score <= 2 ? "Solidna Gra" : "Wyrównana Walka");
            showOutroCard('pingpong', title, `Wygrałeś z AI (${playerPong.score}:${aiPong.score}). Paletka nie kłamie.`, grade, true);
            return; 
        }
        resetBall(); 
    }

    pongCtx.shadowBlur = 20;
    
    // Paletka gracza - cyjanowa z blaskiem
    pongCtx.shadowColor = "#00ffff";
    let pgGrad = pongCtx.createLinearGradient(playerPong.x, 0, playerPong.x + paddle.w, 0);
    pgGrad.addColorStop(0, "#00ffff");
    pgGrad.addColorStop(1, "#0080ff");
    pongCtx.fillStyle = pgGrad;
    pongCtx.beginPath(); pongCtx.roundRect(playerPong.x, playerPong.y, paddle.w, paddle.h, 6); pongCtx.fill();

    // Paletka AI - fioletowa z blaskiem
    pongCtx.shadowColor = "#ff00ff";
    let aiGrad = pongCtx.createLinearGradient(aiPong.x, 0, aiPong.x + paddle.w, 0);
    aiGrad.addColorStop(0, "#ff00aa");
    aiGrad.addColorStop(1, "#ff00ff");
    pongCtx.fillStyle = aiGrad;
    pongCtx.beginPath(); pongCtx.roundRect(aiPong.x, aiPong.y, paddle.w, paddle.h, 6); pongCtx.fill();

    // Piłka z poświatą
    pongCtx.shadowColor = "#ffffff";
    pongCtx.shadowBlur = 25;
    let ballGrad = pongCtx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, ball.r);
    ballGrad.addColorStop(0, "#ffffff");
    ballGrad.addColorStop(1, "#aaddff");
    pongCtx.fillStyle = ballGrad;
    pongCtx.beginPath();
    pongCtx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    pongCtx.fill();
    pongCtx.shadowBlur = 0;

    gameLoopId = requestAnimationFrame(pongLoop);
}

// ==========================================
// LOGIKA: KÓŁKO I KRZYŻYK
// ==========================================
const ticBoardDiv = document.getElementById("ticTacToeBoard");
const ticStatusDiv = document.getElementById("ticStatus");
let ticBoard, ticGameOver;

function resetTic() {
    ticBoard = Array(9).fill("");
    ticGameOver = false;
    ticStatusDiv.textContent = "Twój ruch (X)";
    ticBoardDiv.innerHTML = "";
    ticBoard.forEach((_, i) => {
        const c = document.createElement("div");
        c.className = "cell";
        c.onclick = () => playerMove(i);
        ticBoardDiv.appendChild(c);
    });
}

function playerMove(i) {
    if (ticBoard[i] || ticGameOver) return;
    ticBoard[i] = "X";
    renderTic();
    if (checkWin(ticBoard, "X")) {
        markGameWon('tictactoe');
        return endTic("Wygrałeś! Ocena: S (Taktyk)", true);
    }
    if (ticBoard.every(x => x)) return endTic("Remis! Ocena: B (Solidnie)");
    ticStatusDiv.textContent = "AI myśli...";
    setTimeout(aiTicMove, 300);
}

function aiTicMove() {
    if (ticGameOver) return;
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (!ticBoard[i]) {
            ticBoard[i] = "O";
            let score = minimax(ticBoard, 0, false);
            ticBoard[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    ticBoard[move] = "O";
    renderTic();
    if (checkWin(ticBoard, "O")) return endTic("AI wygrało! Ocena: C");
    if (ticBoard.every(x => x)) return endTic("Remis! Ocena: B (Solidnie)");
    ticStatusDiv.textContent = "Twój ruch (X)";
}

function minimax(board, depth, isMaxing) {
    if (checkWin(board, "O")) return 10 - depth;
    if (checkWin(board, "X")) return depth - 10;
    if (board.every(x => x)) return 0;
    if (isMaxing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

function checkWin(b, p) {
    const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return w.some(c => c.every(i => b[i] === p));
}

function renderTic() {
    [...ticBoardDiv.children].forEach((c, i) => {
        c.textContent = ticBoard[i];
        if(ticBoard[i] === "X") {
            c.style.color = "#00ffff";
            c.style.textShadow = "0 0 15px rgba(0, 255, 255, 0.8)";
        } else if(ticBoard[i] === "O") {
            c.style.color = "#ff00ff";
            c.style.textShadow = "0 0 15px rgba(255, 0, 255, 0.8)";
        }
    });
}

function endTic(msg, win) {
    ticGameOver = true;
    ticStatusDiv.textContent = msg;
    if (win) {
        setTimeout(() => showOutroCard('tictactoe', 'Taktyk Planszy', 'Minimax nie ma szans tam, gdzie intuicja gracza rządzi.', 'S', true), 400);
    } else if (msg.includes('Remis')) {
        setTimeout(() => showOutroCard('tictactoe', 'Honorowy Remis', 'AI nie było w stanie Cię pokonać — nic więcej powiedzieć nie trzeba.', 'B', true), 400);
    } else {
        setTimeout(() => showOutroCard('tictactoe', 'AI Wygrało', 'Minimax okazał się silniejszy tym razem. Spróbuj ponownie!', 'C', false), 400);
    }
}

// ==========================================
// LOGIKA: SPACE SHOOTER
// ==========================================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const levelSpan = document.getElementById("level");
let level = 1, enemies = [], bullets = [], powerUps = [], rapid = false;
let shooterStars = [];
let shooterShotsFired = 0; 
const player = { x: 180, y: 440, w: 30, h: 30 };

document.addEventListener("mousemove", e => {
    if (document.getElementById("shooter").style.display !== "none") {
        const rect = canvas.getBoundingClientRect();
        player.x = e.clientX - rect.left - (player.w / 2);
        player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    }
});

canvas.onclick = () => {
    if (document.getElementById("shooter").style.display !== "none") {
        bullets.push({ x: player.x + 12, y: player.y });
        shooterShotsFired++;
    }
};

function spawn() {
    enemies = [];
    let count = level * 2;
    for (let i = 0; i < count; i++) {
        enemies.push({ x: (i % 6) * 60 + 15, y: -30 - (Math.floor(i/6)*40), w: 30, h: 30, hp: 1, boss: false });
    }
    if (level % 5 === 0) enemies.push({ x: 160, y: -100, w: 80, h: 80, hp: 10 + level, boss: true });
}

function resetGame() {
    level = 1; rapid = false; enemies = []; bullets = []; powerUps = []; shooterShotsFired = 0;
    shooterStars = Array.from({length: 60}, () => ({x: Math.random()*400, y: Math.random()*500, s: Math.random()*2+1}));
    levelSpan.textContent = level;
    spawn();
}

function loop() {
    if (document.getElementById("shooter").style.display === "none") return;
    
    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#050B14"); 
    bgGrad.addColorStop(1, "#1A0B2E");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 400, 500);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    shooterStars.forEach(s => {
        s.y += s.s * 0.5;
        if(s.y > 500) { s.y = 0; s.x = Math.random() * 400; }
        ctx.fillRect(s.x, s.y, s.s, s.s);
    });

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.moveTo(player.x + player.w / 2, player.y);
    ctx.lineTo(player.x + player.w, player.y + player.h);
    ctx.lineTo(player.x + player.w / 2, player.y + player.h - 8);
    ctx.lineTo(player.x, player.y + player.h);
    ctx.fill();
    ctx.shadowBlur = 0;

    bullets.forEach(b => b.y -= rapid ? 10 : 5);
    bullets = bullets.filter(b => b.y > 0);
    ctx.shadowBlur = 10;
    ctx.shadowColor = "yellow";
    ctx.fillStyle = "#f1c40f";
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, 6, 15, 3);
        ctx.fill();
    });
    ctx.shadowBlur = 0;

    enemies.forEach(e => {
        e.y += e.boss ? (0.1 + level * 0.05) : (0.3 + level * 0.1);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = e.boss ? "#ff00ff" : "#ff3300";
        ctx.fillStyle = e.boss ? "#9b59b6" : "#e74c3c";
        
        ctx.beginPath();
        if(e.boss) {
            ctx.roundRect(e.x, e.y, e.w, e.h, 15);
        } else {
            ctx.roundRect(e.x, e.y, e.w, e.h, 5);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (e.y + e.h > canvas.height) { cancelAnimationFrame(gameLoopId); showOutroCard('shooter', 'Inwazja Wygrała', `Wróg przebił się przez Twoją obronę. Strzałów: ${shooterShotsFired}.`, 'C', false); resetGame(); return; }
    });

    enemies = enemies.filter(e => {
        let hit = false;
        bullets = bullets.filter(b => {
            if (b.x < e.x + e.w && b.x + 5 > e.x && b.y < e.y + e.h && b.y + 10 > e.y) { hit = true; return false; }
            return true;
        });
        if (hit) e.hp--;
        return e.hp > 0;
    });

    if (Math.random() < 0.002) powerUps.push({ x: Math.random() * 350, y: 0 });
    powerUps.forEach(p => {
        p.y += 2; 
        ctx.shadowBlur = 15; ctx.shadowColor = "lime"; ctx.fillStyle = "#2ecc71";
        ctx.beginPath(); ctx.roundRect(p.x, p.y, 20, 20, 10); ctx.fill(); ctx.shadowBlur = 0;
        
        if (p.y + 20 > player.y && p.x + 20 > player.x && p.x < player.x + player.w) {
            rapid = true; p.y = 1000; setTimeout(() => rapid = false, 5000);
        }
    });

    if (enemies.length === 0) { 
        if (level === 10) {
            markGameWon('shooter');
            let grade = shooterShotsFired < 150 ? "S" : (shooterShotsFired < 250 ? "A" : "B");
            let gradeLabel = shooterShotsFired < 150 ? "S (Komandos)" : (shooterShotsFired < 250 ? "A (Dobry żołnierz)" : "B (Strzelasz na ślepo)");
            cancelAnimationFrame(gameLoopId);
            showOutroCard('shooter', 'Obrońca Kosmosu', `Ocaliłeś kosmos! Wystrzelone pociski: ${shooterShotsFired}. Ocena: ${gradeLabel}`, grade, true);
            return;
        }
        level++; 
        levelSpan.textContent = level; 
        spawn(); 
    }
    gameLoopId = requestAnimationFrame(loop);
}

// ==========================================
// LOGIKA: PASJANS
// ==========================================
const solCanvas = document.getElementById("solitaireCanvas");
let solCtx;
if(solCanvas) solCtx = solCanvas.getContext("2d");

let stock = [], waste = [], foundations = [[],[],[],[]], tableau = [[],[],[],[],[],[],[]];
const SUITS = ['♥', '♦', '♣', '♠'], VALS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function resetSolitaire() {
    let deck = [];
    SUITS.forEach(s => VALS.forEach(v => {
        deck.push({ s, v, color: (s==='♥'||s==='♦') ? '#e74c3c' : '#222', up: false });
    }));
    deck.sort(() => Math.random() - 0.5);
    
    tableau = [[],[],[],[],[],[],[]];
    for(let i=0; i<7; i++) {
        for(let j=i; j<7; j++) { 
            let c = deck.pop(); 
            if(i===j) c.up = true; 
            tableau[j].push(c); 
        }
    }
    stock = deck; 
    waste = []; 
    foundations = [[],[],[],[]];
}

function solitaireLoop() {
    if (document.getElementById("solitaire").style.display === "none") return;
    
    // Tło - eleganckie zielone sukno z teksturą
    let sGrad = solCtx.createLinearGradient(0, 0, 800, 600);
    sGrad.addColorStop(0, "#1a5c2e");
    sGrad.addColorStop(0.5, "#1e6b34");
    sGrad.addColorStop(1, "#164d26");
    solCtx.fillStyle = sGrad;
    solCtx.fillRect(0,0,800,600);

    // Subtelna tekstura siatki
    solCtx.strokeStyle = "rgba(0,0,0,0.08)";
    solCtx.lineWidth = 1;
    for(let i=0; i<800; i+=30) { solCtx.beginPath(); solCtx.moveTo(i,0); solCtx.lineTo(i,600); solCtx.stroke(); }
    for(let i=0; i<600; i+=30) { solCtx.beginPath(); solCtx.moveTo(0,i); solCtx.lineTo(800,i); solCtx.stroke(); }

    // Ramka planszy
    solCtx.strokeStyle = "rgba(255,255,255,0.06)";
    solCtx.lineWidth = 2;
    solCtx.strokeRect(8, 8, 784, 584);

    drawSlot(20, 20); 
    if(stock.length > 0) drawCard(20, 20, {up: false});
    if(waste.length > 0) drawCard(100, 20, waste[waste.length-1]);

    let score = 0;
    foundations.forEach((f, i) => {
        drawSlot(400 + i*90, 20);
        if(f.length > 0) drawCard(400 + i*90, 20, f[f.length-1]);
        score += f.length;
    });
    document.getElementById("solitaireScore").textContent = score;

    tableau.forEach((t, i) => {
        drawSlot(20 + i*110, 150);
        t.forEach((c, j) => drawCard(20 + i*110, 150 + j*25, c));
    });

    if(score === 52) { 
        markGameWon('solitaire');
        setTimeout(()=>showOutroCard('solitaire','Karciany Strateg','Wszystkie 52 karty w bazach. Cierpliwość i taktyka.',  'S', true),200);
        return;
        setTimeout(() => showOutroCard('solitaire', 'Karciany Strateg', 'Wszystkie 52 karty na bazach. Cierpliwość i taktyka w jednym.', 'S', true), 200);
        return; 
    }
    gameLoopId = requestAnimationFrame(solitaireLoop);
}

function drawSlot(x, y) {
    solCtx.strokeStyle = "rgba(255,255,255,0.18)";
    solCtx.lineWidth = 2;
    solCtx.beginPath();
    solCtx.roundRect(x, y, 70, 100, 8);
    solCtx.stroke();
    // Subtelne wypełnienie slotu
    solCtx.fillStyle = "rgba(0,0,0,0.12)";
    solCtx.fill();
}

function drawCard(x, y, card) {
    // Cień karty
    solCtx.shadowBlur = 8;
    solCtx.shadowColor = "rgba(0,0,0,0.6)";
    solCtx.shadowOffsetX = 2;
    solCtx.shadowOffsetY = 3;

    if(card.up) {
        // Biała karta z delikatnym gradientem
        let cGrad = solCtx.createLinearGradient(x, y, x, y+100);
        cGrad.addColorStop(0, "#ffffff");
        cGrad.addColorStop(1, "#f0f0f0");
        solCtx.fillStyle = cGrad;
    } else {
        // Zakryta karta
        let cGrad = solCtx.createLinearGradient(x, y, x+70, y+100);
        cGrad.addColorStop(0, "#1a3a5c");
        cGrad.addColorStop(1, "#0d2236");
        solCtx.fillStyle = cGrad;
    }
    solCtx.beginPath(); 
    solCtx.roundRect(x, y, 70, 100, 7); 
    solCtx.fill();
    solCtx.shadowBlur = 0;
    solCtx.shadowOffsetX = 0;
    solCtx.shadowOffsetY = 0;
    
    // Obramowanie
    solCtx.strokeStyle = card.up ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)";
    solCtx.lineWidth = 1.5;
    solCtx.stroke();
    
    if(card.up) {
        // Wartość w lewym górnym
        solCtx.fillStyle = card.color;
        solCtx.font = "bold 15px 'Segoe UI', Arial";
        solCtx.fillText(card.v, x+5, y+18);
        solCtx.font = "13px 'Segoe UI', Arial";
        solCtx.fillText(card.s, x+5, y+32);
        // Duży symbol na środku
        solCtx.font = "28px Arial";
        solCtx.textAlign = "center";
        solCtx.textBaseline = "middle";
        solCtx.fillText(card.s, x+35, y+58);
        solCtx.textAlign = "left";
        solCtx.textBaseline = "alphabetic";
        // Wartość w prawym dolnym (odwrócona)
        solCtx.save();
        solCtx.translate(x+65, y+88);
        solCtx.rotate(Math.PI);
        solCtx.fillStyle = card.color;
        solCtx.font = "bold 15px 'Segoe UI', Arial";
        solCtx.fillText(card.v, 0, 0);
        solCtx.restore();
    } else {
        // Wzór na rewersie
        solCtx.strokeStyle = "rgba(100,150,200,0.3)";
        solCtx.lineWidth = 1;
        for(let i=8; i<62; i+=8) {
            solCtx.beginPath(); solCtx.moveTo(x+i, y+5); solCtx.lineTo(x+i, y+95); solCtx.stroke();
        }
        solCtx.beginPath(); solCtx.roundRect(x+5, y+5, 60, 90, 4); solCtx.strokeStyle="rgba(100,160,220,0.25)"; solCtx.lineWidth=2; solCtx.stroke();
    }
}

function getCardValue(v) { return VALS.indexOf(v); }

function canMoveToFoundation(card, f) {
    if (f.length === 0) return card.v === 'A';
    let top = f[f.length-1];
    return top.s === card.s && getCardValue(card.v) === getCardValue(top.v) + 1;
}

function canMoveToTableau(card, col) {
    if (col.length === 0) return card.v === 'K';
    let top = col[col.length-1];
    return top.up && top.color !== card.color && getCardValue(card.v) === getCardValue(top.v) - 1;
}

if(solCanvas) {
    solCanvas.onclick = (e) => {
        const mx = e.offsetX, my = e.offsetY;
        
        if(mx > 20 && mx < 90 && my > 20 && my < 120) {
            if(stock.length > 0) { 
                let c = stock.pop(); c.up = true; waste.push(c); 
            } else { 
                stock = waste.reverse().map(c => { c.up = false; return c; }); 
                waste = []; 
            }
            return;
        }
        
        if(mx > 100 && mx < 170 && my > 20 && my < 120 && waste.length > 0) {
            let card = waste[waste.length-1];
            for(let i=0; i<4; i++) {
                if(canMoveToFoundation(card, foundations[i])) {
                    foundations[i].push(waste.pop()); return;
                }
            }
            for(let i=0; i<7; i++) {
                if(canMoveToTableau(card, tableau[i])) {
                    tableau[i].push(waste.pop()); return;
                }
            }
        }
        
        for(let i=0; i<7; i++) {
            let col = tableau[i];
            let x = 20 + i*110;
            
            if(mx > x && mx < x+70 && my > 150) {
                if(col.length > 0) {
                    let clickedIdx = -1;
                    
                    for(let j=col.length-1; j>=0; j--) {
                        let y = 150 + j*25;
                        let h = (j === col.length - 1) ? 100 : 25; 
                        if(my >= y && my <= y + h) {
                            clickedIdx = j;
                            break;
                        }
                    }
                    
                    if(clickedIdx !== -1) {
                        let card = col[clickedIdx];
                        
                        if(!card.up && clickedIdx === col.length - 1) {
                            card.up = true; 
                        } 
                        else if(card.up) {
                            if(clickedIdx === col.length - 1) {
                                for(let f of foundations) {
                                    if(canMoveToFoundation(card, f)) {
                                        f.push(col.pop()); return;
                                    }
                                }
                            }
                            for(let t=0; t<7; t++) {
                                if(t !== i && canMoveToTableau(card, tableau[t])) {
                                    let movingCards = col.splice(clickedIdx);
                                    tableau[t].push(...movingCards);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

// ==========================================
// LOGIKA: DINO RUN
// ==========================================
function restartDino() {
    cancelAnimationFrame(gameLoopId); 
    resetDino();                     
    dinoLoop();                      
}
const dinoCanvas = document.getElementById("dinoCanvas");
let dinoCtx;
if(dinoCanvas) dinoCtx = dinoCanvas.getContext("2d");

const imgDino = new Image(); imgDino.src = 'twoj_dino.png'; 
const imgObstacle = new Image(); imgObstacle.src = 'twoja_przeszkoda.png';
const imgCoin = new Image(); imgCoin.src = 'twoja_moneta.png';

let dinoData = { x: 50, y: 300, w: 40, h: 40, dy: 0, gravity: 0.8, jumpPower: -14, isJumping: false, ground: 300 };
let dinoObstacles = [];
let dinoCoinsList = [];
let dinoCoinsCollected = 0;
let dinoStartTime = 0;
let dinoSpeed = 4.5; 
let dinoFrames = 0;

function resetDino() {
    dinoData = { x: 50, y: 300, w: 40, h: 40, dy: 0, gravity: 0.8, jumpPower: -14, isJumping: false, ground: 300 };
    dinoObstacles = [];
    dinoCoinsList = [];
    dinoCoinsCollected = 0;
    dinoSpeed = 4.5;
    dinoFrames = 0;
    dinoStartTime = Date.now();
    document.getElementById("dinoCoins").textContent = dinoCoinsCollected;
    document.getElementById("dinoTime").textContent = "0";
}

function drawImageSafely(ctx, img, x, y, w, h, fallbackColor) {
    if (img.complete && img.naturalHeight !== 0) {
        ctx.drawImage(img, x, y, w, h);
    } else {
        ctx.shadowBlur = 8; ctx.shadowColor = fallbackColor;
        ctx.fillStyle = fallbackColor;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

document.addEventListener('keydown', (e) => {
    if (document.getElementById("dino").style.display !== "none") {
        if ((e.code === 'Space' || e.code === 'ArrowUp') && !dinoData.isJumping) {
            dinoData.dy = dinoData.jumpPower;
            dinoData.isJumping = true;
        }
    }
});

if (dinoCanvas) {
    dinoCanvas.addEventListener('mousedown', () => {
        if (document.getElementById("dino").style.display !== "none" && !dinoData.isJumping) {
            dinoData.dy = dinoData.jumpPower;
            dinoData.isJumping = true;
        }
    });
}

function dinoLoop() {
    if (document.getElementById("dino").style.display === "none") return;
    
    let elapsedTime = Math.floor((Date.now() - dinoStartTime) / 1000);
    document.getElementById("dinoTime").textContent = elapsedTime;
    
    if (elapsedTime >= 60) {
        markGameWon('dino');
        let grade = dinoCoinsCollected >= 35 ? "S" : (dinoCoinsCollected >= 15 ? "A" : "B");
        let title = dinoCoinsCollected >= 35 ? "Łowca Skarbów" : (dinoCoinsCollected >= 15 ? "Sprytny Biegacz" : "Dinozaur Przetrwał");
        showOutroCard('dino', title, `Minuta przetrwana — ${dinoCoinsCollected} monet zebrano po drodze.`, grade, true);
        return;
    }

    // === TŁO — piękny gradient nieba ===
    let elapsedRatio = Math.min(elapsedTime / 60, 1);
    // Niebo zmienia kolor z biegiem czasu (dzień -> zachód)
    let skyTop = `hsl(${210 - elapsedRatio*30}, 70%, ${40 + elapsedRatio*5}%)`;
    let skyBot = `hsl(${195 - elapsedRatio*20}, 60%, ${60 - elapsedRatio*10}%)`;
    let dGrad = dinoCtx.createLinearGradient(0, 0, 0, dinoCanvas.height);
    dGrad.addColorStop(0, skyTop);
    dGrad.addColorStop(0.65, skyBot);
    dGrad.addColorStop(1, "#c9b89a");
    dinoCtx.fillStyle = dGrad;
    dinoCtx.fillRect(0, 0, dinoCanvas.width, dinoCanvas.height);

    // Słońce / księżyc
    let sunX = dinoCanvas.width * (1 - elapsedRatio * 0.7);
    dinoCtx.shadowBlur = 30; dinoCtx.shadowColor = elapsedRatio > 0.5 ? "#ff8c00" : "#ffe066";
    dinoCtx.fillStyle = elapsedRatio > 0.5 ? "#ff9500" : "#ffe066";
    dinoCtx.beginPath(); dinoCtx.arc(sunX, 55, 28, 0, Math.PI*2); dinoCtx.fill();
    dinoCtx.shadowBlur = 0;

    // Chmury (przesuwają się w lewo)
    dinoCtx.fillStyle = "rgba(255,255,255,0.55)";
    let t = Date.now() / 1000;
    [[120, 60, 50, 22], [320, 45, 60, 18], [550, 70, 45, 20], [700, 55, 38, 16]].forEach(([cx, cy, rw, rh]) => {
        let ox = ((cx - t * 20) % (dinoCanvas.width + 100) + dinoCanvas.width + 100) % (dinoCanvas.width + 100) - 50;
        dinoCtx.beginPath(); dinoCtx.ellipse(ox, cy, rw, rh, 0, 0, Math.PI*2); dinoCtx.fill();
        dinoCtx.beginPath(); dinoCtx.ellipse(ox - rw*0.4, cy + rh*0.2, rw*0.6, rh*0.8, 0, 0, Math.PI*2); dinoCtx.fill();
        dinoCtx.beginPath(); dinoCtx.ellipse(ox + rw*0.4, cy + rh*0.2, rw*0.65, rh*0.8, 0, 0, Math.PI*2); dinoCtx.fill();
    });

    // Ziemia — jasnobrązowa z gradientem
    let groundY = dinoData.ground + dinoData.h;
    let groundGrad = dinoCtx.createLinearGradient(0, groundY, 0, dinoCanvas.height);
    groundGrad.addColorStop(0, "#8b6914");
    groundGrad.addColorStop(0.08, "#a07820");
    groundGrad.addColorStop(1, "#5a3d0a");
    dinoCtx.fillStyle = groundGrad;
    dinoCtx.fillRect(0, groundY, dinoCanvas.width, dinoCanvas.height);

    // Trawa (zielona linia)
    dinoCtx.fillStyle = "#4caf50";
    dinoCtx.fillRect(0, groundY, dinoCanvas.width, 5);
    dinoCtx.fillStyle = "#388e3c";
    dinoCtx.fillRect(0, groundY + 5, dinoCanvas.width, 3);

    dinoData.y += dinoData.dy;
    if (dinoData.y < dinoData.ground) {
        dinoData.dy += dinoData.gravity;
    } else {
        dinoData.y = dinoData.ground;
        dinoData.dy = 0;
        dinoData.isJumping = false;
    }

    drawImageSafely(dinoCtx, imgDino, dinoData.x, dinoData.y, dinoData.w, dinoData.h, "#00ff22");

    dinoFrames++;
    
    if (dinoFrames % 800 === 0) dinoSpeed += 0.5; 

    if (dinoFrames % 130 === 0 || (Math.random() < 0.006 && dinoFrames > 150)) {
        let obsW = 20 + Math.random() * 20;
        let obsH = 30 + Math.random() * 30;
        if (dinoObstacles.length === 0 || dinoObstacles[dinoObstacles.length-1].x < dinoCanvas.width - 250) {
            dinoObstacles.push({ x: dinoCanvas.width, y: dinoData.ground + dinoData.h - obsH, w: obsW, h: obsH });
        }
    }

    if (dinoFrames % 120 === 0 || Math.random() < 0.02) {
        dinoCoinsList.push({ x: dinoCanvas.width, y: dinoData.ground - 40 - Math.random() * 80, w: 20, h: 20 });
    }

    for (let i = 0; i < dinoObstacles.length; i++) {
        let obs = dinoObstacles[i];
        obs.x -= dinoSpeed;
        drawImageSafely(dinoCtx, imgObstacle, obs.x, obs.y, obs.w, obs.h, "#e84118");

        if (dinoData.x < obs.x + obs.w && dinoData.x + dinoData.w > obs.x &&
            dinoData.y < obs.y + obs.h && dinoData.y + dinoData.h > obs.y) {
            cancelAnimationFrame(gameLoopId);
            showOutroCard('dino', 'Kolizja!', `Przeżyłeś ${elapsedTime} sekund. Zebrane monety: ${dinoCoinsCollected}.`, 'C', false);
            resetDino();
            return;
        }
    }
    dinoObstacles = dinoObstacles.filter(obs => obs.x + obs.w > 0);

    for (let i = 0; i < dinoCoinsList.length; i++) {
        let coin = dinoCoinsList[i];
        coin.x -= dinoSpeed;
        
        dinoCtx.shadowBlur = 12; dinoCtx.shadowColor = "#ffd700";
        if(imgCoin.complete && imgCoin.naturalHeight !== 0) {
            dinoCtx.drawImage(imgCoin, coin.x, coin.y, coin.w, coin.h);
        } else {
            // Ładna złota moneta
            let cg = dinoCtx.createRadialGradient(coin.x+coin.w*0.35, coin.y+coin.h*0.35, 1, coin.x+coin.w/2, coin.y+coin.h/2, coin.w/2);
            cg.addColorStop(0, "#ffe066"); cg.addColorStop(1, "#f0a500");
            dinoCtx.fillStyle = cg;
            dinoCtx.beginPath(); dinoCtx.arc(coin.x+coin.w/2, coin.y+coin.h/2, coin.w/2, 0, Math.PI*2); dinoCtx.fill();
            dinoCtx.strokeStyle = "#c87800"; dinoCtx.lineWidth = 1.5; dinoCtx.stroke();
            dinoCtx.fillStyle = "#c87800"; dinoCtx.font = `bold ${coin.w*0.55}px Arial`;
            dinoCtx.textAlign = "center"; dinoCtx.textBaseline = "middle";
            dinoCtx.fillText("$", coin.x+coin.w/2, coin.y+coin.h/2);
            dinoCtx.textAlign = "left"; dinoCtx.textBaseline = "alphabetic";
        }
        dinoCtx.shadowBlur = 0;

        if (!coin.collected &&
            dinoData.x < coin.x + coin.w && dinoData.x + dinoData.w > coin.x &&
            dinoData.y < coin.y + coin.h && dinoData.y + dinoData.h > coin.y) {
            coin.collected = true;
            dinoCoinsCollected++;
            document.getElementById("dinoCoins").textContent = dinoCoinsCollected;
        }
    }
    dinoCoinsList = dinoCoinsList.filter(coin => coin.x + coin.w > 0 && !coin.collected);

    gameLoopId = requestAnimationFrame(dinoLoop);
}

// ==========================================
// LOGIKA: TOMUŚ STRZYKAWA
// ==========================================
const tomusCanvas = document.getElementById("tomusCanvas");
const tctx = tomusCanvas ? tomusCanvas.getContext("2d") : null;

let tomusTarget = { x: 300, y: 200, r: 35 };
let tomusStartTime, tomusGameOver, lastTomusMove;
let tomusClicks = 0; 

function resetTomus() {
    tomusTarget = { x: 300, y: 200, r: 35 };
    tomusStartTime = Date.now();
    tomusGameOver = false;
    lastTomusMove = Date.now();
    tomusClicks = 0; 
}

if(tomusCanvas) {
    tomusCanvas.onclick = (e) => {
        if (tomusGameOver || document.getElementById("tomus").style.display === "none") return;
        tomusClicks++; 
        
        const rect = tomusCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dist = Math.hypot(mx - tomusTarget.x, my - tomusTarget.y);
        
        if (dist <= tomusTarget.r + 10) { 
            tomusGameOver = true;
            markGameWon('tomus');
            let gradeKey = tomusClicks === 1 ? "S" : (tomusClicks <= 3 ? "A" : "B");
            let gradeLabel = tomusClicks === 1 ? "S (Złoty Strzał!)" : (tomusClicks <= 3 ? "A (Dobry refleks)" : "B (Ślepak)");
            cancelAnimationFrame(gameLoopId);
            showOutroCard('tomus', 'Jeden Strzał', `Tomuś pokonany! Kliknięć: ${tomusClicks}. Ocena: ${gradeLabel}`, gradeKey, true);
        }
    };
}

function tomusLoop() {
    if (document.getElementById("tomus").style.display === "none" || tomusGameOver) return;

    let timeLeft = 10 - Math.floor((Date.now() - tomusStartTime) / 1000);
    document.getElementById("tomusTime").textContent = timeLeft;

    if (timeLeft <= 0) {
        tomusGameOver = true;
        cancelAnimationFrame(gameLoopId);
        showOutroCard('tomus', 'Tomuś Uciekł!', `Spróbuj go trafić szybciej. Pudeł: ${tomusClicks}.`, 'C', false);
        return;
    }

    if (Date.now() - lastTomusMove > 200) {
        tomusTarget.x = 50 + Math.random() * (tomusCanvas.width - 100);
        tomusTarget.y = 50 + Math.random() * (tomusCanvas.height - 100);
        lastTomusMove = Date.now();
    }

    let tGrad = tctx.createRadialGradient(300, 200, 50, 300, 200, 450);
    tGrad.addColorStop(0, "#4a0e1c"); 
    tGrad.addColorStop(1, "#0a0204");
    tctx.fillStyle = tGrad;
    tctx.fillRect(0, 0, tomusCanvas.width, tomusCanvas.height);
    
    let pulse = Math.sin(Date.now() / 150) * 8; 
    tctx.shadowBlur = 30;
    tctx.shadowColor = "#ff0055";
    tctx.fillStyle = "#e74c3c";
    tctx.beginPath();
    tctx.arc(tomusTarget.x, tomusTarget.y, tomusTarget.r + pulse, 0, Math.PI * 2);
    tctx.fill();
    tctx.shadowBlur = 0;

    tctx.fillStyle = "white";
    tctx.font = "35px Arial";
    tctx.textAlign = "center";
    tctx.textBaseline = "middle";
    tctx.fillText("💉", tomusTarget.x, tomusTarget.y);

    gameLoopId = requestAnimationFrame(tomusLoop);
}

// ==========================================
// LOGIKA: BLOCK BUSTER
// ==========================================
const bbCanvas = document.getElementById("blockCanvas");
const bbCtx = bbCanvas ? bbCanvas.getContext("2d") : null;
const bbScoreSpan = document.getElementById("blockScore");

const BB_ROWS = 8, BB_COLS = 8, BB_CELL = 40;
const BB_OFF_X = 40, BB_OFF_Y = 20; 
let bbGrid = [];
let bbInventory = [];
let bbScore = 0;
let bbDragging = null;
let bbAnimations = []; 

const BB_SHAPES = [
    { m: [[1]], c: '#f1c40f' }, 
    { m: [[1,1]], c: '#3498db' }, 
    { m: [[1],[1]], c: '#3498db' }, 
    { m: [[1,1,1]], c: '#e74c3c' }, 
    { m: [[1],[1],[1]], c: '#e74c3c' }, 
    { m: [[1,1,1,1]], c: '#9b59b6' }, 
    { m: [[1],[1],[1],[1]], c: '#9b59b6' }, 
    { m: [[1,1],[1,1]], c: '#2ecc71' }, 
    { m: [[1,1,1],[1,1,1],[1,1,1]], c: '#f39c12' }, 
    { m: [[1,0],[1,1]], c: '#1abc9c' }, 
    { m: [[1,1,1],[1,0,0],[1,0,0]], c: '#34495e' } 
];

function resetBlockbuster() {
    bbGrid = Array.from({length: BB_ROWS}, () => Array(BB_COLS).fill(null));
    bbScore = 0;
    bbAnimations = [];
    bbScoreSpan.textContent = bbScore;
    fillInventory();
}

function fillInventory() {
    bbInventory = [];
    for(let i=0; i<3; i++) {
        let randShape = BB_SHAPES[Math.floor(Math.random() * BB_SHAPES.length)];
        let shapeW = randShape.m[0].length * 20; 
        bbInventory.push({
            shape: randShape.m,
            color: randShape.c,
            x: 60 + i * 110 - shapeW/2,
            y: 420,
            baseX: 60 + i * 110 - shapeW/2,
            baseY: 420,
            scale: 0.5 
        });
    }
}

function drawBlock(ctx, x, y, size, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, size - 2, size - 2, 4);
    ctx.fill();
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, size - 4, size / 3, 3);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function drawGrid() {
    bbCtx.fillStyle = "rgba(0, 0, 0, 0.4)"; 
    bbCtx.fillRect(BB_OFF_X, BB_OFF_Y, BB_COLS * BB_CELL, BB_ROWS * BB_CELL);
    
    for (let r = 0; r < BB_ROWS; r++) {
        for (let c = 0; c < BB_COLS; c++) {
            let x = BB_OFF_X + c * BB_CELL;
            let y = BB_OFF_Y + r * BB_CELL;
            
            bbCtx.strokeStyle = "rgba(255, 255, 255, 0.1)"; 
            bbCtx.strokeRect(x, y, BB_CELL, BB_CELL);
            
            if (bbGrid[r][c]) {
                drawBlock(bbCtx, x, y, BB_CELL, bbGrid[r][c]);
            }
        }
    }
}

function blockbusterLoop() {
    if (document.getElementById("blockbuster").style.display === "none") return;
    
    let bgGradient = bbCtx.createLinearGradient(0, 0, bbCanvas.width, bbCanvas.height);
    bgGradient.addColorStop(0, "#0f0c29");   
    bgGradient.addColorStop(0.5, "#302b63"); 
    bgGradient.addColorStop(1, "#24243e");   
    
    bbCtx.fillStyle = bgGradient;
    bbCtx.fillRect(0, 0, bbCanvas.width, bbCanvas.height);

    drawGrid();

    for (let i = bbAnimations.length - 1; i >= 0; i--) {
        let anim = bbAnimations[i];
        drawBlock(bbCtx, BB_OFF_X + anim.c * BB_CELL + (BB_CELL - anim.size)/2, 
                         BB_OFF_Y + anim.r * BB_CELL + (BB_CELL - anim.size)/2, 
                         anim.size, anim.color, anim.alpha);
        anim.size -= 2;
        anim.alpha -= 0.05;
        if (anim.alpha <= 0) bbAnimations.splice(i, 1);
    }

    bbInventory.forEach((item, index) => {
        if (bbDragging && bbDragging.index === index) return;
        let sCell = BB_CELL * item.scale;
        for(let r=0; r<item.shape.length; r++) {
            for(let c=0; c<item.shape[r].length; c++) {
                if(item.shape[r][c]) {
                    drawBlock(bbCtx, item.x + c * sCell, item.y + r * sCell, sCell, item.color);
                }
            }
        }
    });

    if (bbDragging) {
        let item = bbDragging.item;
        for(let r=0; r<item.shape.length; r++) {
            for(let c=0; c<item.shape[r].length; c++) {
                if(item.shape[r][c]) {
                    drawBlock(bbCtx, bbDragging.x + c * BB_CELL, bbDragging.y + r * BB_CELL, BB_CELL, item.color);
                }
            }
        }
    }

    gameLoopId = requestAnimationFrame(blockbusterLoop);
}

if(bbCanvas) {
    bbCanvas.addEventListener("mousedown", (e) => {
        if (document.getElementById("blockbuster").style.display === "none") return;
        const rect = bbCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        bbInventory.forEach((item, index) => {
            let sCell = BB_CELL * item.scale;
            let w = item.shape[0].length * sCell;
            let h = item.shape.length * sCell;
            
            if(mx >= item.x && mx <= item.x + w && my >= item.y && my <= item.y + h) {
                bbDragging = {
                    item: item,
                    index: index,
                    offsetX: mx - item.x,
                    offsetY: my - item.y,
                    x: mx - (mx - item.x) * (1/item.scale), 
                    y: my - (my - item.y) * (1/item.scale)
                };
            }
        });
    });

    bbCanvas.addEventListener("mousemove", (e) => {
        if (!bbDragging) return;
        const rect = bbCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        bbDragging.x = mx - bbDragging.offsetX * 2; 
        bbDragging.y = my - bbDragging.offsetY * 2;
    });

    bbCanvas.addEventListener("mouseup", (e) => {
        if (!bbDragging) return;
        
        let item = bbDragging.item;
        let gridC = Math.floor((bbDragging.x + BB_CELL/2 - BB_OFF_X) / BB_CELL);
        let gridR = Math.floor((bbDragging.y + BB_CELL/2 - BB_OFF_Y) / BB_CELL);
        
        let canPlace = true;

        for(let r=0; r<item.shape.length; r++) {
            for(let c=0; c<item.shape[r].length; c++) {
                if(item.shape[r][c]) {
                    let destR = gridR + r;
                    let destC = gridC + c;
                    if(destR < 0 || destR >= BB_ROWS || destC < 0 || destC >= BB_COLS || bbGrid[destR][destC] !== null) {
                        canPlace = false;
                    }
                }
            }
        }

        if(canPlace) {
            let blocksPlaced = 0;
            for(let r=0; r<item.shape.length; r++) {
                for(let c=0; c<item.shape[r].length; c++) {
                    if(item.shape[r][c]) {
                        bbGrid[gridR + r][gridC + c] = item.color;
                        blocksPlaced++;
                    }
                }
            }
            
            bbScore += blocksPlaced * 2; 
            bbInventory.splice(bbDragging.index, 1); 
            checkLines();
            
            if(bbInventory.length === 0) fillInventory();
            checkGameOver();
            
        } else {
            item.x = item.baseX;
            item.y = item.baseY;
        }

        bbDragging = null;
    });

    bbCanvas.addEventListener("mouseleave", () => {
        if(bbDragging) {
            bbDragging.item.x = bbDragging.item.baseX;
            bbDragging.item.y = bbDragging.item.baseY;
            bbDragging = null;
        }
    });
}

function checkLines() {
    let rowsToClear = [];
    let colsToClear = [];

    for(let r=0; r<BB_ROWS; r++) {
        if(bbGrid[r].every(cell => cell !== null)) rowsToClear.push(r);
    }
    for(let c=0; c<BB_COLS; c++) {
        let isFull = true;
        for(let r=0; r<BB_ROWS; r++) {
            if(bbGrid[r][c] === null) isFull = false;
        }
        if(isFull) colsToClear.push(c);
    }

    rowsToClear.forEach(r => {
        for(let c=0; c<BB_COLS; c++) {
            if(bbGrid[r][c]) {
                bbAnimations.push({r: r, c: c, color: bbGrid[r][c], size: BB_CELL, alpha: 1});
                bbGrid[r][c] = null;
            }
        }
        bbScore += 50; 
    });

    colsToClear.forEach(c => {
        for(let r=0; r<BB_ROWS; r++) {
            if(bbGrid[r][c]) { 
                bbAnimations.push({r: r, c: c, color: bbGrid[r][c], size: BB_CELL, alpha: 1});
                bbGrid[r][c] = null;
            }
        }
        bbScore += 50; 
    });

    bbScoreSpan.textContent = bbScore;

    if (bbScore >= 1000) {
        setTimeout(() => {
            markGameWon('blockbuster');
            let grade = bbScore >= 1500 ? 'S' : 'A';
            let title = bbScore >= 1500 ? 'Architekt Chaosu' : 'Burzyciel Bloków';
            showOutroCard('blockbuster', title, `${bbScore} punktów — plansza nie wiedziała co ją uderzyło.`, grade, true);
        }, 100);
    }
}

function checkGameOver() {
    let hasMove = false;
    for(let item of bbInventory) {
        for(let r=0; r<BB_ROWS; r++) {
            for(let c=0; c<BB_COLS; c++) {
                let canFit = true;
                for(let ir=0; ir<item.shape.length; ir++) {
                    for(let ic=0; ic<item.shape[ir].length; ic++) {
                        if(item.shape[ir][ic]) {
                            let destR = r + ir;
                            let destC = c + ic;
                            if(destR >= BB_ROWS || destC >= BB_COLS || bbGrid[destR][destC] !== null) {
                                canFit = false;
                            }
                        }
                    }
                }
                if(canFit) hasMove = true;
            }
        }
    }

    if(!hasMove && bbInventory.length > 0) {
        setTimeout(() => {
            showOutroCard("blockbuster", bbScore>=500?"Prawie!":"Plansza Zablokowana", `Brak ruchów przy ${bbScore} pkt.`, bbScore>=500?"B":"C", false);
        }, 100);
    }
}

// ==========================================
// LOGIKA: KRÓL KIBLA (UŁATWIONY)
// ==========================================
const kibelCanvas = document.getElementById("kibelCanvas");
const kctx = kibelCanvas ? kibelCanvas.getContext("2d") : null;

let kibelPressure = 0;
let kibelMaxPressure = 0; 
let kibelStartTime = 0;
let kibelGameOver = false;
let kibelDoors = [];
let kibelRolls = [];

function resetKibel() {
    kibelPressure = 0;
    kibelMaxPressure = 0; 
    kibelStartTime = Date.now();
    kibelGameOver = false;
    kibelRolls = [];

    kibelDoors = [
        { x: 30, y: 120, w: 80, h: 160, shaking: false, anger: 0 },   
        { x: 490, y: 120, w: 80, h: 160, shaking: false, anger: 0 },  
        { x: 260, y: 20, w: 80, h: 100, shaking: false, anger: 0 }    
    ];

    document.getElementById("kibelPressureText").textContent = "0";
    document.getElementById("kibelTime").textContent = "0";
}

window.addEventListener("keydown", (e) => {
    if (document.getElementById("krol_kibla").style.display !== "none" && !kibelGameOver) {
        if (e.code === "Space") {
            e.preventDefault(); 
            kibelPressure -= 15; // Było 12, teraz spacją zbijasz więcej ciśnienia
            if (kibelPressure < 0) kibelPressure = 0;
        }
    }
});

if (kibelCanvas) {
    kibelCanvas.addEventListener("mousedown", (e) => {
        if (kibelGameOver || document.getElementById("krol_kibla").style.display === "none") return;
        const rect = kibelCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (let i = 0; i < kibelRolls.length; i++) {
            let r = kibelRolls[i];
            if (mx > r.x - 25 && mx < r.x + 25 && my > r.y - 25 && my < r.y + 25) {
                kibelRolls.splice(i, 1); 
                return;
            }
        }

        for (let d of kibelDoors) {
            if (d.shaking && mx > d.x && mx < d.x + d.w && my > d.y && my < d.y + d.h) {
                d.shaking = false;
                d.anger = 0;
                return;
            }
        }
    });
}

function kibelLoop() {
    if (document.getElementById("krol_kibla").style.display === "none" || kibelGameOver) return;

    let elapsedTime = Math.floor((Date.now() - kibelStartTime) / 1000);
    document.getElementById("kibelTime").textContent = elapsedTime;
    document.getElementById("kibelPressureText").textContent = Math.floor(kibelPressure);

    if (kibelPressure > kibelMaxPressure) kibelMaxPressure = kibelPressure;

    if (elapsedTime >= 60) {
        kibelGameOver = true;
        markGameWon('krol_kibla');
        let gradeKey = kibelMaxPressure < 40 ? "S" : (kibelMaxPressure < 75 ? "A" : "B");
        let gradeLabel = kibelMaxPressure < 40 ? "S (Zwieracze ze stali!)" : (kibelMaxPressure < 75 ? "A (Pełna kontrola)" : "B (Było blisko katastrofy)");
        cancelAnimationFrame(gameLoopId);
        showOutroCard('krol_kibla', 'Król Kibla!', `Przetrwałeś 60 sekund! Max ciśnienie: ${Math.floor(kibelMaxPressure)}%. Ocena: ${gradeLabel}`, gradeKey, true);
        return;
    }

    // Ciśnienie rośnie ciut wolniej
    kibelPressure += 0.09 + (elapsedTime * 0.003); 
    
    if (kibelPressure >= 100) {
        kibelGameOver = true;
        cancelAnimationFrame(gameLoopId);
        showOutroCard('krol_kibla', 'Katastrofa!', 'Ciśnienie wygrało... Łazienka wymaga remontu. 💩💥', 'C', false);
        return;
    }

    // Drzwi szarpią odrobinę rzadziej
    if (Math.random() < 0.009 + (elapsedTime * 0.0002)) {
        let availableDoors = kibelDoors.filter(d => !d.shaking);
        if (availableDoors.length > 0) {
            let d = availableDoors[Math.floor(Math.random() * availableDoors.length)];
            d.shaking = true;
            d.anger = 0;
        }
    }

    for (let d of kibelDoors) {
        if (d.shaking) {
            // Cierpliwość osoby dobijającej się ucieka wolniej
            d.anger += 0.25 + (elapsedTime * 0.008);
            if (d.anger >= 100) {
                kibelGameOver = true;
                cancelAnimationFrame(gameLoopId);
                showOutroCard('krol_kibla', 'Wtargnięcie!', 'Ktoś wbił do środka! JA SOBIE NIE ŻYCZE!!! 😱', 'C', false);
                return;
            }
        }
    }

    // Rolki rzucane lekko rzadziej
    if (Math.random() < 0.008 + (elapsedTime * 0.0003)) {
        let side = Math.random() > 0.5;
        kibelRolls.push({
            x: side ? -40 : kibelCanvas.width + 40,
            y: 30 + Math.random() * 200,
            targetX: 300,
            targetY: 250,
            speed: 1.2 + Math.random() * 1.5 // Wolniejsze rolki
        });
    }

    for (let i = kibelRolls.length - 1; i >= 0; i--) {
        let r = kibelRolls[i];
        let angle = Math.atan2(r.targetY - r.y, r.targetX - r.x);
        r.x += Math.cos(angle) * r.speed;
        r.y += Math.sin(angle) * r.speed;

        if (Math.hypot(300 - r.x, 250 - r.y) < 50) {
            kibelPressure += 20; 
            kibelRolls.splice(i, 1);
        }
    }

    // === TŁO — łazienka z kafelkami ===
    let kGrad = kctx.createLinearGradient(0, 0, 0, 400);
    kGrad.addColorStop(0, "#e8f4f8");
    kGrad.addColorStop(1, "#cce8f4");
    kctx.fillStyle = kGrad;
    kctx.fillRect(0, 0, kibelCanvas.width, kibelCanvas.height);

    // Kafelki na ścianach
    kctx.strokeStyle = "rgba(100,150,200,0.2)";
    kctx.lineWidth = 1;
    for(let i=0; i<kibelCanvas.width; i+=40) {
        kctx.beginPath(); kctx.moveTo(i, 0); kctx.lineTo(i, kibelCanvas.height); kctx.stroke();
    }
    for(let i=0; i<kibelCanvas.height; i+=40) {
        kctx.beginPath(); kctx.moveTo(0, i); kctx.lineTo(kibelCanvas.width, i); kctx.stroke();
    }

    // Podłoga (dolna 1/4)
    let floorGrad = kctx.createLinearGradient(0, 300, 0, 400);
    floorGrad.addColorStop(0, "#d4b896");
    floorGrad.addColorStop(1, "#b8916a");
    kctx.fillStyle = floorGrad;
    kctx.fillRect(0, 300, kibelCanvas.width, 100);
    kctx.strokeStyle = "rgba(100,60,20,0.2)"; kctx.lineWidth = 1;
    for(let i=0; i<kibelCanvas.width; i+=50) { kctx.beginPath(); kctx.moveTo(i,300); kctx.lineTo(i,400); kctx.stroke(); }
    for(let i=300; i<400; i+=50) { kctx.beginPath(); kctx.moveTo(0,i); kctx.lineTo(kibelCanvas.width,i); kctx.stroke(); }

    // Pasek ściany/podłogi
    kctx.fillStyle = "#8b6914";
    kctx.fillRect(0, 298, kibelCanvas.width, 4);

    kibelDoors.forEach(d => {
        let ox = d.shaking ? (Math.random()-0.5)*8 : 0;
        // Rama drzwi
        kctx.fillStyle = "#5d4037";
        kctx.beginPath(); kctx.roundRect(d.x + ox - 5, d.y - 5, d.w + 10, d.h + 5, [6,6,0,0]); kctx.fill();
        // Skrzydło
        let doorGrad = kctx.createLinearGradient(d.x+ox, 0, d.x+ox+d.w, 0);
        doorGrad.addColorStop(0, d.shaking ? "#c0392b" : "#8d6e63");
        doorGrad.addColorStop(0.5, d.shaking ? "#e74c3c" : "#a1887f");
        doorGrad.addColorStop(1, d.shaking ? "#c0392b" : "#795548");
        kctx.fillStyle = doorGrad;
        kctx.shadowBlur = d.shaking ? 18 : 0; kctx.shadowColor = "red";
        kctx.beginPath(); kctx.roundRect(d.x + ox, d.y, d.w, d.h, [4,4,0,0]); kctx.fill();
        kctx.shadowBlur = 0;
        // Panel drzwi
        kctx.strokeStyle = d.shaking ? "rgba(255,100,100,0.4)" : "rgba(0,0,0,0.2)";
        kctx.lineWidth = 2;
        kctx.beginPath(); kctx.roundRect(d.x+ox+6, d.y+6, d.w-12, d.h/2-8, 3); kctx.stroke();
        kctx.beginPath(); kctx.roundRect(d.x+ox+6, d.y+d.h/2, d.w-12, d.h/2-8, 3); kctx.stroke();
        // Klamka
        kctx.fillStyle = "#ffd700";
        kctx.beginPath(); kctx.arc(d.x+ox+d.w-12, d.y+d.h/2, 5, 0, Math.PI*2); kctx.fill();
        // Pasek złości
        if(d.shaking) {
            kctx.fillStyle = "rgba(0,0,0,0.7)";
            kctx.beginPath(); kctx.roundRect(d.x, d.y-28, d.w, 16, 4); kctx.fill();
            kctx.fillStyle = "#e74c3c";
            kctx.beginPath(); kctx.roundRect(d.x+2, d.y-26, (d.w-4)*(d.anger/100), 12, 3); kctx.fill();
        }
    });

    // Muszla toaletowa
    kctx.shadowBlur = 10; kctx.shadowColor = "rgba(0,100,150,0.2)";
    kctx.fillStyle = "#f5f9fc";
    kctx.beginPath();
    kctx.ellipse(300, 270, 72, 92, 0, 0, Math.PI*2);
    kctx.fill();
    kctx.strokeStyle = "#b0c8d8";
    kctx.lineWidth = 4;
    kctx.stroke();
    // Deska
    kctx.fillStyle = "#e8f0f4";
    kctx.beginPath();
    kctx.ellipse(300, 260, 60, 50, 0, 0, Math.PI*2);
    kctx.fill();
    kctx.strokeStyle = "#c0d8e8"; kctx.lineWidth = 2; kctx.stroke();
    kctx.shadowBlur = 0;

    kctx.font = "58px Arial";
    kctx.textAlign = "center";
    let face = "😎";
    if(kibelPressure > 40) face = "😬";
    if(kibelPressure > 75) face = "🥵";
    kctx.fillText(face, 300, 275);
    kctx.fillText("👑", 300, 200);

    kctx.font = "45px Arial";
    kibelRolls.forEach(r => {
        kctx.fillText("🧻", r.x, r.y);
    });

    if(kibelPressure > 70) {
        let intensity = (kibelPressure - 70) / 30; 
        kctx.fillStyle = `rgba(255, 0, 0, ${Math.abs(Math.sin(Date.now()/200)) * 0.4 * intensity})`;
        kctx.fillRect(0, 0, kibelCanvas.width, kibelCanvas.height);
    }

    gameLoopId = requestAnimationFrame(kibelLoop);
}

// ==========================================
// LOGIKA: WISIELEC
// ==========================================
const hangCanvas = document.getElementById("hangmanCanvas");
let hctx = null;
const hangWordSpan = document.getElementById("hangmanWord");
const hangStatusDiv = document.getElementById("hangmanStatus");
const hangKeyDiv = document.getElementById("hangmanKeyboard");
const hangHintSpan = document.getElementById("hangHintText");
const hangDefSpan = document.getElementById("hangDefText");

let hangWord = "";
let hangDef = "";
let guessedLetters = [];
let hangErrors = 0;
const maxErrors = 7;
let usedHint = false;

const hangConfig = {
    gallowsColor: "#8d6e63", 
    ropeColor: "#f1c40f",    
    bodyColor: "#ecf0f1",    
    execColor: "#ffffff",    
    execFace: "#000000"      
};

const polishWords = [
    { word: "PROGRAMOWANIE", def: "Proces tworzenia kodu i instrukcji dla komputera." },
    { word: "KLAWIATURA", def: "Urządzenie wejściowe z klawiszami." },
    { word: "STRZYKAWA", def: "Atrybut Tomusia, służy do robienia zastrzyków." },
    { word: "DINOZAUR", def: "Wymarły gad wielkich rozmiarów. Bohater gry, w której się biega." },
    { word: "INTERNET", def: "Globalna sieć komputerowa." },
    { word: "ALGORYTM", def: "Ściśle określony ciąg czynności do rozwiązania problemu." },
    { word: "PASJANS", def: "Gra karciana przeznaczona dla jednej osoby." },
    { word: "KOSMOS", def: "Przestrzeń pozaziemska, latają w niej statki (np. Space Shooter)." },
    { word: "KIBEL", def: "Inaczej toaleta. Musisz być jego królem." },
    { word: "PRZESZKODA", def: "Coś, co stoi na drodze i utrudnia przejście." }
];

async function resetHangman() {
    if(!hctx && hangCanvas) hctx = hangCanvas.getContext("2d");

    // Pobierz słowo z bazy D1 przez API, fallback do lokalnych słów
    let wordObj;
    try {
        const res = await fetch('/api/words?action=random');
        if (res.ok) {
            const data = await res.json();
            if (data && data.word) {
                wordObj = { word: data.word.toUpperCase(), def: data.hint || data.def || 'Brak podpowiedzi' };
            }
        }
    } catch(e) {}

    // Fallback do lokalnych słów jeśli API nie odpowie
    if (!wordObj) {
        const fallback = polishWords[Math.floor(Math.random() * polishWords.length)];
        wordObj = { word: fallback.word, def: fallback.def };
    }

    hangWord = wordObj.word;
    hangDef = wordObj.def;

    if (hangDefSpan) hangDefSpan.textContent = hangDef;

    guessedLetters = [];
    hangErrors = 0;
    usedHint = false;
    document.getElementById("hintBtn").disabled = false;
    if(hangHintSpan) hangHintSpan.textContent = "Dostępna (1 raz)";
    createHangmanKeyboard();
}

function createHangmanKeyboard() {
    const letters = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ".split("");
    if(hangKeyDiv) hangKeyDiv.innerHTML = "";
    letters.forEach(l => {
        const btn = document.createElement("button");
        btn.textContent = l;
        btn.className = "menu-btn";
        btn.style.cssText = `
            padding: 8px 10px; margin: 3px; font-size: 15px; font-weight: 700;
            background: #1e2225; border: 1.5px solid #444; border-radius: 8px;
            color: #e0e0e0; min-width: 36px; transition: all 0.15s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
            cursor: pointer;
        `;
        btn.onmouseover = () => { if(!btn.disabled) { btn.style.borderColor = "#f1c40f"; btn.style.color = "#f1c40f"; } };
        btn.onmouseout = () => { if(!btn.disabled) { btn.style.borderColor = "#444"; btn.style.color = "#e0e0e0"; } };
        btn.onclick = () => guessLetter(l, btn);
        hangKeyDiv.appendChild(btn);
    });
}

function guessLetter(letter, btn) {
    if (btn.disabled || hangErrors >= maxErrors) return;
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "default";
    btn.onmouseover = null; btn.onmouseout = null;

    if (hangWord.includes(letter)) {
        guessedLetters.push(letter);
        btn.style.background = "#27ae60";
        btn.style.borderColor = "#2ecc71";
        btn.style.color = "#fff";
        btn.style.boxShadow = "0 0 8px rgba(46,204,113,0.5)";
    } else {
        hangErrors++;
        btn.style.background = "#c0392b";
        btn.style.borderColor = "#e74c3c";
        btn.style.color = "#fff";
        btn.style.boxShadow = "0 0 8px rgba(231,76,60,0.5)";
    }
    checkHangmanStatus();
}

function getHint() {
    if (usedHint || hangErrors >= maxErrors) return;
    let notGuessed = hangWord.split("").filter(l => !guessedLetters.includes(l));
    if (notGuessed.length > 0) {
        let randomL = notGuessed[Math.floor(Math.random() * notGuessed.length)];
        guessedLetters.push(randomL);
        const buttons = hangKeyDiv.querySelectorAll("button");
        buttons.forEach(b => { 
            if(b.textContent === randomL) { 
                b.disabled = true;
                b.style.opacity = "0.5";
                b.style.cursor = "default";
                b.onmouseover = null; b.onmouseout = null;
                b.style.background = "#27ae60";
                b.style.borderColor = "#2ecc71";
                b.style.color = "#fff";
                b.style.boxShadow = "0 0 8px rgba(46,204,113,0.5)";
            } 
        });
        usedHint = true;
        document.getElementById("hintBtn").disabled = true;
        hangHintSpan.textContent = "Wykorzystano!";
        checkHangmanStatus();
    }
}

function renderHangman() {
    if(!hctx) return;

    // === TŁO — mroźna, dramatyczna szarość z vignette ===
    let hGrad = hctx.createLinearGradient(0, 0, 0, 400);
    hGrad.addColorStop(0, "#141618");
    hGrad.addColorStop(1, "#1e2225");
    hctx.fillStyle = hGrad;
    hctx.fillRect(0, 0, 500, 400);

    // Subtelna siatka (stare drewno)
    hctx.strokeStyle = "rgba(255,255,255,0.025)";
    hctx.lineWidth = 1;
    for(let i=0; i<500; i+=25) { hctx.beginPath(); hctx.moveTo(i,0); hctx.lineTo(i,400); hctx.stroke(); }
    for(let i=0; i<400; i+=25) { hctx.beginPath(); hctx.moveTo(0,i); hctx.lineTo(500,i); hctx.stroke(); }

    // Vignette
    let vign = hctx.createRadialGradient(250, 200, 100, 250, 200, 280);
    vign.addColorStop(0, "transparent");
    vign.addColorStop(1, "rgba(0,0,0,0.55)");
    hctx.fillStyle = vign;
    hctx.fillRect(0, 0, 500, 400);

    let display = hangWord.split("").map(l => guessedLetters.includes(l) ? l : "_").join(" ");
    if(hangWordSpan) hangWordSpan.textContent = display;
    if(hangStatusDiv) hangStatusDiv.textContent = `Błędy: ${hangErrors} / ${maxErrors}`;

    // Szubienica — grube drewno z ciepłym kolorem
    hctx.shadowBlur = 6; hctx.shadowColor = "rgba(200,150,80,0.3)";
    hctx.strokeStyle = "#a0704a";
    hctx.lineWidth = 12;
    hctx.lineCap = "round";
    hctx.lineJoin = "round";
    hctx.beginPath();
    hctx.moveTo(25, 378); hctx.lineTo(200, 378);   // podstawa
    hctx.moveTo(65, 378); hctx.lineTo(65, 48);     // słup
    hctx.lineTo(225, 48); hctx.lineTo(225, 82);    // poprzeczka + hak
    hctx.stroke();
    hctx.shadowBlur = 0;

    // Sznur (żółty)
    hctx.strokeStyle = "#d4a017";
    hctx.lineWidth = 3;
    hctx.beginPath(); hctx.moveTo(225, 82); hctx.lineTo(225, 82); hctx.stroke();

    // Postać wisielca
    hctx.strokeStyle = "#3c2004";
    hctx.lineWidth = 5;
    hctx.lineCap = "round";
    if (hangErrors >= 1) {
        // Głowa z twarzą
        hctx.beginPath(); hctx.arc(225, 108, 26, 0, Math.PI*2);
        hctx.fillStyle = "#3c2004"; hctx.fill(); hctx.stroke();
        // Twarz
        if(hangErrors >= 6) {
            // Twarz x_x
            hctx.strokeStyle = "#c0392b"; hctx.lineWidth = 2;
            hctx.beginPath(); hctx.moveTo(215,102); hctx.lineTo(221,108); hctx.moveTo(221,102); hctx.lineTo(215,108); hctx.stroke();
            hctx.beginPath(); hctx.moveTo(229,102); hctx.lineTo(235,108); hctx.moveTo(235,102); hctx.lineTo(229,108); hctx.stroke();
            hctx.strokeStyle = "#c0392b"; hctx.beginPath(); hctx.arc(225, 117, 6, 0, Math.PI); hctx.stroke();
        } else if(hangErrors >= 3) {
            // Twarz smutna
            hctx.fillStyle = "#999fa3"; hctx.beginPath(); hctx.arc(217, 105, 3, 0, Math.PI*2); hctx.fill();
            hctx.beginPath(); hctx.arc(233, 105, 3, 0, Math.PI*2); hctx.fill();
            hctx.strokeStyle = "#918c8c"; hctx.lineWidth=2; hctx.beginPath(); hctx.arc(225,117,6,0,Math.PI); hctx.stroke();
        }
        hctx.strokeStyle = "#3c2004"; hctx.lineWidth = 5;
    }
    if (hangErrors >= 2) { hctx.beginPath(); hctx.moveTo(225, 134); hctx.lineTo(225, 248); hctx.stroke(); }
    if (hangErrors >= 3) { hctx.beginPath(); hctx.moveTo(225, 155); hctx.lineTo(185, 205); hctx.stroke(); }
    if (hangErrors >= 4) { hctx.beginPath(); hctx.moveTo(225, 155); hctx.lineTo(265, 205); hctx.stroke(); }
    if (hangErrors >= 5) { hctx.beginPath(); hctx.moveTo(225, 248); hctx.lineTo(195, 325); hctx.stroke(); }
    if (hangErrors >= 6) { hctx.beginPath(); hctx.moveTo(225, 248); hctx.lineTo(255, 325); hctx.stroke(); }

    if (hangErrors > 0) {
        drawExecutioner(380, 280, hangErrors);
    }
}

function drawExecutioner(x, y, level) {
    const jump = Math.abs(Math.sin(Date.now() / 150)) * 20; 
    const speed = level * 0.5;

    hctx.fillStyle = hangConfig.execColor;
    hctx.beginPath();
    hctx.moveTo(x - 30, y + 100);
    hctx.lineTo(x + 30, y + 100);
    hctx.lineTo(x + 20, y + 20);
    hctx.lineTo(x - 20, y + 20);
    hctx.fill();

    hctx.beginPath();
    hctx.moveTo(x - 25, y + 25); 
    hctx.lineTo(x + 25, y + 25); 
    hctx.lineTo(x, y - 40 - (jump/2)); 
    hctx.fill();

    hctx.strokeStyle = hangConfig.execColor;
    hctx.lineWidth = 8;
    const wave = Math.sin(Date.now() / 100 * speed) * 30;
    hctx.beginPath();
    hctx.moveTo(x - 20, y + 40); hctx.lineTo(x - 50, y + wave);
    hctx.moveTo(x + 20, y + 40); hctx.lineTo(x + 50, y - wave);
    hctx.stroke();

    hctx.fillStyle = hangConfig.execFace;
    hctx.beginPath();
    hctx.arc(x - 8, y + 5, 4, 0, Math.PI*2);
    hctx.arc(x + 8, y + 5, 4, 0, Math.PI*2);
    hctx.fill();
}

function checkHangmanStatus() {
    if (!hangWord.split("").some(l => !guessedLetters.includes(l))) {
        renderHangman();
        setTimeout(() => { 
            markGameWon('wisielec'); 
            let grade = hangErrors === 0 ? "S" : (hangErrors <= 3 ? "A" : "B");
            let title = hangErrors === 0 ? "Jasnowidz" : (hangErrors <= 3 ? "Mądrala" : "Uff, za burtą o włos");
            showOutroCard('wisielec', title, `Słowo "${hangWord}" odgadnięte z ${hangErrors} błędami. Szubienica stoi pusta.`, grade, true);
        }, 100);
    } else if (hangErrors >= maxErrors) {
        renderHangman();
        setTimeout(() => { 
            showOutroCard('wisielec', 'Szubienica Zajęta', `Szukane słowo to: "${hangWord}". Spróbuj ponownie!`, 'C', false);
            resetHangman();
        }, 100);
    }
}

function hangmanLoop() {
    if (document.getElementById("wisielec").style.display === "none") return;
    renderHangman();
    gameLoopId = requestAnimationFrame(hangmanLoop);
}

// ==========================================
// GRA 10: UDERZ CHIŃCZYKA (WHACK-A-MOLE)
// ==========================================
let whackScore = 0;
let whackTime = 30;
let whackGameInterval;
let whackTimerInterval;
let activeHole = -1;
const WHACK_TARGET = 20;
let whackBestScore = 0;
let whackGamesPlayed = 0;

function initWhackHoles() {
    const grid = document.getElementById('whackGrid');
    if (!grid) return;
    if (grid.children.length === 9) return; // already created
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'whack-hole';
        hole.addEventListener('click', () => hitMole(i));
        grid.appendChild(hole);
    }
}

function startWhack() {
    initWhackHoles();
    clearTimeout(whackGameInterval);
    clearInterval(whackTimerInterval);
    whackScore = 0;
    whackTime = 30;
    activeHole = -1;
    updateWhackUI();
    document.querySelectorAll('.whack-hole').forEach(h => {
        h.classList.remove('active', 'hit');
    });

    whackTimerInterval = setInterval(() => {
        whackTime--;
        updateWhackUI();
        if (whackTime <= 0) {
            clearInterval(whackTimerInterval);
            clearTimeout(whackGameInterval);
            document.querySelectorAll('.whack-hole').forEach(h => h.classList.remove('active'));
            endWhack(false);
        }
    }, 1000);

    spawnMole();
}

function spawnMole() {
    if (whackTime <= 0) return;
    document.querySelectorAll('.whack-hole').forEach(h => h.classList.remove('active'));

    let newHole;
    do {
        newHole = Math.floor(Math.random() * 9);
    } while (newHole === activeHole);

    activeHole = newHole;
    const holes = document.querySelectorAll('.whack-hole');
    if (holes[activeHole]) holes[activeHole].classList.add('active');

    let delay = Math.max(400, 1200 - (whackScore * 35));
    whackGameInterval = setTimeout(spawnMole, delay);
}

function updateWhackUI() {
    const scoreEl = document.getElementById('whackScore');
    const timeEl  = document.getElementById('whackTime');
    const bigS    = document.getElementById('whackBigS');
    const prog    = document.getElementById('whackProg');
    const arc     = document.getElementById('whackArc');
    const arcTxt  = document.getElementById('whackArcTxt');
    const best    = document.getElementById('whackSBest');
    const games   = document.getElementById('whackSGames');

    if (scoreEl) scoreEl.textContent = whackScore;
    if (timeEl)  timeEl.textContent  = whackTime;
    if (bigS)    bigS.textContent    = whackScore;
    if (prog)    prog.style.width    = Math.min(100, (whackScore / WHACK_TARGET) * 100) + '%';
    if (arc) {
        const pct = whackTime / 30;
        arc.setAttribute('stroke-dashoffset', 226 - (226 * pct));
    }
    if (arcTxt) arcTxt.textContent = whackTime;
    if (best)   best.textContent   = whackBestScore;
    if (games)  games.textContent  = whackGamesPlayed;
}

function hitMole(index) {
    if (whackTime <= 0) return;
    if (index !== activeHole) return;

    whackScore++;
    activeHole = -1;
    clearTimeout(whackGameInterval);

    const holes = document.querySelectorAll('.whack-hole');
    const hole = holes[index];
    if (hole) {
        hole.classList.remove('active');
        hole.classList.add('hit');
        setTimeout(() => hole.classList.remove('hit'), 200);
    }

    const whackContainer = document.getElementById('whack');
    if (whackContainer) {
        whackContainer.classList.add('flash-bg');
        setTimeout(() => whackContainer.classList.remove('flash-bg'), 200);
    }

    updateWhackUI();

    if (whackScore >= WHACK_TARGET) {
        clearInterval(whackTimerInterval);
        endWhack(true);
    } else {
        spawnMole();
    }
}

function endWhack(win) {
    clearTimeout(whackGameInterval);
    clearInterval(whackTimerInterval);
    document.querySelectorAll('.whack-hole').forEach(h => h.classList.remove('active'));
    whackGamesPlayed++;
    if (whackScore > whackBestScore) whackBestScore = whackScore;
    if (win) {
        markGameWon('whack');
        showOutroCard('whack', 'Mistrz Młotka', 'Żaden Chińczyk nie zdążył się ukryć.', 'S', true);
    } else {
        showOutroCard('whack', 'Koniec Czasu!', `Nie udało się zebrać ${WHACK_TARGET} punktów. Wynik: ${whackScore}.`, 'C', false);
    }
}

// ==========================================
// KLASYCZNE SLIDE PUZZLE (15-puzzle / 4x4)
// ==========================================
const SPUZZLE_SIZE = 4;       // plansza 4x4
const SPUZZLE_CELL = 100;     // px na kafelek
let spuzzleTiles = [];        // tablica 16 liczb, 0 = puste miejsce
let spuzzleMoves = 0;
let spuzzleWon = false;

function initSlide() {
    spuzzleWon = false;
    spuzzleMoves = 0;
    // Generuj rozwiązywalną permutację przez losowanie ruchów ze stanu rozwiązanego
    spuzzleTiles = Array.from({length: 16}, (_, i) => i); // [0,1,2,...,15], 0 = puste
    // Wykonaj 200 losowych ruchów ze stanu rozwiązanego
    for (let i = 0; i < 200; i++) {
        const blank = spuzzleTiles.indexOf(0);
        const moves = [];
        const r = Math.floor(blank / SPUZZLE_SIZE);
        const c = blank % SPUZZLE_SIZE;
        if (r > 0) moves.push(blank - SPUZZLE_SIZE);
        if (r < 3) moves.push(blank + SPUZZLE_SIZE);
        if (c > 0) moves.push(blank - 1);
        if (c < 3) moves.push(blank + 1);
        const pick = moves[Math.floor(Math.random() * moves.length)];
        spuzzleTiles[blank] = spuzzleTiles[pick];
        spuzzleTiles[pick] = 0;
    }
    renderSlidePuzzle();
}

function renderSlidePuzzle() {
    const container = document.getElementById('slideContainer');
    if (!container) return;

    container.innerHTML = '';
    const board = document.createElement('div');
    board.style.cssText = `
        position: relative;
        width: ${SPUZZLE_SIZE * SPUZZLE_CELL}px;
        height: ${SPUZZLE_SIZE * SPUZZLE_CELL}px;
        background: #111;
        border: 6px solid #2a2a2a;
        border-radius: 14px;
        box-shadow: inset 0 0 30px rgba(0,0,0,0.9), 0 12px 40px rgba(0,0,0,0.7);
        overflow: hidden;
    `;

    spuzzleTiles.forEach((val, idx) => {
        if (val === 0) return; // puste pole – nie rysuj
        const row = Math.floor(idx / SPUZZLE_SIZE);
        const col = idx % SPUZZLE_SIZE;

        // Cel tej płytki
        const targetIdx = val; // kafelek val powinien być na pozycji val-1 (0-indexed: val-1)
        const targetRow = Math.floor((val - 1) / SPUZZLE_SIZE);
        const targetCol = (val - 1) % SPUZZLE_SIZE;
        const isInPlace = (row === targetRow && col === targetCol);

        const tile = document.createElement('div');
        const gap = 5;
        tile.style.cssText = `
            position: absolute;
            left: ${col * SPUZZLE_CELL + gap}px;
            top: ${row * SPUZZLE_CELL + gap}px;
            width: ${SPUZZLE_CELL - gap * 2}px;
            height: ${SPUZZLE_CELL - gap * 2}px;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 32px; font-weight: 900;
            cursor: pointer;
            user-select: none;
            transition: left 0.12s cubic-bezier(0.2,0.8,0.2,1), top 0.12s cubic-bezier(0.2,0.8,0.2,1);
            box-shadow: inset 0 2px 0 rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.5);
            font-family: 'Segoe UI', Arial, sans-serif;
            ${isInPlace
                ? 'background: linear-gradient(135deg, #27ae60, #2ecc71); color: #fff; border: 2px solid rgba(255,255,255,0.3);'
                : 'background: linear-gradient(135deg, #e74c3c, #c0392b); color: #fff; border: 2px solid rgba(255,255,255,0.2);'
            }
        `;
        tile.textContent = val;
        tile.onclick = () => slideTileClick(idx);
        board.appendChild(tile);
    });

    // Licznik ruchów
    const info = document.createElement('div');
    info.style.cssText = `
        margin-top: 18px;
        font-size: 16px; color: #a8d8ea;
        text-align: center;
        font-family: 'Segoe UI', Arial, sans-serif;
    `;
    const solved = spuzzleTiles.slice(1).every((v,i) => v === i+1) && spuzzleTiles[15] === 0;
    info.textContent = `Ruchy: ${spuzzleMoves}  |  ${solved ? '✅ Ułożone!' : '🟥 Przesuń kafle numerowane 1–15 w kolejności (puste pole w prawym dolnym rogu)'}`;

    container.appendChild(board);
    container.appendChild(info);
}

function slideTileClick(idx) {
    if (spuzzleWon) return;
    const blank = spuzzleTiles.indexOf(0);
    const row = Math.floor(idx / SPUZZLE_SIZE);
    const col = idx % SPUZZLE_SIZE;
    const bRow = Math.floor(blank / SPUZZLE_SIZE);
    const bCol = blank % SPUZZLE_SIZE;

    // Dopuszcza ruch tylko jeśli kafelek sąsiaduje z pustym polem
    const adjacent = (row === bRow && Math.abs(col - bCol) === 1) ||
                     (col === bCol && Math.abs(row - bRow) === 1);
    if (!adjacent) return;

    // Zamień kafelek z pustym miejscem
    spuzzleTiles[blank] = spuzzleTiles[idx];
    spuzzleTiles[idx] = 0;
    spuzzleMoves++;

    renderSlidePuzzle();
    checkSlidePuzzleWin();
}

function checkSlidePuzzleWin() {
    // Stan wygrany: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
    const solved = spuzzleTiles.every((v, i) => {
        if (i === 15) return v === 0;
        return v === i + 1;
    });
    if (solved) {
        spuzzleWon = true;
        renderSlidePuzzle();
        setTimeout(() => {
            markGameWon('slide');
            let grade = spuzzleMoves <= 50 ? 'S' : spuzzleMoves <= 100 ? 'A' : 'B';
            let title = spuzzleMoves <= 50 ? 'Układankowy Geniusz' : spuzzleMoves <= 100 ? 'Skupiony Taktyk' : 'Cierpliwy Gracz';
            showOutroCard('slide', title, `Puzzle ułożone w zaledwie ${spuzzleMoves} ruchach. Kafelek po kafelku do zwycięstwa.`, grade, true);
        }, 300);
    }
}
// ==========================================
// LOGIKA: UCIECZKA Z FABRYKI (GRA 12)
// ==========================================
const factoryCanvas = document.getElementById("factoryCanvas");
const fctx = factoryCanvas ? factoryCanvas.getContext("2d") : null;

// ŁADOWANIE TWOJEGO WŁASNEGO OBRAZKA (ZMIENIAJ TUTAJ)
const imgEnemy = new Image();
imgEnemy.src = 'img/żyd.png'; 

let fMouseX = 400, fMouseY = 250;
let fScore = 0;
let fEscaped = 0;
let fGameOver = false;
let fSquares = [];
let fParticles = [];
let fMuzzleFlash = 0;
if(factoryCanvas) {
    factoryCanvas.addEventListener('mousemove', (e) => {
        const rect = factoryCanvas.getBoundingClientRect();
        fMouseX = (e.clientX - rect.left) * (factoryCanvas.width / rect.width);
        fMouseY = (e.clientY - rect.top) * (factoryCanvas.height / rect.height);
    });
}

function factoryLoop() {
    if (document.getElementById("factory").style.display === "none" || fGameOver) return;

    const now = Date.now() / 1000;

    // === SKY — night gradient with slight horizon glow ===
    let bgGrad = fctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0,   "#060814");
    bgGrad.addColorStop(0.5, "#0d1230");
    bgGrad.addColorStop(0.75,"#1a1a2e");
    bgGrad.addColorStop(1,   "#0f3460");
    fctx.fillStyle = bgGrad;
    fctx.fillRect(0, 0, 800, 500);

    // Mgławica / aurora glow za fabryką
    let auroraGrad = fctx.createRadialGradient(670, 200, 20, 670, 200, 220);
    auroraGrad.addColorStop(0, "rgba(100,0,160,0.18)");
    auroraGrad.addColorStop(1, "transparent");
    fctx.fillStyle = auroraGrad;
    fctx.fillRect(400, 0, 400, 400);

    // Gwiazdy (animowane migotanie)
    const starData = [[40,30,1.8],[120,15,1.2],[200,45,1.5],[310,20,1.1],[420,35,1.7],[530,10,1.3],[80,80,1.4],[350,70,1.6],[160,55,1.0],[260,25,1.9],[480,60,1.2],[55,110,1.1]];
    starData.forEach(([sx,sy,sr], i) => {
        let twinkle = 0.4 + 0.6 * Math.abs(Math.sin(now * 1.3 + i * 0.8));
        fctx.fillStyle = `rgba(255,255,255,${twinkle})`;
        fctx.beginPath(); fctx.arc(sx, sy, sr, 0, Math.PI*2); fctx.fill();
    });

    // Księżyc
    fctx.fillStyle = "#fffde8";
    fctx.shadowBlur = 18; fctx.shadowColor = "rgba(255,255,200,0.4)";
    fctx.beginPath(); fctx.arc(80, 55, 22, 0, Math.PI*2); fctx.fill();
    fctx.fillStyle = "#0d1230"; // Faza — zakryta część
    fctx.beginPath(); fctx.arc(88, 52, 20, 0, Math.PI*2); fctx.fill();
    fctx.shadowBlur = 0;

    // === ZIEMIA z trawą ===
    // Grunt
    let groundGrad = fctx.createLinearGradient(0, 390, 0, 500);
    groundGrad.addColorStop(0, "#1e3a1e");
    groundGrad.addColorStop(0.3, "#152b15");
    groundGrad.addColorStop(1, "#0a160a");
    fctx.fillStyle = groundGrad;
    fctx.fillRect(0, 390, 800, 110);

    // Ścieżka / droga asfaltowa
    let roadGrad = fctx.createLinearGradient(0, 395, 0, 460);
    roadGrad.addColorStop(0, "#2a2a2a");
    roadGrad.addColorStop(1, "#181818");
    fctx.fillStyle = roadGrad;
    fctx.fillRect(0, 400, 550, 70);

    // Linia środkowa drogi
    fctx.strokeStyle = "rgba(255,200,50,0.5)"; fctx.lineWidth = 2.5;
    fctx.setLineDash([28, 16]);
    fctx.beginPath(); fctx.moveTo(0, 435); fctx.lineTo(540, 435); fctx.stroke();
    fctx.setLineDash([]);

    // Krawężnik
    fctx.fillStyle = "#555"; fctx.fillRect(0, 397, 550, 5);
    fctx.fillStyle = "#888"; fctx.fillRect(0, 395, 550, 3);

    // Trawa po bokach drogi
    fctx.fillStyle = "#1a4a1a";
    fctx.fillRect(0, 468, 550, 32);
    // Źdźbła trawy
    fctx.strokeStyle = "#2d7a2d"; fctx.lineWidth = 1.5;
    for(let gx = 5; gx < 550; gx += 9) {
        let gh = 4 + Math.sin(gx * 0.3 + now * 0.8) * 2;
        fctx.beginPath(); fctx.moveTo(gx, 468); fctx.lineTo(gx + 2, 468 - gh); fctx.stroke();
    }

    // === FABRYKA — budynek przemysłowy ===
    // Cień budynku na ziemi
    fctx.fillStyle = "rgba(0,0,0,0.35)";
    fctx.beginPath(); fctx.ellipse(680, 500, 120, 18, 0, 0, Math.PI*2); fctx.fill();

    // Główny budynek
    let buildGrad = fctx.createLinearGradient(545, 0, 800, 0);
    buildGrad.addColorStop(0, "#2e1a3a");
    buildGrad.addColorStop(0.5, "#4a235a");
    buildGrad.addColorStop(1, "#3a1a48");
    fctx.fillStyle = buildGrad;
    fctx.beginPath(); fctx.roundRect(545, 75, 255, 425, [10,10,0,0]); fctx.fill();

    // Poziome pasy paneli na budynku
    fctx.strokeStyle = "rgba(0,0,0,0.25)"; fctx.lineWidth = 1;
    for(let py = 100; py < 400; py += 25) {
        fctx.beginPath(); fctx.moveTo(545, py); fctx.lineTo(800, py); fctx.stroke();
    }

    // Boczna ściana (perspektywa)
    let sideGrad = fctx.createLinearGradient(515, 0, 550, 0);
    sideGrad.addColorStop(0, "#1c0d24");
    sideGrad.addColorStop(1, "#3a1a48");
    fctx.fillStyle = sideGrad;
    fctx.beginPath();
    fctx.moveTo(515, 125); fctx.lineTo(545, 100); fctx.lineTo(545, 500); fctx.lineTo(515, 500);
    fctx.closePath(); fctx.fill();

    // Okna — świecące żółto-pomarańczowo
    const windowPos = [[563,95],[618,95],[673,95],[728,95],[563,155],[618,155],[673,155],[728,155],[563,215],[618,215],[673,215],[728,215]];
    windowPos.forEach(([wx,wy], wi) => {
        let flicker = 0.5 + 0.5 * Math.sin(now * 2.1 + wi * 0.7);
        fctx.shadowBlur = 10; fctx.shadowColor = `rgba(255,180,0,${flicker * 0.6})`;
        let winGrad = fctx.createLinearGradient(wx, wy, wx, wy+18);
        winGrad.addColorStop(0, `rgba(255,220,80,${0.35 + flicker * 0.35})`);
        winGrad.addColorStop(1, `rgba(200,100,0,${0.2 + flicker * 0.2})`);
        fctx.fillStyle = winGrad;
        fctx.beginPath(); fctx.roundRect(wx, wy, 28, 18, 3); fctx.fill();
        // Krzyż okna
        fctx.strokeStyle = `rgba(0,0,0,0.4)`; fctx.lineWidth = 1;
        fctx.beginPath(); fctx.moveTo(wx+14, wy); fctx.lineTo(wx+14, wy+18); fctx.stroke();
        fctx.beginPath(); fctx.moveTo(wx, wy+9); fctx.lineTo(wx+28, wy+9); fctx.stroke();
    });
    fctx.shadowBlur = 0;

    // Szyld na budynku
    fctx.shadowBlur = 6; fctx.shadowColor = "rgba(0,0,0,0.6)";
    let signGrad = fctx.createLinearGradient(560, 270, 560, 320);
    signGrad.addColorStop(0, "#f39c12");
    signGrad.addColorStop(1, "#e67e22");
    fctx.fillStyle = signGrad;
    fctx.beginPath(); fctx.roundRect(562, 270, 208, 48, 8); fctx.fill();
    // Obramowanie szyldu
    fctx.strokeStyle = "#c0392b"; fctx.lineWidth = 2.5;
    fctx.beginPath(); fctx.roundRect(562, 270, 208, 48, 8); fctx.stroke();
    fctx.shadowBlur = 0;
    fctx.fillStyle = "#1a0a00";
    fctx.font = "bold 24px 'Segoe UI', Arial";
    fctx.textAlign = "center"; fctx.textBaseline = "middle";
    fctx.fillText("⚙ FABRYKA ⚙", 666, 294);

    // Kominy
    [[608, 15, 36, 62], [708, 32, 26, 46]].forEach(([cx,cy,cw,ch], ci) => {
        let chiGrad = fctx.createLinearGradient(cx, 0, cx+cw, 0);
        chiGrad.addColorStop(0, "#636e72"); chiGrad.addColorStop(1, "#95a5a6");
        fctx.fillStyle = chiGrad;
        fctx.fillRect(cx, cy, cw, ch);
        fctx.fillStyle = "#4a4a4a";
        fctx.fillRect(cx-4, cy, cw+8, 8);
    });

    // Dym z kominów (gęstszy)
    [[626, 14], [721, 30]].forEach(([sx,sy], idx) => {
        for(let s=0; s<6; s++) {
            let prog = ((now * 0.4 + s * 0.25 + idx * 0.2) % 1.5);
            let alpha = (1 - prog/1.5) * 0.5;
            let r = 8 + prog * 40;
            let dy = -prog * 90;
            let dx = Math.sin(prog * 2.5 + idx * 1.5 + now * 0.3) * 15;
            fctx.beginPath(); fctx.arc(sx+dx, sy+dy, r, 0, Math.PI*2);
            fctx.fillStyle = `rgba(150,150,150,${alpha})`; fctx.fill();
        }
    });

    // Brama wyjściowa (skąd uciekają)
    let gateGrad = fctx.createLinearGradient(515, 330, 545, 330);
    gateGrad.addColorStop(0, "#0a0010");
    gateGrad.addColorStop(1, "#1a0028");
    fctx.fillStyle = gateGrad;
    fctx.beginPath(); fctx.roundRect(516, 335, 44, 115, [6,6,0,0]); fctx.fill();
    // Blask z bramy
    let glowGrad = fctx.createRadialGradient(538, 392, 0, 538, 392, 35);
    glowGrad.addColorStop(0, "rgba(255,80,0,0.25)");
    glowGrad.addColorStop(1, "transparent");
    fctx.fillStyle = glowGrad;
    fctx.fillRect(505, 330, 70, 130);
    // Kraty bramy
    fctx.strokeStyle = "rgba(80,40,0,0.8)"; fctx.lineWidth = 3;
    for(let bar = 522; bar < 558; bar += 9) {
        fctx.beginPath(); fctx.moveTo(bar, 336); fctx.lineTo(bar, 450); fctx.stroke();
    }
    fctx.strokeStyle = "rgba(80,40,0,0.5)"; fctx.lineWidth = 2;
    for(let bh = 350; bh < 450; bh += 22) {
        fctx.beginPath(); fctx.moveTo(517, bh); fctx.lineTo(559, bh); fctx.stroke();
    }

    // Latarnia przy bramie
    fctx.fillStyle = "#555";
    fctx.fillRect(508, 295, 5, 50);
    fctx.fillStyle = "#777";
    fctx.beginPath(); fctx.roundRect(502, 290, 17, 10, 3); fctx.fill();
    let lampFlicker = 0.7 + 0.3 * Math.sin(now * 8.3);
    fctx.shadowBlur = 20; fctx.shadowColor = `rgba(255,220,100,${lampFlicker * 0.8})`;
    fctx.fillStyle = `rgba(255,240,150,${lampFlicker})`;
    fctx.beginPath(); fctx.ellipse(510, 295, 8, 6, 0, 0, Math.PI*2); fctx.fill();
    fctx.shadowBlur = 0;

    // === SPAWN WROGA ===
    if (Math.random() < 0.012 + (fScore * 0.0005)) {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#ff00ff', '#00ffff'];
        const w = 30 + Math.random()*20;
        fSquares.push({
            x: 535,
            w: w,
            y: 468 - w,          // stoi na drodze — dolna krawędź = y 468
            speed: 1.5 + Math.random()*2 + (fScore*0.04),
            color: colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * Math.PI * 2,
            squish: 0
        });
    }

    // === RUCH I RYSOWANIE — kwadraty z animacjami ===
    for (let i = fSquares.length - 1; i >= 0; i--) {
        let sq = fSquares[i];
        sq.x -= sq.speed;
        sq.wobble += 0.08;

        let drawY = sq.y;

        // Lekkie squish przy lądowaniu
        let scaleX = 1 + Math.sin(sq.wobble) * 0.06;
        let scaleY = 1 - Math.sin(sq.wobble) * 0.06;
        let w = sq.w * scaleX;
        let h = sq.w * scaleY;
        let ox = (w - sq.w) / 2;

        // Cień na drodze
        fctx.fillStyle = "rgba(0,0,0,0.35)";
        fctx.beginPath();
        fctx.ellipse(sq.x + sq.w/2, 470, sq.w * 0.45 * scaleX, 5, 0, 0, Math.PI*2);
        fctx.fill();

        // Główny kwadrat z glowem
        fctx.shadowBlur = 14 + Math.sin(sq.wobble * 1.5) * 6;
        fctx.shadowColor = sq.color;
        fctx.fillStyle = sq.color;
        fctx.fillRect(sq.x - ox, drawY, w, h);
        fctx.shadowBlur = 0;

        // Highlight (górna krawędź jaśniejsza)
        fctx.fillStyle = "rgba(255,255,255,0.18)";
        fctx.fillRect(sq.x - ox, drawY, w, h * 0.28);

        // Oczy — animowane (przesuwają się)
        let eyeShift = Math.sin(sq.wobble * 0.7) * 2;
        fctx.fillStyle = "white";
        fctx.fillRect(sq.x + sq.w*0.18 + eyeShift, drawY + sq.w*0.22, sq.w*0.22, sq.w*0.22);
        fctx.fillRect(sq.x + sq.w*0.58 + eyeShift, drawY + sq.w*0.22, sq.w*0.22, sq.w*0.22);
        fctx.fillStyle = "black";
        fctx.fillRect(sq.x + sq.w*0.22 + eyeShift, drawY + sq.w*0.28, sq.w*0.11, sq.w*0.11);
        fctx.fillRect(sq.x + sq.w*0.62 + eyeShift, drawY + sq.w*0.28, sq.w*0.11, sq.w*0.11);

        // Ucieczka za lewą krawędź
        if (sq.x + sq.w < 0) {
            fSquares.splice(i, 1);
            fEscaped++;
            document.getElementById("factoryEscaped").textContent = fEscaped;
            if (fEscaped >= 15) {
                fGameOver = true;
                cancelAnimationFrame(gameLoopId);
                setTimeout(() => {
                    showOutroCard('factory', 'Zwolniony!', `Zbyt wiele wrogów uciekło z fabryki. Zestrzelono tylko: ${fScore}. Ocena: C`, 'C', false);
                }, 100);
            }
        }
    }

    // === CZĄSTECZKI PO TRAFIENIU (krew / iskry) ===
    for (let i = fParticles.length - 1; i >= 0; i--) {
        let p = fParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // grawitacja
        p.life -= 0.045;
        if (p.life <= 0) { fParticles.splice(i, 1); continue; }
        fctx.globalAlpha = p.life;
        fctx.fillStyle = p.color;
        let ps = p.life * 6;
        fctx.beginPath(); fctx.arc(p.x, p.y, ps, 0, Math.PI*2); fctx.fill();
        fctx.globalAlpha = 1.0;
    }

    // === MUZZLE FLASH (przy kursore) ===
    if (fMuzzleFlash > 0) {
        let alpha = fMuzzleFlash / 10;
        let flashGrad = fctx.createRadialGradient(fMouseX, fMouseY, 0, fMouseX, fMouseY, 28);
        flashGrad.addColorStop(0, `rgba(255,255,200,${alpha})`);
        flashGrad.addColorStop(0.3, `rgba(255,160,0,${alpha * 0.8})`);
        flashGrad.addColorStop(1, "transparent");
        fctx.fillStyle = flashGrad;
        fctx.beginPath(); fctx.arc(fMouseX, fMouseY, 28, 0, Math.PI*2); fctx.fill();
        // Promienie błysku
        for(let ray = 0; ray < 6; ray++) {
            let angle = (ray / 6) * Math.PI * 2 + now * 3;
            let len = 15 + Math.random() * 12;
            fctx.strokeStyle = `rgba(255,220,100,${alpha * 0.7})`;
            fctx.lineWidth = 1.5;
            fctx.beginPath();
            fctx.moveTo(fMouseX, fMouseY);
            fctx.lineTo(fMouseX + Math.cos(angle)*len, fMouseY + Math.sin(angle)*len);
            fctx.stroke();
        }
        fMuzzleFlash--;
    }

    gameLoopId = requestAnimationFrame(factoryLoop);
}

function resetFactory() {
    fScore = 0;
    fEscaped = 0;
    fGameOver = false;
    fSquares = [];
    fParticles = [];
    fMuzzleFlash = 0;
    
    const scoreEl = document.getElementById("factoryScore");
    const escEl = document.getElementById("factoryEscaped");
    if(scoreEl) scoreEl.textContent = fScore;
    if(escEl) escEl.textContent = fEscaped;
}

if(factoryCanvas) {
    factoryCanvas.addEventListener("mousedown", (e) => {
        if (fGameOver || document.getElementById("factory").style.display === "none") return;
        const rect = factoryCanvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (factoryCanvas.width / rect.width);
        const my = (e.clientY - rect.top) * (factoryCanvas.height / rect.height);

        for (let i = fSquares.length - 1; i >= 0; i--) {
            let sq = fSquares[i];
            let drawY = sq.y + (sq.jump ? Math.sin(sq.jumpAngle)*20 : 0);

            if (mx > sq.x && mx < sq.x + sq.w && my > drawY && my < drawY + sq.w) {
                fScore++;
                fMuzzleFlash = 10;
                document.getElementById("factoryScore").textContent = fScore;

                // Krew / kolorowe cząsteczki
                const bloodColors = ['#c0392b','#e74c3c','#922b21','#ff6b6b'];
                for(let p=0; p<20; p++) {
                    fParticles.push({
                        x: sq.x + sq.w*0.5, y: drawY + sq.w*0.4,
                        vx: (Math.random()-0.5)*14, vy: (Math.random()-0.8)*12,
                        life: 1, color: bloodColors[Math.floor(Math.random()*bloodColors.length)]
                    });
                }

                fSquares.splice(i, 1);

                if (fScore >= 30) {
                    fGameOver = true;
                    setTimeout(() => {
                        markGameWon('factory');
                        showOutroCard('factory', 'Nieomylny Strzelec', 'Trzydzieści strzałów — żaden nie chybił.', 'S', true);
                    }, 100);
                }
                return; 
            }
        }
    });
}

// ==========================================
// LOGIKA: FLAPPY BIRD
// ==========================================
const flappyCanvas = document.getElementById("flappyCanvas");
const flCtx = flappyCanvas ? flappyCanvas.getContext("2d") : null;

// TUTAJ ZMIENIASZ OBRAZEK PTAKA (ścieżka do pliku, np. 'img/ptak.png')
const imgBird = new Image();
imgBird.src = 'twoj_ptak.png'; 

let bird = { x: 50, y: 250, size: 30, dy: 0, gravity: 0.6, jump: -8 };
let flappyPipes = [];
let flappyScore = 0;
let flappyGameOver = false;
let flappyFrames = 0;
let flappyWaiting = true; // Czeka na pierwsze kliknięcie
const FLAPPY_WIN_SCORE = 15; // Ilość rur do zdobycia, żeby wygrać grę

function resetFlappy() {
    bird = { x: 50, y: 250, size: 30, dy: 0, gravity: 0.6, jump: -8 };
    flappyPipes = [];
    flappyScore = 0;
    flappyGameOver = false;
    flappyFrames = 0;
    flappyWaiting = true;
    document.getElementById("flappyScoreText").textContent = flappyScore;
}

function flappyJump() {
    if (document.getElementById("flappy").style.display === "none" || flappyGameOver) return;
    if (flappyWaiting) flappyWaiting = false;
    bird.dy = bird.jump;
}

// Sterowanie
window.addEventListener('keydown', (e) => {
    if (document.getElementById("flappy").style.display !== "none" && !flappyGameOver) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            flappyJump();
        }
    }
});

if (flappyCanvas) {
    flappyCanvas.addEventListener('mousedown', () => {
        flappyJump();
    });
}

function flappyLoop() {
    if (document.getElementById("flappy").style.display === "none" || flappyGameOver) return;

    // === TŁO — gradient nieba z chmurkami ===
    let bgGrad = flCtx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#4a90d9");
    bgGrad.addColorStop(0.6, "#87ceeb");
    bgGrad.addColorStop(1, "#c8e6f7");
    flCtx.fillStyle = bgGrad;
    flCtx.fillRect(0, 0, 400, 500);

    // Chmurki (przesuwają się powoli)
    flCtx.fillStyle = "rgba(255,255,255,0.85)";
    let ct = Date.now() / 1000;
    [[80, 80, 40, 18], [230, 60, 50, 20], [340, 100, 35, 15], [120, 140, 30, 14]].forEach(([cx, cy, rw, rh]) => {
        let ox = ((cx - ct * 18) % 450 + 450) % 450 - 25;
        flCtx.beginPath(); flCtx.ellipse(ox, cy, rw, rh, 0, 0, Math.PI*2); flCtx.fill();
        flCtx.beginPath(); flCtx.ellipse(ox-rw*0.4, cy+rh*0.3, rw*0.6, rh*0.75, 0, 0, Math.PI*2); flCtx.fill();
        flCtx.beginPath(); flCtx.ellipse(ox+rw*0.4, cy+rh*0.3, rw*0.6, rh*0.75, 0, 0, Math.PI*2); flCtx.fill();
    });

    // Ziemia na dole
    flCtx.fillStyle = "#7ec850";
    flCtx.fillRect(0, 480, 400, 20);
    flCtx.fillStyle = "#5a9e38";
    flCtx.fillRect(0, 488, 400, 12);

    // Fizyka ptaka - gdy czeka, tylko delikatnie unosi się w górę i dół
    if (flappyWaiting) {
        bird.y = 250 + Math.sin(Date.now() / 400) * 12;
        bird.dy = 0;
    } else {
        bird.dy += bird.gravity;
        bird.y += bird.dy;
    }

    // === PTAK — ładny fallback ===
    if (imgBird.complete && imgBird.naturalHeight !== 0) {
        flCtx.drawImage(imgBird, bird.x, bird.y, bird.size, bird.size);
    } else {
        let bx = bird.x + bird.size/2, by = bird.y + bird.size/2, br = bird.size/2;
        // Ciało
        let bGrad = flCtx.createRadialGradient(bx-4, by-4, 2, bx, by, br);
        bGrad.addColorStop(0, "#ffe066"); bGrad.addColorStop(1, "#f0a500");
        flCtx.shadowBlur = 8; flCtx.shadowColor = "rgba(240,165,0,0.5)";
        flCtx.fillStyle = bGrad;
        flCtx.beginPath(); flCtx.arc(bx, by, br, 0, Math.PI*2); flCtx.fill();
        flCtx.shadowBlur = 0;
        // Skrzydło
        flCtx.fillStyle = "#e09800";
        flCtx.beginPath(); flCtx.ellipse(bx-4, by+4, br*0.55, br*0.3, -0.4, 0, Math.PI*2); flCtx.fill();
        // Oko
        flCtx.fillStyle = "white"; flCtx.beginPath(); flCtx.arc(bx+6, by-3, 5, 0, Math.PI*2); flCtx.fill();
        flCtx.fillStyle = "#222"; flCtx.beginPath(); flCtx.arc(bx+7, by-3, 3, 0, Math.PI*2); flCtx.fill();
        flCtx.fillStyle = "white"; flCtx.beginPath(); flCtx.arc(bx+8, by-4, 1, 0, Math.PI*2); flCtx.fill();
        // Dziób
        flCtx.fillStyle = "#ff8c00";
        flCtx.beginPath(); flCtx.moveTo(bx+br, by); flCtx.lineTo(bx+br+8, by-3); flCtx.lineTo(bx+br+8, by+3); flCtx.fill();
    }

    // Overlay "Kliknij żeby zacząć" gdy w trybie oczekiwania
    if (flappyWaiting) {
        flCtx.fillStyle = "rgba(0,0,0,0.35)";
        flCtx.fillRect(0, 0, 400, 500);
        flCtx.textAlign = "center";
        flCtx.textBaseline = "middle";
        flCtx.fillStyle = "#fff";
        flCtx.font = "bold 22px 'Segoe UI', Arial";
        flCtx.fillText("Kliknij lub naciśnij SPACJĘ", 200, 210);
        flCtx.font = "bold 28px 'Segoe UI', Arial";
        flCtx.fillStyle = "#f1c40f";
        let pulse = Math.abs(Math.sin(Date.now() / 500));
        flCtx.globalAlpha = 0.6 + pulse * 0.4;
        flCtx.fillText("► ZACZYNAMY! ◄", 200, 250);
        flCtx.globalAlpha = 1;
    }

    // Generowanie rur
    flappyFrames++;
    if (!flappyWaiting && flappyFrames % 90 === 0) { // Co 90 klatek nowa rura
        let gap = 130; // Przerwa na przelot
        let topHeight = Math.random() * (500 - gap - 100) + 50;
        flappyPipes.push({ x: 400, top: topHeight, bottom: topHeight + gap, w: 50, passed: false });
    }

    // Rysowanie i ruch rur
    for (let i = flappyPipes.length - 1; i >= 0; i--) {
        let p = flappyPipes[i];
        p.x -= 3; // Prędkość rur

        // Rury z gradientem i kapturami
        let pipeGrad = flCtx.createLinearGradient(p.x, 0, p.x + p.w, 0);
        pipeGrad.addColorStop(0, "#3aad5a"); pipeGrad.addColorStop(0.4, "#4dc76f"); pipeGrad.addColorStop(1, "#2a8a44");
        flCtx.fillStyle = pipeGrad;
        flCtx.strokeStyle = "#1d7038"; flCtx.lineWidth = 2;

        // Górna rura
        flCtx.beginPath(); flCtx.roundRect(p.x, 0, p.w, p.top - 10, [0,0,4,4]); flCtx.fill(); flCtx.stroke();
        // Kapelek górnej rury
        flCtx.fillStyle = "#4dc76f"; flCtx.strokeStyle = "#1d7038";
        flCtx.beginPath(); flCtx.roundRect(p.x - 5, p.top - 22, p.w + 10, 16, 4); flCtx.fill(); flCtx.stroke();

        // Dolna rura
        flCtx.fillStyle = pipeGrad;
        flCtx.beginPath(); flCtx.roundRect(p.x, p.bottom + 10, p.w, 500 - p.bottom - 10, [4,4,0,0]); flCtx.fill(); flCtx.stroke();
        // Kapelek dolnej rury
        flCtx.fillStyle = "#4dc76f"; flCtx.strokeStyle = "#1d7038";
        flCtx.beginPath(); flCtx.roundRect(p.x - 5, p.bottom + 6, p.w + 10, 16, 4); flCtx.fill(); flCtx.stroke();

    // Kolizja z rurami i ekranem — tylko gdy gra jest aktywna
        let hitPipe = !flappyWaiting && (bird.x + bird.size - 5 > p.x && bird.x + 5 < p.x + p.w) &&
                      (bird.y + 5 < p.top || bird.y + bird.size - 5 > p.bottom);
        let hitBoundaries = !flappyWaiting && (bird.y < 0 || bird.y + bird.size > 500);

        if (hitPipe || hitBoundaries) {
            flappyGameOver = true;
            cancelAnimationFrame(gameLoopId);
            setTimeout(() => {
                let grade = flappyScore >= 10 ? "A" : (flappyScore >= 5 ? "B" : "C");
                let gradeLabel = flappyScore >= 10 ? "A (Dobry lot)" : (flappyScore >= 5 ? "B (Mogło być lepiej)" : "C (Totalny Nielot)");
                showOutroCard('flappy', 'Zderzenie!', `Wleciałeś prosto w ścianę! Wynik: ${flappyScore}. Ocena: ${gradeLabel}`, grade, false);
            }, 50);
            return;
        }

        // Punktacja
        if (p.x + p.w < bird.x && !p.passed) {
            flappyScore++;
            p.passed = true;
            document.getElementById("flappyScoreText").textContent = flappyScore;

            // Warunek Wygranej
            if (flappyScore >= FLAPPY_WIN_SCORE) {
                flappyGameOver = true;
                setTimeout(() => {
                    markGameWon('flappy');
                    showOutroCard('flappy', 'Mistrz Przestworzy', 'Piętnaście rur i ani jednego zderzenia. Legenda.', 'S', true);
                }, 50);
                return;
            }
        }

        // Usuwanie rur z pamięci gdy wylecą za ekran
        if (p.x + p.w < 0) {
            flappyPipes.splice(i, 1);
        }
    }

    gameLoopId = requestAnimationFrame(flappyLoop);
}
// ═══════════════════════════════════════════════════════════
// SIDE PANEL HELPERS — nie ingerują w logikę gier
// ═══════════════════════════════════════════════════════════
function _ss(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}
function _sw(id,pct){const e=document.getElementById(id);if(e)e.style.width=Math.min(100,Math.max(0,pct))+'%';}
function _sh(id,pct){const e=document.getElementById(id);if(e)e.style.height=Math.min(100,Math.max(0,pct))+'%';}

// Shooter wave dots
function _shooterWaveDots(lvl){
    const wb=document.getElementById('shooterWaves');
    if(!wb)return;
    if(wb.children.length===0){for(let i=1;i<=10;i++){const d=document.createElement('div');d.className='sp-wdot';d.textContent=i;d.id='swd'+i;wb.appendChild(d);}}
    for(let i=1;i<=10;i++){const d=document.getElementById('swd'+i);if(!d)continue;d.className='sp-wdot'+(i<lvl?' done':i===lvl?' cur':'');}
    _ss('shooterBigLvl',String(lvl).padStart(2,'0'));
    _ss('shooterSLevel',lvl);
}

// Hook into existing game callbacks via MutationObserver on score/status elements
// This way we NEVER touch the game logic itself

function _initSidePanels(){
    // Shooter level
    const lvlEl=document.getElementById('level');
    if(lvlEl){new MutationObserver(()=>{const v=parseInt(lvlEl.textContent)||1;_shooterWaveDots(v);_ss('shooterSLevel',v);}).observe(lvlEl,{childList:true,characterData:true,subtree:true});}

    // Dino time
    const dtEl=document.getElementById('dinoTime');
    if(dtEl){new MutationObserver(()=>{
        const t=parseInt(dtEl.textContent)||0;
        _ss('dinoTimerTxt',t);
        const arc=document.getElementById('dinoTimerArc');
        if(arc)arc.style.strokeDashoffset=289-(t/60)*289;
    }).observe(dtEl,{childList:true,characterData:true,subtree:true});}

    // Dino coins
    const dcEl=document.getElementById('dinoCoins');
    if(dcEl){new MutationObserver(()=>_ss('dinoSCoins',dcEl.textContent)).observe(dcEl,{childList:true,characterData:true,subtree:true});}

    // Pong scores
    const ppEl=document.getElementById('scorePlayer'),paEl=document.getElementById('scoreAi');
    if(ppEl){new MutationObserver(()=>{const p=parseInt(ppEl.textContent)||0;_ss('pongBigP',p);_sw('pongProg',p/5*100);}).observe(ppEl,{childList:true,characterData:true,subtree:true});}
    if(paEl){new MutationObserver(()=>_ss('pongBigA',paEl.textContent)).observe(paEl,{childList:true,characterData:true,subtree:true});}

    // Solitaire
    const solEl=document.getElementById('solitaireScore');
    if(solEl){new MutationObserver(()=>{const v=parseInt(solEl.textContent)||0;_ss('solStatC',v);_ss('solStatL',52-v);}).observe(solEl,{childList:true,characterData:true,subtree:true});}

    // Tomus time
    const ttEl=document.getElementById('tomusTime');
    if(ttEl){new MutationObserver(()=>{const t=parseInt(ttEl.textContent)||0;_ss('tomusClock',t);_sw('tomusClockBar',t/10*100);const b=document.getElementById('tomusClockBar');if(b&&t<=3)b.style.background='linear-gradient(90deg,#e74c3c,#ff4444)';}).observe(ttEl,{childList:true,characterData:true,subtree:true});}

    // Kibel pressure
    const kpEl=document.getElementById('kibelPressureText');
    if(kpEl){new MutationObserver(()=>{const p=parseFloat(kpEl.textContent)||0;_sh('kibelPressFill',p);}).observe(kpEl,{childList:true,characterData:true,subtree:true});}
    const ktEl=document.getElementById('kibelTime');
    if(ktEl){new MutationObserver(()=>_ss('kibelSTime',ktEl.textContent)).observe(ktEl,{childList:true,characterData:true,subtree:true});}

    // Blockbuster score
    const bsEl=document.getElementById('blockScore');
    if(bsEl){new MutationObserver(()=>{const v=parseInt(bsEl.textContent)||0;_ss('bbSScore',v);_sw('bbProg',v/10);const p=Math.min(100,Math.round(v/10));_ss('bbProgPct',p+'%');}).observe(bsEl,{childList:true,characterData:true,subtree:true});}

    // Whack score+time
    const wsEl=document.getElementById('whackScore'),wtEl=document.getElementById('whackTime');
    let _whackBest=0,_whackGames=0;
    if(wsEl){new MutationObserver(()=>{const v=parseInt(wsEl.textContent)||0;_ss('whackBigS',v);_sw('whackProg',v/20*100);if(v>_whackBest){_whackBest=v;_ss('whackSBest',v);}}).observe(wsEl,{childList:true,characterData:true,subtree:true});}
    if(wtEl){new MutationObserver(()=>{const t=parseInt(wtEl.textContent)||0;_ss('whackArcTxt',t);const arc=document.getElementById('whackArc');if(arc)arc.style.strokeDashoffset=(1-t/30)*226;}).observe(wtEl,{childList:true,characterData:true,subtree:true});}

    // Slide moves - watched by renderSlidePuzzle updating slideContainer
    // Patch slideTileClick to also update big moves display
    const _origSlide=typeof slideTileClick!=='undefined'?slideTileClick:null;

    // Factory score+escaped
    const fsEl=document.getElementById('factoryScore'),feEl=document.getElementById('factoryEscaped');
    if(fsEl){new MutationObserver(()=>{const v=parseInt(fsEl.textContent)||0;_ss('factSKills',v);_sw('factProg',v/30*100);_ss('factProgTxt',v+' / 30');}).observe(fsEl,{childList:true,characterData:true,subtree:true});}
    if(feEl){new MutationObserver(()=>{const v=parseInt(feEl.textContent)||0;_ss('factSEsc',v);_sw('factEscProg',v/15*100);_ss('factEscTxt',v+' / 15');}).observe(feEl,{childList:true,characterData:true,subtree:true});}

    // Flappy score
    const flEl=document.getElementById('flappyScoreText');
    let _flappyBest=0,_flappyGames=0;
    if(flEl){new MutationObserver(()=>{const v=parseInt(flEl.textContent)||0;_ss('flappyBigS',v);_sw('flappyProg',v/15*100);if(v>_flappyBest){_flappyBest=v;_ss('flappySBest',v);}}).observe(flEl,{childList:true,characterData:true,subtree:true});}

    // Tic stats patch
    const _origEndTic=endTic;
    window.endTic=function(msg,win){
        _origEndTic(msg,win);
        if(win)_ss('ticWins',(parseInt(document.getElementById('ticWins')?.textContent||0)+1));
        else if(msg.includes('Remis'))_ss('ticDraws',(parseInt(document.getElementById('ticDraws')?.textContent||0)+1));
        else if(msg.includes('AI'))_ss('ticLosses',(parseInt(document.getElementById('ticLosses')?.textContent||0)+1));
    };

    // Slide moves display
    const _origRenderSlide=renderSlidePuzzle;
    window.renderSlidePuzzle=function(){
        _origRenderSlide();
        _ss('slideBigM',typeof spuzzleMoves!=='undefined'?spuzzleMoves:0);
    };

    // Hangman errors
    const _origRenderHang=typeof renderHangman!=='undefined'?renderHangman:null;
    if(_origRenderHang){
        window.renderHangman=function(){
            _origRenderHang();
            const errs=typeof hangErrors!=='undefined'?hangErrors:0;
            document.querySelectorAll('.sp-herr').forEach(ic=>{
                ic.classList.toggle('on',parseInt(ic.dataset.n)<=errs);
            });
            _sw('hangErrBar',errs/7*100);
            _ss('hangErrTxt',errs+' / 7');
            if(typeof hangWord!=='undefined'&&typeof guessedLetters!=='undefined'){
                const guessed=hangWord.split('').filter(l=>guessedLetters.includes(l)).length;
                _ss('hangSGuessed',guessed);
                _ss('hangSLeft',Math.max(0,hangWord.length-guessed));
            }
            if(typeof hangDef!=='undefined'&&hangDef)_ss('hangSideDef',hangDef);
        };
    }

    // Whack games counter patch
    const _origStartWhack=startWhack;
    window.startWhack=function(){_origStartWhack();_whackGames++;_ss('whackSGames',_whackGames);};

    // Flappy games counter
    const _origResetFlappy=resetFlappy;
    window.resetFlappy=function(){_origResetFlappy();_flappyGames++;_ss('flappySGames',_flappyGames);};

    // Shooter shots fired
    const _origLoop=loop;

    // Initial wave dots
    _shooterWaveDots(1);
}

// Init side panels after DOM ready
if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',_initSidePanels);
}else{
    setTimeout(_initSidePanels,200);
}

// ==========================================
// QUIZ — BAZA PYTAŃ
// ==========================================
const QUIZ_CATEGORIES = {
    geografia: { label: 'Geografia', emoji: '🌍', color: '#3498db' },
    nauka:     { label: 'Nauka',     emoji: '⚗️', color: '#2ecc71' },
    historia:  { label: 'Historia',  emoji: '🏛️', color: '#e67e22' },
    sport:     { label: 'Sport',     emoji: '⚽', color: '#e74c3c' },
    muzyka:    { label: 'Muzyka',    emoji: '🎵', color: '#9b59b6' },
    film:      { label: 'Film & TV', emoji: '🎬', color: '#1abc9c' },
    it:        { label: 'IT',        emoji: '💻', color: '#00bcd4' },
    nauka2:    { label: 'Biologia',  emoji: '🧬', color: '#27ae60' },
};

const QUIZ_QUESTIONS = {
    geografia: [
        { q: 'Jaka jest stolica Australii?', a: 'Canberra', wrong: ['Sydney','Melbourne','Brisbane'] },
        { q: 'Który kraj ma największą powierzchnię na świecie?', a: 'Rosja', wrong: ['Kanada','USA','Chiny'] },
        { q: 'Jaka rzeka jest najdłuższa na świecie?', a: 'Nil', wrong: ['Amazonka','Missisipi','Jangcy'] },
        { q: 'W którym kraju leży Mount Everest?', a: 'Nepal', wrong: ['Tybet','Indie','Bhutan'] },
        { q: 'Ile kontynentów ma Ziemia?', a: '7', wrong: ['5','6','8'] },
        { q: 'Jaka jest stolica Brazylii?', a: 'Brasília', wrong: ['Rio de Janeiro','São Paulo','Salvador'] },
        { q: 'Który ocean jest największy?', a: 'Spokojny', wrong: ['Atlantycki','Indyjski','Arktyczny'] },
        { q: 'W którym kraju leży Sahara?', a: 'W wielu krajach Afryki', wrong: ['Egipcie','Libii','Algierii'] },
        { q: 'Jaka jest stolica Japonii?', a: 'Tokio', wrong: ['Osaki','Kioto','Hiroshima'] },
        { q: 'Który kraj ma największą populację?', a: 'Indie', wrong: ['Chiny','USA','Indonezja'] },
        { q: 'Jaka jest stolica Kanady?', a: 'Ottawa', wrong: ['Toronto','Vancouver','Montreal'] },
        { q: 'Gdzie leży Islandia?', a: 'Na Atlantyku', wrong: ['Na Oceanie Arktycznym','Na Morzu Północnym','Na Bałtyku'] },
        { q: 'Przez ile stref czasowych rozciąga się Rosja?', a: '11', wrong: ['8','9','12'] },
        { q: 'Jakie morze oddziela Europę od Afryki?', a: 'Morze Śródziemne', wrong: ['Morze Czerwone','Morze Czarne','Morze Arabskie'] },
        { q: 'Jaka jest najwyższa góra Europy (bez Kaukazu)?', a: 'Mont Blanc', wrong: ['Elbrus','Matterhorn','Dufourspitze'] },
    ],
    nauka: [
        { q: 'Ile protonów ma atom węgla?', a: '6', wrong: ['4','8','12'] },
        { q: 'Jaka jest prędkość światła (w przybliżeniu)?', a: '300 000 km/s', wrong: ['150 000 km/s','500 000 km/s','1 000 000 km/s'] },
        { q: 'Z czego składa się woda?', a: 'H₂O', wrong: ['HO₂','H₃O','H₂O₂'] },
        { q: 'Ile wynosi temperatura wrzenia wody przy 1 atm?', a: '100°C', wrong: ['90°C','110°C','95°C'] },
        { q: 'Która planeta jest najbliżej Słońca?', a: 'Merkury', wrong: ['Wenus','Ziemia','Mars'] },
        { q: 'Co to jest DNA?', a: 'Kwas deoksyrybonukleinowy', wrong: ['Kwas rybonukleinowy','Białko kodujące','Mitochondrium'] },
        { q: 'Ile chromosomów ma zdrowy człowiek?', a: '46', wrong: ['44','48','23'] },
        { q: 'Jaki gaz stanowi największą część atmosfery Ziemi?', a: 'Azot', wrong: ['Tlen','Dwutlenek węgla','Argon'] },
        { q: 'Co oznacza E=mc²?', a: 'Energia = masa × prędkość światła²', wrong: ['Energia = moc × czas²','Masa = energia × czas','Energia kinetyczna = masa × prędkość'] },
        { q: 'Ile planet ma nasz Układ Słoneczny?', a: '8', wrong: ['7','9','10'] },
        { q: 'Jaki pierwiastek ma symbol Au?', a: 'Złoto', wrong: ['Srebro','Aluminium','Żelazo'] },
        { q: 'Co to jest fotosynteza?', a: 'Proces wytwarzania glukozy przez rośliny ze światła', wrong: ['Oddychanie komórkowe','Fermentacja','Trawienie'] },
        { q: 'Ile wynosi wartość liczby π (do 2 miejsc)?', a: '3,14', wrong: ['3,12','3,16','3,18'] },
        { q: 'Co to jest kwazar?', a: 'Bardzo jasne jądro galaktyki', wrong: ['Rodzaj gwiazdy neutronowej','Typ czarnej dziury','Asteroidalny pas'] },
        { q: 'Jaki jest symbol chemiczny żelaza?', a: 'Fe', wrong: ['Ir','F','Zn'] },
    ],
    historia: [
        { q: 'W którym roku wybuchła I Wojna Światowa?', a: '1914', wrong: ['1912','1916','1918'] },
        { q: 'Kto był pierwszym prezydentem USA?', a: 'George Washington', wrong: ['Abraham Lincoln','Thomas Jefferson','Benjamin Franklin'] },
        { q: 'W którym roku upadł mur berliński?', a: '1989', wrong: ['1987','1991','1993'] },
        { q: 'Kto napisał "Quo Vadis"?', a: 'Henryk Sienkiewicz', wrong: ['Adam Mickiewicz','Bolesław Prus','Stefan Żeromski'] },
        { q: 'W którym roku Polska odzyskała niepodległość?', a: '1918', wrong: ['1916','1920','1922'] },
        { q: 'Kim był Napoleon Bonaparte?', a: 'Cesarzem Francuzów', wrong: ['Królem Francji','Prezydentem Francji','Generałem Republiki'] },
        { q: 'Kiedy wybuchła II Wojna Światowa?', a: '1939', wrong: ['1937','1938','1940'] },
        { q: 'Kto odkrył Amerykę w 1492?', a: 'Krzysztof Kolumb', wrong: ['Amerigo Vespucci','Ferdynand Magellan','Vasco da Gama'] },
        { q: 'Jakie starożytne cuda świata nadal istnieje?', a: 'Piramidy w Gizie', wrong: ['Kolos Rodyjski','Wiszące ogrody Babilonu','Latarnia Morska w Aleksandrii'] },
        { q: 'W którym roku założono Rzym (tradycja)?', a: '753 p.n.e.', wrong: ['500 p.n.e.','1000 p.n.e.','300 p.n.e.'] },
        { q: 'Kto był ostatnim carem Rosji?', a: 'Mikołaj II', wrong: ['Aleksander III','Aleksander II','Paweł I'] },
        { q: 'W którym roku lądowanie na Księżycu (Apollo 11)?', a: '1969', wrong: ['1967','1971','1965'] },
        { q: 'Jaki był przydomek Władysława II Jagiełły przed chrztem?', a: 'Jagiełło', wrong: ['Łokietek','Krzywousty','Chrobry'] },
        { q: 'Kto stworzył druk (prasa drukarska)?', a: 'Johannes Gutenberg', wrong: ['Leonardo da Vinci','Galileo Galilei','Isaac Newton'] },
        { q: 'Kiedy zaczęła się zimna wojna?', a: 'Po 1945', wrong: ['Po 1918','W 1939','W 1950'] },
    ],
    sport: [
        { q: 'Ile graczy jest w drużynie piłki nożnej?', a: '11', wrong: ['9','10','12'] },
        { q: 'W którym kraju odbyły się Igrzyska Olimpijskie 2020?', a: 'Japonia', wrong: ['Chiny','Korea','Australia'] },
        { q: 'Ile setów wygrywa mecz tenisowy (mężczyźni, Wielki Szlem)?', a: '3 z 5', wrong: ['2 z 3','3 z 4','4 z 7'] },
        { q: 'Ile punktów daje touchdown w futbolu amerykańskim?', a: '6', wrong: ['5','7','3'] },
        { q: 'Kto jest rekordzistą świata w biegu na 100m?', a: 'Usain Bolt', wrong: ['Justin Gatlin','Tyson Gay','Christian Coleman'] },
        { q: 'Ile żyłek ma lotka do badmintona?', a: '16', wrong: ['12','14','18'] },
        { q: 'W którym kraju powstała gra w szachy?', a: 'Indie', wrong: ['Chiny','Persja','Egipt'] },
        { q: 'Ile metrów ma basen olimpijski?', a: '50', wrong: ['25','100','75'] },
        { q: 'Ile pól ma szachownica?', a: '64', wrong: ['32','48','72'] },
        { q: 'Jaki sport rozgrywa się na Wimbledonie?', a: 'Tenis', wrong: ['Badminton','Squash','Ping-pong'] },
        { q: 'Ile drużyn gra w Ekstraklasie (Polska)?', a: '18', wrong: ['16','20','14'] },
        { q: 'Ile rund ma mecz bokserski (zawodowy, tytuł)?', a: '12', wrong: ['10','15','8'] },
        { q: 'W jakim sporcie używa się "puchu"?', a: 'Badminton', wrong: ['Squash','Tenis stołowy','Padel'] },
        { q: 'Ile kart ma standardowa talia?', a: '52', wrong: ['48','54','36'] },
        { q: 'Co to jest "hat-trick"?', a: '3 gole jednego gracza w meczu', wrong: ['2 gole z rzutu karnego','Gol głową','4 gole w meczu'] },
    ],
    muzyka: [
        { q: 'Ile nut jest w skali durowej?', a: '7', wrong: ['5','8','12'] },
        { q: 'Kto skomponował "Flet magiczny"?', a: 'Mozart', wrong: ['Beethoven','Chopin','Bach'] },
        { q: 'Ile strun ma standardowa gitara?', a: '6', wrong: ['4','5','7'] },
        { q: 'Jaki instrument grał Fryderyk Chopin?', a: 'Fortepian', wrong: ['Skrzypce','Wiolonczela','Organy'] },
        { q: 'Co oznacza "forte" w muzyce?', a: 'Głośno', wrong: ['Cicho','Wolno','Szybko'] },
        { q: 'Z jakiego kraju pochodzą The Beatles?', a: 'Wielka Brytania', wrong: ['USA','Australia','Irlandia'] },
        { q: 'Ile oktaw ma fortepian (standardowy)?', a: '7', wrong: ['5','6','8'] },
        { q: 'Jaki gatunek muzyki stworzył Elvis Presley?', a: 'Rock and Roll', wrong: ['Blues','Jazz','Country'] },
        { q: 'Co to jest "lento"?', a: 'Wolne tempo', wrong: ['Szybkie tempo','Średnie tempo','Bardzo szybkie tempo'] },
        { q: 'Ile członków miał oryginalny skład The Beatles?', a: '4', wrong: ['3','5','6'] },
        { q: 'Kto skomponował Symfonię Losu (V)?', a: 'Beethoven', wrong: ['Mozart','Brahms','Schubert'] },
        { q: 'Co to jest "staccato"?', a: 'Krótkie, urwane dźwięki', wrong: ['Długie, płynne dźwięki','Dźwięki z wibracją','Bardzo głośne dźwięki'] },
        { q: 'Ile dźwięków zawiera skala chromatyczna?', a: '12', wrong: ['7','8','10'] },
        { q: 'Jakiego instrumentu używa DJ?', a: 'Gramofonu / konsoletki', wrong: ['Syntezatora','Gitary elektrycznej','Bębna'] },
        { q: 'Co to jest "opus" w muzyce klasycznej?', a: 'Numer dzieła kompozytora', wrong: ['Styl gry','Rodzaj formy muzycznej','Tempo utworu'] },
    ],
    film: [
        { q: 'Kto wyreżyserował "Listę Schindlera"?', a: 'Steven Spielberg', wrong: ['Martin Scorsese','Francis Ford Coppola','Ridley Scott'] },
        { q: 'Jaka postać mówi "May the Force be with you"?', a: 'Gwiezdne Wojny', wrong: ['Star Trek','Avatar','Matrix'] },
        { q: 'Ile Oscarów zdobył film "Titanic" (1997)?', a: '11', wrong: ['9','13','7'] },
        { q: 'Kto grał Jacka w filmie "Titanic"?', a: 'Leonardo DiCaprio', wrong: ['Brad Pitt','Tom Hanks','Matt Damon'] },
        { q: 'Z jakiego kraju pochodzi film "Parasite" (Oscar 2019)?', a: 'Korea Południowa', wrong: ['Japonia','Chiny','Tajwan'] },
        { q: 'Kto grał Batmana w trylogii Nolana?', a: 'Christian Bale', wrong: ['Ben Affleck','Michael Keaton','Val Kilmer'] },
        { q: 'Jaki film zaczyna się słowami "Life is like a box of chocolates"?', a: 'Forrest Gump', wrong: ['Cast Away','The Green Mile','Philadelphia'] },
        { q: 'Kto wyreżyserował "Ojca Chrzestnego"?', a: 'Francis Ford Coppola', wrong: ['Martin Scorsese','Brian De Palma','Sidney Lumet'] },
        { q: 'Jaki aktor grał Iron Mana?', a: 'Robert Downey Jr.', wrong: ['Chris Evans','Chris Hemsworth','Mark Ruffalo'] },
        { q: 'Ile części ma trylogia "Władca Pierścieni"?', a: '3', wrong: ['2','4','5'] },
        { q: 'Kto stworzył Myszki Miki?', a: 'Walt Disney', wrong: ['Chuck Jones','Tex Avery','Max Fleischer'] },
        { q: 'Jaki film zdobył pierwszy Oscar dla najlepszego filmu?', a: 'Wings (1927)', wrong: ['Casablanca','Obywatel Kane','Na wschód od Edenu'] },
        { q: 'Kim jest "The Mandalorian"?', a: 'Łowcą nagród ze Gwiezdnych Wojen', wrong: ['Klonem z Republiki','Szturmowcem Imperium','Jedi ze Starego Zakonu'] },
        { q: 'Ile sezonów ma "Breaking Bad"?', a: '5', wrong: ['4','6','7'] },
        { q: 'Kto gra Sherlocka Holmesa w serialu BBC?', a: 'Benedict Cumberbatch', wrong: ['Martin Freeman','Andrew Scott','Mark Gatiss'] },
    ],
    it: [
        { q: 'Co oznacza skrót "HTML"?', a: 'HyperText Markup Language', wrong: ['High Transfer Markup Language','Hyper Tool Markup Logic','HyperText Making Language'] },
        { q: 'Kto stworzył Linuxa?', a: 'Linus Torvalds', wrong: ['Bill Gates','Dennis Ritchie','Richard Stallman'] },
        { q: 'Ile bitów ma jeden bajt?', a: '8', wrong: ['4','16','32'] },
        { q: 'Co oznacza CSS?', a: 'Cascading Style Sheets', wrong: ['Computer Style Syntax','Code Style System','Creative Styling Script'] },
        { q: 'W jakim roku powstał Python?', a: '1991', wrong: ['1985','1995','2000'] },
        { q: 'Co robi instrukcja "for" w programowaniu?', a: 'Powtarza kod określoną ilość razy', wrong: ['Sprawdza warunek','Definiuje funkcję','Deklaruje zmienną'] },
        { q: 'Co to jest "bug" w programowaniu?', a: 'Błąd w kodzie', wrong: ['Funkcja debugowania','Komentarz w kodzie','Typ danych'] },
        { q: 'Co to jest "API"?', a: 'Interfejs programowania aplikacji', wrong: ['Automatyczna procedura indeksowania','Algorytm przetwarzania instrukcji','Architektura protokołu internetu'] },
        { q: 'Jaki język jest używany do stylowania stron?', a: 'CSS', wrong: ['HTML','JavaScript','PHP'] },
        { q: 'Co to jest "null" w programowaniu?', a: 'Brak wartości', wrong: ['Zero','Pusty string','Fałsz (false)'] },
        { q: 'Czym jest "framework" webowy?', a: 'Gotowa struktura do budowy aplikacji', wrong: ['Rodzaj bazy danych','Protokół sieciowy','System operacyjny'] },
        { q: 'Co to jest "GitHub"?', a: 'Platforma do hostowania repozytoriów Git', wrong: ['Język programowania','Baza danych w chmurze','Serwer pocztowy'] },
        { q: 'Co to jest "localhost"?', a: 'Adres własnego komputera w sieci', wrong: ['Domyślny serwer DNS','Adres IP Google','Router sieciowy'] },
        { q: 'Ile wynosi 2^10?', a: '1024', wrong: ['512','2048','256'] },
        { q: 'Co to jest "responsive design"?', a: 'Strona dostosowująca się do rozmiaru ekranu', wrong: ['Strona ładująca się szybko','Animowana strona','Strona z dużą ilością zdjęć'] },
    ],
    nauka2: [
        { q: 'Jaka jest podstawowa jednostka życia?', a: 'Komórka', wrong: ['Atom','Cząsteczka','Organ'] },
        { q: 'Gdzie zachodzi fotosynteza w roślinie?', a: 'W chloroplastach', wrong: ['W mitochondriach','W jądrze komórkowym','W wakuoli'] },
        { q: 'Jak nazywa się cukier prosty w owocach?', a: 'Fruktoza', wrong: ['Glukoza','Sacharoza','Laktoza'] },
        { q: 'Ile komór ma ludzkie serce?', a: '4', wrong: ['2','3','5'] },
        { q: 'Co produkuje insulinę?', a: 'Trzustka', wrong: ['Wątroba','Nerka','Nadnercze'] },
        { q: 'Jak długo trwa ciąża u człowieka?', a: 'Ok. 9 miesięcy', wrong: ['6 miesięcy','12 miesięcy','8 miesięcy'] },
        { q: 'Co to jest ekosystem?', a: 'Zespół organizmów i ich środowisko', wrong: ['Pojedynczy gatunek','Obszar geograficzny','Typ klimatu'] },
        { q: 'Jak nazywa się największy organ człowieka?', a: 'Skóra', wrong: ['Wątroba','Płuca','Jelito grube'] },
        { q: 'Co to jest mutacja genetyczna?', a: 'Zmiana w sekwencji DNA', wrong: ['Podział komórki','Przekazanie genów','Synteza białka'] },
        { q: 'Ile par chromosomów ma człowiek?', a: '23', wrong: ['22','24','46'] },
        { q: 'Co to jest osmoza?', a: 'Dyfuzja wody przez membranę półprzepuszczalną', wrong: ['Transport aktywny jonów','Trawienie tłuszczów','Oddychanie komórkowe'] },
        { q: 'Jaka krew płynie w tętnicach?', a: 'Utlenowana (z wyjątkiem tętnicy płucnej)', wrong: ['Tylko odtlenowana','Zawsze utlenowana','Mieszana'] },
        { q: 'Co to jest "RNA"?', a: 'Kwas rybonukleinowy', wrong: ['Białko transportujące','Lipid komórkowy','Enzym trawienny'] },
        { q: 'Jaką funkcję pełni hemoglobina?', a: 'Przenosi tlen w krwi', wrong: ['Trawi białka','Produkuje hormony','Filtruje krew'] },
        { q: 'Co to jest "mitoza"?', a: 'Podział komórkowy dający 2 identyczne komórki', wrong: ['Podział redukcyjny na komórki płciowe','Synteza ATP','Translacja białka'] },
    ],
};

// ==========================================
// QUIZ — LOGIKA
// ==========================================
let quizState = {
    category: '',
    questions: [],
    current: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    total: 10,
    avatarEmojis: ['😎','🚀','🔥','⭐','💎','👑','🏆','🎯','🌟','⚡'],
};

function initQuizCategoryScreen() {
    const grid = document.getElementById('quizCatGrid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.entries(QUIZ_CATEGORIES).forEach(([key, cat]) => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.style.cssText = `flex-direction:column;gap:4px;padding:12px 6px;font-size:13px;border-color:${cat.color};`;
        btn.innerHTML = `<span style="font-size:24px">${cat.emoji}</span><span>${cat.label}</span>`;
        btn.onclick = () => startQuizCategory(key);
        grid.appendChild(btn);
    });
}

async function startQuizCategory(catKey) {
    // Spróbuj pobrać słowa z bazy D1 i zamień na pytania quizowe
    let dbQuestions = [];
    try {
        const url = catKey === 'mix'
            ? '/api/words?action=list'
            : `/api/words?action=list&cat=${encodeURIComponent(catKey)}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data.words && data.words.length >= 4) {
                // Zamień słowa z bazy na pytania quizowe
                const allWords = data.words;
                dbQuestions = allWords.map(entry => {
                    // 3 losowe błędne odpowiedzi z innych słów
                    const others = allWords.filter(w => w.word !== entry.word);
                    const wrong = others.sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
                    return {
                        q: `${entry.hint ? '[' + entry.hint + '] ' : ''}${entry.def || 'Co to jest: ' + entry.word + '?'}`,
                        a: entry.word,
                        wrong: wrong.length === 3 ? wrong : ['błąd1','błąd2','błąd3']
                    };
                }).filter(q => q.wrong.length === 3);
            }
        }
    } catch(e) {}

    // Połącz pytania z bazy z lokalnymi
    let pool = [];
    if (catKey === 'mix') {
        Object.values(QUIZ_QUESTIONS).forEach(qs => pool.push(...qs));
        quizState.category = 'Mix';
    } else {
        pool = [...(QUIZ_QUESTIONS[catKey] || [])];
        quizState.category = QUIZ_CATEGORIES[catKey]?.label || catKey;
    }

    // Dodaj pytania z bazy (bez duplikatów)
    pool = [...pool, ...dbQuestions];
    pool.sort(() => Math.random() - 0.5);

    quizState.questions = pool.slice(0, quizState.total);
    quizState.current = 0;
    quizState.score = 0;
    quizState.correct = 0;
    quizState.wrong = 0;
    quizState.streak = 0;
    quizState.bestStreak = 0;
    quizState.answered = false;

    document.getElementById('quizCategoryScreen').style.display = 'none';
    document.getElementById('quizGameScreen').style.display = 'flex';
    document.getElementById('quizSideCat').textContent = quizState.category;

    // Build step markers
    const markers = document.getElementById('quizStepMarkers');
    markers.innerHTML = '';
    for (let i = 0; i <= quizState.total; i++) {
        const m = document.createElement('div');
        m.style.cssText = `width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.2);flex-shrink:0;`;
        m.id = `quizMark_${i}`;
        markers.appendChild(m);
    }

    updateQuizStats();
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = quizState.questions[quizState.current];
    if (!q) return;
    quizState.answered = false;

    document.getElementById('quizQuestion').textContent = q.q;
    document.getElementById('quizNextBtn').style.display = 'none';
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizCatLabel').textContent = quizState.category.toUpperCase();
    document.getElementById('quizStepLabel').textContent = `Krok ${quizState.current + 1} / ${quizState.total}`;

    // Animate question card
    const card = document.getElementById('quizCard');
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0';
    setTimeout(() => { card.style.transition = 'all 0.3s'; card.style.transform = 'scale(1)'; card.style.opacity = '1'; }, 50);

    // Build answers (shuffle)
    const answers = [q.a, ...q.wrong].sort(() => Math.random() - 0.5);
    const container = document.getElementById('quizAnswers');
    container.innerHTML = '';
    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.style.cssText = `text-align:left;padding:12px 16px;font-size:14px;line-height:1.4;min-height:54px;transition:all 0.2s;`;
        btn.textContent = ans;
        btn.onclick = () => selectAnswer(ans, q.a, btn);
        container.appendChild(btn);
    });

    updateQuizProgress();
}

function selectAnswer(chosen, correct, btnEl) {
    if (quizState.answered) return;
    quizState.answered = true;

    const isCorrect = chosen === correct;
    const allBtns = document.querySelectorAll('#quizAnswers button');

    allBtns.forEach(b => {
        b.disabled = true;
        if (b.textContent === correct) {
            b.style.cssText += ';background:rgba(46,204,113,0.25);border-color:#2ecc71;color:#2ecc71;';
        } else if (b === btnEl && !isCorrect) {
            b.style.cssText += ';background:rgba(231,76,60,0.25);border-color:#e74c3c;color:#e74c3c;';
        }
    });

    const fb = document.getElementById('quizFeedback');
    fb.style.display = 'block';

    if (isCorrect) {
        quizState.score += 10 + quizState.streak * 2;
        quizState.correct++;
        quizState.streak++;
        quizState.bestStreak = Math.max(quizState.bestStreak, quizState.streak);
        fb.style.cssText = 'display:block;padding:12px 20px;border-radius:10px;font-weight:700;font-size:15px;text-align:center;width:100%;box-sizing:border-box;background:rgba(46,204,113,0.2);border:1px solid #2ecc71;color:#2ecc71;';
        const msgs = ['✅ Dobrze!', '🔥 Świetnie!', '⭐ Trafiłeś!', '💎 Perfekcja!', '🚀 Tak trzymaj!'];
        fb.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        if (quizState.streak > 1) fb.textContent += ` Seria: ${quizState.streak}🔥 (+${10 + (quizState.streak-1)*2} pkt)`;
        // Avatar upgrade
        const lvl = Math.min(Math.floor(quizState.correct / 2), quizState.avatarEmojis.length - 1);
        document.getElementById('quizAvatar').textContent = quizState.avatarEmojis[lvl];
        // Bounce animation
        animateAvatarBounce(true);
    } else {
        quizState.wrong++;
        quizState.streak = 0;
        fb.style.cssText = 'display:block;padding:12px 20px;border-radius:10px;font-weight:700;font-size:15px;text-align:center;width:100%;box-sizing:border-box;background:rgba(231,76,60,0.2);border:1px solid #e74c3c;color:#e74c3c;';
        fb.textContent = `❌ Źle! Poprawna odpowiedź: ${correct}`;
        // Shake & fall back
        animateAvatarFall();
    }

    updateQuizStats();

    // Auto-next after delay
    setTimeout(() => {
        document.getElementById('quizNextBtn').style.display = 'inline-block';
    }, 600);
}

function animateAvatarBounce(up) {
    const av = document.getElementById('quizAvatar');
    av.style.transition = 'all 0.2s';
    av.style.transform = 'translate(-50%,-100%) scale(1.5)';
    setTimeout(() => { av.style.transform = 'translate(-50%,-50%) scale(1)'; }, 200);
}

function animateAvatarFall() {
    const av = document.getElementById('quizAvatar');
    av.style.transition = 'all 0.4s cubic-bezier(.68,-0.55,.27,1.55)';
    // Falls back to step 0
    av.style.left = '0%';
    av.style.transform = 'translate(-50%,-50%) rotate(-30deg) scale(0.8)';
    setTimeout(() => {
        av.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)';
        quizState.current = 0; // reset position visually
        updateQuizProgress(true); // force to 0
    }, 400);
}

function updateQuizProgress(forceZero = false) {
    const pct = forceZero ? 0 : (quizState.current / quizState.total) * 100;
    document.getElementById('quizProgressFill').style.width = pct + '%';
    const av = document.getElementById('quizAvatar');
    if (!forceZero) {
        av.style.left = pct + '%';
        av.style.transform = 'translate(-50%,-50%)';
    }
    // Update markers
    for (let i = 0; i <= quizState.total; i++) {
        const m = document.getElementById(`quizMark_${i}`);
        if (!m) continue;
        const passed = !forceZero && i <= quizState.current;
        m.style.background = passed ? '#f39c12' : 'rgba(255,255,255,0.15)';
        m.style.borderColor = passed ? '#f39c12' : 'rgba(255,255,255,0.2)';
    }
}

function updateQuizStats() {
    document.getElementById('quizScore').textContent = quizState.score;
    document.getElementById('quizCorrect').textContent = quizState.correct;
    document.getElementById('quizWrong').textContent = quizState.wrong;
    document.getElementById('quizStreak').textContent = `🔥 ${quizState.streak}`;
    document.getElementById('quizBestStreak').textContent = quizState.bestStreak;
}

function quizNext() {
    // If previous answer was wrong, reset to start
    const wasWrong = quizState.answered && quizState.streak === 0 && quizState.wrong > 0;

    if (wasWrong) {
        // Go back to start — re-shuffle remaining
        quizState.current = 0;
        const pool = [...quizState.questions];
        pool.sort(() => Math.random() - 0.5);
        quizState.questions = pool;
        updateQuizProgress(false);
    } else {
        quizState.current++;
    }

    if (quizState.current >= quizState.total) {
        quizFinish();
        return;
    }
    updateQuizProgress();
    renderQuizQuestion();
}

function quizFinish() {
    const pct = Math.round((quizState.correct / quizState.total) * 100);
    let grade = 'C', title = 'Zaliczono', msg = '';
    if (pct === 100) { grade = 'S'; title = '🏆 Genialny!'; msg = `Perfekcja! ${quizState.correct}/${quizState.total} poprawnych. Jesteś mistrzem wiedzy.`; }
    else if (pct >= 80) { grade = 'A'; title = '⭐ Świetny wynik!'; msg = `${quizState.correct}/${quizState.total} poprawnych. Bardzo dobra robota!`; }
    else if (pct >= 60) { grade = 'B'; title = '👍 Nieźle!'; msg = `${quizState.correct}/${quizState.total} — dobry wynik. Trochę ćwiczeń i będzie S!`; }
    else { grade = 'C'; title = '📚 Ucz się więcej'; msg = `${quizState.correct}/${quizState.total} — powtórz materiał i spróbuj ponownie.`; }

    if (pct >= 60) markGameWon('quiz');
    showOutroCard('quiz', title, msg, grade, pct >= 60);
}

// ==========================================
// WISIELEC — POBIERANIE SŁÓW Z API
// ==========================================

// Fallback słowa (używane jeśli API nie odpowie)
const HANGMAN_FALLBACK = [
    { word: 'javascript', hint: 'Język programowania', def: 'Popularny język skryptowy używany w przeglądarkach' },
    { word: 'algorytm', hint: 'Informatyka', def: 'Zbiór kroków rozwiązywania problemu' },
    { word: 'fotosynteza', hint: 'Biologia', def: 'Proces wytwarzania glukozy przez rośliny' },
    { word: 'chromatin', hint: 'Biologia komórkowa', def: 'Kompleks DNA i białek w jądrze komórkowym' },
    { word: 'ewolucja', hint: 'Biologia', def: 'Proces zmian cech organizmów przez pokolenia' },
    { word: 'kryptografia', hint: 'Bezpieczeństwo IT', def: 'Nauka o szyfrowaniu informacji' },
    { word: 'meteorologia', hint: 'Nauka o pogodzie', def: 'Dział fizyki atmosfery badający pogodę' },
    { word: 'antropologia', hint: 'Nauka o człowieku', def: 'Nauka badająca człowieka i jego kulturę' },
    { word: 'magnetyzm', hint: 'Fizyka', def: 'Zjawisko przyciągania przez magnesy' },
    { word: 'architektura', hint: 'Sztuka budowania', def: 'Sztuka i nauka projektowania budowli' },
];

async function fetchHangmanWord() {
    try {
        const res = await fetch('/api/words?action=random');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (data.word) return data;
        throw new Error('No word');
    } catch {
        // Fallback to local words
        return HANGMAN_FALLBACK[Math.floor(Math.random() * HANGMAN_FALLBACK.length)];
    }
}

// Wisielec pobiera słowa z /api/words (D1) — patrz funkcja resetHangman powyżej
