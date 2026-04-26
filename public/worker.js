/**
 * Cloudflare Worker — ecosystem
 * 
 * Serwuje statyczne pliki (HTML/CSS/JS) z Assets
 * ORAZ obsługuje endpoint /api/words dla Wisielca (D1 database)
 */
 
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};
 
async function ensureTable(db) {
    await db.batch([
        db.prepare("CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT NOT NULL, hint TEXT DEFAULT '', def TEXT DEFAULT '', category TEXT DEFAULT 'ogolne', created INTEGER DEFAULT (unixepoch()))")
    ]);
 
    const { results } = await db.prepare('SELECT COUNT(*) as n FROM words').all();
    if (results[0].n > 0) return;
 
    await db.batch([
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('algorytm','Informatyka','Zbior krokow do rozwiazania problemu','it'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('fotosynteza','Biologia','Proces wytwarzania glukozy','biologia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('ewolucja','Biologia','Zmiana cech organizmow','biologia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('kryptografia','IT','Nauka o szyfrowaniu','it'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('meteorologia','Nauka','Dzial fizyki atmosfery','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('architektura','Sztuka','Projektowanie budowli','kultura'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('antropologia','Nauka','Nauka o czlowieku','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('magnetyzm','Fizyka','Przyciaganie ferromagnetykow','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('demokracja','Polityka','System rzadow woli wiekszosci','historia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('astronomia','Nauka','Nauka o cialach niebieskich','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('chromosom','Biologia','Struktura niosaca geny','biologia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('javascript','IT','Jezyk skryptowy przegladarek','it'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('renesans','Historia','Ruch kulturalny XIV-XVII w','historia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('izotop','Chemia','Atom z rozna liczba neutronow','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('katalizator','Chemia','Substancja przyspieszajaca reakcje','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('parlament','Polityka','Cialo ustawodawcze','historia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('symbioza','Biologia','Relacja miedzy organizmami','biologia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('grawitacja','Fizyka','Sila przyciagania mas','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('logarytm','Matematyka','Odwrotnosc potegowania','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('propaganda','Historia','Ksztaltowanie opinii','historia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('urbanizacja','Geografia','Wzrost ludnosci miejskiej','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('hologram','Fizyka','Obraz 3D z lasera','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('polimer','Chemia','Makroczasteczka z jednostek','nauka'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('fotografia','Sztuka','Utrwalanie obrazow swiatlem','kultura'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('ekosystem','Biologia','Organizmy i ich srodowisko','biologia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('inflacja','Ekonomia','Wzrost poziomu cen','ekonomia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('migracja','Socjologia','Przemieszczanie sie ludnosci','historia'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('program','IT','Instrukcje dla komputera','it'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('paradoks','Filozofia','Twierdzenie sprzeczne','kultura'),
        db.prepare("INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)").bind('klimatologia','Nauka','Nauka o wzorcach pogodowych','nauka'),
    ]);
}
 
// ── Handler API /api/words ─────────────────────────────────
async function handleApi(request, env) {
    const url    = new URL(request.url);
    const method = request.method.toUpperCase();
 
    // CORS preflight
    if (method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                ...CORS_HEADERS,
                'Access-Control-Allow-Methods': 'GET,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Key',
            },
        });
    }
 
    if (!env.DB) {
        return new Response(JSON.stringify({
            error: 'Baza D1 nie jest podpięta. Dodaj binding "DB" w zakładce Bindings workera.'
        }), { status: 500, headers: CORS_HEADERS });
    }
 
    try {
        await ensureTable(env.DB);
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Błąd bazy: ' + e.message }), { status: 500, headers: CORS_HEADERS });
    }
 
    // ── GET ──────────────────────────────────────────────────
    if (method === 'GET') {
        const action = url.searchParams.get('action') || 'random';
        const cat    = url.searchParams.get('cat')    || '';
 
        if (action === 'random') {
            const query  = cat
                ? 'SELECT word,hint,def,category FROM words WHERE category=? ORDER BY RANDOM() LIMIT 1'
                : 'SELECT word,hint,def,category FROM words ORDER BY RANDOM() LIMIT 1';
            const params = cat ? [cat] : [];
            const { results } = await env.DB.prepare(query).bind(...params).all();
            if (!results.length)
                return new Response(JSON.stringify({ error: 'Brak słów w bazie' }), { status: 404, headers: CORS_HEADERS });
            return new Response(JSON.stringify(results[0]), { headers: CORS_HEADERS });
        }
 
        if (action === 'list') {
            const query  = cat
                ? 'SELECT id,word,hint,category FROM words WHERE category=? ORDER BY id DESC LIMIT 200'
                : 'SELECT id,word,hint,category FROM words ORDER BY id DESC LIMIT 200';
            const params = cat ? [cat] : [];
            const { results } = await env.DB.prepare(query).bind(...params).all();
            return new Response(JSON.stringify({ words: results, count: results.length }), { headers: CORS_HEADERS });
        }
 
        if (action === 'categories') {
            const { results } = await env.DB.prepare('SELECT DISTINCT category FROM words ORDER BY category').all();
            return new Response(JSON.stringify({ categories: results.map(r => r.category) }), { headers: CORS_HEADERS });
        }
 
        return new Response(JSON.stringify({ error: 'Nieznana akcja. Użyj: random, list, categories' }), { status: 400, headers: CORS_HEADERS });
    }
 
    // ── POST — dodaj słowo ───────────────────────────────────
    if (method === 'POST') {
        const key = request.headers.get('X-Admin-Key');
        if (env.ADMIN_KEY && key !== env.ADMIN_KEY)
            return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401, headers: CORS_HEADERS });
 
        let body;
        try   { body = await request.json(); }
        catch { return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON' }), { status: 400, headers: CORS_HEADERS }); }
 
        const { word, hint = '', def = '', category = 'ogólne' } = body;
        if (!word || word.length < 2 || word.length > 30)
            return new Response(JSON.stringify({ error: 'Słowo musi mieć 2–30 znaków' }), { status: 400, headers: CORS_HEADERS });
 
        await env.DB.prepare('INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)')
            .bind(word.toLowerCase().trim(), hint, def, category).run();
 
        return new Response(JSON.stringify({ ok: true, word }), { headers: CORS_HEADERS });
    }
 
    // ── DELETE — usuń słowo ──────────────────────────────────
    if (method === 'DELETE') {
        const key = request.headers.get('X-Admin-Key');
        if (env.ADMIN_KEY && key !== env.ADMIN_KEY)
            return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401, headers: CORS_HEADERS });
 
        const id = url.searchParams.get('id');
        if (!id) return new Response(JSON.stringify({ error: 'Brak ?id=' }), { status: 400, headers: CORS_HEADERS });
 
        await env.DB.prepare('DELETE FROM words WHERE id=?').bind(Number(id)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: CORS_HEADERS });
    }
 
    return new Response(JSON.stringify({ error: 'Metoda nieobsługiwana' }), { status: 405, headers: CORS_HEADERS });
}
 
// ── GŁÓWNY HANDLER ─────────────────────────────────────────
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
 
        // Wszystkie requesty do /api/* obsługuje nasz kod
        if (url.pathname.startsWith('/api/')) {
            return handleApi(request, env);
        }
 
        // Reszta idzie do statycznych assetów (HTML/CSS/JS)
        return env.ASSETS.fetch(request);
    },
};
 
